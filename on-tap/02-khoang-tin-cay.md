# 02 — Cơ sở suy diễn thống kê, khoảng tin cậy (chương 5)

Mục lục chương: 5.1 Ước lượng điểm và biến thiên mẫu · 5.2 Khoảng tin cậy cho tỉ
lệ · 5.3 Kiểm định giả thuyết cho tỉ lệ.

> **Cảnh báo phạm vi.** Chương 5 dựng toàn bộ lý thuyết trên **tỉ lệ** $\hat p$.
> Nó không nhắc phân phối $t$, không có khoảng tin cậy cho trung bình. Mục 4 dưới
> đây là phần **bổ sung ngoài book** — cần vì chương 6 dùng $t$ cho trung bình, và
> đề thi hay hỏi CI cho trung bình.

## 1. Bốn khái niệm nền

**Ước lượng điểm** — một con số từ mẫu dùng để đoán tham số quần thể.
$\hat{p}$ đoán $p$, $\bar{x}$ đoán $\mu$.

**Sai số mẫu (sampling error)** — mức độ một ước lượng thay đổi từ mẫu này sang
mẫu khác. Đây là biến thiên *tự nhiên*, không phải lỗi.

**Độ chệch (bias)** — xu hướng *hệ thống* ước lượng cao hơn hoặc thấp hơn tham số
thật. Khác hẳn sai số mẫu: lấy mẫu to hơn thì sai số mẫu giảm, còn độ chệch thì
**không giảm**. Đây là điểm phân biệt hay ra thi.

**Phân phối mẫu (sampling distribution)** — phân phối của ước lượng qua vô số lần
lấy mẫu lặp lại. Không quan sát được trong thực tế; nó là vật thể lý thuyết mà
toàn bộ suy diễn dựa lên.

## 2. Định lý giới hạn trung tâm cho tỉ lệ

$$\hat{p} \;\sim\; \mathcal{N}\!\left(\text{trung bình} = p,\;\; SE = \sqrt{\frac{p(1-p)}{n}}\right)$$

**Hai điều kiện phải kiểm trước khi dùng:**

1. **Độc lập** — mẫu ngẫu nhiên; nếu lấy không hoàn lại thì $n < 10\%$ quần thể.
2. **Cỡ mẫu** — ít nhất **10 thành công và 10 thất bại** kỳ vọng:
   $np \ge 10$ và $n(1-p) \ge 10$.

Đề thi thường ẩn một cái bẫy ở đây: $n$ lớn nhưng $p$ rất nhỏ (ví dụ $n = 100$,
$p = 0{,}02$ → $np = 2 < 10$) thì **không được dùng xấp xỉ chuẩn**.

## 3. Khoảng tin cậy cho tỉ lệ

$$\text{ước lượng điểm} \;\pm\; z^{*} \times SE$$

$$\hat{p} \;\pm\; z^{*}\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$

Phần $z^{*} \times SE$ gọi là **biên sai số (margin of error)**.

| Độ tin cậy | 90% | 95% | 98% | 99% |
|---|---|---|---|---|
| $z^{*}$ | 1,645 | **1,96** | 2,33 | 2,576 |

Lưu ý ở $SE$: khi **dựng CI** thì thay $p$ bằng $\hat p$ (chưa biết $p$), nhưng khi
**kiểm định** thì dùng $p_0$ của $H_0$ (đã giả định $p$). Nhầm chỗ này là lỗi phổ
biến nhất giữa 5.2 và 5.3.

### Bài mẫu 1 — Facebook (bài trong book)

Khảo sát 850 người dùng, 67% cho rằng các danh mục Facebook gán là chính xác.
Dựng CI 95%.

$\hat p = 0{,}67$, $n = 850$

$$SE = \sqrt{\frac{0{,}67 \times 0{,}33}{850}} = \sqrt{\frac{0{,}2211}{850}} = \sqrt{0{,}000260} = 0{,}0161$$

$$CI = 0{,}67 \pm 1{,}96 \times 0{,}0161 = 0{,}67 \pm 0{,}032 = (0{,}64;\ 0{,}70)$$

**Đọc kết quả cho đúng:** "Chúng ta tin cậy 95% rằng từ 64% đến 70% *toàn bộ người
dùng Facebook Mỹ* nghĩ rằng phân loại là chính xác."

### Bài mẫu 2 — tự làm

$n = 400$, $\hat p = 0{,}30$, độ tin cậy 95%.

Kiểm điều kiện: $n\hat p = 120 \ge 10$, $n(1-\hat p) = 280 \ge 10$ ✓

$$SE = \sqrt{\frac{0{,}30 \times 0{,}70}{400}} = \sqrt{0{,}000525} = 0{,}0229$$

$$CI = 0{,}30 \pm 1{,}96(0{,}0229) = 0{,}30 \pm 0{,}0449 = (0{,}255;\ 0{,}345)$$

## 4. ⚠️ Bổ sung ngoài book — CI cho trung bình

Book không có phần này nhưng chương 6 dùng nó, và đề thi hay hỏi.

**Biết $\sigma$ (hiếm, thường là đề cho sẵn):**

$$\bar{x} \pm z^{*}\frac{\sigma}{\sqrt{n}}$$

**Không biết $\sigma$ (trường hợp thật):**

$$\bar{x} \pm t^{*}_{n-1}\frac{s}{\sqrt{n}}$$

Bậc tự do $df = n - 1$. Phân phối $t$ đuôi dày hơn chuẩn nên $t^{*} > z^{*}$ —
khoảng rộng hơn, đúng với việc ta biết ít hơn. Khi $n$ lớn (>30) thì $t^{*} \to z^{*}$.

### Bài mẫu 3

$n = 25$, $\bar x = 52$, $s = 8$, độ tin cậy 95%.

$df = 24$, tra bảng $t^{*}_{0{,}025;\,24} = 2{,}064$

$$SE = \frac{8}{\sqrt{25}} = 1{,}6 \qquad ME = 2{,}064 \times 1{,}6 = 3{,}30$$

$$CI = 52 \pm 3{,}30 = (48{,}70;\ 55{,}30)$$

Nếu lỡ dùng $z^{*} = 1{,}96$ thay vì $t^{*} = 2{,}064$ sẽ ra $(48{,}86;\ 55{,}14)$
— hẹp hơn, tức là **tự tin quá mức**. Đó chính là lỗi mà phân phối $t$ sinh ra để
sửa.

## 5. Tính cỡ mẫu

Muốn biên sai số không quá $ME$ ở độ tin cậy cho trước:

$$n \;\ge\; \frac{(z^{*})^2\, p(1-p)}{ME^2}$$

Chưa biết $p$ thì lấy $p = 0{,}5$ — giá trị làm $p(1-p)$ **lớn nhất** (bằng 0,25),
tức là an toàn nhất. Luôn **làm tròn lên**.

### Bài mẫu 4

Muốn $ME \le 3\%$ ở độ tin cậy 95%, chưa biết gì về $p$.

$$n \ge \frac{1{,}96^2 \times 0{,}25}{0{,}03^2} = \frac{3{,}8416 \times 0{,}25}{0{,}0009} = \frac{0{,}9604}{0{,}0009} = 1067{,}1$$

→ cần $n = 1068$.

Đây là lý do các cuộc thăm dò dư luận toàn thấy "n ≈ 1000, sai số ±3%".

**Hệ quả cần nhớ:** $ME \propto 1/\sqrt{n}$. Muốn **giảm sai số một nửa** phải
**tăng mẫu gấp bốn**. Câu này ra thi rất nhiều.

## 6. Bốn cách đọc sai khoảng tin cậy

CI 95% $= (0{,}64;\ 0{,}70)$:

| Câu | Đúng/Sai | Vì sao |
|---|---|---|
| "95% người dùng nằm trong khoảng 64–70%" | ❌ | CI nói về **tham số** $p$, không nói về cá thể |
| "Xác suất $p$ nằm trong (0,64; 0,70) là 95%" | ❌ | $p$ là hằng số, không có xác suất. Cái ngẫu nhiên là *khoảng* |
| "95% mẫu có $\hat p$ trong khoảng này" | ❌ | Nhầm CI với phân phối mẫu |
| "Nếu lặp lại việc lấy mẫu và dựng CI, khoảng 95% số khoảng sẽ chứa $p$" | ✅ | Định nghĩa tần suất, đúng |

Câu ngắn gọn được chấp nhận trong bài thi: **"Ta tin cậy 95% rằng $p$ nằm trong
(0,64; 0,70)."**

## 7. Cầu nối sang kiểm định

CI và kiểm định hai phía là **cùng một phép tính nhìn từ hai phía**:

> $p_0$ **nằm ngoài** CI $(1-\alpha)$ $\iff$ bác bỏ $H_0: p = p_0$ ở mức $\alpha$
> (hai phía).

Ví dụ CI 95% cho tỉ lệ là $(0{,}64;\ 0{,}67)$ và hỏi "có phải đa số (>50%) không?"
→ $0{,}50$ nằm ngoài khoảng → bác bỏ $H_0: p = 0{,}5$ → có, dữ liệu ủng hộ đa số.

Chi tiết ở [file 03](03-kiem-dinh-gia-thuyet.md).

## Tự kiểm tra

1. Giữ nguyên $n$, đổi từ CI 95% sang 99%. Khoảng rộng ra hay hẹp lại?
   <details><summary>đáp</summary>
   Rộng ra ($z^*$ từ 1,96 lên 2,576). Muốn chắc chắn hơn thì phải chấp nhận nói
   mơ hồ hơn. Chắc chắn 100% thì khoảng là $(-\infty, +\infty)$.</details>
2. Tăng $n$ gấp 9 lần thì $SE$ còn bao nhiêu?
   <details><summary>đáp</summary>
   Còn $1/3$, vì $SE \propto 1/\sqrt{n}$ và $\sqrt{9} = 3$.</details>
3. Mẫu bị chệch (chỉ hỏi người dùng Facebook đang online). Tăng $n$ lên 100.000 có
   cứu được không?
   <details><summary>đáp</summary>
   Không. Tăng $n$ chỉ thu hẹp sai số mẫu, không đụng gì tới độ chệch. Kết quả sẽ
   là một khoảng rất hẹp bao quanh **con số sai**.</details>
