# Phụ lục kỹ thuật

Phụ lục này giữ toàn bộ công thức, bảng chẩn đoán, kiểm định, độ nhạy và kết quả phụ đã chuyển khỏi thân bài. Các kết quả chính và kết luận dễ đọc hơn nằm ở [chương 4](chuong-04-thiet-ke-nhan-qua.md), [chương 5](chuong-05-ket-qua.md) và [chương 6](chuong-06-suc-manh-va-co-che.md).

## A. Chẩn đoán

<a id="a1"></a>

### A.1 Đồ thị nhân quả và đường backdoor

Nội dung lý thuyết đã được đưa về [mục 4.5 của Chương 4](chuong-04-thiet-ke-nhan-qua.md#45-đồ-thị-nhân-quả).

<a id="a2"></a>

### A.2 Nghịch lý Simpson và chẩn đoán cân bằng

Nội dung lý thuyết và chẩn đoán cân bằng đã được đưa về [mục 4.8 của Chương 4](chuong-04-thiet-ke-nhan-qua.md#48-nghịch-lý-simpson-và-lý-do-phân-tầng).

<a id="a3"></a>

### A.3 Chồng lấn hiệp biến và bootstrap

*Chuyển nguyên vẹn từ mục 5.1.*

**Chồng lấn hiệp biến:** 2,6% SKU `Z=1` nằm ngoài khoảng của `Z=0` — toàn bộ ở chiều giá nền; sản lượng và số tuần chồng lấn hoàn toàn. g-computation phải ngoại suy ở đúng 2,6% đó.

**Bootstrap PP2:** 5.000/5.000 lần hợp lệ, 0 lần thất bại.

<a id="a4"></a>

### A.4 Ba cổng chẩn đoán

*Chuyển nguyên vẹn từ mục 5.5.*

| Cổng | Tiêu chí khóa trước | Kết quả |
|---|---|---|
| **1 — Cân bằng sau phân tầng** | ≤ 1/3 cặp \|SMD\| > 0,25 | 🔴 **TRƯỢT** — 12/15 cặp |
| **2 — Giả dược 05→06** | \|ước lượng\| ≤ 0,918 | ✅ **ĐẠT** — lớn nhất 0,562 |
| **3 — TOST tiền xu hướng** | p < 0,05 ở biên ±0,918 | 🔴 **KHÔNG ĐẠT** — p từ 0,090 đến 0,244 |

Giả dược cho so sánh chính `Z`: −0,195 (thô) và +0,101 (có hiệp biến).

⚠️ Hiệp biến của giả dược được tính **lại chỉ trên tháng 05**. Dùng `pre_*` của đặc tả chính sẽ là rò rỉ, vì chúng tính trên 05+06 mà tháng 06 chính là kỳ "hậu" của giả dược.

**Ba cổng không phải ba lá phiếu.** Cổng 2 đạt **không bù** được cổng 1 và 3:

> Không phát hiện chênh lệch giả dược có độ lớn vượt ngưỡng định trước, nhưng kiểm định tương đương không đạt và mất cân bằng tiền kỳ còn nghiêm trọng. Giả định xu hướng song song **không được xác nhận**; mọi diễn giải nhân quả chỉ có điều kiện và đã được hạ cấp.

## B. Thống kê

<a id="b1"></a>

### B.1 Khung Kết quả tiềm năng và giả định

Nội dung lý thuyết đã được đưa về [mục 4.6 của Chương 4](chuong-04-thiet-ke-nhan-qua.md#46-khung-kết-quả-tiềm-năng).

<a id="b2"></a>

### B.2 Kiểm định tương đương TOST trong kết quả giá

*Chuyển nguyên vẹn từ mục 5.3.*

**TOST — không kết luận được ở mọi biên:**

| Phương pháp | Biên ±0,459 | Biên ±0,918 |
|---|---|---|
| PP1-A thô | p = 0,460 | p = 0,193 |
| PP1-A có hiệp biến | p = 0,398 | p = 0,189 |
| PP1-B g-computation | p = 0,604 | p = 0,372 |
| PP2 phân tầng | p = 0,367 | p = 0,132 |

⇒ **Không được kết luận pass-through bằng hoặc gần 0.**

🔴 **Nhưng cũng KHÔNG được đọc "TOST thất bại" như bằng chứng chống lại sự tương đương.** Biên ±0,918 **nhỏ hơn** mức cần cho 80% sức mạnh ở cả bốn đặc tả (±1,73 đến ±2,27). Sức mạnh thực của TOST ở biên này là **0,0%** — nó không có cơ hội nào thành công, kể cả khi tác động thật đúng bằng 0. Xem [chương 6.3](chuong-06-suc-manh-va-co-che.md).

<a id="b3"></a>

### B.3 Độ lớn tối thiểu phát hiện được

*Chuyển nguyên vẹn từ mục 6.1.*

`MDE = (1,96 + 0,842) × SE = 2,802 × SE` tại α = 0,05, sức mạnh 80%.

| Đặc tả | SE | MDE | Sức mạnh tại mốc chuyển hoàn toàn (1,835) |
|---|---|---|---|
| PP1-A thô | 0,600 | 1,68 | 87% |
| PP1-A có hiệp biến | 0,733 | 2,05 | 71% |
| PP1-B g-computation | 0,776 | **2,17** | 66% |
| PP2 phân tầng | 0,592 | 1,66 | 88% |

**Không có một MDE chung.** Khoảng **1,66 – 2,17** điểm log ×100. Nếu buộc phải nêu một con số, dùng **2,17** và gọi rõ là *MDE bảo thủ theo đặc tả kém chính xác nhất* — không được chọn 1,66.

⇒ Thiết kế **đủ sức** phát hiện mức chuyển hoàn toàn với PP1-thô và PP2 (87–88%), nhưng **không đủ** với hai đặc tả còn lại (66–71%). Điều này giải thích vì sao việc bác bỏ mốc chuyển hoàn toàn phụ thuộc phương pháp ([chương 5.3](chuong-05-ket-qua.md)).

### 🔴 Không dùng sức mạnh hậu kiểm

Đồ án **không** tính "observed power". Nó chỉ là một phép biến đổi đơn điệu của p-value và không thêm thông tin nào. MDE là đại lượng đúng cho câu hỏi này.

<a id="b4"></a>

### B.4 Đường cong sức mạnh — mô phỏng

*Chuyển nguyên vẹn từ mục 6.2.*

Cách làm: **tái định tâm** dữ liệu về H₀ (trừ ATT quan sát khỏi nhóm `Z=1`), cộng hiệu ứng giả định `δ`, chạy lại toàn bộ estimator. 2.000 lần mỗi mức.

*Nếu cộng thẳng `δ` vào dữ liệu hiện tại thì hiệu ứng thật sẽ là `ATT quan sát + δ`, không phải `δ`.*

| δ (điểm log ×100) | Sức mạnh |
|---|---|
| 0 | **0,051** ← đúng mức α, xác nhận tái định tâm chạy đúng |
| −0,5 | 0,109 |
| −1,0 | 0,288 |
| **−1,835** *(chuyển hoàn toàn)* | **0,716** |
| −2,5 | 0,928 |
| −3,0 | 0,979 |

MDE từ mô phỏng ≈ **2,10** so với giải tích **2,05** — khớp.

<a id="b5"></a>

### B.5 Sức mạnh của TOST

*Chuyển nguyên vẹn từ mục 6.3.*

Đây là phát hiện quan trọng, và nó **đổi cách đọc kết quả TOST ở chương 5**.

MDE khác 0 không trả lời được câu "có chứng minh được tương đương không". Tính riêng:

Với tác động thật đúng bằng 0, sức mạnh TOST là

```
2 · Φ(δ/SE − z₀,₉₅) − 1
```

| Đặc tả | Biên cần cho 80% sức mạnh | Biên đang dùng | Sức mạnh thực ở biên đang dùng |
|---|---|---|---|
| PP1-A thô | ±1,755 | ±0,918 | **0,0%** 🔴 |
| PP1-A có hiệp biến | ±2,146 | ±0,918 | **0,0%** 🔴 |
| PP1-B g-computation | ±2,270 | ±0,918 | **0,0%** 🔴 |
| PP2 phân tầng | ±1,734 | ±0,918 | **0,0%** 🔴 |

**Sức mạnh bằng 0 ở cả bốn đặc tả.** Kiểm định tương đương với biên ±0,918 **không có cơ hội nào** thành công, kể cả khi tác động thật đúng bằng 0.

⚠️ **Sửa lỗi công thức (26/07).** Bản đầu tính biên cần thiết bằng `(z₀,₉₅ + z₀,₈₀)·SE = 2,487·SE`, cho ra 1,49–1,93. Sai: công thức đó chỉ đạt **60%** sức mạnh. Đúng phải là `(z₀,₉₅ + z₀,₉₀)·SE = 2,926·SE`. Đã kiểm chứng bằng mô phỏng 400.000 lần: biên 2,487·SE cho sức mạnh 0,601; biên 2,926·SE cho 0,800. Kết luận không đổi mà mạnh thêm.

> **"TOST thất bại" KHÔNG phải bằng chứng chống lại sự tương đương.** Nó chủ yếu phản ánh việc thiết kế không đủ chính xác cho biên đã chọn trước.

Nếu không nói rõ điều này, người đọc sẽ hiểu ngược — tưởng rằng dữ liệu đã bác bỏ khả năng pass-through gần 0.

<a id="b6"></a>

### B.6 Phạm vi của bất định

*Chuyển nguyên vẹn từ mục 6.7.*

🔴 Mọi HC3 và bootstrap trong đồ án chỉ đo **bất định có điều kiện ở cấp SKU**.

Bất định ở **cấp chính sách** — một cửa hàng, một ngày, một người ra quyết định giá — **không ước lượng được** bằng dữ liệu này.

Hai chẩn đoán bổ sung, đặt ở phụ lục với nhãn **"chẩn đoán, không có địa vị suy diễn"**:

| Cách | Vì sao không có địa vị suy diễn |
|---|---|
| Gộp cụm theo nhóm hàng (3 cụm) | Lý thuyết tiệm cận cần số cụm lớn; 3 cụm thì không |
| Hoán vị nhãn trong tầng | Can thiệp do **luật định**, không bốc thăm ⇒ không tồn tại phân phối ngẫu nhiên hóa để hoán vị mô phỏng |

🔴 **Cấm viết "đã xử lý ngụy lặp"** hay bất kỳ câu nào ngụ ý hai cách trên giải quyết được vấn đề.

## C. Độ nhạy

<a id="c1"></a>

### C.1 Lưới độ nhạy — báo cáo toàn bộ

*Chuyển nguyên vẹn từ mục 5.6.*

### Cửa sổ thời gian

| Cửa sổ | n | Theo `Z` | p | Per-protocol | p |
|---|---|---|---|---|---|
| Chính (05+06 → 07+08) | 287 | −0,270 | 0,713 | −0,264 | 0,714 |
| **Có tháng 4** | 293 | −0,113 | 0,876 | −0,092 | 0,898 |
| Hẹp 1 tháng (06 → 07) | 251 | −0,214 | 0,782 | −0,217 | 0,777 |
| Từ 11/06 (gồm cả hai địa chỉ) | 248 | −0,212 | 0,790 | −0,214 | 0,785 |

Cửa sổ có tháng 4 — quyết định hậu kiểm ở [chương 4](chuong-04-thiet-ke-nhan-qua.md) — **không** làm đổi kết luận.

Cửa sổ từ 11/06 không phải là mẫu "chỉ địa điểm mới". Nếu bắt đầu từ 24/06, tiền kỳ chỉ còn 7 ngày nên quá ngắn để dựng mẫu SKU.

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

## D. Kết quả phụ

<a id="d1"></a>

### D.1 Kết quả theo tầng

*Chuyển nguyên vẹn từ mục 5.2.*

| Tầng | Khoảng giá nền | n(Z=1) | n(Z=0) | Trọng số | τ̂_s |
|---|---|---|---|---|---|
| 0 | 9.000 – 26.000đ | 19 | 39 | 0,123 | −0,076 |
| 1 | 27.000 – 42.000đ | 39 | 20 | 0,252 | +0,066 |
| 2 | 43.000 – 62.000đ | 32 | 24 | 0,206 | −0,256 |
| **3** | **64.000 – 96.000đ** | 31 | 27 | 0,200 | **−1,662** |
| 4 | 99.000 – 804.000đ | 34 | 22 | 0,219 | +0,551 |

⚠️ Tầng 3 có chênh lệch âm lớn nhất, nhưng **ước lượng thiếu chính xác và được nhận diện sau khi xem bảng năm tầng**. Sai số chuẩn xấp xỉ 1,36 nên |t| ≈ 1,22 và khoảng tin cậy chứa 0. Bốn tầng còn lại không tạo thành quy luật đơn điệu. **Chưa thể phân biệt dị biệt thật với nhiễu** — không đào sâu riêng tầng này.

<a id="d2"></a>

### D.2 Kết quả per-protocol theo `D`

*Chuyển nguyên vẹn từ mục 5.4.*

Cần thêm giả định rằng quyết định cập nhật thuế không liên quan xu hướng giá phản thực.

| Đối chứng | n₀ | Ước lượng | p |
|---|---|---|---|
| ĐC-A rượu/bia/thuốc lá | 132 | −0,264 | 0,714 |
| ĐC-B bỏ hàng hóa chất | 137 | −0,203 | 0,769 |
| ĐC-C đầy đủ | 157 | −0,076 | 0,903 |
| ĐC-8% *(độ nhạy)* | 1.908 | +0,927 | 0,134 |
| PP2 phân tầng, ĐC-A | 132 | −0,343 | 0,563 |

<a id="d3"></a>

### D.3 Mô phỏng làm tròn giá — chuẩn cơ học

*Chuyển nguyên vẹn từ mục 6.4.*

Câu hỏi duy nhất: *nếu* cửa hàng chuyển hoàn toàn phần giảm thuế **và** làm tròn theo quy tắc R, giá niêm yết có phải đổi mức không?

Toán tử: làm tròn về mức **gần nhất**, điểm hòa làm tròn **lên**. Đầu vào: giá tiền kỳ của 155 SKU `Z=1`. Tỉ lệ 1,08/1,10.

| Lưới làm tròn | Số SKU sẽ đổi mức | Tỉ lệ |
|---|---|---|
| 1.000đ | 135/155 | **87,1%** |
| 500đ | 152/155 | 98,1% |
| 100đ | 155/155 | 100% |

**Kết luận đúng:**

> Với giả định chuyển hoàn toàn, giá giao dịch nền đại diện cho giá niêm yết, và cửa hàng làm tròn gần nhất đến 1.000 đồng, 135/155 SKU sẽ chuyển sang một mức lưới khác. Vì vậy riêng cơ chế làm tròn này **không thể che hoàn toàn** mức giảm thuế cơ học đối với khoảng 87% SKU; nó **có thể che** đối với 13% còn lại.

🔴 **Không được suy ra:** 135 SKU thực tế phải giảm giá · cửa hàng cố tình không chuyển thuế · quy tắc làm tròn 1.000đ "bị bác bỏ" · chi phí thực đơn không tồn tại.

⚠️ **Hạn chế:** `pre_p` là **giá giao dịch trung vị**, không chắc trùng giá niêm yết. Mô phỏng giả định hai thứ trùng nhau.

⚠️ **Cảnh báo trình bày.** Tỉ lệ ở bảng trên **trùng ngẫu nhiên** với tỉ lệ tuân thủ thuế ở [chương 4.3](chuong-04-thiet-ke-nhan-qua.md) — cùng dạng 135/155 nhưng là **hai tập SKU hoàn toàn khác nhau**, không có quan hệ cơ chế nào. **Không đặt hai con số này cạnh nhau** trên web hay slide; người đọc lướt sẽ tưởng chúng liên quan.

<a id="d4"></a>

### D.4 SKU có còn được bán không?

*Chuyển nguyên vẹn từ mục 6.5.*

Mẫu chính đã điều kiện hóa trên việc SKU có mặt ở cả hai kỳ, nên phải dựng **cohort trước chọn lọc**: toàn bộ SKU có mặt ở tiền kỳ.

🔴 `Z` cho nhánh này gán **chỉ từ thông tin trước 01/07** (thuế suất tiền kỳ + định danh sản phẩm). Dùng `grp` hay thuế suất hậu kỳ sẽ là vòng lặp logic — chính SKU biến mất là SKU không có thuế suất hậu kỳ.

| Nhóm | n | Còn bán ở hậu kỳ |
|---|---|---|
| `Z=1` | 189 | **82,0%** |
| `Z=0` | 148 | **89,2%** |

Chênh lệch **−7,2 điểm phần trăm**, SE 3,8, KTC 95% **[−14,6; +0,2]**.

**Đây là mối đe dọa nghiêm trọng cho diễn giải kết quả giá.** Giá hậu kỳ chỉ quan sát được khi SKU còn bán. Tỉ lệ sống sót khác nhau nghĩa là mẫu giá đã điều kiện hóa trên một **biến hậu can thiệp**. Nếu cầu nền ảnh hưởng cả việc sống sót lẫn việc đổi giá, điều kiện hóa mở ra đường **collider**.

Hệ quả — phải sửa cách gọi tên kết quả chương 5:

| Không phải | Mà là |
|---|---|
| ITT vô điều kiện cho toàn bộ cohort tiền kỳ | **So sánh theo `Z` trong nhóm SKU có giá quan sát được ở cả hai kỳ** |

Nó cũng **không phải** hiệu ứng trên nhóm "luôn sống sót", vì không nhận diện được SKU nào sẽ sống sót dưới cả hai trạng thái.

⚠️ Khoảng tin cậy chứa 0 **không** làm mối đe dọa biến mất. Ngược lại, vì nhóm `Z=1` vốn bán thưa hơn ngay từ tiền kỳ, −7,2 điểm % cũng **không chứng minh** chính sách gây SKU biến mất.

<a id="d5"></a>

### D.5 Sản lượng

*Chuyển nguyên vẹn từ mục 6.6.*

Chuẩn hóa theo **phơi nhiễm**: `y = 100 · log[(Q_hậu / E_hậu) / (Q_tiền / E_tiền)]`, với `E` = số ngày cửa hàng thực sự có giao dịch.

Đo được: **E tiền kỳ = 48 ngày, E hậu kỳ = 48 ngày** — bằng nhau, nên chuẩn hóa không làm đổi kết quả ở cửa sổ này. Vẫn giữ công thức vì các cửa sổ độ nhạy có `E` khác nhau.

> Trong các SKU còn bán ở cả hai kỳ, chênh lệch sản lượng chuẩn hóa theo ngày là **−20,6 điểm log ×100**; KTC 95% **[−42,6; +1,4]**, p = 0,067. **MDE 80% là 31,5 điểm**, nên thiết kế không đủ lực phát hiện các thay đổi nhỏ hơn mức này. Ước lượng còn chịu chọn lọc survivorship (§6.5) và không đại diện cho toàn bộ cohort tiền kỳ.

🔴 **Cấm viết:** "gần có ý nghĩa" · "có xu hướng giảm" · "chính sách làm sản lượng giảm 20,6%" · "không có tác động đến sản lượng".

⚠️ **Không cộng** −20,6 với −7,2 điểm % thành "tổng tác động". Một bên là log sản lượng **có điều kiện sống sót**, bên kia là **xác suất sống sót** — hai đại lượng khác nhau.
