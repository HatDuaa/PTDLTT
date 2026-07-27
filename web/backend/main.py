"""FastAPI app phục vụ kết quả pipeline PTDLTT dưới dạng JSON.

CHỈ ĐỌC: backend không tính toán lại bất kỳ số liệu nào. Nó chỉ nạp các
file CSV/JSON đã có sẵn trong `ket-qua/` (sinh ra bởi `code/chay_tat_ca.py`)
và trả nguyên vẹn dưới dạng JSON cho frontend.

Chạy dev:
    uvicorn main:app --reload --app-dir web/backend
"""
from __future__ import annotations

import sys
from contextlib import asynccontextmanager
from typing import Any

# Console mặc định trên Windows dùng cp1252, không encode được tiếng Việt có
# dấu -> print() sẽ crash ngay khi khởi động. Ép stdout/stderr sang UTF-8.
for _luong in (sys.stdout, sys.stderr):
    if hasattr(_luong, "reconfigure"):
        _luong.reconfigure(encoding="utf-8", errors="replace")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from doc_ket_qua import BAN_DO_EDA, KHOA_MANIFEST, LoiKiemChungDuLieu, nap_toan_bo

# Bộ nhớ đệm dữ liệu đã kiểm chứng, nạp một lần lúc khởi động (xem lifespan).
_DU_LIEU: dict[str, Any] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Kiểm chứng + nạp toàn bộ dữ liệu TRƯỚC KHI phục vụ request đầu tiên.

    Nếu thiếu file hoặc thiếu cột bắt buộc, để lỗi lan ra ngoài — uvicorn sẽ
    dừng khởi động. Backend KHÔNG được chạy với dữ liệu rỗng hoặc giả.
    """
    global _DU_LIEU
    _DU_LIEU = nap_toan_bo()
    print(f"[OK] Đã nạp và kiểm chứng {len(_DU_LIEU)} nguồn dữ liệu từ ket-qua/")
    yield
    _DU_LIEU = {}


app = FastAPI(
    title="API Kết Quả Đánh Giá Chính Sách Thuế GTGT",
    description=(
        "Đọc thuần túy các file trong ket-qua/ do pipeline code/chay_tat_ca.py "
        "sinh ra. Không tính toán lại bất kỳ con số nào."
    ),
    lifespan=lifespan,
)

# CORS: chỉ cho phép frontend chạy local tại localhost:3000 gọi API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def _lay(khoa: str) -> Any:
    """Lấy dữ liệu đã nạp theo khóa (tên file CSV hoặc 'manifest').

    Không nên bao giờ KeyError vì lifespan đã kiểm chứng đủ mọi khóa khai
    báo trong SCHEMA_CSV trước khi app nhận request — nếu vẫn xảy ra, đó là
    lỗi lập trình nội bộ, trả 500 kèm thông báo rõ ràng thay vì im lặng.
    """
    if khoa not in _DU_LIEU:
        raise HTTPException(
            status_code=500, detail=f"Dữ liệu '{khoa}' chưa được nạp (lỗi nội bộ)"
        )
    return _DU_LIEU[khoa]


@app.get("/")
def trang_chu():
    """Kiểm tra nhanh API đang chạy; xem /docs để biết chi tiết các endpoint."""
    return {"trang_thai": "ok", "tai_lieu": "/docs"}


@app.get("/api/uoc-luong-chinh")
def uoc_luong_chinh():
    """Kết quả ước lượng chính (pass-through) — kq-uoc-luong-chinh.csv."""
    return _lay("kq-uoc-luong-chinh.csv")


@app.get("/api/theo-tang")
def theo_tang():
    """Kết quả phân tích theo tầng giá — kq-theo-tang.csv."""
    return _lay("kq-theo-tang.csv")


@app.get("/api/cong-chan-doan")
def cong_chan_doan():
    """Kết quả công cụ chẩn đoán tương đương — kq-cong-chan-doan.csv."""
    return _lay("kq-cong-chan-doan.csv")


@app.get("/api/do-nhay")
def do_nhay():
    """Kết quả phân tích độ nhạy (nhiều cửa sổ/phương pháp) — kq-do-nhay.csv."""
    return _lay("kq-do-nhay.csv")


@app.get("/api/mde")
def mde():
    """Minimum Detectable Effect và sức mạnh thống kê — kq-mde-va-suc-manh.csv."""
    return _lay("kq-mde-va-suc-manh.csv")


@app.get("/api/lam-tron")
def lam_tron():
    """Mô phỏng độ nhạy với việc làm tròn giá — kq-mo-phong-lam-tron.csv."""
    return _lay("kq-mo-phong-lam-tron.csv")


@app.get("/api/san-luong")
def san_luong():
    """Kết quả ước lượng theo sản lượng — kq-san-luong.csv."""
    return _lay("kq-san-luong.csv")


@app.get("/api/luong-mau")
def luong_mau():
    """Luồng xử lý mẫu (funnel) từ dữ liệu thô đến mẫu phân tích — bang-luong-mau.csv."""
    return _lay("bang-luong-mau.csv")


@app.get("/api/smd-sau-phan-tang")
def smd_sau_phan_tang():
    """SMD từng biến sau khi đã phân tầng — kq-smd-sau-phan-tang.csv.

    Bằng chứng cổng chẩn đoán 1 bị trượt: nhiều cặp (tầng, biến) vẫn có
    |SMD| vượt ngưỡng 0,25 dù đã phân tầng (cột `vuot_nguong`).
    """
    return _lay("kq-smd-sau-phan-tang.csv")


@app.get("/api/chan-doan-type")
def chan_doan_type():
    """Bằng chứng loại biến `type` khỏi phân tầng — chan-doan-bien-type.csv.

    85% SKU mang nhiều hơn một nhãn `type` trong tiền kỳ, nên `type` không
    dùng được để chia tầng ổn định (xem đặc tả khóa §9).
    """
    return _lay("chan-doan-bien-type.csv")


@app.get("/api/eda")
def danh_sach_eda():
    """Liệt kê các tên hợp lệ dùng cho GET /api/eda/{ten}."""
    return {"ten_hop_le": sorted(BAN_DO_EDA.keys())}


@app.get("/api/eda/{ten}")
def eda(ten: str):
    """Một bảng khảo sát dữ liệu (EDA) theo tên — file eda-{ten}.csv."""
    ten_file = BAN_DO_EDA.get(ten)
    if ten_file is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Tên EDA không hợp lệ: '{ten}'. "
                f"Dùng GET /api/eda để xem danh sách tên hợp lệ."
            ),
        )
    return _lay(ten_file)


@app.get("/api/manifest")
def manifest():
    """Siêu dữ liệu tái lập pipeline (tham số, checksum, môi trường) — manifest-tai-lap.json."""
    return _lay(KHOA_MANIFEST)


@app.get("/api/tat-ca")
def tat_ca():
    """Gộp toàn bộ dữ liệu vào một JSON — dùng để xuất bản tĩnh khi nộp bài."""
    return {
        "uoc_luong_chinh": _lay("kq-uoc-luong-chinh.csv"),
        "theo_tang": _lay("kq-theo-tang.csv"),
        "cong_chan_doan": _lay("kq-cong-chan-doan.csv"),
        "do_nhay": _lay("kq-do-nhay.csv"),
        "mde": _lay("kq-mde-va-suc-manh.csv"),
        "lam_tron": _lay("kq-mo-phong-lam-tron.csv"),
        "san_luong": _lay("kq-san-luong.csv"),
        "luong_mau": _lay("bang-luong-mau.csv"),
        "chan_doan_type": _lay("chan-doan-bien-type.csv"),
        "smd_sau_phan_tang": _lay("kq-smd-sau-phan-tang.csv"),
        "eda": {ten: _lay(ten_file) for ten, ten_file in BAN_DO_EDA.items()},
        "manifest": _lay(KHOA_MANIFEST),
    }
