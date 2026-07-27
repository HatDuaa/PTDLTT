# Review hồ sơ `claude-opus-4.8`

Ngày review: 23/07/2026  
Đối tượng: `../claude-opus-4.8/`  
Trạng thái: review tài liệu và mã nguồn khám phá hiện có.

## Kết luận ngắn

Hướng VAT đáng tiếp tục và hồ sơ mới đã sửa đúng nhiều kết luận quá mạnh. Tuy nhiên, **chưa thể chốt kết quả định lượng hiện tại** vì code còn một số lỗi thiết kế/triển khai có khả năng làm thay đổi sai số chuẩn, event study và các đặc tả điều chỉnh.

Vấn đề lớn nhất về đề bài vẫn chưa được giải quyết: dữ liệu này hiện chỉ hỗ trợ chắc nhất một chiến lược nhận dạng trước–sau có đối chứng. Cần hỏi giảng viên xem DiD và weighted/matched DiD có được tính là hai mô hình hay không.

## File trong folder review

- [01-review-phuong-phap.md](01-review-phuong-phap.md): đánh giá thiết kế, diễn giải và cặp mô hình.
- [02-review-code.md](02-review-code.md): lỗi cụ thể phát hiện trong code và cách sửa.
- [03-checklist-truoc-khi-chot.md](03-checklist-truoc-khi-chot.md): thứ tự công việc trước khi viết báo cáo.

## Phán quyết theo hạng mục

| Hạng mục | Đánh giá |
|---|---|
| Câu hỏi nghiên cứu VAT | Giữ |
| Giá thanh toán làm outcome chính | Giữ |
| Sản lượng làm outcome phụ | Giữ, nhưng hiện chưa đáng tin để suy luận |
| DiD làm thiết kế chính | Có thể giữ, phải sửa implementation |
| Hồi quy cắt ngang làm mô hình nhân quả | Đã loại đúng |
| Monte Carlo làm mô hình nhân quả thứ hai | Đã loại đúng |
| DiD + matched/weighted DiD | Hợp lý nếu giảng viên chấp nhận hai estimator chung nhận dạng |
| ITS | Chỉ robustness, quá yếu để làm trụ chính |
| Kết luận “pass-through = 0” | Không được dùng |
| Kết luận “bác bỏ full pass-through” | Có triển vọng, phải chạy lại pipeline đã sửa |
| Kết luận lợi ích thuộc nhà bán lẻ | Không được dùng |

## Cập nhật sau khi hồ sơ hoàn tất

Các file `04`–`08` đã được bổ sung sau lượt đọc đầu. Review bản hoàn chỉnh nằm tại
[04-addendum-ban-hoan-chinh.md](04-addendum-ban-hoan-chinh.md). Các lỗi P0/P1 trong
[02-review-code.md](02-review-code.md) vẫn còn vì mã nguồn chưa được sửa.
