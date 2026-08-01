# Đồ án cuối kỳ — Phân tích dữ liệu thông minh

## Tác động của việc giảm thuế GTGT lên giá bán lẻ

Việc giảm thuế giá trị gia tăng từ **10% xuống 8%**, hiệu lực **01/07/2025** theo
Nghị quyết 204/2025/QH15, có làm giảm giá bán lẻ mà người tiêu dùng thực trả không?

| | |
|---|---|
| **Môn học** | Phân tích dữ liệu thông minh |
| **Giảng viên** | TS. Bùi Tiến Lên |

### Nhóm 5

| Họ và tên | MSSV |
|---|---|
| Nguyễn Đình Lộc | 25C11050 |
| Dương Tiến Vinh | 24C11034 |
| Phạm Thị Chiều | 24C12003 |
| Lê Hoàng Nhân | 24C11044 |

---

## Mục lục

| Chương | Nội dung |
|---|---|
| [1 · Bối cảnh](chuong-01-boi-canh.md) | Vì sao chọn đề tài, câu hỏi nghiên cứu |
| [2 · Cơ sở pháp lý](chuong-02-co-so-phap-ly.md) | Hai nghị quyết, diện được giảm và diện loại trừ |
| [3 · Dữ liệu](chuong-03-du-lieu.md) | Nguồn, quy mô bốn cấp, quy tắc lọc, các lỗ hổng |
| [4 · Thiết kế nhân quả](chuong-04-thiet-ke-nhan-qua.md) | Đồ thị nhân quả, khung Kết quả tiềm năng, giả định, hai mô hình |
| [5 · Kết quả](chuong-05-ket-qua.md) | Bốn ước lượng, tỉ lệ chuyển thuế, ba cổng chẩn đoán |
| [6 · Độ chắc chắn và phạm vi](chuong-06-suc-manh-va-co-che.md) | MDE, sức mạnh, chuẩn giá cơ học, phạm vi áp dụng |
| [Phụ lục kỹ thuật](phu-luc-ky-thuat.md) | Công thức, bảng chẩn đoán, độ nhạy, kết quả phụ |

**Sản phẩm kèm theo**

| | |
|---|---|
| Mã nguồn phân tích | [`code/`](../code) — pipeline sáu bước, chạy bằng `python code/chay_tat_ca.py` |
| Web trình bày kết quả | [`web/`](../web) — 7 trang phân tích, FastAPI + Next.js |
| Bộ trình chiếu | `web/frontend/app/trinh-bay` — 25 slide, xem tại `/trinh-bay` |
| Bản tin tóm tắt | [`ban-tin-nhom.html`](ban-tin-nhom.html) — mở bằng trình duyệt là xong |

---

## Kết quả chính

Kết quả rõ nhất của đồ án là **cửa hàng đã không chuyển hết phần giảm thuế vào giá bán lẻ**.

Nếu giảm giá đúng theo phần thuế được giảm, 135 mặt hàng lẽ ra phải đổi giá. Thực tế chỉ
**1 mặt hàng** rơi đúng mức đó, còn **110 mặt hàng giữ nguyên giá cũ**. Theo bốn cách tính,
phần giảm thuế thực sự đi vào giá chỉ khoảng **14% – 36%** mức lẽ ra phải đạt.

Ba cổng chẩn đoán đặt trước cho thấy chưa thể quy toàn bộ chênh lệch đó cho chính sách —
điều này giới hạn **độ lớn** của tác động ước lượng được, không lật ngược kết luận trên.
Chi tiết ở [chương 5](chuong-05-ket-qua.md) và [chương 6](chuong-06-suc-manh-va-co-che.md).

> **Nguyên tắc xuyên suốt:** không con số kết quả nào trong báo cáo, web hay slide được gõ
> tay. Tất cả sinh từ `python code/chay_tat_ca.py` và đọc lại qua một nguồn duy nhất.
