# Phase 00 — Khóa nền tảng (cổng chặn)

**Người:** cả nhóm · **Trạng thái:** ✅ **XONG 26/07/2026** · **Chặn:** phase 01–06

> Mục đích: khóa mọi lựa chọn có thể bị thao túng về sau. Sau phase này, **không ai được đổi estimand, mẫu, đặc tả hay nhóm đối chứng** mà không đi qua quy trình sửa đổi ở [`dac-ta-khoa.md` §12](dac-ta-khoa.md).

## Bối cảnh

- [plan.md](plan.md) — bản đồ tổng thể
- [dac-ta-khoa.md](dac-ta-khoa.md) — **sản phẩm chính của phase này**
- [10-truy-nguyen-hai-co-do.md](../../claude-opus-4.8/10-truy-nguyen-hai-co-do.md) §0 — vì sao phải khóa

---

## Nguyên tắc phạm vi

Phase 0 khóa **quyết định**, không phải **thực thi**. Nguyên tắc phân định:

> Quyết định nào mà **nếu chốt muộn sẽ phải làm lại từ đầu** → thuộc phase 0.
> Quyết định nào chỉ ảnh hưởng cách trình bày → thuộc phase sau.

Hệ quả: rất nhiều thứ trông như "việc của phase 1–4" thực ra phải chốt ở đây. Ngược lại, **dựng khung HTML không thuộc phase 0** — nó là thực thi, chuyển sang phase 5.

---

## Việc đã làm

### 1. Ban hành [`dac-ta-khoa.md`](dac-ta-khoa.md) — 15 mục

| Mục | Khóa gì | Kéo từ |
|---|---|---|
| 1 | Ước lượng đích ATT, tổng thể mà nó đại diện | — |
| 2 | Nguồn dữ liệu, đường dẫn bản trung gian | P1 |
| 3 | **7 quy tắc lọc theo thứ tự** + số dòng còn lại | P1 |
| 4 | Công thức giá, gộp bằng trung vị, biến kết quả, đơn vị, trọng số | P1 |
| 5 | Quy tắc gán nhóm, roster SKU cố định, xử lý SKU đổi mã | P1 |
| 6 | Cửa sổ chính + **3 cửa sổ độ nhạy bắt buộc báo cáo song song** | — |
| 7 | Ngưỡng survivorship + lưới độ nhạy, kèm số SKU từng mức | P1 |
| 8 | **Đặc tả PP1 đầy đủ**: dạng hàm, danh sách 4 hiệp biến, quy tắc chỉ dùng tiền kỳ | P3 |
| 9 | **Đặc tả PP2 đầy đủ**: định nghĩa tầng, điểm cắt, quy tắc tầng nhỏ, công thức trọng số | P3 |
| 10 | α, KTC, loại sai số chuẩn, đơn vị bootstrap, số lần lặp, seed, biên TOST, xử lý ngụy lặp | P4 |
| 11 | **Công bố quyết định hậu kiểm** (loại tháng 4) | — |
| 12 | Quy trình sửa đổi + nhật ký | — |
| 13 | **Thứ bậc kết quả** + quy tắc xử lý khi hai phương pháp lệch nhau | — |
| 14 | Thừa nhận hai phương pháp dùng chung một chiến lược nhận dạng | P2 |
| 15 | Tiêu chí nghiệm thu + ô ký xác nhận | — |

### 2. Giải quyết hai mâu thuẫn tài liệu

| Mâu thuẫn | Xử lý |
|---|---|
| Số SKU **156/161** vs **153/157** | Chạy lại `15-DAC-TA-SACH-ket-qua-chinh.py` → xác nhận **T=153, C10=157, C8=1908, 82.109 dòng**. Con số cũ là đặc tả **còn tháng 4**. Đã sửa `plan.md` §3 và chú thích §2 |
| `plan.md` §0 chốt "hồi quy + phân tầng" nhưng §5b vẫn ghi "DiD cơ bản vs DiD đa biến" | Đã viết lại §5b cho khớp |

### 3. Đo trước các con số cần để khóa

Không thể khóa ngưỡng và cách chia tầng nếu chưa biết chúng dẫn tới đâu. Đã đo — **chỉ dùng thông tin tiền can thiệp, không đụng biến kết quả**:

- **Lưới survivorship**: ≥1 tuần → 153 SKU treated; ≥3 tuần → 92; ≥5 tuần → 40. Ngưỡng có thể làm mẫu đổi gấp 4 lần ⇒ bắt buộc định trước
- **Phân bố tầng**: cắt phân vị trong từng cặp so sánh cho **0 tầng rỗng** ở đối chứng chính; cắt toàn cục tạo **1 tầng rỗng** và mất 3 SKU treated ⇒ chọn cách 1, cách 2 làm độ nhạy
- **Phát hiện phụ có giá trị**: với đối chứng 8%, SKU treated dồn vào tầng giá cao (62/72 nhóm Nước uống). Cơ cấu tầng lệch mạnh ⇒ phân tầng là phương pháp thứ hai **thật sự mang thông tin**, không trùng lặp với hồi quy

### 4. Phát hiện rủi ro tái lập

🔴 Các CSV trung gian đang nằm trong **thư mục tạm của phiên làm việc** và sẽ bị xóa. Hiện **không script nào chạy lại được từ repo**. Đã ghi vào `dac-ta-khoa.md` §2; phase 1 phải xử lý đầu tiên.

---

## Việc còn lại của phase 0 — thuộc về nhóm, không thuộc về máy

| # | Việc | Ai |
|---|---|---|
| 1 | **Ký xác nhận** đã đọc `dac-ta-khoa.md` (bảng §15) | cả 4 |
| 2 | **Chỉ định biên tập trưởng** — thống nhất thuật ngữ, đơn vị, đối chiếu số giữa 4 người. Không kiêm phase nặng | cả nhóm |
| 3 | **Gửi câu hỏi DiD cho giảng viên** ([plan.md §5b](plan.md)) | cả nhóm |
| 4 | Chốt **cây nội dung web** (chương nào ở đâu) + quy ước mọi bảng/biểu đồ sinh từ script | biên tập trưởng |

⚠️ Việc 4 **chỉ chốt cấu trúc**, không dựng HTML. Dựng khung là phase 5.

---

## Câu hỏi giảng viên — không còn là "không chặn"

Đánh giá trước đây cho rằng câu hỏi này chỉ để xác nhận. **Sai.** Nếu thầy yêu cầu hai **chiến lược nhận dạng** khác nhau thì cặp phương pháp hiện tại không đáp ứng — cả hai cùng dựa trên xu hướng song song, và dữ liệu này không cho phép chiến lược thứ hai.

| | |
|---|---|
| Chặn | **Phase 3** |
| Không chặn | Phase 1, 2 |
| Nếu thầy yêu cầu hai chiến lược | Phải đổi dữ liệu — không có cách vá |

---

## Tiêu chí nghiệm thu

- [x] `dac-ta-khoa.md` tồn tại, không còn ô TBD, có ngày và số phiên bản
- [x] Mọi hạng mục có thể thao túng đã được khóa bằng **công thức cụ thể**, không phải tên đề mục
- [x] Hai mâu thuẫn tài liệu đã giải quyết bằng dữ liệu thật
- [x] Quyết định hậu kiểm (loại tháng 4) đã công bố kèm nghĩa vụ báo cáo song song
- [x] Có quy trình sửa đổi và nhật ký sửa đổi
- [ ] Cả 4 thành viên đã ký xác nhận
- [ ] Đã chỉ định biên tập trưởng
- [ ] Câu hỏi đã gửi giảng viên

---

## Rủi ro nếu bỏ qua phase này

Mỗi người tự chọn mẫu và đặc tả khác nhau → con số trong báo cáo không khớp nhau, và **không chống được cáo buộc chọn kết quả đẹp**. Nhóm đã có tiền lệ: đặc tả từng bị đổi sau khi nhìn thấy kết quả, và phải viết cả một mục công bố việc đó.
