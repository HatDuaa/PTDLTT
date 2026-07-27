# ⚠️ Mã cũ — KHÔNG dùng để sinh kết quả nộp bài

20 script trong thư mục này là **nhật ký khảo sát**, không phải pipeline chính thức.
Pipeline chính thức nằm ở **`code/`** ở gốc repo, chạy bằng:

```bash
python code/chay_tat_ca.py
```

## Vì sao không dùng lại

| Vấn đề | Hậu quả |
|---|---|
| Nhiều script còn mốc `2025-02-01` | Cửa sổ thời gian khác đặc tả khóa §6 |
| Mỗi script **tự tính lại** nhóm T/C10/C8 | Chạy hai script có thể ra hai mẫu khác nhau |
| `03-hai-mo-hinh-uoc-luong.py` dùng seed 7 | Đặc tả khóa §10 quy định seed **42** |
| `15-...py` **in cứng** kết quả placebo (dòng 42) | Con số không sinh từ dữ liệu |
| `mode().iloc[0]` chọn ngầm khi hòa | Xem đặc tả khóa §5 — đã thay bằng quy tắc tường minh |
| `astype('int64')` trên mã vạch | Có thể hỏng mã hoặc mất số 0 đầu |
| Đường dẫn trỏ vào thư mục tạm | Không chạy lại được từ repo |

## Vẫn giữ lại để làm gì

Các script này ghi lại **cách nhóm đi tới kết luận** — đặc biệt `12`, `13`, `14`
(truy nguyên lỗ hổng dữ liệu và chẩn đoán tháng 4). Chúng là bằng chứng cho
mục công bố hậu kiểm ở đặc tả khóa §11.

Khi cần chuyển một phân tích sang pipeline chính thức: đọc từ
`du-lieu-tam/mau-phan-tich-chinh.csv`, **không** chép lại luật lọc.
