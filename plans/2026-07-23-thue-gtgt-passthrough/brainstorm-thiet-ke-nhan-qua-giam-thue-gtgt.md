# Báo cáo Brainstorm — Thiết kế nhân quả cho đồ án cuối kỳ Phân tích dữ liệu

| | |
|---|---|
| **Ngày** | 23/07/2026 (bản 2 — đã tiếp thu phản biện) |
| **Chủ đề** | Đánh giá tác động chính sách giảm thuế GTGT 10%→8% (01/07/2025) lên giá bán lẻ |
| **Dữ liệu** | `60.xlsx` — hóa đơn điện tử máy tính tiền, CTCP Bất động sản Kelly, TP.HCM |
| **Quy mô nhóm** | 4 người |
| **Trạng thái** | ✅ Chốt đề tài, chốt outcome chính, chốt nhóm treated/control. ⛔ **CHƯA chốt cặp mô hình** — chờ giảng viên trả lời (§6) |

---

## 1. Yêu cầu đề bài

Từ `da-final-project.pdf`:

- Phân tích dữ liệu lĩnh vực kinh tế/xã hội/khoa học **có ngữ cảnh Việt Nam**
- **Bắt buộc: hai mô hình phân tích nhân quả khác nhau để so sánh**
- Dữ liệu có sẵn > 2000 quan sát
- Trình bày dạng **web**; sản phẩm: báo cáo + mã nguồn + slide; tiếng Việt

Chương trình môn học (bookda, 11 chương): ch.7 Mô hình đồ thị, ch.8 Phân tích nhân quả (3 cấp độ Pearl, Simpson, Berkson, Potential Outcomes, ATE), ch.9 Hồi quy tuyến tính, ch.10 Hồi quy đa biến & logistic, ch.11 Monte Carlo. Công cụ: Python + Excel.

Slide môn học không trình bày DiD, IV, RDD, propensity score, matching, IPW. → **Không né tên phương pháp.** Nếu dùng DiD thì gọi đúng tên, giải thích bằng ngôn ngữ Potential Outcomes đã học, và nói rõ đây là phần vận dụng thêm.

---

## 2. Dữ liệu

| Sheet | Số dòng | Nội dung |
|---|---|---|
| `goc` | 67.562 | Hóa đơn: ngày, địa chỉ bán, tổng tiền, VAT, khách hàng, trạng thái |
| `chitiet` | 233.996 | Dòng hàng: SKU (barcode), tên, ĐVT, số lượng, đơn giá chưa thuế, thuế suất (0/5/8/10%), tiền thuế, tiền sau thuế, `type` ∈ {Nước uống, Đồ ăn, Sản phẩm khác} |

Kỳ dữ liệu: 12/2024 – 17/08/2025.

### 2.1 Nhật ký làm sạch dữ liệu

| # | Vấn đề | Chứng cứ | Xử lý |
|---|---|---|---|
| 1 | 13.335 hóa đơn tháng 3–4/2025 là `THUE_MUAVAO` (mua vào từ NCC) | `ma_ncc_hddt` | Chỉ giữ `THUE_BANRA` |
| 2 | 12/2024–01/2025: 31 và 34 hóa đơn nhưng 44k dòng chi tiết (có hóa đơn 1.469 dòng) → hóa đơn tổng hợp | Số dòng/hóa đơn | Cắt mẫu từ 01/02/2025 |
| 3 | Dữ liệu trống 02–10/06; địa chỉ trên hóa đơn đổi hẳn từ 24/06. Không xác định được ngày dời vật lý | `diachi_ban` theo ngày | Cửa sổ từ 11/06, gồm cả hai địa chỉ |
| 4 | ✅ **`daxoa=2` = bản ghi trùng lặp** | 3.917 HĐ, chỉ 01–16/05/2025; `nguoitao=BOT` 100% (bản còn lại `DNCS` 100%); 1.589/3.917 trùng số hóa đơn; tiền TB 66.300 vs 68.636 | Loại `daxoa=2` |
| 5 | ⚠️ **Mã vạch `ma_hh_ct` chỉ được điền từ ~04/2025** (138.982/233.996 dòng có mã). Nhóm treated và đối chứng 10% có **0 SKU giao dịch trong tháng 2–3** | Số SKU theo tháng | **Kỳ tiền can thiệp hiệu dụng chỉ 04–06/2025 (3 tháng)** — hạn chế nghiêm trọng, phải nêu rõ |

Sau lọc: ~97.000 dòng hàng.

### 2.2 Hạn chế dữ liệu không khắc phục được

- **Không có giá vốn / chiết khấu nhà cung cấp.** Hóa đơn mua vào chỉ có tháng 3–4/2025, tức toàn bộ *trước* chính sách → không quan sát được chuyển giá ở khâu cung ứng sau 1/7.
- **Một cửa hàng duy nhất** → không có đơn vị đối chứng theo không gian.
- **Kỳ tiền can thiệp 3 tháng** → kiểm định xu hướng song song có sức mạnh thấp.

---

## 3. Thí nghiệm tự nhiên

### 3.1 Cơ sở pháp lý

| Văn bản | Hiệu lực | Nội dung liên quan |
|---|---|---|
| NQ 174/2024/QH15 + NĐ 180/2024 | 01/01–30/06/2025 | Giảm VAT 10%→8%, **loại trừ "sản phẩm hóa chất"** |
| [NQ 204/2025/QH15](https://vanban.chinhphu.vn/?docid=214209&pageid=27160) + [NĐ 174/2025/NĐ-CP](https://vanban.chinhphu.vn/?classid=1&docid=214310&pageid=27160&typegroupid=4) | 01/07/2025–31/12/2026 | **Bỏ "sản phẩm hóa chất"** khỏi danh mục loại trừ; vẫn loại trừ hàng chịu **thuế TTĐB** (trừ xăng) |

Trích dẫn nguồn chính thức `vanban.chinhphu.vn`, không dùng trang tổng hợp luật.

### 3.2 Nhóm phân tích

| Nhóm | Số SKU | Thuế suất | Hàng gì | Vì sao |
|---|---|---|---|---|
| **Can thiệp** | **156** | 10% → 8% từ 1/7 | Khăn ướt, nước súc miệng, keo dán, VPP, chăm sóc cá nhân | NQ 204 bỏ "sản phẩm hóa chất" khỏi loại trừ |
| **Đối chứng chính** | **161** | 10% suốt kỳ | Bia (Sabeco, Tiger, Heineken, 333), thuốc lá (Marlboro, Craven A, Camel, 555), Soju | Chịu thuế TTĐB → loại trừ ở **cả hai** nghị quyết |
| **Đối chứng phụ** | **1.951** | 8% suốt kỳ | Nước uống, đồ ăn thông thường | Đã được giảm từ trước |

**Điểm mạnh:** cả hai nhóm được xác định bởi văn bản pháp luật, ngoài tầm ảnh hưởng của cửa hàng.

### 3.3 Căn cứ chọn đối chứng chính — chỉ dùng thông tin TIỀN can thiệp

> ⚠️ **Đính chính bản 1:** bản trước dùng phân phối Δlog giá trước→sau để lập luận nhóm 10% tốt hơn nhóm 8%. Δlog giá trước→sau **chính là biến kết quả** → đó là chọn nhóm đối chứng theo outcome, một lỗi phương pháp. Lập luận đó đã bị rút.

Bằng chứng còn hiệu lực (đều là tiền can thiệp):

| Tiêu chí | Treated | ĐC 10% | ĐC 8% |
|---|---|---|---|
| Giá trung vị | 36.000đ | **31.000đ** | 14.000đ |
| Tần suất đổi giá/tuần | 0,035 | **0,029** (KS vs T: p=0,907) | 0,048 (KS vs T: p=0,901) |

Lưu ý: KS p lớn chỉ có nghĩa "chưa phát hiện khác biệt ở đặc trưng này", **không chứng minh hai nhóm tương đương tổng thể**. Còn phải bổ sung: xu hướng giá tiền kỳ, độ biến động giá, tần suất có giao dịch, mùa vụ tiền kỳ.

---

## 4. Khung nhân quả

- **Can thiệp T**: SKU thuộc danh mục được giảm thuế từ 01/07/2025
- **Kết quả chính Y**: Δlog(giá bán lẻ đã gồm thuế) → **tỷ lệ chuyển giảm thuế vào giá (pass-through)**
- **Kết quả phụ**: Δlog(giá chưa thuế); "giữ nguyên giá" (logistic); sản lượng (kèm cảnh báo thiếu sức mạnh)
- **Đơn vị phân tích**: SKU cho giá; SKU × tuần cho sản lượng

### 4.1 Giả định nhận dạng và trạng thái kiểm chứng

| # | Giả định | Trạng thái |
|---|---|---|
| 1 | Xu hướng song song | ⚠️ **Không phát hiện bằng chứng khác biệt** (hệ số lead tháng 4: −0,727 điểm %, p=0,373; tháng 5: −0,003, p=0,996), **nhưng chỉ 2 kỳ lead và giá thưa → kiểm định sức mạnh thấp**. Không được viết "pre-trend đạt" |
| 2 | SUTVA | Rủi ro thấp cho giá (giá không đổi → không thay thế chéo giá). Kênh còn lại — trưng bày/nhập hàng — chỉ ảnh hưởng sản lượng |
| 3 | Không dự đoán trước | Giả dược mốc 1/6: β=0,314, p=0,580 |
| 4 | Thành phần nhóm ổn định | ✅ 152/158 SKU treated có hóa đơn ghi cả hai địa chỉ; 0 SKU chỉ gắn với địa chỉ cũ |
| 5 | Ngoại sinh của can thiệp | ✅ Do Quốc hội quyết định |

### 4.2 Vấn đề chọn mẫu chưa giải quyết

Lọc SKU phải có ≥3 tuần quan sát giá gây **survivorship bias mạnh**:

| Nhóm | | n SKU | Giá trung vị | Số tuần trung vị |
|---|---|---|---|---|
| Treated | bị loại | 55 | **76.000đ** | 1 |
| Treated | giữ lại | 101 | 49.000đ | 4 |
| ĐC 10% | bị loại | 44 | **104.500đ** | 2 |
| ĐC 10% | giữ lại | 117 | 37.000đ | 6 |

SKU bị loại là hàng đắt, bán thưa. **Bắt buộc**: phân tích độ nhạy theo nhiều ngưỡng lọc + báo cáo đặc tính nhóm bị loại.

---

## 5. Kết quả sơ bộ

### 5.1 Ước lượng ATT lên giá (sai phân bậc nhất cấp SKU)

| | Đối chứng 10% | Đối chứng 8% |
|---|---|---|
| ATT giá gồm thuế | +0,011% [−1,081; +1,103] | +0,289% [−0,695; +1,272] |
| ATT giá chưa thuế | +1,792%, p=0,001 | +2,071%, p<0,001 |
| **Pass-through** | **−0,006 [−0,601; +0,589]** | −0,157 [−0,693; +0,379] |
| H₀: chuyển hoàn toàn (−1,835%) | **BÁC BỎ, p=0,0009** | BÁC BỎ, p<0,0001 |
| Tương đương trong ±0,5% | CHƯA ĐẠT | CHƯA ĐẠT |

**Phát biểu chuẩn:**

> Ước lượng pass-through gần 0, nhưng khoảng tin cậy còn rộng. Nghiên cứu **bác bỏ được** giả thuyết chuyển hoàn toàn phần giảm VAT vào giá thanh toán; **chưa chứng minh được** pass-through tương đương 0.

> Trong dữ liệu tại điểm bán này, phần giảm VAT không được phản ánh vào giá thanh toán. Do thiếu dữ liệu giá vốn và chuỗi cung ứng, nghiên cứu **chưa xác định được** phần lợi ích cuối cùng thuộc về nhà bán lẻ hay nhà cung cấp.

Kiểm định hoán vị Monte Carlo (10.000 lần): p=0,983 — lưu ý đây chỉ là kiểm định H₀=0, **không chứng minh tương đương 0**.

### 5.2 Kiểm định vững

| Kiểm định | Kết quả |
|---|---|
| Giả dược tại mốc 01/06 | β=0,314, p=0,580 |
| Cửa sổ từ 11/06, gồm cả hai địa chỉ | β=−0,289, p=0,655 |
| Giả dược mốc 1/5 | β=1,330, p=0,061 ⚠️ chạy lại sau khi đã xác định `daxoa=2` là bản trùng |

### 5.3 Sản lượng — phân tích phụ

Panel 4.030 ô SKU×tuần, 39,3% ô bằng 0. ATT = +0,142 đơn vị/SKU-tuần, p=0,661 (nền 1,043). Biên mở rộng logistic: p=0,318. **MDE ≈ 87%.**

Trình bày: giá không đổi → lý thuyết cầu dự đoán sản lượng không đổi → dữ liệu nhất quán, **nhưng không loại trừ được hiệu ứng dưới 87%**. Không viết "chính sách không tác động đến sản lượng".

### 5.4 Phân tích cơ chế — mô phỏng làm tròn giá (KHÔNG phải mô hình nhân quả)

91,7% giá niêm yết chia hết 1.000đ. Nếu chuyển 100% giảm thuế rồi làm tròn bội số 1.000đ → **89,7% SKU lẽ ra phải đổi giá**; bội số 500đ → 97,4%. Thực tế ~0%. Mức giảm trung vị 1.091đ, lớn hơn một nấc giá tròn.

→ Làm tròn **không** giải thích được việc giữ giá.

> ⚠️ Đây là **phân tích cơ chế**, không phải mô hình nhân quả: nó không dựng được Y(0) cho SKU treated. Không dùng để đáp ứng yêu cầu "hai mô hình".

---

## 6. ⛔ Cặp mô hình — CHƯA CHỐT

### 6.1 Đã loại

| Phương án | Lý do loại |
|---|---|
| **Hồi quy cắt ngang sau 1/7 có điều chỉnh cửa sau** | **Không nhận dạng được tác động.** Treatment gần như tất định theo phân loại pháp lý (hóa chất → 8%, TTĐB → 10%) → điều kiện hóa theo nhóm sản phẩm thì mất overlap → **vi phạm positivity**. Hệ số −31% chỉ phản ánh hai tập sản phẩm có giá khác nhau. Chỉ giữ làm mục minh họa "mô hình ngây thơ" |
| **Mô phỏng Monte Carlo làm tròn giá làm mô hình thứ 2** | Không ước lượng Y(1)−Y(0). Là phân tích cơ chế |
| **PSM/IPW đứng riêng** | Không xử lý được cú sốc thời gian — confounder thật của bài toán |

### 6.2 Các phương án còn lại

| | Mô hình A | Mô hình B | Hai chiến lược nhận dạng khác nhau? |
|---|---|---|---|
| **P1** | DiD (sai phân bậc nhất, cấp SKU) | DiD có so khớp/trọng số theo đặc trưng **tiền can thiệp** (giá nền, xu hướng giá, tần suất bán, tần suất đổi giá, độ biến động, ĐVT) | ❌ Cùng dựa trên xu hướng song song |
| **P2** | DiD | Chuỗi thời gian gián đoạn (ITS) | ✅ Nhưng rất yếu: 3 tháng tiền kỳ, một cửa hàng, cú dời chỗ sát mốc → chỉ nên làm kiểm định vững |

**Lưu ý về P1:** so khớp **không** cần hai SKU cùng nhóm pháp lý — có thể so khớp theo giá nền, tần suất bán, độ biến động. Nên phản biện "matched DiD cũng vi phạm positivity" là **không đúng**. Tuy vậy nếu không điều chỉnh được khác biệt sâu giữa loại hàng thì giả định xu hướng song song có điều kiện vẫn yếu, và P1 vẫn **không tạo ra chiến lược nhận dạng mới**.

### 6.3 Rủi ro cần biết trước

Dữ liệu này chỉ hỗ trợ **một** chiến lược nhận dạng: so sánh nhóm qua thời gian. Không có biến công cụ, không có ngưỡng, không có cửa hàng thứ hai. **Nếu giảng viên yêu cầu hai chiến lược nhận dạng thực sự khác nhau thì đề tài này không đáp ứng được và phải đổi hướng.**

### 6.4 Câu hỏi gửi giảng viên (quyết định kiến trúc đồ án)

> Thưa thầy, nhóm em dự định đánh giá tác động của chính sách giảm VAT 10% xuống 8% từ ngày 01/07/2025 đối với giá bán lẻ, sử dụng dữ liệu panel theo mặt hàng trước và sau chính sách.
>
> Cho nhóm em hỏi yêu cầu "hai mô hình phân tích nhân quả khác nhau" được hiểu là hai phương pháp ước lượng khác nhau nhưng có thể dùng chung chiến lược nhận dạng, ví dụ Difference-in-Differences và weighted/matched Difference-in-Differences, hay phải là hai chiến lược nhận dạng hoàn toàn khác nhau? Nhóm có được sử dụng DiD dù phương pháp này không được trình bày trực tiếp trong slide, nếu diễn giải bằng khung Potential Outcomes không ạ?

---

## 7. Chia việc 4 người

| Người | Mảng | Nội dung | Chương |
|---|---|---|---|
| **A** | Dữ liệu & Mô tả | Nhật ký làm sạch (§2.1), từ điển biến, EDA, mô tả cú dời cửa hàng, phân tích độ nhạy ngưỡng lọc (§4.2) | 1, 2, 3 |
| **B** | Đồ thị & Nghịch lý | DAG chuyên gia cho bài toán thuế; Simpson & Berkson (§8) | 7, 8 |
| **C** | Lõi nhân quả | Thiết kế, cặp mô hình (chờ thầy), kiểm định vững, giả dược | 4, 8, 9, 10 |
| **D** | Suy diễn & Mô phỏng | Bootstrap, hoán vị, kiểm định tương đương/TOST, đường cong sức mạnh, mô phỏng cơ chế làm tròn | 5, 6, 11 |
| Chung | Sản phẩm | Báo cáo web (HTML tĩnh), slide, mã nguồn Python | — |

---

## 8. Phụ lục — nghịch lý và mô hình đồ thị

### 8.1 Berkson / collider (dùng được, n lớn)

Tương quan chi tiêu Nước uống vs Đồ ăn: toàn bộ 50.234 hóa đơn **+0,860**; giỏ nhỏ (<50k) **−0,437**; giỏ vừa (50–150k) **−0,494**; giỏ lớn (>150k) +0,871. Tổng tiền hóa đơn là collider; điều kiện hóa trên nó làm tương quan đảo dấu.

### 8.2 Học cấu trúc mạng Bayes — hạ xuống phụ lục

Học "mù" (PC, Hill-Climbing/BIC) cho cạnh vô lý (`TongTien → NuocUong`, `DoAn → CuaHang`); thêm tri thức miền thì đồ thị hợp lý.

> ⚠️ **Không được kết luận "thuật toán đã trượt".** `SoMon` và `TongTien` có quan hệ **tất định** với các món trong giỏ → vi phạm giả định faithfulness và causal sufficiency mà các thuật toán causal discovery dựa vào. Đầu vào đã sai giả định, nên kết quả sai không phải lỗi thuật toán.
>
> ⚠️ **Không so trực tiếp χ²** (4.395 / 9.572 / 13.057) để nói "phụ thuộc tăng 2–3 lần" — khác bậc tự do và số tầng. Phải dùng p-value kèm df, Cramér's V, và kiểm tra kích thước ô kỳ vọng.

Đây là mục minh họa, **không** phải trụ chính ngang với phân tích VAT.

---

## 9. Việc còn nợ

- [x] Xác định `daxoa=2` → bản ghi trùng lặp (§2.1 #4)
- [x] Tìm nguyên nhân tháng 2–3 rớt khỏi event study → mã vạch chỉ có từ ~04/2025 (§2.1 #5)
- [ ] Chạy lại giả dược mốc 1/5 sau khi đã hiểu `daxoa=2`
- [ ] Phân tích độ nhạy theo ngưỡng lọc số tuần (survivorship, §4.2)
- [ ] Bổ sung kiểm tra tiền can thiệp: xu hướng giá, độ biến động giá, tần suất giao dịch, mùa vụ
- [ ] Mẫu Simpson nhóm "Sản phẩm khác" chỉ 6 quan sát đối chứng → tìm cách phân tầng khác
- [ ] **Gửi câu hỏi §6.4 cho giảng viên → chốt cặp mô hình**

---

## 10. Tiêu chí nghiệm thu

- [ ] Mọi con số tái lập được từ mã nguồn bằng một lệnh
- [ ] Nhật ký làm sạch ghi rõ số quan sát còn lại ở từng bước
- [ ] Mọi hệ số ghi rõ **đơn vị** (điểm phần trăm hay log-point)
- [ ] Hai mô hình trình bày song song kèm mục giải thích chênh lệch
- [ ] Mọi giả định nhận dạng được nêu, kèm trạng thái kiểm chứng và **giới hạn sức mạnh kiểm định**
- [ ] Kết quả pass-through phát biểu theo §5.1, không nói "bằng 0"
- [ ] Kết quả sản lượng kèm MDE, không phát biểu quá
- [ ] Gọi đúng tên phương pháp, giải thích bằng khung đã học

---

## 11. Nhật ký quyết định

| Quyết định | Lý do |
|---|---|
| Chọn thí nghiệm tự nhiên về thuế | Thứ duy nhất trong dữ liệu có can thiệp ngoại sinh thật |
| Đối chứng chính = 161 SKU giữ 10% | Giá nền và tần suất đổi giá tiền can thiệp gần treated hơn nhóm 8% |
| Kết quả chính = giá | MDE sản lượng ≈ 87% → kiểm định gần như không mang thông tin |
| Bỏ hồi quy cắt ngang khỏi vị trí mô hình nhân quả | Vi phạm positivity; không nhận dạng được |
| Bỏ Monte Carlo làm tròn khỏi vị trí mô hình nhân quả | Không dựng được Y(0) |
| Rút lập luận chọn đối chứng bằng phân phối Δ giá | Đó là biến kết quả → chọn theo outcome |
| Hạ mạng Bayes xuống phụ lục | Quan hệ tất định vi phạm giả định của causal discovery |
| Chưa chốt cặp mô hình | Chờ giảng viên xác định "hai mô hình" nghĩa là gì |
