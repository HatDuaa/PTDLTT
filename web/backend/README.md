# Backend API — Kết quả đánh giá chính sách thuế GTGT

Backend FastAPI CHỈ ĐỌC: nạp các file trong `ket-qua/` (sinh ra bởi
`code/chay_tat_ca.py`) và phục vụ nguyên vẹn dưới dạng JSON. Không tính
toán lại, không gõ tay bất kỳ con số nào.

## Cài đặt

```bash
pip install -r web/backend/requirements.txt
```

Yêu cầu Python 3.11+ (đã kiểm thử trên Python 3.14.0, khớp môi trường ghi
trong `ket-qua/manifest-tai-lap.json`).

## Chạy server dev

Chạy từ thư mục gốc repo:

```bash
uvicorn main:app --reload --app-dir web/backend
```

Hoặc `cd web/backend` rồi `uvicorn main:app --reload`.

Server mặc định ở `http://127.0.0.1:8000`. Tài liệu API tương tác (Swagger):
`http://127.0.0.1:8000/docs`.

CORS chỉ mở cho `http://localhost:3000` (nơi frontend dev chạy). Nếu
frontend chạy ở origin khác, sửa `allow_origins` trong `main.py`.

## Kiểm chứng khi khởi động

Lúc `uvicorn` khởi động, backend đọc và kiểm tra TOÀN BỘ file khai báo
trong `doc_ket_qua.py::SCHEMA_CSV` (đủ file, đủ cột). Nếu thiếu bất kỳ
file hoặc cột nào, ứng dụng **dừng ngay** với thông báo liệt kê chính xác
file/cột thiếu — không bao giờ chạy với dữ liệu rỗng hoặc giả.

## Endpoint

Tất cả endpoint là `GET`, chỉ đọc, trả JSON. NaN/Infinity trong CSV được
chuyển thành `null` trước khi trả về (bắt buộc — Starlette dùng
`json.dumps(..., allow_nan=False)` nên nếu không dọn trước sẽ lỗi 500).

| Endpoint | File nguồn |
|---|---|
| `GET /api/uoc-luong-chinh` | `kq-uoc-luong-chinh.csv` |
| `GET /api/theo-tang` | `kq-theo-tang.csv` |
| `GET /api/cong-chan-doan` | `kq-cong-chan-doan.csv` |
| `GET /api/do-nhay` | `kq-do-nhay.csv` |
| `GET /api/mde` | `kq-mde-va-suc-manh.csv` |
| `GET /api/lam-tron` | `kq-mo-phong-lam-tron.csv` |
| `GET /api/san-luong` | `kq-san-luong.csv` |
| `GET /api/luong-mau` | `bang-luong-mau.csv` |
| `GET /api/chan-doan-type` | `chan-doan-bien-type.csv` — bằng chứng loại biến `type` khỏi phân tầng (85% SKU mang >1 nhãn `type` ở tiền kỳ) |
| `GET /api/smd-sau-phan-tang` | `kq-smd-sau-phan-tang.csv` — bằng chứng cổng chẩn đoán 1 bị trượt (nhiều cặp tầng/biến vẫn \|SMD\| > 0,25 sau phân tầng, cột `vuot_nguong`) |
| `GET /api/eda` | liệt kê tên hợp lệ cho `/api/eda/{ten}` |
| `GET /api/eda/{ten}` | `eda-{ten}.csv` (ten ∈ can-bang-tien-ky, co-cau-loai-san-pham, do-phu-theo-thang, ho-tro-phan-tang, luoi-survivorship, ma-tran-chuyen-thue) |
| `GET /api/manifest` | `manifest-tai-lap.json` |
| `GET /api/tat-ca` | gộp tất cả (bao gồm `chan_doan_type`, `smd_sau_phan_tang`) — dùng cho bản xuất tĩnh |

## Xuất JSON tĩnh (cho bản nộp bài không chạy server)

```bash
python web/backend/xuat_json_tinh.py
```

Mặc định ghi ra `web/backend/du-lieu-tinh/tat-ca.json`, cấu trúc giống hệt
response của `GET /api/tat-ca`. Có thể chỉ định đường dẫn khác:

```bash
python web/backend/xuat_json_tinh.py duong/dan/khac.json
```

Frontend tĩnh có thể `import`/`fetch` thẳng file JSON này khi build mà
không cần chạy backend lúc runtime.

## Cấu trúc mã nguồn

- `doc_ket_qua.py` — hợp đồng schema (tên file → cột bắt buộc), hàm đọc +
  kiểm chứng CSV/JSON, hàm dọn NaN/Infinity → `null`.
- `main.py` — app FastAPI, CORS, lifespan kiểm chứng dữ liệu lúc khởi
  động, định nghĩa endpoint.
- `xuat_json_tinh.py` — script CLI xuất toàn bộ dữ liệu ra file JSON tĩnh.

## Thêm cột/file mới từ pipeline

Khi `code/chay_tat_ca.py` sinh thêm file hoặc đổi tên cột, cập nhật
`SCHEMA_CSV` (và `BAN_DO_EDA` nếu là file EDA mới) trong `doc_ket_qua.py`
rồi thêm route tương ứng trong `main.py`. Không sửa file trong `ket-qua/`.
