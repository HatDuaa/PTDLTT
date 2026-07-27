# 08 — Chia việc, việc còn nợ, tiêu chí nghiệm thu

---

## 1. Bản đồ phủ chương trình môn học

| Chương | Nội dung môn học | Trạng thái trong đồ án |
|---|---|---|
| 1. Giới thiệu PTDL | — | ⚪ Chưa làm — đặt vấn đề, câu hỏi nghiên cứu |
| 2. Kỹ thuật thu thập dữ liệu | — | 🟡 Có tư liệu ([01](01-du-lieu-va-lam-sach.md)) — cần viết thành chương |
| 3. Phân tích mô tả | — | ⚪ **Trống nhất** — cần EDA đầy đủ |
| 4. Phương pháp nghiên cứu | — | 🟡 Có thiết kế ([03](03-thiet-ke-nhan-qua.md)) — cần viết phần khung pháp lý, thí nghiệm tự nhiên |
| 5. Cơ sở suy diễn thống kê | — | 🟡 Có KTC, bootstrap — cần hệ thống hóa |
| 6. Kiểm định giả thuyết | — | 🟢 Có t-test, hoán vị, TOST, KS, chi-square |
| 7. Mô hình đồ thị | DAG, mạng Bayes | 🟡 DAG chuyên gia cần vẽ; mạng Bayes đã chạy ([06](06-phu-luc-do-thi-nghich-ly.md)) nhưng chỉ ở mức phụ lục |
| 8. Phân tích nhân quả | 3 cấp độ Pearl, Simpson, Berkson, Potential Outcomes, ATE | 🟢 Mạnh — Berkson có ví dụ thật n=50k; Simpson còn thiếu mẫu |
| 9–10. Hồi quy | Tuyến tính, đa biến, logistic | 🟢 Đã có đủ ba loại |
| 11. Monte Carlo | — | 🟢 Hoán vị, bootstrap, đường cong sức mạnh, mô phỏng cơ chế |

---

## 2. Chia việc 4 người

| Người | Mảng | Nội dung cụ thể | Chương |
|---|---|---|---|
| **A** | Dữ liệu & Mô tả | Nhật ký làm sạch theo [01 §4](01-du-lieu-va-lam-sach.md) kèm số quan sát từng bước · Từ điển biến · EDA đầy đủ (phân bố giá trị giỏ, nhóm hàng, mùa vụ, ngày trong tuần) · Mô tả cú dời cửa hàng · **Phân tích độ nhạy theo ngưỡng lọc số tuần** ([05 §2](05-han-che-va-rui-ro.md)) | 1, 2, 3 |
| **B** | Đồ thị & Nghịch lý | Vẽ DAG chuyên gia cho bài toán thuế, chỉ ra tập chặn cửa sau · Berkson/collider trên dữ liệu giỏ hàng · Tìm cách phân tầng cho Simpson · Mạng Bayes (phụ lục, kèm 2 cảnh báo phương pháp) | 7, 8 |
| **C** | Lõi nhân quả | Thiết kế và giả định nhận dạng · **Cặp mô hình — chờ giảng viên** · Kiểm định vững, giả dược nhiều mốc · Bổ sung kiểm tra tiền can thiệp còn thiếu ([03 §3](03-thiet-ke-nhan-qua.md)) · Mục "mô hình ngây thơ" minh họa sai lệch | 4, 8, 9, 10 |
| **D** | Suy diễn & Mô phỏng | Bootstrap KTC · Kiểm định hoán vị · **Kiểm định tương đương TOST** · Đường cong sức mạnh và MDE cho sản lượng · Mô phỏng cơ chế làm tròn giá | 5, 6, 11 |
| **Chung** | Sản phẩm | Báo cáo web (HTML tĩnh self-contained, mở được không cần server) · Slide thuyết trình · Mã nguồn Python có README và một lệnh chạy lại toàn bộ | — |

**Rủi ro phân công:** mảng C bị chặn cho tới khi giảng viên trả lời câu hỏi ở [03 §6.5](03-thiet-ke-nhan-qua.md). Trong lúc chờ, người C làm phần kiểm tra tiền can thiệp còn thiếu và giả dược.

---

## 3. Việc còn nợ

| # | Việc | Ưu tiên | Người |
|---|---|---|---|
| 1 | **Gửi câu hỏi cho giảng viên** ([03 §6.5](03-thiet-ke-nhan-qua.md)) — quyết định kiến trúc toàn bộ đồ án | 🔴 Cao nhất | Cả nhóm |
| 2 | Chạy lại giả dược mốc 01/05 ở cả hai trạng thái giữ/loại `daxoa=2` | 🔴 Cao | C |
| 3 | Phân tích độ nhạy theo ngưỡng lọc số tuần (survivorship). **Không chọn ngưỡng sau khi xem kết quả** — đặc tả chính dùng điều kiện tối thiểu **định trước**, rồi báo cáo toàn bộ lưới độ nhạy kèm estimand của từng mẫu | 🔴 Cao | A |
| 3b | **Điều tra hệ số lead tháng 4 (−1,37)** — vì sao giá hai nhóm phân kỳ trong tháng 4? Có phải hiệu ứng gia nhập của SKU mới khi mã vạch bắt đầu được điền? | 🔴 Cao | C |
| 3c | **Làm rõ vì sao ĐC 8% + hiệp biến tiền kỳ cho kết quả ngược** (+1,225%, p=0,038) | 🔴 Cao | C |
| 4 | Bổ sung kiểm tra tiền can thiệp: xu hướng giá theo tuần, độ biến động giá, tần suất giao dịch, mùa vụ | 🟡 Vừa | C |
| 5 | Simpson: **không cố tìm**. Nếu không có phân tầng có ý nghĩa miền và đủ mẫu thì **bỏ hẳn phần này** thay vì đào dữ liệu | 🟢 Thấp (có thể cắt) | B |
| 6 | Sửa phần mạng Bayes: thay χ² bằng p-value kèm df và Cramér's V | 🟡 Vừa | B |
| 7 | Dọn mã nguồn thành pipeline một lệnh chạy | 🟢 Thấp (sau khi chốt) | Chung |
| 8 | Vẽ DAG chuyên gia | 🟢 Thấp | B |

**Đã xong:** xác định `daxoa=2` (bản trùng lặp) · tìm nguyên nhân tháng 2–3 rớt (mã vạch từ 04/2025) · xác nhận danh mục không gãy khi dời cửa hàng · kiểm định TOST · tra cứu cơ sở pháp lý.

---

## 4. Tiêu chí nghiệm thu

### Tái lập được
- [ ] Mọi con số trong báo cáo tái lập từ mã nguồn bằng **một lệnh**
- [ ] Nhật ký làm sạch ghi rõ số quan sát còn lại ở **từng bước**
- [ ] Có từ điển biến

### Trung thực về phương pháp
- [ ] Mọi hệ số ghi rõ **đơn vị** (điểm phần trăm hay log-point)
- [ ] Mọi giả định nhận dạng được nêu, kèm trạng thái kiểm chứng **và giới hạn sức mạnh kiểm định**
- [ ] Gọi **đúng tên** phương pháp, giải thích bằng khung đã học, ghi rõ phần nào là vận dụng thêm
- [ ] Nêu rõ mô hình nào **không** phải mô hình nhân quả và vì sao

### Không phát biểu quá
- [ ] Pass-through: "bác bỏ chuyển hoàn toàn; chưa chứng minh tương đương 0" — **không viết "bằng 0"**
- [ ] Không viết "nhà bán lẻ giữ trọn phần giảm thuế"
- [ ] Sản lượng: kèm MDE, không viết "chính sách không tác động"
- [ ] Không viết "pre-trend đạt"
- [ ] Không khái quát hóa từ một cửa hàng ra ngành bán lẻ Việt Nam

### Nội dung
- [ ] Hai mô hình trình bày song song **kèm mục giải thích chênh lệch**
- [ ] Có DAG mở đầu phần nhân quả
- [ ] Có mục Simpson và Berkson trên dữ liệu thật
- [ ] Có mục hạn chế dữ liệu ([05 §3](05-han-che-va-rui-ro.md))

### Sản phẩm
- [ ] Báo cáo web mở được không cần server
- [ ] Slide riêng
- [ ] Mã nguồn có README
- [ ] Toàn bộ tiếng Việt
