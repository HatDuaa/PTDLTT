"""Nạp và kiểm chứng các file kết quả sinh ra bởi pipeline `code/chay_tat_ca.py`.

QUY TẮC TỐI THƯỢNG: module này CHỈ đọc dữ liệu, KHÔNG tính toán lại bất kỳ
con số nào. Mọi giá trị trả về cho client phải bắt nguồn trực tiếp từ file
trong thư mục `ket-qua/`. Nếu thiếu file hoặc thiếu cột đã khai báo, phải
dừng ngay bằng lỗi rõ ràng — tuyệt đối không phục vụ dữ liệu rỗng/giả.
"""
from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any

import pandas as pd

# Thư mục ket-qua/ suy ra từ vị trí file này:
# web/backend/doc_ket_qua.py -> parents[0]=backend, [1]=web, [2]=gốc repo
THU_MUC_KET_QUA = Path(__file__).resolve().parents[2] / "ket-qua"

# --- Hợp đồng schema: tên file CSV -> danh sách cột bắt buộc phải có ---
# Đây là hợp đồng giữa backend và pipeline Python. Nếu pipeline đổi tên cột
# mà không cập nhật ở đây, khởi động backend sẽ thất bại ngay thay vì âm
# thầm phục vụ sai dữ liệu.
SCHEMA_CSV: dict[str, list[str]] = {
    "kq-uoc-luong-chinh.csv": [
        "vai_tro", "uoc_luong", "pp", "se", "p", "ktc_duoi", "ktc_tren",
        "pass_through", "p_chuyen_hoan_toan", "tost_hep", "tost_rong",
        "so_lan_hop_le", "so_lan_that_bai",
    ],
    "kq-theo-tang.csv": [
        "mau", "tang", "n1", "n0", "gia_min", "gia_max", "tau_s", "w_s",
    ],
    "kq-cong-chan-doan.csv": [
        "mau", "dac_ta", "n", "uoc_luong", "se", "p", "tost_p",
        "truot_cong2", "tuong_duong_cong3",
    ],
    "kq-do-nhay.csv": [
        "truc", "muc", "n", "pp", "uoc_luong", "se", "p", "ktc_duoi",
        "ktc_tren", "so_lan_hop_le", "so_lan_that_bai",
    ],
    "kq-mde-va-suc-manh.csv": [
        "dac_ta", "se", "mde", "suc_manh_tai_moc_chuyen_hoan_toan",
        "bien_tost_du_80", "suc_manh_tost_bien_dang_dung", "delta", "suc_manh",
    ],
    "kq-mo-phong-lam-tron.csv": [
        "buoc_lam_tron", "so_sku", "so_doi_muc", "ti_le_doi_muc",
    ],
    "kq-san-luong.csv": [
        "nhanh", "n", "uoc_luong", "se", "p", "ktc_duoi", "ktc_tren", "mde",
    ],
    "bang-luong-mau.csv": [
        "buoc", "quy_tac", "dong_vao", "dong_ra", "mat", "ghi_chu",
    ],
    "chan-doan-bien-type.csv": [
        "grp", "so_nhan_type", "so_sku",
    ],
    "kq-smd-sau-phan-tang.csv": [
        "tang", "bien", "n1", "n0", "smd", "vuot_nguong",
    ],
    "eda-can-bang-tien-ky.csv": [
        "doi_chung", "n_C", "bien", "T_trung_vi", "C_trung_vi", "T_IQR",
        "C_IQR", "SMD",
    ],
    "eda-co-cau-loai-san-pham.csv": [
        "loai_sp", "C10", "C8", "T",
    ],
    "eda-do-phu-theo-thang.csv": [
        "thang", "so_ngay_co_du_lieu", "so_hoa_don", "so_dong_hang",
        "ti_le_co_ma_vach", "so_sku",
    ],
    "eda-ho-tro-phan-tang.csv": [
        "doi_chung", "tang", "gia_nen_min", "gia_nen_max", "n_T", "n_C", "mong",
    ],
    "eda-luoi-survivorship.csv": [
        "nguong_tuan", "nhom", "so_giu", "so_loai", "gia_nen_giu",
        "gia_nen_loai", "sl_giu", "sl_loai",
    ],
    "eda-ma-tran-chuyen-thue.csv": [
        "tien", "hau", "so_sku",
    ],
}

# Ánh xạ tên ngắn dùng trong URL GET /api/eda/{ten} -> tên file CSV thật.
BAN_DO_EDA: dict[str, str] = {
    "can-bang-tien-ky": "eda-can-bang-tien-ky.csv",
    "co-cau-loai-san-pham": "eda-co-cau-loai-san-pham.csv",
    "do-phu-theo-thang": "eda-do-phu-theo-thang.csv",
    "ho-tro-phan-tang": "eda-ho-tro-phan-tang.csv",
    "luoi-survivorship": "eda-luoi-survivorship.csv",
    "ma-tran-chuyen-thue": "eda-ma-tran-chuyen-thue.csv",
}

TEN_FILE_MANIFEST = "manifest-tai-lap.json"
KHOA_MANIFEST = "manifest"  # khóa nội bộ dùng trong dict dữ liệu đã nạp


class LoiKiemChungDuLieu(RuntimeError):
    """Báo lỗi khi thiếu file hoặc thiếu cột bắt buộc trong ket-qua/."""


def _don_sach_gia_tri(gia_tri: Any) -> Any:
    """Chuyển NaN/Infinity/-Infinity thành None để JSON hợp lệ.

    pandas rất dễ sinh ra các giá trị này (ô trống trong CSV, chia cho 0,
    kết quả bootstrap thất bại, ...). JSONResponse của Starlette dùng
    json.dumps(..., allow_nan=False) nên nếu không dọn trước, request sẽ
    lỗi 500 thay vì trả về null như mong đợi — do đó bước dọn này là bắt
    buộc, không phải tùy chọn.
    """
    if isinstance(gia_tri, float) and (math.isnan(gia_tri) or math.isinf(gia_tri)):
        return None
    return gia_tri


def khung_du_lieu_sang_json(df: pd.DataFrame) -> list[dict[str, Any]]:
    """Chuyển DataFrame -> list[dict] an toàn cho JSON (không NaN/Infinity)."""
    ban_ghi = df.to_dict(orient="records")
    return [
        {cot: _don_sach_gia_tri(gia_tri) for cot, gia_tri in dong.items()}
        for dong in ban_ghi
    ]


def _doc_va_kiem_chung_csv(ten_file: str, cot_bat_buoc: list[str]) -> pd.DataFrame:
    """Đọc một CSV trong ket-qua/ và kiểm tra đủ cột bắt buộc.

    Raise LoiKiemChungDuLieu nếu file không tồn tại hoặc thiếu cột.
    """
    duong_dan = THU_MUC_KET_QUA / ten_file
    if not duong_dan.exists():
        raise LoiKiemChungDuLieu(f"Thiếu file bắt buộc: {duong_dan}")
    try:
        df = pd.read_csv(duong_dan)
    except Exception as loi:  # noqa: BLE001 - muốn bắt mọi lỗi đọc file để báo rõ
        raise LoiKiemChungDuLieu(f"Không đọc được '{ten_file}': {loi}") from loi
    cot_thieu = [c for c in cot_bat_buoc if c not in df.columns]
    if cot_thieu:
        raise LoiKiemChungDuLieu(
            f"File '{ten_file}' thiếu cột bắt buộc {cot_thieu}. "
            f"Cột hiện có: {list(df.columns)}"
        )
    return df


def nap_toan_bo() -> dict[str, Any]:
    """Đọc + kiểm chứng TOÀN BỘ file kết quả khai báo trong SCHEMA_CSV.

    Gom hết lỗi (thay vì dừng ở lỗi đầu tiên) để người vận hành sửa một
    lần đủ. Nếu có bất kỳ lỗi nào, raise LoiKiemChungDuLieu và KHÔNG trả
    về dữ liệu — backend không được khởi động với dữ liệu thiếu/rỗng.
    """
    loi: list[str] = []
    du_lieu: dict[str, Any] = {}

    for ten_file, cot_bat_buoc in SCHEMA_CSV.items():
        try:
            df = _doc_va_kiem_chung_csv(ten_file, cot_bat_buoc)
            du_lieu[ten_file] = khung_du_lieu_sang_json(df)
        except LoiKiemChungDuLieu as e:
            loi.append(str(e))

    duong_dan_manifest = THU_MUC_KET_QUA / TEN_FILE_MANIFEST
    if not duong_dan_manifest.exists():
        loi.append(f"Thiếu file bắt buộc: {duong_dan_manifest}")
    else:
        try:
            du_lieu[KHOA_MANIFEST] = json.loads(
                duong_dan_manifest.read_text(encoding="utf-8")
            )
        except json.JSONDecodeError as e:
            loi.append(f"File '{TEN_FILE_MANIFEST}' không phải JSON hợp lệ: {e}")

    if loi:
        thong_diep = "KIỂM CHỨNG DỮ LIỆU THẤT BẠI khi khởi động backend:\n" + "\n".join(
            f"  - {m}" for m in loi
        )
        raise LoiKiemChungDuLieu(thong_diep)

    return du_lieu
