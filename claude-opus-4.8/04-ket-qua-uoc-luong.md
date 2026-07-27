# 04 — Kết quả ước lượng (bản 2 — đã sửa lỗi đặc tả)

> **Trạng thái:** các con số dưới đây là kết quả **kiểm chứng tính khả thi của thiết kế**, chưa phải kết quả cuối. Bản 1 có 2 lỗi đặc tả code (rò rỉ dữ liệu hậu kỳ vào hiệp biến; event study thiếu SKU FE) do review của `codex-gpt-5.6-review` phát hiện. **Đã sửa và chạy lại — kết quả thay đổi ở 3 chỗ, xem [09](09-nhat-ky-sua-loi-code.md).**

Mẫu: hóa đơn bán ra, `daxoa=0`, từ 01/02/2025, loại dòng số lượng/giá bằng 0 → **97.092 dòng hàng**; 156 SKU treated, 161 SKU đối chứng 10% (C10), 1.951 SKU đối chứng 8% (C8).

Script: [`code/03`](code/03-hai-mo-hinh-uoc-luong.py) · [`code/04`](code/04-placebo-hoanvi-sanluong.py) · [`code/07`](code/07-berkson-va-mophong-lamtron.py) · **[`code/10` (bản sửa)](code/10-SUA-eventstudy-hiepbien-tost-bootstrap.py)** · **[`code/11` (MDE)](code/11-mde-va-duong-cong-suc-manh.py)**

> **Quy ước đơn vị:** mọi hệ số ghi "%" hoặc "điểm %" đều đã nhân 100 từ log-point (`log(p₁/p₀) × 100`). Hệ số ghi "log" là log-point nguyên bản.

---

## 1. Thống kê mô tả — Δlog giá cấp SKU

| Nhóm | n | Δ giá **gồm** thuế (TB) | Δ giá **chưa** thuế (TB) | Δ giá chưa thuế (trung vị) | % SKU giữ nguyên giá |
|---|---|---|---|---|---|
| Treated | 156 | +0,89% | **+2,67%** | **+1,83%** | 79% |
| ĐC 10% | 161 | +0,88% | +0,88% | 0,00% | 81% |
| ĐC 8% | 1.951 | +0,60% | +0,60% | 0,00% | 86% |

Nhóm treated có giá gồm thuế đứng yên như nhóm đối chứng, nhưng giá chưa thuế tăng gần đúng mức thuế được giảm (trung vị 1,83% so với mốc lý thuyết 1,835%).

**Phải viết trong báo cáo:** tỷ lệ giữ nguyên giá ~80% ở **cả ba nhóm** → giữ giá là **quán tính định giá mặc định**. Phát hiện không phải "cửa hàng giữ giá" mà là "cửa hàng không lệch khỏi quán tính đó dù thuế giảm".

---

## 2. Ước lượng ATT lên giá

Mốc lý thuyết nếu chuyển hoàn toàn: **log(1,08/1,10) = −1,835%**

| Đặc tả | Đối chứng 10% | p | Đối chứng 8% | p |
|---|---|---|---|---|
| ATT giá **gồm** thuế, không hiệp biến | **+0,011%** [−1,081; +1,103] | 0,984 | +0,289% [−0,695; +1,272] | 0,565 |
| ATT + hiệp biến **chỉ từ tiền can thiệp** ⚠️ | **+0,096%** (se 0,656) | 0,884 | **+1,225%** (se 0,589) | **0,038** |
| ATT giá **chưa** thuế, không hiệp biến | **+1,792%** [+0,699; +2,886] | **0,001** | +2,071% [+1,085; +3,057] | <0,001 |
| Logistic P(giữ nguyên giá) | −0,079 | 0,779 | −0,496 | 0,018 |

> ⚠️ **Đây là kết quả sau khi sửa lỗi rò rỉ.** Bản 1 tính hiệp biến "giá nền / sản lượng nền" trên **toàn kỳ** dù đặt tên là nền. Sau khi tính lại chỉ từ dữ liệu trước 01/07:
> - Với **C10**: hầu như không đổi (+0,343 → +0,096), kết luận không đổi
> - Với **C8**: **+0,916 (p=0,113) → +1,225 (p=0,038)** — chuyển từ không có ý nghĩa sang **có ý nghĩa**, và dấu là **dương** (giá treated tăng tương đối so với đối chứng, tức pass-through âm)
>
> **Đây là một cảnh báo độ nhạy nghiêm túc:** kết luận phụ thuộc vào lựa chọn nhóm đối chứng. Phải báo cáo cả hai, không chọn cái đẹp hơn.

### 2.1 Bootstrap cụm theo SKU (5.000 lần) — [`code/10`](code/10-SUA-eventstudy-hiepbien-tost-bootstrap.py)

| | ATT bootstrap TB | KTC 95% percentile | Pass-through KTC 95% |
|---|---|---|---|
| ĐC 10% | +0,035% | [−1,047; +1,118] | [−0,609; +0,571] |
| ĐC 8% | +0,284% | [−0,692; +1,271] | [−0,693; +0,377] |

Khớp với sai số chuẩn giải tích HC3.

### 2.2 Kiểm định tương đương TOST đầy đủ

Bản 1 chỉ làm kiểm định điểm và kiểm tra KTC nằm trong biên — **không phải TOST**. Bản này cài đúng hai kiểm định một phía với biên tương đương định trước.

Đối chứng 10% (ATT = +0,011%, se = 0,557):

| Biên tương đương | Ý nghĩa | p_TOST | Kết luận |
|---|---|---|---|
| ±0,459% | 25% pass-through | 0,2107 | ❌ Không kết luận được tương đương |
| ±0,917% | 50% pass-through | 0,0518 | ❌ Không kết luận được (sát ngưỡng) |
| ±0,500% | biên tuyệt đối | 0,1900 | ❌ Không kết luận được |
| **H₀: chuyển hoàn toàn (−1,835%)** | | **p = 0,0009** | ✅ **BÁC BỎ** |

Đối chứng 8%: p_TOST lần lượt 0,3675 / 0,1052 / 0,3370 — cũng không kết luận được tương đương; H₀ chuyển hoàn toàn bác bỏ p < 0,0001.

### 2.3 Phát biểu chuẩn — dùng nguyên văn

> Điểm ước lượng cho thấy **rất ít** phần giảm VAT được phản ánh vào giá thanh toán, nhưng khoảng tin cậy vẫn **tương thích với mức chuyển một phần đáng kể**. Nghiên cứu **bác bỏ được** giả thuyết chuyển hoàn toàn trong đặc tả hiện tại (p = 0,0009); **không kết luận được** pass-through tương đương 0 ở bất kỳ biên tương đương nào đã xét (25%, 50%, ±0,5 điểm %).
>
> Kết luận này **nhạy với lựa chọn nhóm đối chứng**: với nhóm đối chứng 8% và hiệp biến tiền kỳ, ước lượng là +1,225% (p = 0,038), tức pass-through âm có ý nghĩa.
>
> Do thiếu dữ liệu giá vốn và chuỗi cung ứng, nghiên cứu **chưa xác định được** phần lợi ích cuối cùng thuộc về nhà bán lẻ hay nhà cung cấp.

**KHÔNG được viết:** "pass-through bằng 0" · "phần giảm VAT không được phản ánh vào giá" (quá tuyệt đối) · "nhà bán lẻ giữ trọn phần giảm thuế" · "chính sách không tác động".

**Kiểm định hoán vị Monte Carlo** (10.000 lần, ĐC 10%): chênh lệch quan sát +0,011%, p = 0,983, KTC null 95% = [−1,07; +1,07]. Đây chỉ là kiểm định H₀ = 0 — **p lớn không chứng minh tương đương 0**, xem §2.2.

---

## 3. Kiểm định vững

### 3.1 Giả dược đặt tại nhiều mốc (kỳ vọng β ≈ 0)

| Mốc giả | n SKU | β (điểm %) | se | p |
|---|---|---|---|---|
| 01/05/2025 | 168 | +1,330 | 0,710 | **0,061** ⚠️ |
| 01/06/2025 = mốc dời cửa hàng | 237 | +0,314 | 0,567 | 0,580 |
| **01/07/2025 — mốc thật** | 317 | +0,011 | 0,557 | 0,984 |
| 01/07/2025, cửa sổ hẹp chỉ địa điểm mới | 268 | −0,289 | 0,647 | 0,655 |

**Cách phát biểu đúng:**

> Không phát hiện phân kỳ giá tại mốc dời cửa hàng (p = 0,580). Kết quả này **làm giảm bớt, nhưng không loại bỏ**, lo ngại về cú sốc địa điểm — sức mạnh của kiểm định chưa được xác định.

**KHÔNG viết "mối đe dọa bị loại bằng thực nghiệm".**

Giả dược 01/05 có p = 0,061: **không xử lý như một ngưỡng đặc biệt**. Báo cáo hệ số và KTC, xem nó là **tín hiệu về độ bất ổn của xu hướng tiền can thiệp**. Cần chạy lại có kiểm soát khối `daxoa=2` (01–16/05).

### 3.2 Event study — bản sửa, CÓ SKU FE

> ⚠️ Bản 1 chuẩn hóa giá theo trung vị **toàn kỳ** của SKU (rò rỉ dữ liệu hậu kỳ vào biến kết quả tiền kỳ) và **không có SKU FE**. Bản này: `log(giá) ~ C(tháng)×T + C(SKU)`, sai số chuẩn cụm theo SKU, mốc chuẩn 2025-06.

Đối chứng 10% (1.222 quan sát, 317 SKU):

| Tháng | β (điểm %) | se | p | KTC 95% | |
|---|---|---|---|---|---|
| 2025-04 | **−1,374** | 0,891 | 0,123 | [−3,12; +0,37] | trước CS |
| 2025-05 | −0,030 | 0,648 | 0,963 | [−1,30; +1,24] | trước CS |
| 2025-07 | −0,232 | 0,761 | 0,760 | [−1,72; +1,26] | sau CS |
| 2025-08 | +0,019 | 0,891 | 0,983 | [−1,73; +1,77] | sau CS |

Đối chứng 8% (8.889 quan sát, 2.107 SKU):

| Tháng | β (điểm %) | se | p | |
|---|---|---|---|---|
| 2025-04 | **−1,352** | 0,755 | **0,074** | trước CS |
| 2025-05 | +0,343 | 0,589 | 0,560 | trước CS |
| 2025-07 | −0,027 | 0,661 | 0,967 | sau CS |
| 2025-08 | +0,027 | 0,709 | 0,970 | sau CS |

> ⚠️ **Bằng chứng xu hướng song song YẾU ĐI sau khi sửa đặc tả.** Hệ số lead tháng 4 tăng từ −0,727 (bản 1) lên **−1,374 / −1,352**, và với đối chứng 8% thì p = 0,074 — sát ngưỡng. Cùng với giả dược 01/05 (p = 0,061), có **hai tín hiệu độc lập** về khả năng tồn tại xu hướng tiền can thiệp khác nhau giữa hai nhóm.

**Cách phát biểu:**

> Với chỉ 2 kỳ tiền can thiệp khả dụng, kiểm định xu hướng song song có sức mạnh thấp. Hệ số lead tháng 4/2025 âm và có độ lớn đáng kể (−1,37 điểm %, p = 0,123 với đối chứng 10%; −1,35, p = 0,074 với đối chứng 8%), cùng với giả dược 01/05 (p = 0,061), là **tín hiệu cảnh báo về độ bất ổn của giả định xu hướng song song**. Kết quả chính cần được đọc với dè dặt tương ứng.

Tháng 02–03/2025 không có trong bảng vì mã vạch chưa được điền, xem [01 §3 vấn đề 5](01-du-lieu-va-lam-sach.md).

### 3.3 Tần suất đổi giá tiền can thiệp

| Nhóm | n SKU | TB | Trung vị | Độ lệch chuẩn | KS vs Treated |
|---|---|---|---|---|---|
| Treated | 101 | 0,035 | 0 | 0,089 | — |
| ĐC 10% | 117 | 0,029 | 0 | 0,100 | D=0,073, p=0,907 |
| ĐC 8% | 1.610 | 0,048 | 0 | 0,113 | D=0,057, p=0,901 |

Không phát hiện khác biệt về hành vi đổi giá tiền can thiệp — **nhưng đây chỉ là một đặc trưng**, không chứng minh hai nhóm tương đương tổng thể. Số SKU giảm (101/156, 117/161) do yêu cầu ≥3 tuần quan sát, xem [05 §2](05-han-che-va-rui-ro.md).

---

## 4. Sản lượng — phân tích phụ

Panel SKU × tuần, điền 0 **chỉ trong vòng đời SKU**. Script: [`code/11`](code/11-mde-va-duong-cong-suc-manh.py)

| Chỉ số | Giá trị |
|---|---|
| Số ô panel | 4.030 |
| Tỷ lệ ô bằng 0 | 39,3% |
| Sản lượng TB nhóm treated trước CS | 1,043 đơn vị/SKU-tuần |
| **ATT (mức, FE SKU + tuần, cụm theo SKU)** | **+0,142 đơn vị/SKU-tuần, se = 0,325, p = 0,661** (= +13,7% so với nền) |
| Biên mở rộng — logistic P(có bán trong tuần) | β = +0,142, se = 0,142, p = 0,318 |

### Đường cong sức mạnh — mô phỏng 2.000 lần/mức, tái lập được

| Tác động thật | % so với nền | Tỷ lệ bác bỏ H₀ |
|---|---|---|
| 0,052 | 5% | 5,5% |
| 0,104 | 10% | 7,2% |
| 0,209 | 20% | 13,4% |
| 0,313 | 30% | 27,6% |
| 0,521 | 50% | 53,1% |
| 0,834 | 80% | 88,4% |
| 1,043 | 100% | 97,4% |

**MDE giải tích** (sức mạnh 80%, α = 5%) = (1,96 + 0,8416) × 0,325 = **0,910 đơn vị ≈ 87% so với nền**. Mô phỏng khớp: tác động bằng 80% nền cho sức mạnh 88,4%.

### Cách trình bày bắt buộc

> Vì giá thanh toán gần như không thay đổi, lý thuyết cầu dự đoán sản lượng cũng ít thay đổi; dữ liệu nhất quán với dự đoán đó. Tuy nhiên độ chính xác quá thấp: với sức mạnh 80%, thiết kế chỉ phát hiện được tác động từ khoảng **87% trở lên** so với mức nền. Với tác động 20%, xác suất phát hiện chỉ 13,4%. **Kết quả này không phải bằng chứng về việc chính sách không tác động đến sản lượng.**

Ghi chú kỹ thuật: **không dùng `log(1+q)`** — với >39% ô bằng 0, hệ số không diễn giải được là phần trăm thay đổi.

---

## 5. Phân tích cơ chế — mô phỏng quy tắc làm tròn giá

⚠️ **Phân tích cơ chế, KHÔNG phải mô hình nhân quả** — xem [03 §6.1b](03-thiet-ke-nhan-qua.md).

91,7% giá niêm yết chia hết 1.000đ; 93,0% chia hết 500đ. Mức giá phổ biến: 12.000 · 13.000 · 4.000 · 14.000 · 18.000 · 15.000 · 25.000.

**Mô phỏng:** lấy giá tiền can thiệp của từng SKU treated, giả định chuyển 100% phần giảm thuế, làm tròn theo quy tắc.

| Kịch bản | % SKU lẽ ra phải đổi giá |
|---|---|
| Chuyển 100%, làm tròn bội số 1.000đ | **89,7%** |
| Chuyển 100%, làm tròn bội số 500đ | 97,4% |
| Chuyển 100%, không làm tròn | 100% |
| **Thực tế quan sát** | **~0%** |

Mức giảm trung vị 1.091đ trên giá trung vị 60.000đ — lớn hơn một nấc giá tròn.

### Cách phát biểu đúng

> Mô phỏng bác bỏ **các quy tắc làm tròn 500đ và 1.000đ đã giả định** như lời giải thích cho việc giữ nguyên giá. Nó **không bác bỏ khái niệm chi phí điều chỉnh giá (menu cost) nói chung** — chi phí này còn có thể bao gồm cập nhật hệ thống POS, in lại bảng giá, phối hợp với nhà cung cấp, hoặc chính sách giá thống nhất toàn chuỗi. Không đồng nhất "làm tròn" với "toàn bộ menu cost".

---

## 6. Mô hình ngây thơ — chỉ minh họa, KHÔNG phải mô hình nhân quả

Hồi quy cắt ngang chỉ dùng dữ liệu sau 01/07:

| Đặc tả | β (log) | quy đổi | p |
|---|---|---|---|
| Thô: log(giá) ~ T | +0,070 | ≈ +7% | 0,549 |
| Điều chỉnh `type` + ĐVT | **−0,376** | **≈ −31%** | **<0,001** |

Càng điều chỉnh hiệp biến càng sai. Nguyên nhân: vi phạm positivity — không tồn tại hai sản phẩm giống nhau nhận trạng thái thuế khác nhau. Hệ số −31% chỉ phản ánh khăn ướt và bia/thuốc lá có mặt bằng giá khác nhau.

**Dùng làm mục:** *"Mô hình ngây thơ và minh họa sai lệch khi chỉ dùng dữ liệu sau can thiệp"*.
