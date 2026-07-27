"""Xuất toàn bộ dữ liệu API ra một file JSON tĩnh.

Dùng khi nộp bài / build frontend tĩnh mà không chạy uvicorn: frontend có
thể `import` thẳng file JSON này thay vì gọi API lúc runtime. Dữ liệu xuất
ra giống hệt response của GET /api/tat-ca (đọc trực tiếp từ ket-qua/, có
kiểm chứng schema, đã dọn NaN/Infinity -> null).

Chạy:
    python web/backend/xuat_json_tinh.py [đường-dẫn-file-đích]

Mặc định ghi vào web/backend/du-lieu-tinh/tat-ca.json.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

# Console mặc định trên Windows dùng cp1252, không encode được tiếng Việt có
# dấu -> print() sẽ crash. Ép stdout/stderr sang UTF-8 trước khi in.
for _luong in (sys.stdout, sys.stderr):
    if hasattr(_luong, "reconfigure"):
        _luong.reconfigure(encoding="utf-8", errors="replace")

from doc_ket_qua import KHOA_MANIFEST, BAN_DO_EDA, nap_toan_bo

MAC_DINH_DUONG_DAN_DICH = Path(__file__).resolve().parent / "du-lieu-tinh" / "tat-ca.json"


def gop_du_lieu(du_lieu: dict) -> dict:
    """Gộp dữ liệu đã nạp thành cấu trúc giống hệt GET /api/tat-ca."""
    return {
        "uoc_luong_chinh": du_lieu["kq-uoc-luong-chinh.csv"],
        "theo_tang": du_lieu["kq-theo-tang.csv"],
        "cong_chan_doan": du_lieu["kq-cong-chan-doan.csv"],
        "do_nhay": du_lieu["kq-do-nhay.csv"],
        "mde": du_lieu["kq-mde-va-suc-manh.csv"],
        "lam_tron": du_lieu["kq-mo-phong-lam-tron.csv"],
        "san_luong": du_lieu["kq-san-luong.csv"],
        "luong_mau": du_lieu["bang-luong-mau.csv"],
        "chan_doan_type": du_lieu["chan-doan-bien-type.csv"],
        "smd_sau_phan_tang": du_lieu["kq-smd-sau-phan-tang.csv"],
        "eda": {ten: du_lieu[ten_file] for ten, ten_file in BAN_DO_EDA.items()},
        "manifest": du_lieu[KHOA_MANIFEST],
    }


def main() -> None:
    duong_dan_dich = Path(sys.argv[1]) if len(sys.argv) > 1 else MAC_DINH_DUONG_DAN_DICH
    du_lieu = nap_toan_bo()  # raise LoiKiemChungDuLieu nếu thiếu file/cột
    ket_qua = gop_du_lieu(du_lieu)

    duong_dan_dich.parent.mkdir(parents=True, exist_ok=True)
    duong_dan_dich.write_text(
        json.dumps(ket_qua, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"[OK] Đã xuất JSON tĩnh: {duong_dan_dich}")


if __name__ == "__main__":
    main()
