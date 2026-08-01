# 03 — Kiểm định giả thuyết thống kê (chương 6)

Mục lục chương: 6.1 Bốn bước · 6.2 Kiểm định tham số · 6.3 Kiểm định phi tham số ·
6.4 Bài tập.

**Đây là chương nặng nhất trong danh sách ôn.** Mục 6.2 là một bảng gồm 8 loại
kiểm định; đề gần như chắc chắn rút từ đó. Chiến lược: thuộc *bảng chọn công thức*
trước, hiểu bản chất sau.

## 1. Bốn bước (6.1)

1. Phát biểu $H_0$ và $H_a$.
2. Lấy mẫu ngẫu nhiên cỡ $n$, chọn thống kê kiểm định $G$, xác định phân phối của
   $G$ **khi $H_0$ đúng**.
3. Với mức ý nghĩa $\alpha$, xác định **miền bác bỏ**.
4. Bác bỏ $H_0$ nếu giá trị tính được rơi vào miền bác bỏ.

**Lối làm hiện đại** (máy tính) — tương đương và nhanh hơn:

1. Tính thống kê kiểm định ($z$, $t$, hoặc $q$).
2. Tính p-value tương ứng.
3. Bác bỏ $H_0$ nếu **p-value $< \alpha$**.

Book định nghĩa gọn: $\text{p-value} = p(\mathcal{D} \mid H_0)$ — xác suất quan sát
được dữ liệu (hoặc cực đoan hơn) **với điều kiện $H_0$ đúng**.

> **Bẫy kinh điển:** p-value **KHÔNG** phải $P(H_0 \mid \mathcal{D})$, tức không
> phải "xác suất $H_0$ đúng". Đảo ngược hai vế của xác suất có điều kiện là lỗi
> khái niệm bị trừ điểm nặng nhất chương này.

## 2. Đặt giả thuyết cho đúng chiều

| Đề nói | $H_0$ | $H_a$ | Miền bác bỏ |
|---|---|---|---|
| "có khác không", "có thay đổi không" | $\mu = \mu_0$ | $\mu \ne \mu_0$ | hai đuôi, $\|z\| > z_{\alpha/2}$ |
| "có lớn hơn không", "có tăng không" | $\mu = \mu_0$ | $\mu > \mu_0$ | đuôi phải, $z > z_\alpha$ |
| "có nhỏ hơn không", "có giảm không" | $\mu = \mu_0$ | $\mu < \mu_0$ | đuôi trái, $z < -z_\alpha$ |

Ba quy tắc:

- $H_0$ **luôn mang dấu bằng**. Điều muốn chứng minh nằm ở $H_a$.
- Chọn chiều **trước khi nhìn dữ liệu**. Thấy $\bar x < \mu_0$ rồi mới quyết định
  kiểm một phía trái là gian lận thống kê.
- Một phía dùng $z_\alpha$, hai phía dùng $z_{\alpha/2}$. Với $\alpha = 0{,}05$:
  một phía **1,645**, hai phía **1,96**.

## 3. Sai lầm loại I và loại II

| | Không bác bỏ $H_0$ | Bác bỏ $H_0$ |
|---|---|---|
| **$H_0$ đúng** | quyết định đúng | **Sai lầm loại I** — xác suất $\alpha$ |
| **$H_0$ sai** | **Sai lầm loại II** — xác suất $\beta$ | quyết định đúng |

- **Loại I ($\alpha$)** = dương tính giả — kết luận có hiệu ứng trong khi không có.
- **Loại II ($\beta$)** = âm tính giả — bỏ sót hiệu ứng thật.
- **Lực kiểm định (power)** $= 1 - \beta$ — khả năng phát hiện hiệu ứng khi nó
  thật sự tồn tại.

Quan hệ đánh đổi: giữ nguyên $n$ mà **giảm $\alpha$ thì $\beta$ tăng**. Muốn giảm
cả hai thì chỉ còn cách **tăng $n$**.

Ví dụ để nhớ: xét nghiệm bệnh. Loại I = báo có bệnh cho người khoẻ. Loại II = báo
khoẻ cho người có bệnh. Y học đặt $\alpha$ cao để $\beta$ thấp, vì bỏ sót bệnh
nguy hiểm hơn.

## 4. Bảng chọn công thức — kiểm định tham số (6.2)

Đọc bảng này theo cột "Khi nào dùng" là chọn được công thức trong 5 giây.

### 4.1 Một trung bình, biết $\sigma$

$$z = \frac{\bar{x} - \mu_0}{\sigma/\sqrt{n}}$$

Bác bỏ: hai phía $|z| > z_{\alpha/2}$ · phải $z > z_\alpha$ · trái $z < -z_\alpha$

### 4.2 Một trung bình, KHÔNG biết $\sigma$

$$t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}} \qquad df = n-1$$

Bác bỏ: hai phía $|t| > t_{\alpha/2;\,n-1}$ · phải $t > t_{\alpha;\,n-1}$ · trái
$t < -t_{\alpha;\,n-1}$

> Đề cho $s$ (độ lệch chuẩn **mẫu**) → dùng $t$. Cho $\sigma$ (quần thể) → dùng
> $z$. Đây là dấu hiệu nhận biết duy nhất cần nhớ.

### 4.3 Phương sai của một quần thể

$$q = \frac{(n-1)s^2}{\sigma_0^2} \qquad df = n-1$$

Bác bỏ: hai phía $q > \chi^2_{\alpha/2;\,n-1}$ **hoặc** $q < \chi^2_{1-\alpha/2;\,n-1}$ ·
phải $q > \chi^2_{\alpha;\,n-1}$ · trái $q < \chi^2_{1-\alpha;\,n-1}$

Phân phối $\chi^2$ **không đối xứng**, nên hai đuôi phải tra hai giá trị khác nhau
— không lấy dấu trị tuyệt đối được.

### 4.4 Một tỉ lệ

$$z = \frac{\hat{p} - p_0}{\sqrt{\dfrac{p_0(1-p_0)}{n}}}$$

Bác bỏ: hai phía $|z| > z_{\alpha/2}$ · phải $z > z_\alpha$ · trái $z < -z_\alpha$

Mẫu số dùng **$p_0$** chứ không phải $\hat p$ — khác với khi dựng CI. Xem
[file 02 mục 3](02-khoang-tin-cay.md).

### 4.5 Hai trung bình, phương sai BẰNG nhau

$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{s_p^2\left(\dfrac{1}{n_1}+\dfrac{1}{n_2}\right)}}
\qquad
s_p^2 = \frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}$$

$df = n_1 + n_2 - 2$. Bác bỏ hai phía: $|t| > t_{\alpha/2;\,n_1+n_2-2}$

$s_p^2$ là trung bình có trọng số của hai phương sai, trọng số là bậc tự do.

### 4.6 Hai trung bình, phương sai KHÁC nhau, $n_1 > 30$ và $n_2 > 30$

$$z = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\dfrac{s_1^2}{n_1}+\dfrac{s_2^2}{n_2}}}$$

Bác bỏ hai phía: $|z| > z_{\alpha/2}$

### 4.7 Hai phương sai

$$f = \frac{s_1^2}{s_2^2}$$

Bác bỏ: hai phía $f > F_{\alpha/2;\,n_1-1,\,n_2-1}$ hoặc $f < F_{1-\alpha/2;\,n_1-1,\,n_2-1}$

Kiểm định này thường dùng **trước** 4.5 để quyết định có được gộp phương sai không.

### 4.8 Hai tỉ lệ

$$z = \frac{\hat{p}_1 - \hat{p}_2}{\sqrt{\bar{p}(1-\bar{p})\left(\dfrac{1}{n_1}+\dfrac{1}{n_2}\right)}}
\qquad
\bar{p} = \frac{n_1\hat{p}_1 + n_2\hat{p}_2}{n_1+n_2}$$

$\bar p$ là tỉ lệ gộp — vì $H_0$ nói hai tỉ lệ **bằng nhau**, nên dồn cả hai mẫu
lại để ước lượng cái tỉ lệ chung đó.

## 5. Kiểm định phi tham số (6.3)

### 5.1 Độc lập của hai biến định tính (chi bình phương)

$H_0$: hai biến độc lập · $H_a$: không độc lập

Dạng dùng được khi làm bài:

$$q = \sum_{i}\sum_{j} \frac{(O_{ij} - E_{ij})^2}{E_{ij}}
\qquad
E_{ij} = \frac{R_i \times C_j}{n}$$

với $O_{ij}$ là tần suất **quan sát** ở ô $(i,j)$, $E_{ij}$ là tần suất **kỳ vọng**,
$R_i$ là tổng hàng $i$ và $C_j$ là tổng cột $j$.

Bác bỏ: $q > \chi^2_{\alpha;\,(h-1)(k-1)}$ với $h$ hàng, $k$ cột.

### 5.2 Kiểm định tính chuẩn Jarque–Bera

$H_0$: biến phân phối chuẩn

$$q = n\left(\frac{\text{skew}^2}{6} + \frac{\text{kurt}^2}{24}\right)$$

Bác bỏ: $q > \chi^2_{\alpha;\,2}$ (luôn $df = 2$).

Phân phối chuẩn có độ lệch 0 và độ nhọn thừa 0, nên $q$ đo mức lệch khỏi cả hai.

### 5.3 Kolmogorov–Smirnov (phù hợp phân phối)

$H_0$: $F_o = F_m$ (thực nghiệm = mô hình)

$$d = \max_x \left| F_o(x) - F_m(x) \right|$$

Bác bỏ: $d > D_\alpha$. Là khoảng cách dọc lớn nhất giữa hai hàm phân phối tích luỹ.

## 6. Bài tập có lời giải

Bốn bài đầu theo đúng dạng của mục 6.4 trong book.

---

### Bài 1 — một trung bình, chưa biết $\sigma$

*Giám đốc tuyên bố lương trung bình công nhân là 380 (nghìn đ/tháng). Mẫu $n = 36$
cho $\bar x = 350$, $s = 40$. Kiểm định ở $\alpha = 0{,}05$.*

**Bước 1.** $H_0: \mu = 380$ · $H_a: \mu \ne 380$ (đề chỉ hỏi "có đúng không" → hai phía)

**Bước 2.** Có $s$, không có $\sigma$ → dùng $t$, $df = 35$.

$$SE = \frac{s}{\sqrt{n}} = \frac{40}{6} = 6{,}667$$

$$t = \frac{350 - 380}{6{,}667} = \frac{-30}{6{,}667} = -4{,}50$$

**Bước 3.** Miền bác bỏ: $|t| > t_{0{,}025;\,35} = 2{,}030$

**Bước 4.** $|{-4{,}50}| = 4{,}50 > 2{,}030$ → **bác bỏ $H_0$**.

p-value $\approx 0{,}00007 < 0{,}05$, cùng kết luận.

> Kết luận: dữ liệu bác bỏ tuyên bố của giám đốc; lương trung bình thực tế thấp
> hơn 380 một cách có ý nghĩa thống kê.

---

### Bài 2 — hai trung bình, mẫu lớn

*Đường huyết trước và sau khi tiếp xúc môi trường lao động. Nhóm trước: $n_1 = 50$,
$\bar x = 60$ mg%, $s_1 = 7$. Nhóm sau: $n_2 = 40$, $\bar y = 52$ mg%, $s_2 = 9{,}2$.
Hỏi có giảm không, $\alpha = 0{,}05$.*

**Bước 1.** "Có giảm không" → một phía. $H_0: \mu_1 = \mu_2$ · $H_a: \mu_1 > \mu_2$

**Bước 2.** $n_1, n_2 > 30$, phương sai khác nhau → công thức 4.6.

$$SE = \sqrt{\frac{7^2}{50} + \frac{9{,}2^2}{40}} = \sqrt{\frac{49}{50} + \frac{84{,}64}{40}} = \sqrt{0{,}980 + 2{,}116} = \sqrt{3{,}096} = 1{,}760$$

$$z = \frac{60 - 52}{1{,}760} = \frac{8}{1{,}760} = 4{,}55$$

**Bước 3.** Một phía, $\alpha = 0{,}05$ → miền bác bỏ $z > 1{,}645$

**Bước 4.** $4{,}55 > 1{,}645$ → **bác bỏ $H_0$**. Đường huyết có giảm thật.

> Chú ý: hai nhóm cỡ khác nhau (50 và 40) nên đây **không** phải dữ liệu ghép cặp,
> dù đề nói "trước và sau". Ghép cặp phải là cùng những người đó, $n_1 = n_2$.

---

### Bài 3 — một tỉ lệ, một phía

*Tỉ lệ phế phẩm trước đây 5%. Sau cải tiến, kiểm 800 sản phẩm thấy 24 phế phẩm.
Tỉ lệ đã giảm chưa, $\alpha = 0{,}01$?*

**Bước 1.** $H_0: p = 0{,}05$ · $H_a: p < 0{,}05$ (đuôi trái)

**Bước 2.** $\hat p = 24/800 = 0{,}03$. Điều kiện: $np_0 = 40 \ge 10$,
$n(1-p_0) = 760 \ge 10$ ✓

$$SE = \sqrt{\frac{0{,}05 \times 0{,}95}{800}} = \sqrt{\frac{0{,}0475}{800}} = \sqrt{0{,}00005938} = 0{,}007706$$

$$z = \frac{0{,}03 - 0{,}05}{0{,}007706} = \frac{-0{,}02}{0{,}007706} = -2{,}60$$

**Bước 3.** Miền bác bỏ: $z < -z_{0{,}01} = -2{,}326$

**Bước 4.** $-2{,}60 < -2{,}326$ → **bác bỏ $H_0$**. Cải tiến có hiệu quả.

p-value $= P(Z < -2{,}60) = 0{,}0047 < 0{,}01$ ✓

> Nếu đề để $\alpha = 0{,}001$ thì ngưỡng là $-3{,}09$ và ta **không** bác bỏ được.
> Cùng một dữ liệu, kết luận đổi theo $\alpha$ — đây là điều nên nói thêm một câu
> khi làm bài tự luận.

---

### Bài 4 — hai tỉ lệ

*Dùng DDT: 90 người, 10 nhiễm. Không dùng: 100 người, 26 nhiễm. So sánh hiệu quả,
$\alpha = 0{,}05$.*

**Bước 1.** $H_0: p_1 = p_2$ · $H_a: p_1 \ne p_2$

**Bước 2.** $\hat p_1 = 10/90 = 0{,}1111$ · $\hat p_2 = 26/100 = 0{,}26$

$$\bar p = \frac{10 + 26}{90 + 100} = \frac{36}{190} = 0{,}1895$$

$$SE = \sqrt{0{,}1895 \times 0{,}8105 \times \left(\frac{1}{90}+\frac{1}{100}\right)}
= \sqrt{0{,}1536 \times 0{,}02111} = \sqrt{0{,}003243} = 0{,}05694$$

$$z = \frac{0{,}1111 - 0{,}26}{0{,}05694} = \frac{-0{,}14889}{0{,}05694} = -2{,}615$$

**Bước 3.** Miền bác bỏ: $|z| > 1{,}96$

**Bước 4.** $2{,}615 > 1{,}96$ → **bác bỏ $H_0$**. Hai tỉ lệ nhiễm khác nhau có ý
nghĩa; nhóm dùng DDT nhiễm ít hơn.

> Giữ tử số ở 5 chữ số ($-0{,}14889$) là có chủ ý. Lấy tử số làm tròn thành
> $-0{,}1489$ rồi chia sẽ ra $2{,}61503$, làm tròn thành $2{,}62$; tính đủ chữ số
> mới ra $2{,}61487$, tức $2{,}615$. Cùng cái bẫy làm tròn ở
> [file 06](06-hoi-quy-tuyen-tinh.md) — chỉ khác là ở đây nó đủ sức đổi chữ số
> cuối của đáp án.

> Tử số dùng $\hat p_1, \hat p_2$ riêng, mẫu số dùng $\bar p$ gộp. Nhớ bằng logic:
> mẫu số được tính **dưới giả định $H_0$ đúng**, mà $H_0$ nói hai tỉ lệ bằng nhau.

---

### Bài 5 — chi bình phương độc lập

*Kiểm tra hút thuốc có liên quan tới bệnh phổi không, $\alpha = 0{,}05$.*

| Quan sát $O$ | Bệnh | Không bệnh | Tổng hàng |
|---|---|---|---|
| Hút | 30 | 70 | 100 |
| Không hút | 20 | 130 | 150 |
| **Tổng cột** | **50** | **200** | **250** |

**Kỳ vọng** $E_{ij} = \dfrac{R_i \times C_j}{250}$ (tổng hàng nhân tổng cột, chia $n$):

| $E$ | Bệnh | Không bệnh |
|---|---|---|
| Hút | $100(50)/250 = 20$ | $100(200)/250 = 80$ |
| Không hút | $150(50)/250 = 30$ | $150(200)/250 = 120$ |

Mọi $E_{ij} \ge 5$ ✓ (điều kiện dùng xấp xỉ $\chi^2$)

$$q = \frac{(30-20)^2}{20} + \frac{(70-80)^2}{80} + \frac{(20-30)^2}{30} + \frac{(130-120)^2}{120}$$

$$q = 5{,}000 + 1{,}250 + 3{,}333 + 0{,}833 = 10{,}42$$

$df = (2-1)(2-1) = 1$, tra $\chi^2_{0{,}05;\,1} = 3{,}841$

$10{,}42 > 3{,}841$ → **bác bỏ $H_0$**. Hút thuốc và bệnh phổi **không độc lập**.

> Viết kết luận là "không độc lập", **đừng viết "hút thuốc gây bệnh phổi"**.
> Chi bình phương chỉ phát hiện liên hệ, không phát hiện nhân quả. Muốn nói nhân
> quả phải sang chương 7–8.

## 7. Sai sót hay gặp khi chấm bài

1. **Quên chia đôi $\alpha$** ở kiểm định hai phía. Dùng 1,645 cho hai phía là sai.
2. **Dùng $z$ khi đề cho $s$ và $n$ nhỏ.** Phải là $t$ với $df = n-1$.
3. **Dùng $\hat p$ ở mẫu số** khi kiểm định một tỉ lệ. Phải là $p_0$.
4. **Quên kiểm điều kiện** ($np \ge 10$, $E_{ij} \ge 5$). Nhiều đề cho điểm riêng
   cho bước này.
5. **Kết luận "chấp nhận $H_0$".** Viết đúng là "**chưa đủ bằng chứng để bác bỏ
   $H_0$**". Không bác bỏ được không có nghĩa là $H_0$ đúng.
6. **Nhầm ý nghĩa thống kê với ý nghĩa thực tiễn.** $n$ đủ lớn thì chênh lệch bé
   xíu cũng có $p < 0{,}05$.

## Tự kiểm tra

1. p-value $= 0{,}03$. Câu nào đúng: (a) $H_0$ có 3% khả năng đúng; (b) nếu $H_0$
   đúng thì 3% khả năng thấy dữ liệu cực đoan cỡ này trở lên.
   <details><summary>đáp</summary>
   (b). (a) là đảo ngược điều kiện — sai kinh điển.</details>
2. Giảm $\alpha$ từ 0,05 xuống 0,01, giữ nguyên $n$. Lực kiểm định thay đổi ra sao?
   <details><summary>đáp</summary>
   **Giảm.** Ngưỡng khắt khe hơn → khó bác bỏ hơn → $\beta$ tăng → power $= 1-\beta$
   giảm. Bớt dương tính giả thì thêm âm tính giả.</details>
3. Kiểm định 20 giả thuyết độc lập ở $\alpha = 0{,}05$, tất cả $H_0$ đều đúng. Kỳ
   vọng bao nhiêu cái "có ý nghĩa"?
   <details><summary>đáp</summary>
   $20 \times 0{,}05 = 1$. Đây là vấn đề đa kiểm định — chạy đủ nhiều kiểm định thì
   kiểu gì cũng ra kết quả đẹp.</details>
