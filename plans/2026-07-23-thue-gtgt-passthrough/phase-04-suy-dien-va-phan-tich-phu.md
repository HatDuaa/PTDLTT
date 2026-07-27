# Phase 04 — Suy diễn & phân tích phụ

**Người:** D · **Chương phủ:** 5, 6, 11 · **Phụ thuộc:** phase 0, 1, 3 · **Chặn:** kết luận cuối

> Phase 3 cho ước lượng điểm. Phase này trả lời: **dữ liệu này có đủ sức phát hiện tác động không**, và **cơ chế nào giải thích kết quả**.
>
> 🔴 Toàn bộ nhánh sản lượng và cơ chế là **khám phá**, không phải nhân quả ([đặc tả §13](dac-ta-khoa.md) bậc 4).

---

## 1. MDE và đường cong sức mạnh — tính LẠI theo `Z`

🔴 **Không tái sử dụng MDE 87% cũ.** Con số đó tính trên thiết kế theo `D` với mẫu và đối chứng khác. Phải tính lại cho:

| Biến kết quả | Mẫu | Ghi chú |
|---|---|---|
| Giá gồm thuế | ITT `Z=1` vs `Z=0` | Kết quả chính |
| Sản lượng | ITT `Z=1` vs `Z=0` | Nhánh khám phá |

### MDE giải tích — bốn đặc tả, bốn con số

`MDE_j = (1,96 + 0,842) · SE_j = 2,802 · SE_j`

| Đặc tả | SE | MDE |
|---|---|---|
| PP1-A thô | 0,600 | **1,68** |
| PP1-A có hiệp biến | 0,733 | 2,05 |
| PP1-B g-computation | 0,776 | **2,17** |
| PP2 phân tầng | 0,592 | 1,66 |

🔴 **Không có một MDE chung.** Báo cáo cả bốn, hoặc khoảng **1,66 – 2,17**. Nếu slide buộc một con số thì dùng **2,17** và gọi rõ là *"MDE bảo thủ theo đặc tả kém chính xác nhất"* — **cấm** chọn 1,66.

Mốc chuyển hoàn toàn 1,835 nằm **trong** khoảng MDE ⇒ sức mạnh xấp xỉ 66–87%: đủ với PP1-thô và PP2, **không đủ** với PP1-hiệp biến và g-computation.

### 🔴 Sức mạnh của TOST — mục bắt buộc, trước đây thiếu

MDE khác 0 **không** trả lời được câu "có chứng minh được tương đương không". Phải tính riêng.

Phát hiện quyết định: biên ±0,918 **nhỏ hơn** `1,645 × SE` của cả bốn đặc tả (0,974 – 1,276).

⇒ **TOST gần như không thể đạt kể cả khi tác động đúng bằng 0.** Biên cần cho ~80% sức mạnh tại ATT = 0 là khoảng **1,47 – 1,93**.

Hệ quả cho cách viết: *"TOST thất bại"* **không phải bằng chứng chống lại tương đương** — nó chủ yếu phản ánh thiết kế không đủ chính xác cho biên đã chọn. Phải nói thẳng điều này, nếu không người đọc sẽ hiểu ngược.

TOST tương đương với yêu cầu **KTC 90% nằm trọn trong biên** — trình bày bằng hình sẽ rõ hơn bằng p-value.

### Mô phỏng đường cong sức mạnh — DGP phải khóa

🔴 Bản trước không khóa cơ chế sinh dữ liệu. Nếu cộng thẳng hiệu ứng vào dữ liệu hiện tại thì hiệu ứng thật thành `ATT quan sát + δ`, không phải `δ`.

Quy trình đúng:
1. **Tái định tâm** dữ liệu về H₀ (trừ ATT quan sát khỏi nhóm `Z=1`)
2. Cộng hiệu ứng giả định `δ` vào nhóm `Z=1`
3. Chạy lại **toàn bộ** estimator và phép suy diễn
4. Lặp 2.000 lần mỗi mức, đếm tỉ lệ bác bỏ

Lưới `δ` theo **chiều giảm giá**: 0 → −3 điểm log ×100.

### 🔴 CẤM sức mạnh hậu kiểm

Không tính "observed power" hay "post-hoc power". Nó chỉ là một phép biến đổi đơn điệu của p-value, **không thêm thông tin nào**. MDE là đủ và đúng.

---

## 2. Nhánh sản lượng — khám phá

| | |
|---|---|
| Ước lượng chính | **ITT theo `Z`** |
| Phụ | per-protocol theo `D` |
| Trục độ nhạy | 3 biến thể 23 SKU · 4 cửa sổ · 5 ngưỡng survivorship |

### 🔴 Biến kết quả phải chuẩn hóa theo phơi nhiễm

**Cấm dùng tổng sản lượng tiền/hậu kỳ trực tiếp** — số ngày cửa hàng hoạt động trong hai kỳ khác nhau (dữ liệu chỉ có 161/259 ngày).

```
y_i = 100 · log[ (Q_hậu / E_hậu) / (Q_tiền / E_tiền) ]
```

với `E` = **số ngày cửa hàng thực sự có giao dịch** trong kỳ.

Nếu không xác định được `E` đáng tin cậy thì **bỏ hẳn nhánh sản lượng**, còn hơn dùng tổng thô.

Tách riêng **biên độ tăng cường** (sản lượng của SKU còn bán) khỏi **biên độ mở rộng** (SKU còn xuất hiện hay không).

**Bắt buộc ghi kèm MDE mỗi lần nhắc tới.** Nếu MDE lớn, kiểm định gần như không mang thông tin.

🔴 **Cấm viết "không có tác động lên sản lượng".** Không bác bỏ ≠ bằng 0.

### Nếu làm phân tích biến mất khỏi kệ

Mẫu chính **đã điều kiện hóa** trên việc SKU có mặt ở cả hai kỳ. Chạy logistic trên mẫu đó là vô nghĩa — biến kết quả đã bị cố định bằng 1 theo xây dựng.

⇒ Phải dựng **cohort trước chọn lọc**: lấy toàn bộ SKU có mặt ở **tiền kỳ**, biến kết quả = có xuất hiện ở hậu kỳ hay không.

🔴 **`Z` cho nhánh này phải xác định HOÀN TOÀN từ thông tin trước 01/07.** Không được dùng `grp` hay thuế suất hậu kỳ — chính những SKU biến mất là những SKU **không có** thuế suất hậu kỳ, nên gán `Z` từ đó là vòng lặp logic.

Nếu không dựng được thì **bỏ hẳn**, không chạy trên mẫu sai.

---

## 3. Mô phỏng làm tròn giá — chuẩn cơ học, KHÔNG phải phản thực

Mục đích: nếu cửa hàng chuyển hoàn toàn phần giảm thuế **và** làm tròn theo quy tắc thông thường, bao nhiêu SKU sẽ đổi giá niêm yết?

| Hạng mục | Khóa trước |
|---|---|
| Đầu vào | Giá tiền kỳ của SKU `Z=1` |
| Tỉ lệ | `1,08 / 1,10` |
| Lưới làm tròn | 1.000đ · 500đ · 100đ — **báo cáo cả ba** |
| **Toán tử** | **Làm tròn về mức gần nhất**; điểm hòa làm tròn **lên** |

⚠️ **`pre_p` là giá GIAO DỊCH trung vị, không chắc là giá niêm yết.** Phải ghi rõ hạn chế này — mô phỏng giả định hai thứ trùng nhau.

🔴 **Đây KHÔNG phải mô phỏng phản thực `Y(0)`.** Nó không dựng kết quả tiềm năng, chỉ trả lời một câu hỏi cơ học: *"mức thay đổi giá cần thiết có vượt bậc làm tròn không?"*

Kết quả chỉ bác bỏ **đúng bộ quy tắc làm tròn đã liệt kê**, không bác bỏ khái niệm chi phí thực đơn nói chung.

---

## 4. Bất định — nói đúng phạm vi

🔴 Mọi HC3 và bootstrap trong đồ án chỉ đo **bất định có điều kiện ở cấp SKU**.

Bất định ở **cấp chính sách** — một cửa hàng, một ngày, một người ra quyết định giá — **không ước lượng được** bằng dữ liệu này. Đây là hạn chế nền tảng, phải nằm ở chương hạn chế.

**Quyết định: đưa gộp cụm và hoán vị xuống PHỤ LỤC**, gắn nhãn *"chẩn đoán, không có địa vị suy diễn"*:
- Gộp cụm theo nhóm hàng (3 cụm) — số cụm quá ít cho lý thuyết tiệm cận
- Hoán vị nhãn trong tầng — can thiệp do luật định, không bốc thăm ⇒ **không phải** suy diễn ngẫu nhiên hóa hợp lệ

🔴 **Cấm viết "đã xử lý ngụy lặp"** hay bất kỳ câu nào ngụ ý hai cách trên giải quyết được vấn đề.

---

## 5. Phụ lục Wald

**Quyết định: GIỮ ở phụ lục.** Không để trạng thái "nếu còn thời gian".

Bootstrap **đồng thời** reduced form và first stage (không chia hai ước lượng điểm), đủ ba biến thể phân loại 23 SKU, kèm first stage của từng biến thể.

Tên gọi: **"ITT hiệu chỉnh theo Wald, có điều kiện trên các giả định IV mạnh"**. Cấm gọi là bằng chứng LATE nhân quả.

---

## 6. Những gì CẮT khỏi thân bài

| Nội dung | Lý do |
|---|---|
| Sức mạnh hậu kiểm | Biến đổi đơn điệu của p-value |
| Đào sâu riêng tầng 3 | Nhận diện sau khi xem bảng 5 tầng; KTC chứa 0 |
| Nghịch lý Berkson | `type` không ổn định cấp SKU; điều kiện hóa trên tổng giỏ tạo tương quan âm **cơ học** |
| Mạng Bayes | Quan hệ tất định vi phạm giả định học cấu trúc |
| Logistic trên mẫu chính | Biến kết quả đã bị cố định bằng 1 theo xây dựng |

Berkson và mạng Bayes: nếu vẫn muốn giữ, chỉ ở **phụ lục**, gọi đúng tên là minh họa công cụ, và **cấm** diễn giải nhân quả.

---

## Tiêu chí nghiệm thu

- [ ] MDE tính lại theo `Z` cho **cả** giá và sản lượng
- [ ] Đường cong sức mạnh khớp MDE giải tích
- [ ] Không có "observed power" ở bất kỳ đâu
- [ ] Mỗi lần nhắc sản lượng đều kèm MDE
- [ ] Mô phỏng làm tròn báo cáo cả 3 bậc, gọi đúng tên là chuẩn cơ học
- [ ] Có mục nói rõ bất định cấp chính sách **không** ước lượng được
- [ ] Gộp cụm và hoán vị gắn đúng nhãn "độ nhạy"
- [ ] Logistic hoặc dựng đúng cohort, hoặc bỏ hẳn
- [ ] Mọi con số sinh từ script

## Rủi ro

| Rủi ro | Xử lý |
|---|---|
| Dùng lại MDE 87% cũ | Tính lại từ SE thực của đặc tả `Z` |
| Biến mô phỏng làm tròn thành "phương pháp thứ ba" | Nó không dựng `Y(0)`; chỉ là chuẩn cơ học |
| Trình bày hoán vị/gộp cụm như đã xử lý ngụy lặp | Nhãn vai trò bắt buộc |
| Chạy logistic trên mẫu đã điều kiện hóa | Dựng cohort tiền kỳ hoặc bỏ |
