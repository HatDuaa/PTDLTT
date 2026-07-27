# Chương 6 — Sức mạnh thống kê và cơ chế

> Chương 5 cho ước lượng điểm. Chương này trả lời: **dữ liệu có đủ sức phát hiện tác động không**, và **cơ chế nào giải thích kết quả**.
>
> 🔴 Toàn bộ nhánh sản lượng và cơ chế là **khám phá**, không phải nhân quả.

## 6.1 Độ lớn tối thiểu phát hiện được (MDE)

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

## 6.2 Đường cong sức mạnh — mô phỏng

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

## 6.3 🔴 Sức mạnh của TOST — biên đã chọn không khả thi

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

## 6.4 Mô phỏng làm tròn giá — chuẩn cơ học

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

## 6.5 Biên độ mở rộng — SKU có còn được bán không?

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

## 6.6 Biên độ tăng cường — sản lượng

Chuẩn hóa theo **phơi nhiễm**: `y = 100 · log[(Q_hậu / E_hậu) / (Q_tiền / E_tiền)]`, với `E` = số ngày cửa hàng thực sự có giao dịch.

Đo được: **E tiền kỳ = 48 ngày, E hậu kỳ = 48 ngày** — bằng nhau, nên chuẩn hóa không làm đổi kết quả ở cửa sổ này. Vẫn giữ công thức vì các cửa sổ độ nhạy có `E` khác nhau.

> Trong các SKU còn bán ở cả hai kỳ, chênh lệch sản lượng chuẩn hóa theo ngày là **−20,6 điểm log ×100**; KTC 95% **[−42,6; +1,4]**, p = 0,067. **MDE 80% là 31,5 điểm**, nên thiết kế không đủ lực phát hiện các thay đổi nhỏ hơn mức này. Ước lượng còn chịu chọn lọc survivorship (§6.5) và không đại diện cho toàn bộ cohort tiền kỳ.

🔴 **Cấm viết:** "gần có ý nghĩa" · "có xu hướng giảm" · "chính sách làm sản lượng giảm 20,6%" · "không có tác động đến sản lượng".

⚠️ **Không cộng** −20,6 với −7,2 điểm % thành "tổng tác động". Một bên là log sản lượng **có điều kiện sống sót**, bên kia là **xác suất sống sót** — hai đại lượng khác nhau.

## 6.7 Phạm vi của bất định

🔴 Mọi HC3 và bootstrap trong đồ án chỉ đo **bất định có điều kiện ở cấp SKU**.

Bất định ở **cấp chính sách** — một cửa hàng, một ngày, một người ra quyết định giá — **không ước lượng được** bằng dữ liệu này.

Hai chẩn đoán bổ sung, đặt ở phụ lục với nhãn **"chẩn đoán, không có địa vị suy diễn"**:

| Cách | Vì sao không có địa vị suy diễn |
|---|---|
| Gộp cụm theo nhóm hàng (3 cụm) | Lý thuyết tiệm cận cần số cụm lớn; 3 cụm thì không |
| Hoán vị nhãn trong tầng | Can thiệp do **luật định**, không bốc thăm ⇒ không tồn tại phân phối ngẫu nhiên hóa để hoán vị mô phỏng |

🔴 **Cấm viết "đã xử lý ngụy lặp"** hay bất kỳ câu nào ngụ ý hai cách trên giải quyết được vấn đề.
