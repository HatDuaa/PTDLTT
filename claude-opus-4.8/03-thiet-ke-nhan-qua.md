# 03 — Thiết kế nhân quả

---

## 1. Câu hỏi nghiên cứu

**Chính:** Việc một mặt hàng được đưa vào diện giảm thuế GTGT từ 10% xuống 8% có làm giảm giá mà người tiêu dùng thực trả không?

**Phụ:** Nếu giá thay đổi, sản lượng bán có phản ứng không?

---

## 2. Các thành phần

| Thành phần | Định nghĩa |
|---|---|
| **Can thiệp T** | `1` nếu SKU chuyển thuế suất 10%→8% đúng mốc 01/07/2025 (156 SKU); `0` nếu giữ 10% suốt kỳ (161 SKU) |
| **Thời điểm can thiệp** | 01/07/2025 |
| **Kết quả chính Y** | Δlog(giá đơn vị đã gồm thuế) = log(giá trung vị sau) − log(giá trung vị trước), tính ở **cấp SKU** |
| **Kết quả phụ** | Δlog(giá chưa thuế); biến nhị phân "giữ nguyên giá" (\|Δ\| < 0,5%) → logistic; sản lượng/tuần; biên mở rộng "SKU có bán trong tuần" → logistic |
| **Đơn vị phân tích** | SKU cho phương trình giá; SKU × tuần cho phương trình sản lượng |
| **Ước lượng đích** | ATT — tác động trung bình lên nhóm được can thiệp |

### Vì sao chọn cấp SKU (sai phân) thay vì panel SKU × tuần cho giá

- Giá **chỉ tồn tại khi có giao dịch**; panel SKU×tuần rất thưa (SKU treated có trung vị 7/21 tuần có giao dịch)
- Sai phân bậc nhất triệt tiêu mọi đặc tính bất biến của SKU (thương hiệu, quy cách, chất lượng, phân khúc)
- Không có tự tương quan chuỗi → tránh lỗi kinh điển về sai số chuẩn
- Giải thích được trong 30 giây khi bảo vệ

**Đánh đổi:** mất event study dạng chuẩn. Bù lại bằng giả dược đặt tại nhiều mốc giả.

**Khuyến nghị:** vẫn chạy panel SKU×tuần làm đặc tả bổ sung và báo cáo song song, không lấy làm đặc tả chính.

---

## 3. Chọn nhóm đối chứng — chỉ dùng thông tin tiền can thiệp

> ⚠️ **Đính chính quan trọng.** Ở bản đầu tôi dùng phân phối Δlog giá trước→sau (kiểm định KS: T vs C10 p=0,176; T vs C8 p=0,008) để lập luận nhóm 10% là đối chứng tốt hơn nhóm 8%. **Δlog giá trước→sau chính là biến kết quả.** Chọn nhóm đối chứng vì kết quả sau can thiệp của nó giống nhóm treated là **chọn theo outcome** — một lỗi phương pháp. Lập luận đó đã bị rút bỏ.

Bằng chứng còn hiệu lực, tất cả đều là **tiền can thiệp**:

| Tiêu chí (tiền can thiệp) | Treated | ĐC 10% | ĐC 8% |
|---|---|---|---|
| Giá đơn vị trung vị | 36.000đ | **31.000đ** | 14.000đ |
| Tần suất đổi giá/tuần | 0,035 | **0,029** | 0,048 |
| KS test tần suất đổi giá vs T | — | D=0,073, p=0,907 | D=0,057, p=0,901 |
| Cùng chế độ thuế trước 1/7 | 10% | **10%** | 8% |
| Lý do phân loại | pháp lý | **pháp lý** | pháp lý |

**Giới hạn của bằng chứng này:** KS p lớn chỉ có nghĩa "chưa phát hiện khác biệt ở đặc trưng cụ thể đó", **không chứng minh hai nhóm tương đương tổng thể**.

**Còn phải bổ sung** (chưa làm):
- Xu hướng giá tiền can thiệp theo tuần
- Độ biến động giá tiền can thiệp
- Tần suất có giao dịch
- Yếu tố mùa vụ tiền can thiệp
- Phân phối giá đầy đủ, không chỉ trung vị

**Quyết định:** dùng **cả hai nhóm đối chứng song song** và báo cáo độ nhạy, thay vì tuyên bố một nhóm "tốt hơn".

---

## 4. Nhiễu và cách khống chế

| Nhiễu | Cơ chế đe dọa | Xử lý |
|---|---|---|
| Đặc tính bất biến của SKU | Nhóm treated là hàng phi thực phẩm giá cao, khác hẳn nhóm 8% | Sai phân bậc nhất triệt tiêu |
| **Dời cửa hàng ~10/06/2025** | Tệp khách mới có thể mua hàng gia dụng nhiều hơn — đúng nhóm treated | Giả dược tại mốc dời; cửa sổ hẹp chỉ địa điểm mới; kiểm tra danh mục hàng |
| Mùa vụ, lễ 30/4–1/5, hè | Bia tăng mạnh mùa hè → đe dọa phương trình sản lượng | Nhóm đối chứng cùng thời điểm; nêu rõ hạn chế cho sản lượng |
| Cơ cấu nhóm hàng lệch | ĐC 10%: 60% nước uống; T: 45% đồ ăn | Hiệp biến `type`; phân tầng |
| Mức giá nền lệch | 36k vs 31k vs 14k | Chọn ĐC 10%; hiệp biến log(giá nền) |
| Lạm phát, biến động giá vốn chung | Có thể làm giá tăng ở cả hai nhóm | Nhóm đối chứng hấp thụ |

---

## 5. Giả định nhận dạng

| # | Giả định | Trạng thái kiểm chứng |
|---|---|---|
| 1 | **Xu hướng song song** — nếu không có chính sách, giá hai nhóm diễn biến tương tự | ⚠️ **Không phát hiện bằng chứng khác biệt**: hệ số lead tháng 4 = −0,727 điểm % (p=0,373), tháng 5 = −0,003 (p=0,996). **Nhưng chỉ 2 kỳ lead và dữ liệu giá thưa → kiểm định sức mạnh thấp.** Không được viết "pre-trend đạt" |
| 2 | **SUTVA / không lan tỏa** | Rủi ro thấp cho giá: giá không đổi → không có thay thế chéo giá. Kênh còn lại (trưng bày, quyết định nhập hàng) chỉ ảnh hưởng sản lượng |
| 3 | **Không dự đoán trước** | Giả dược mốc 01/06: β = 0,314, p = 0,580 |
| 4 | **Thành phần nhóm ổn định** | ✅ 152/158 SKU treated bán ở cả hai địa điểm; **0 SKU chỉ bán ở chỗ cũ** |
| 5 | **Can thiệp ngoại sinh** | ✅ Do Quốc hội quyết định; nhóm khớp chính xác với danh mục pháp lý |
| 6 | **Positivity/overlap** | ⚠️ **Vi phạm nếu điều kiện hóa theo phân loại pháp lý** — xem §6.1 |

---

## 6. ⛔ Cặp mô hình — CHƯA CHỐT

### 6.1 Các phương án đã LOẠI, kèm lý do

**a) Hồi quy cắt ngang sau 1/7 có điều chỉnh cửa sau — LOẠI**

Đặc tả: hồi quy log(giá) trên T + hiệp biến, chỉ dùng dữ liệu sau 01/07.

Kết quả chạy thử: thô β = +0,070 log (p=0,549); điều chỉnh `type` + ĐVT β = **−0,376 log ≈ −31%** (p<0,001).

**Lý do loại — vi phạm positivity:** can thiệp gần như **tất định** theo phân loại pháp lý (sản phẩm hóa chất → 8%; hàng TTĐB → 10%). Nếu điều chỉnh đầy đủ theo nhóm sản phẩm thì trong mỗi tầng **không còn đồng thời cả treated và control**. Không tồn tại "hai sản phẩm giống nhau nhưng nhận trạng thái thuế khác nhau" trong dữ liệu.

Hệ số −31% chỉ phản ánh việc khăn ướt và bia/thuốc lá là hai tập sản phẩm có mặt bằng giá khác nhau. **Nó không phải ước lượng tác động của chính sách.**

→ Đây không phải "mô hình hơi bị chệch" mà là **chiến lược nhận dạng không áp dụng được cho dữ liệu này**. Giữ lại làm mục minh họa *"mô hình ngây thơ và sai lệch khi chỉ dùng dữ liệu sau can thiệp"*, **tuyệt đối không tính là một trong hai mô hình nhân quả**.

**b) Mô phỏng Monte Carlo quy tắc làm tròn giá làm mô hình thứ hai — LOẠI**

Mô phỏng trả lời: *"nếu doanh nghiệp chuyển hoàn toàn phần giảm thuế rồi làm tròn theo quy tắc giả định, bao nhiêu SKU sẽ đổi giá?"* Nó **không ước lượng Y(1) − Y(0)** vì không dựng được giá phản thực tế của SKU treated trong trường hợp không có chính sách (Y(0) ở đây đơn giản là giá giữ nguyên → phản thực tế tầm thường).

Đây là **phân tích cơ chế**, rất đáng đưa vào báo cáo, nhưng không đáp ứng yêu cầu "hai mô hình nhân quả". Cụm "design-based vs model-based" là lớp sơn tu từ, không biến Monte Carlo thành một chiến lược nhận dạng.

**c) PSM/IPW đứng riêng — LOẠI**

PSM giải bài toán *lựa chọn dựa trên biến quan sát được*. Nhưng SKU được giảm thuế **không do cửa hàng chọn** — vấn đề nhận dạng thật ở đây là **cú sốc theo thời gian có khác nhau giữa hai nhóm hay không**, và PSM không đụng đến điều đó.

**d) Dời cửa hàng làm can thiệp chính — LOẠI**

Chỉ một đơn vị được can thiệp, không có đối chứng. Giữ làm ví dụ minh họa *"vì sao so sánh trước–sau không phải là nhân quả"* — leo thang từ tầng liên đới lên tầng can thiệp của Pearl trên chính dữ liệu của mình.

**e) Đề tài giỏ hàng / đồ ăn tại chỗ làm đề tài chính — LOẠI**

Can thiệp mang tính đồng thời, không có cú sốc ngoại sinh. Giữ làm chương phụ minh họa Berkson.

### 6.2 Hai phương án còn lại

| | Mô hình A | Mô hình B | Hai chiến lược nhận dạng khác nhau? |
|---|---|---|---|
| **P1** | **DiD** — sai phân bậc nhất cấp SKU, hoặc panel SKU×tuần với hiệu ứng cố định SKU + tuần, sai số chuẩn cụm theo SKU | **DiD có so khớp/trọng số** theo đặc trưng **tiền can thiệp**: mức giá, xu hướng giá, tần suất bán, tần suất đổi giá, độ biến động giá, ĐVT, độ phổ biến | ❌ Cùng dựa trên xu hướng song song |
| **P2** | DiD | **Chuỗi thời gian gián đoạn (ITS)** trên chuỗi tổng hợp | ✅ Ngoại suy thời gian vs so sánh nhóm — nhưng rất yếu ở đây |

**Ghi chú về P1 — đính chính lập luận cũ của tôi:** so khớp **không** đòi hai SKU cùng nhóm pháp lý. Có thể so khớp theo giá nền, tần suất bán, độ biến động — những chiều này có overlap thật. Nên phản biện "matched DiD cũng vi phạm positivity" mà tôi từng đưa ra là **sai**. Tuy vậy, nếu không điều chỉnh được khác biệt sâu giữa loại hàng thì giả định xu hướng song song **có điều kiện** vẫn yếu; và P1 vẫn không tạo ra chiến lược nhận dạng mới.

**Ghi chú về P2:** ITS ở đây có nhược điểm nặng — chỉ 3 tháng tiền kỳ, một cửa hàng, cú dời chỗ 20 ngày trước mốc chính sách, giá SKU thưa và ít thay đổi. **Chỉ nên chạy làm kiểm định vững**, chưa đủ mạnh làm mô hình chính thứ hai.

### 6.3 Về việc gọi tên phương pháp

Không né tên. Nếu dùng DiD thì:
- Gọi **đúng tên** Difference-in-Differences
- Giải thích bằng ngôn ngữ **Potential Outcomes** đã học ở chương 8: Y(1), Y(0), phản thực tế, ATT; giả định xu hướng song song phát biểu như một giả định về phản thực tế
- Nói rõ đây là phần nhóm **vận dụng thêm** từ nền tảng môn học
- Hỏi giảng viên xem có được dùng phương pháp ngoài slide không

Đổi tên thành "ước lượng ATT bằng sai phân có đối chứng" để né chữ DiD là **không trung thực về mặt học thuật**.

### 6.4 Rủi ro nền tảng

Dữ liệu này chỉ hỗ trợ **một** chiến lược nhận dạng: so sánh nhóm qua thời gian.

- Không có biến công cụ
- Không có ngưỡng phân bổ (không làm được RDD)
- Chỉ một cửa hàng (không làm được synthetic control)
- Kỳ tiền can thiệp 3 tháng (ITS rất yếu)

**Nếu giảng viên yêu cầu hai chiến lược nhận dạng thực sự khác nhau thì đề tài này không đáp ứng được và phải đổi hướng.** Cần biết điều này trước khi triển khai.

### 6.5 Câu hỏi gửi giảng viên — quyết định kiến trúc toàn bộ đồ án

> Thưa thầy, nhóm em dự định đánh giá tác động của chính sách giảm VAT 10% xuống 8% từ ngày 01/07/2025 đối với giá bán lẻ, sử dụng dữ liệu panel theo mặt hàng trước và sau chính sách.
>
> Cho nhóm em hỏi yêu cầu "hai mô hình phân tích nhân quả khác nhau" được hiểu là hai phương pháp ước lượng khác nhau nhưng có thể dùng chung chiến lược nhận dạng, ví dụ Difference-in-Differences và weighted/matched Difference-in-Differences, hay phải là hai chiến lược nhận dạng hoàn toàn khác nhau? Nhóm có được sử dụng DiD dù phương pháp này không được trình bày trực tiếp trong slide, nếu diễn giải bằng khung Potential Outcomes không ạ?

Chỉ cần thầy trả lời hai ý này. **Chưa nên hỏi về Monte Carlo như mô hình thứ hai** — sẽ làm câu hỏi rối.

**Khả năng cao nhất:** ý thầy đơn giản hơn ta đang nghĩ — có thể "hai mô hình" chỉ là (1) ước lượng bằng hồi quy có biến tương tác và (2) ước lượng ATT theo khung Potential Outcomes bằng so khớp/trọng số. Không nên tự làm phức tạp trước khi hỏi.
