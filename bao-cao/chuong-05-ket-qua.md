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

Chồng lấn hiệp biến và kết quả bootstrap được tách sang [Phụ lục A.3](phu-luc-ky-thuat.md#a3).

## 5.2 Kết quả theo tầng

Kết quả giữa năm tầng không tạo thành quy luật rõ ràng. Chưa thể tách dị biệt thật khỏi nhiễu, nên nhóm không đào sâu riêng một tầng. Bảng đầy đủ nằm tại [Phụ lục D.1](phu-luc-ky-thuat.md#d1).

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

TOST không cho phép kết luận pass-through bằng hoặc gần 0. Bảng kiểm định và cảnh báo cách đọc nằm tại [Phụ lục B.2](phu-luc-ky-thuat.md#b2).

## 5.4 Kết quả phụ — per-protocol theo `D`

So sánh theo thuế cửa hàng thực áp cần thêm giả định về quyết định vận hành của cửa hàng, nên chỉ là kết quả phụ. Các định nghĩa đối chứng và bảng đầy đủ nằm tại [Phụ lục D.2](phu-luc-ky-thuat.md#d2).

## 5.5 Cổng chẩn đoán

Cổng giả dược đạt, nhưng cổng cân bằng trượt và TOST tiền xu hướng không đạt. Vì vậy giả định xu hướng song song **không được xác nhận**; mọi diễn giải nhân quả chỉ có điều kiện. Tiêu chí, số liệu và cảnh báo rò rỉ nằm tại [Phụ lục A.4](phu-luc-ky-thuat.md#a4).

## 5.6 Giá chưa thuế và độ nhạy

⚠️ **Giá chưa thuế tăng** +1,286 điểm log ×100 (p = 0,082). Với per-protocol thì +1,515 (p = 0,036). Đây là hướng phù hợp với việc doanh thu chưa thuế của cửa hàng tăng khi thuế suất giảm mà giá gồm thuế giữ nguyên — nhưng **không được phát biểu thành "cửa hàng giữ lại phần giảm thuế"**: dữ liệu không có chi phí đầu vào để nói về biên lợi nhuận.

Cửa sổ có tháng 4 — quyết định hậu kiểm ở [chương 4](chuong-04-thiet-ke-nhan-qua.md) — **không** làm đổi kết luận.

Kết luận chung ổn định qua các cửa sổ thời gian và cách xử lý mẫu. Toàn bộ lưới, kể cả trường hợp đổi dấu, nằm tại [Phụ lục C.1](phu-luc-ky-thuat.md#c1).

## 5.7 Giá thực tế có giảm đúng theo phần thuế được giảm không?

Nếu cửa hàng thật sự giảm giá theo thuế, giá mới của từng mặt hàng phải là bao nhiêu? Nhóm lấy giá trước chính sách, giảm theo tỉ lệ thuế từ 10% xuống 8%, rồi làm tròn đến 1.000 đồng. Sau đó so mức giá tính được với giá bán thực tế sau chính sách.

| Nhóm mặt hàng | Lẽ ra phải đổi giá | Giá thực tế đúng mức dự kiến | Tỉ lệ | KTC 95% |
|---|---:|---:|---:|---|
| Được giảm thuế (`Z=1`) | **135** | **1** | **0,7%** | [0,1%; 4,1%] |
| Không được giảm thuế — đối chiếu (`Z=0`) | 92 | 1 | 1,1% | [0,2%; 5,9%] |

Trong 135 mặt hàng được giảm thuế mà lẽ ra phải đổi giá, chỉ **1** mặt hàng đạt đúng mức dự kiến. **110** mặt hàng vẫn giữ nguyên giá cũ.

Cửa hàng đã không thực hiện một đợt giảm giá đồng loạt theo mức giảm thuế. Tỉ lệ khớp ở nhóm được giảm thuế cũng **không cao hơn** nhóm đối chiếu — nhóm này vốn không được giảm thuế nên mức "dự kiến" với chúng chỉ là con số giả định. Vì vậy vài lần giá tình cờ trùng mức dự kiến không tạo thành dấu hiệu cho thấy cửa hàng đã điều chỉnh giá theo thuế.

> **Cách tính.** Giá dự kiến = giá trước chính sách × (1,08/1,10), làm tròn đến 1.000 đồng gần nhất. Xem là khớp nếu chênh dưới 1 đồng. Khoảng tin cậy dùng phương pháp Wilson — Wald sụp về [0; 0] khi tử số nhỏ như ở đây.

⚠️ Đây là **so sánh mô tả với một mức giá giả định**, không phải ước lượng tác động nhân quả. Nó trả lời "giá có bám mức đó không", không trả lời "chính sách gây ra điều gì".

🔴 Phân tích này được **bổ sung sau khi đã xem kết quả** — xem nhật ký sửa đổi §12.

## 5.8 Những gì đứng vững và những gì không

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

## 5.9 Kết luận chương

Kết quả rõ nhất của đồ án là **cửa hàng đã không chuyển hết phần giảm thuế GTGT vào giá bán lẻ**.

Trong 155 mặt hàng được giảm thuế, 126 mặt hàng gần như giữ nguyên giá — cứ 100 mặt hàng thì khoảng **81 mặt hàng không đổi giá** sau ngày giảm thuế. Nếu cửa hàng giảm giá đúng theo phần thuế được giảm và làm tròn đến 1.000 đồng, 135 mặt hàng lẽ ra phải đổi giá. Thực tế chỉ **1** mặt hàng đạt đúng mức đó ([§5.7](#57-giá-thực-tế-có-giảm-đúng-theo-phần-thuế-được-giảm-không)).

Hai phương pháp PP1 và PP2 cho kết quả cùng chiều: cửa hàng chỉ chuyển được khoảng **một phần bảy đến hơn một phần ba** phần giảm thuế vào giá. Các con số này chưa đủ chính xác để nói tỉ lệ thật là bao nhiêu, nhưng đều thấp hơn nhiều so với mức chuyển toàn bộ.

Giá trung bình nhóm được giảm thuế tăng khoảng **0,6%**, nhóm không được giảm tăng khoảng **1,0%**. Có khả năng chính sách đã giúp nhóm được giảm thuế tăng giá ít hơn, nhưng dữ liệu chưa đủ mạnh để xác định bao nhiêu phần chênh lệch này là do chính sách.

Khi giá người mua trả giữ nguyên mà thuế suất giảm từ 10% xuống 8%, phần doanh thu chưa thuế trên mỗi sản phẩm tăng khoảng **1,85%**. Đây là cách khoản tiền người mua trả được chia lại giữa thuế và doanh thu chưa thuế — đồ án **không** dùng con số này để suy ra lợi nhuận, vì không có dữ liệu giá vốn.

### Phạm vi áp dụng

Kết luận áp dụng cho các mặt hàng còn được bán ở **cả hai giai đoạn**, tại **một** cửa hàng tiện lợi TP.HCM, tiền kỳ 05–06/2025 và hậu kỳ 07–08/2025.

Nhóm được giảm thuế và nhóm so sánh có một số khác biệt từ trước (sức bán, tần suất bán), nên cần thận trọng khi nói **chính xác bao nhiêu** là tác động nhân quả. Nhưng các giới hạn này ảnh hưởng tới *độ lớn của tác động*, **không** làm thay đổi phát hiện quan sát được rằng giá thực tế đã không giảm theo phần thuế được giảm.
