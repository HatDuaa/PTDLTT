# Chương 5 — Kết quả

> Mọi con số sinh từ `python code/chay_tat_ca.py`. Đơn vị: **điểm log ×100** (xấp xỉ % khi giá trị nhỏ).
>
> 🔴 **Cổng cân bằng đã trượt** ([chương 4.8](chuong-04-thiet-ke-nhan-qua.md)). Theo quy tắc khóa trước, cả hai phương pháp được trình bày là **so sánh có điều chỉnh**, không phải ước lượng nhân quả sạch.

## 5.1 Kết quả chính — so sánh theo `Z`

Mẫu: `Z=1` **155** SKU · `Z=0` **132** SKU.

🔴 **Tên gọi chính xác của estimand.** Đây **không phải** ITT vô điều kiện cho toàn bộ cohort tiền kỳ, mà là **so sánh theo `Z` trong nhóm SKU có giá quan sát được ở cả hai kỳ**. Lý do: giá hậu kỳ chỉ quan sát được khi SKU còn bán, và tỉ lệ sống sót của hai nhóm **khác nhau 7,2 điểm phần trăm** ([chương 6.5](chuong-06-suc-manh-va-co-che.md)) — mẫu đã điều kiện hóa trên một biến hậu can thiệp.

Nó cũng **không phải** hiệu ứng trên nhóm "luôn sống sót", vì không nhận diện được SKU nào sẽ sống sót dưới cả hai trạng thái.

| Phương pháp | Ước lượng | SE | p | KTC 95% |
|---|---|---|---|---|
| PP1-A thô | −0,398 | 0,600 | 0,507 | [−1,57; +0,78] |
| PP1-A có hiệp biến | −0,270 | 0,733 | 0,713 | [−1,71; +1,17] |
| PP1-B g-computation (ATT) | −0,664 | 0,776 | 0,397 | [−2,20; +0,84] |
| PP2 phân tầng 5 phân vị giá | −0,257 | 0,592 | 0,661 | [−1,41; +0,91] |

**Cả bốn khoảng tin cậy đều chứa 0.** Không phát hiện được bằng chứng thống kê về việc giá giảm.

**Chồng lấn hiệp biến:** 2,6% SKU `Z=1` nằm ngoài khoảng của `Z=0` — toàn bộ ở chiều giá nền; sản lượng và số tuần chồng lấn hoàn toàn. g-computation phải ngoại suy ở đúng 2,6% đó.

**Bootstrap PP2:** 5.000/5.000 lần hợp lệ, 0 lần thất bại.

## 5.2 Kết quả theo tầng

| Tầng | Khoảng giá nền | n(Z=1) | n(Z=0) | Trọng số | τ̂_s |
|---|---|---|---|---|---|
| 0 | 9.000 – 26.000đ | 19 | 39 | 0,123 | −0,076 |
| 1 | 27.000 – 42.000đ | 39 | 20 | 0,252 | +0,066 |
| 2 | 43.000 – 62.000đ | 32 | 24 | 0,206 | −0,256 |
| **3** | **64.000 – 96.000đ** | 31 | 27 | 0,200 | **−1,662** |
| 4 | 99.000 – 804.000đ | 34 | 22 | 0,219 | +0,551 |

⚠️ Tầng 3 có chênh lệch âm lớn nhất, nhưng **ước lượng thiếu chính xác và được nhận diện sau khi xem bảng năm tầng**. Sai số chuẩn xấp xỉ 1,36 nên |t| ≈ 1,22 và khoảng tin cậy chứa 0. Bốn tầng còn lại không tạo thành quy luật đơn điệu. **Chưa thể phân biệt dị biệt thật với nhiễu** — không đào sâu riêng tầng này.

## 5.3 Hai giả thuyết

Mốc **chuyển hoàn toàn** = `log(1,08/1,10) × 100` = **−1,835**.

| Phương pháp | Pass-through | H₀: ATT = 0 | H₀: chuyển hoàn toàn |
|---|---|---|---|
| PP1-A thô | +0,217 | p = 0,507 | p = 0,017 → bác bỏ |
| PP1-A có hiệp biến | +0,147 | p = 0,713 | p = 0,033 → bác bỏ |
| **PP1-B g-computation** | +0,362 | p = 0,397 | **p = 0,131 → KHÔNG bác bỏ** |
| PP2 phân tầng | +0,140 | p = 0,661 | p = 0,008 → bác bỏ |

🔴 **Việc bác bỏ mốc chuyển hoàn toàn PHỤ THUỘC PHƯƠNG PHÁP.** Ba đặc tả bác bỏ, g-computation không. Theo quy tắc khóa trước, **không lấy "3/4" làm biểu quyết**.

> Các ước lượng điểm đều gần 0 hơn mốc chuyển hoàn toàn, nhưng việc bác bỏ mốc đó phụ thuộc vào lựa chọn phương pháp. Dữ liệu **không cung cấp bằng chứng nhất quán** để kết luận cửa hàng đã không chuyển hoàn toàn phần giảm thuế.

Ở bản trước, "bác bỏ chuyển hoàn toàn" là kết luận mạnh nhất của đồ án. Sau khi bổ sung g-computation, nó bị hạ xuống thành **kết quả nhạy với mô hình**.

**TOST — không kết luận được ở mọi biên:**

| Phương pháp | Biên ±0,459 | Biên ±0,918 |
|---|---|---|
| PP1-A thô | p = 0,460 | p = 0,193 |
| PP1-A có hiệp biến | p = 0,398 | p = 0,189 |
| PP1-B g-computation | p = 0,604 | p = 0,372 |
| PP2 phân tầng | p = 0,367 | p = 0,132 |

⇒ **Không được kết luận pass-through bằng hoặc gần 0.**

🔴 **Nhưng cũng KHÔNG được đọc "TOST thất bại" như bằng chứng chống lại sự tương đương.** Biên ±0,918 **nhỏ hơn** mức cần cho 80% sức mạnh ở cả bốn đặc tả (±1,73 đến ±2,27). Sức mạnh thực của TOST ở biên này là **0,0%** — nó không có cơ hội nào thành công, kể cả khi tác động thật đúng bằng 0. Xem [chương 6.3](chuong-06-suc-manh-va-co-che.md).

## 5.4 Kết quả phụ — per-protocol theo `D`

Cần thêm giả định rằng quyết định cập nhật thuế không liên quan xu hướng giá phản thực.

| Đối chứng | n₀ | Ước lượng | p |
|---|---|---|---|
| ĐC-A rượu/bia/thuốc lá | 132 | −0,264 | 0,714 |
| ĐC-B bỏ hàng hóa chất | 137 | −0,203 | 0,769 |
| ĐC-C đầy đủ | 157 | −0,076 | 0,903 |
| ĐC-8% *(độ nhạy)* | 1.908 | +0,927 | 0,134 |
| PP2 phân tầng, ĐC-A | 132 | −0,343 | 0,563 |

## 5.5 Cổng chẩn đoán

| Cổng | Tiêu chí khóa trước | Kết quả |
|---|---|---|
| **1 — Cân bằng sau phân tầng** | ≤ 1/3 cặp \|SMD\| > 0,25 | 🔴 **TRƯỢT** — 12/15 cặp |
| **2 — Giả dược 05→06** | \|ước lượng\| ≤ 0,918 | ✅ **ĐẠT** — lớn nhất 0,562 |
| **3 — TOST tiền xu hướng** | p < 0,05 ở biên ±0,918 | 🔴 **KHÔNG ĐẠT** — p từ 0,090 đến 0,244 |

Giả dược cho so sánh chính `Z`: −0,195 (thô) và +0,101 (có hiệp biến).

⚠️ Hiệp biến của giả dược được tính **lại chỉ trên tháng 05**. Dùng `pre_*` của đặc tả chính sẽ là rò rỉ, vì chúng tính trên 05+06 mà tháng 06 chính là kỳ "hậu" của giả dược.

**Ba cổng không phải ba lá phiếu.** Cổng 2 đạt **không bù** được cổng 1 và 3:

> Không phát hiện chênh lệch giả dược có độ lớn vượt ngưỡng định trước, nhưng kiểm định tương đương không đạt và mất cân bằng tiền kỳ còn nghiêm trọng. Giả định xu hướng song song **không được xác nhận**; mọi diễn giải nhân quả chỉ có điều kiện và đã được hạ cấp.

## 5.6 Lưới độ nhạy — báo cáo toàn bộ

### Cửa sổ thời gian

| Cửa sổ | n | Theo `Z` | p | Per-protocol | p |
|---|---|---|---|---|---|
| Chính (05+06 → 07+08) | 287 | −0,270 | 0,713 | −0,264 | 0,714 |
| **Có tháng 4** | 293 | −0,113 | 0,876 | −0,092 | 0,898 |
| Hẹp 1 tháng (06 → 07) | 251 | −0,214 | 0,782 | −0,217 | 0,777 |
| Sau dời địa điểm (từ 11/06) | 248 | −0,212 | 0,790 | −0,214 | 0,785 |

Cửa sổ có tháng 4 — quyết định hậu kiểm ở [chương 4](chuong-04-thiet-ke-nhan-qua.md) — **không** làm đổi kết luận.

### Các trục còn lại

| Trục | Mức | n | Ước lượng | p |
|---|---|---|---|---|
| 23 SKU chưa phân loại | loại *(cơ sở)* | 287 | −0,270 | 0,713 |
| | gán tất cả `Z=1` | 310 | −0,334 | 0,623 |
| | gán tất cả `Z=0` | 310 | −0,109 | 0,864 |
| Ngưỡng survivorship | ≥1 tuần *(chính)* | 287 | −0,270 | 0,713 |
| | ≥2 tuần | 228 | +0,032 | 0,958 |
| | ≥3 tuần | 189 | −0,298 | 0,623 |
| | ≥4 tuần | 145 | −0,239 | 0,708 |
| | **≥5 tuần** | 104 | **+0,875** | 0,290 |
| 9 SKU hòa VAT | giữ *(T=153)* | 287 | −0,270 | 0,713 |
| | loại *(T=144)* | 278 | −0,164 | 0,828 |
| Biến kết quả | giá gồm thuế | 287 | −0,270 | 0,713 |
| | **giá chưa thuế** | 287 | **+1,286** | **0,082** |

⚠️ Ngưỡng ≥5 tuần đổi dấu, nhưng n giảm còn 104 và khoảng tin cậy rất rộng [−0,75; +2,50].

⚠️ **Giá chưa thuế tăng** +1,286 điểm log ×100 (p = 0,082). Với per-protocol thì +1,515 (p = 0,036). Đây là hướng phù hợp với việc doanh thu chưa thuế của cửa hàng tăng khi thuế suất giảm mà giá gồm thuế giữ nguyên — nhưng **không được phát biểu thành "cửa hàng giữ lại phần giảm thuế"**: dữ liệu không có chi phí đầu vào để nói về biên lợi nhuận.

## 5.7 Những gì đứng vững và những gì không

### Đứng vững

- Trong 155 SKU đủ điều kiện đã phân loại, cửa hàng cập nhật **135**, không cập nhật **20** — tỉ lệ tuân thủ quan sát **87,1%**
- Nhóm đủ điều kiện **bán ít và thưa hơn rõ rệt** so với nhóm thuế TTĐB; điều chỉnh theo năm phân vị giá **không** tạo được cân bằng cục bộ
- Chênh lệch quan sát dao động **−0,11 đến −0,66** điểm log ×100 tùy phương pháp và biến thể; **mọi khoảng tin cậy đều chứa 0**
- Kết luận **ổn định** qua bốn cửa sổ thời gian, ba cách xử lý SKU chưa phân loại, và hai cách xử lý SKU hòa VAT
- Dữ liệu là minh họa có giá trị về **không tuân thủ**, **ô nhiễm nhóm đối chứng** và giới hạn của thí nghiệm tự nhiên thực địa

### 🔴 Không được viết

| Câu cấm | Vì sao |
|---|---|
| "Nghị quyết không làm giảm giá" / "tác động bằng 0" | Không bác bỏ ≠ bằng 0. TOST thất bại ở mọi biên |
| "Cửa hàng giữ lại phần giảm thuế" | Không có dữ liệu chi phí đầu vào |
| "Pass-through bằng 0" | TOST thất bại |
| "Bác bỏ chuyển hoàn toàn" *(như kết luận chính)* | Phụ thuộc phương pháp — g-computation không bác bỏ |
| "Hai phương pháp xác nhận lẫn nhau" | Chung một chiến lược nhận dạng |
| "Xu hướng song song đã đạt / đã được chứng minh" | Cổng 3 không đạt; cổng 1 trượt |
| "Đã xử lý ngụy lặp" | Một cửa hàng, một ngày chính sách |
| Ngoại suy ra cửa hàng khác / ngành bán lẻ Việt Nam | Một cửa hàng |
| Gọi kết quả là "ITT" mà **không** kèm điều kiện mẫu | Mẫu đã điều kiện hóa sống sót, chênh 7,2 điểm % |
| "TOST thất bại ⇒ pass-through khác 0" | Biên quá hẹp so với độ chính xác dữ liệu |
| Dùng p = 0,067 (sản lượng) như "suýt có ý nghĩa" | MDE = 31,5 — thiết kế không đủ lực |
| Đặt 87,1% *(làm tròn)* cạnh 87,1% *(tuân thủ)* | Hai con số trùng **ngẫu nhiên**, hai tập SKU khác nhau |

### Câu kết luận đúng

> Không tìm thấy bằng chứng giá giảm trong các so sánh có điều chỉnh này; dữ liệu không đủ để quy chênh lệch quan sát cho chính sách một cách đáng tin cậy.
