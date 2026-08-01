# 06 — Hồi quy tuyến tính (chương 9)

Mục lục chương: 9.1 Khớp đường thẳng, phần dư và tương quan · 9.2 Khớp bằng bình
phương tối thiểu · 9.3 Các loại giá trị ngoại lệ · 9.4 Suy diễn cho hồi quy.

**Chương được điểm nhanh nhất.** Bài tập rất mẫu mực, gần như chỉ một dạng: cho
$\bar x, \bar y, s_x, s_y, R$ → tìm đường thẳng → dự đoán → kiểm định hệ số góc.

## 1. Mô hình và phần dư

$$\hat{y} = \beta_0 + \beta_1 x$$

**Phần dư** của quan sát $i$:

$$e_i = y_i - \hat{y}_i$$

Bình phương tối thiểu chọn $\beta_0, \beta_1$ sao cho $\sum e_i^2$ **nhỏ nhất** —
không phải $\sum |e_i|$, không phải $\sum e_i$ (tổng này luôn bằng 0 với mọi đường
đi qua $(\bar x, \bar y)$).

## 2. Công thức hệ số

$$b_1 = \frac{s_y}{s_x}\,R
\qquad\qquad
b_0 = \bar{y} - b_1\bar{x}$$

Dạng tính từ dữ liệu thô (khi đề không cho sẵn $R$):

$$b_1 = \frac{S_{xy}}{S_{xx}}
\qquad
S_{xy} = \sum(x_i-\bar x)(y_i-\bar y)
\qquad
S_{xx} = \sum(x_i-\bar x)^2$$

Ba điều rút ra ngay từ hai công thức trên:

- **$b_1$ cùng dấu với $R$** — luôn luôn. Ra ngược dấu là tính sai.
- **Đường hồi quy luôn đi qua $(\bar x,\ \bar y)$** — thay $x = \bar x$ vào là ra
  $\hat y = \bar y$. Dùng để kiểm tra lại $b_0$.
- **$R$ không có đơn vị, $b_1$ thì có** — đơn vị của $b_1$ là (đơn vị $y$)/(đơn vị $x$).

## 3. Hệ số xác định

Hệ số xác định $R^2$ đúng bằng **bình phương hệ số tương quan**, và cũng bằng:

$$R^2 = \frac{SS_{\text{Model}}}{SS_{\text{Total}}} = 1 - \frac{SS_{\text{Error}}}{SS_{\text{Total}}}$$

với $SS_{\text{Total}} = \sum(y_i - \bar y)^2$ và $SS_{\text{Error}} = \sum e_i^2$.

Đọc: *"$x$ giải thích được $R^2 \times 100\%$ biến thiên của $y$."*

## 4. Suy diễn cho hệ số góc (9.4)

$$T = \frac{b_1 - \beta_1^{0}}{SE_{b_1}} \qquad df = n - 2$$

với $\beta_1^{0}$ là **giá trị null** — con số mà $H_0$ khẳng định, gần như luôn là 0.

$$CI: \quad b_1 \pm t^{*}_{n-2}\, SE_{b_1}$$

$H_0: \beta_1 = 0$ nghĩa là "$x$ không có quan hệ tuyến tính với $y$".

$df = n-2$ vì đã ước lượng **hai** tham số ($b_0$ và $b_1$) từ chính mẫu đó. So
với $n-1$ ở chương 3 nơi chỉ ước lượng một tham số ($\bar x$).

Nếu đề cho dữ liệu thô thay vì bảng output:

$$s_e = \sqrt{\frac{SS_{\text{Error}}}{n-2}} \qquad SE_{b_1} = \frac{s_e}{\sqrt{S_{xx}}}$$

## 5. Ba điều kiện của bình phương tối thiểu

1. **Tuyến tính** — quan hệ phải thẳng. Kiểm bằng đồ thị phần dư theo $x$: phải
   không thấy hình dạng nào.
2. **Phần dư gần chuẩn** — kiểm bằng histogram hoặc Q-Q plot của phần dư.
3. **Phương sai không đổi** (đồng phương sai) — độ tản của phần dư như nhau trên
   toàn dải $x$. Hình loa kèn là vi phạm.

Cộng thêm điều kiện ngầm: **quan sát độc lập** (không phải chuỗi thời gian tự
tương quan).

## 6. Ba loại ngoại lệ (9.3)

| Loại | Định nghĩa | Nguy hiểm? |
|---|---|---|
| **Ngoại lệ phần dư** | xa đường theo chiều **dọc** | ít, chỉ làm $R^2$ giảm |
| **Đòn bẩy cao** (high leverage) | xa trung tâm dữ liệu theo chiều **ngang** | tiềm tàng |
| **Có ảnh hưởng** (influential) | bỏ nó ra thì **hệ số góc đổi đáng kể** | **nguy hiểm nhất** |

Một điểm đòn bẩy cao mà nằm đúng trên đường thì vô hại. Đòn bẩy cao **cộng với**
phần dư lớn mới thành điểm có ảnh hưởng.

## 7. Bài mẫu 1 — từ tóm tắt thống kê (dạng bài của book)

*Nghèo đói và tốt nghiệp phổ thông theo bang:* $\bar x = 86{,}01$ (% tốt nghiệp),
$\bar y = 11{,}35$ (% nghèo), $s_x = 3{,}73$, $s_y = 3{,}1$, $R = -0{,}75$.

**Hệ số góc:**

$$b_1 = \frac{s_y}{s_x}R = \frac{3{,}1}{3{,}73}\times(-0{,}75) = 0{,}8311 \times (-0{,}75) = -0{,}62$$

**Hệ số chặn:**

$$b_0 = 11{,}35 - (-0{,}62)(86{,}01) = 11{,}35 + 53{,}33 = 64{,}68$$

> **Bẫy làm tròn.** Giá trị chưa làm tròn là $b_1 = -0{,}62332$; giữ nguyên nó thì
> $b_0 = 64{,}96$ chứ không phải $64{,}68$ — lệch **0,28**. Vì $b_1$ bị nhân với
> $\bar x = 86$, một sai số làm tròn ở chữ số thứ ba bị khuếch đại lên gần 90 lần.
> Nguyên tắc: **giữ đủ chữ số cho tới bước cuối**, chỉ làm tròn khi ghi đáp án. Nếu
> đáp án của mình lệch nhẹ với đáp án mẫu ở hệ số chặn, đây thường là lý do.

**Mô hình** — đặt $y$ = % dân số nghèo, $x$ = % tốt nghiệp phổ thông:

$$\hat{y} = 64{,}68 - 0{,}62\,x$$

**Diễn giải $b_1$:** mỗi 1 điểm phần trăm tăng thêm của tỉ lệ tốt nghiệp **đi kèm**
mức nghèo thấp hơn 0,62 điểm phần trăm.

> Viết "**đi kèm**" chứ đừng viết "**làm giảm**". Đây là dữ liệu quan sát; nói nhân
> quả ở đây là sai — xem [file 05](05-phan-tich-nhan-qua.md).

**Diễn giải $b_0$:** bang có 0% tốt nghiệp phổ thông thì nghèo 64,68%. Con số này
**vô nghĩa** vì $x = 0$ nằm ngoài xa dải dữ liệu (dữ liệu quanh 86%). Đây là
**ngoại suy** — luôn nhắc một câu về nó khi làm bài.

**Dự đoán cho Georgia** ($x = 85{,}1$):

$$\hat y = 64{,}68 - 0{,}62 \times 85{,}1 = 64{,}68 - 52{,}76 = 11{,}92\%$$

**Hệ số xác định:** $R^2 = (-0{,}75)^2 = 0{,}5625 \approx 56\%$

> Trong hồi quy **đơn**, $R^2$ **luôn** đúng bằng bình phương hệ số tương quan — đây
> là đồng nhất thức, không phải xấp xỉ. Nếu con số $R^2$ trong đề không khớp với
> $R^2$ tính từ $R$ được cho, thì hai con số đó thuộc **hai mô hình khác nhau** (ví
> dụ $R^2$ lấy từ mô hình đa biến). Kiểm chéo lại trước khi ghi đáp án.

## 8. Bài mẫu 2 — tính tay đầy đủ từ dữ liệu thô

Dùng lại dữ liệu ở [file 01](01-mo-ta-du-lieu.md) để nối hai chương:

| $x$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $y$ | 2 | 4 | 5 | 4 | 9 |

Đã có: $\bar x = 3$, $\bar y = 4{,}8$, $S_{xx} = 10$, $S_{xy} = 14$, $S_{yy} = 26{,}8$, $R = 0{,}855$.

**Hệ số:**

$$b_1 = \frac{S_{xy}}{S_{xx}} = \frac{14}{10} = 1{,}4
\qquad
b_0 = 4{,}8 - 1{,}4(3) = 0{,}6$$

$$\hat y = 0{,}6 + 1{,}4x$$

**Phần dư:**

| $x$ | 1 | 2 | 3 | 4 | 5 | Σ |
|---|---|---|---|---|---|---|
| $y$ | 2 | 4 | 5 | 4 | 9 | |
| $\hat y$ | 2,0 | 3,4 | 4,8 | 6,2 | 7,6 | |
| $e$ | 0 | 0,6 | 0,2 | −2,2 | 1,4 | **0** ✓ |
| $e^2$ | 0 | 0,36 | 0,04 | 4,84 | 1,96 | **7,20** |

Tổng phần dư bằng 0 — dùng làm kiểm tra bắt buộc trước khi đi tiếp.

**Hệ số xác định:**

$$R^2 = 1 - \frac{7{,}20}{26{,}80} = 1 - 0{,}2687 = 0{,}731$$

Kiểm chéo: $R^2 = 0{,}855^2 = 0{,}731$ ✓

**Suy diễn:**

$$s_e = \sqrt{\frac{7{,}20}{5-2}} = \sqrt{2{,}40} = 1{,}549$$

$$SE_{b_1} = \frac{1{,}549}{\sqrt{10}} = \frac{1{,}549}{3{,}162} = 0{,}490$$

$$T = \frac{1{,}4 - 0}{0{,}490} = 2{,}86 \qquad df = 3$$

Tra $t^{*}_{0{,}025;\,3} = 3{,}182$. Vì $2{,}86 < 3{,}182$ → **không bác bỏ**
$H_0: \beta_1 = 0$ ở $\alpha = 0{,}05$.

$$CI_{95\%} = 1{,}4 \pm 3{,}182(0{,}490) = 1{,}4 \pm 1{,}559 = (-0{,}16;\ 2{,}96)$$

Khoảng **chứa 0**, nhất quán với việc không bác bỏ.

> **Bài học quan trọng nhất của file này.** $R^2 = 73\%$ trông rất đẹp, nhưng hệ số
> góc **không có ý nghĩa thống kê** vì $n = 5$ quá nhỏ. $R^2$ cao và $p$ nhỏ là hai
> chuyện khác nhau: $R^2$ đo *khớp bao nhiêu*, $p$ đo *có chắc không phải may rủi
> không*. Đề hay ra đúng cái bẫy này.

## 9. Bài mẫu 3 — đọc bảng output

*Nghiên cứu IQ của các cặp song sinh, $n = 27$ cặp:*

| | Ước lượng | Sai số chuẩn | $t$ | $\Pr(>|t|)$ |
|---|---|---|---|---|
| (Chặn) | 9,2076 | 9,2999 | 0,99 | 0,3316 |
| bioIQ | 0,9014 | 0,0963 | 9,36 | 0,0000 |

**Kiểm chứng cột $t$:** $0{,}9014 / 0{,}0963 = 9{,}36$ ✓ — cột $t$ luôn là ước
lượng chia sai số chuẩn. Tự tính lại để chắc mình đọc đúng cột.

**Bậc tự do:** $df = 27 - 2 = 25$

**CI 95% cho hệ số góc,** $t^{*}_{0{,}025;\,25} = 2{,}06$:

$$0{,}9014 \pm 2{,}06 \times 0{,}0963 = 0{,}9014 \pm 0{,}1984 = (0{,}70;\ 1{,}10)$$

**Đọc kết quả:**

- Hệ số góc: $p < 0{,}0001$ → rất có ý nghĩa. Bác bỏ $H_0: \beta_1 = 0$.
- Hệ số chặn: $p = 0{,}33$ → không khác 0 có ý nghĩa. **Bình thường và không đáng
  lo** — hệ số chặn hiếm khi là thứ ta quan tâm.
- CI $(0{,}70;\ 1{,}10)$ **chứa 1**. Đáng chú ý: không bác bỏ được giả thuyết
  $\beta_1 = 1$, tức quan hệ có thể là một-đổi-một.

> Mẹo: đề hỏi "kiểm định $\beta_1 = 1$" thì tử số là $b_1 - 1$ chứ không phải
> $b_1 - 0$. Cột $t$ trong bảng output **luôn** ứng với null $= 0$, phải tự tính lại.

## Tự kiểm tra

1. Hoán đổi vai trò $x$ và $y$ rồi hồi quy lại. $R^2$ có đổi không? $b_1$ có đổi không?
   <details><summary>đáp</summary>
   $R^2$ **không đổi** (vì $= R^2$, mà $R$ đối xứng). $b_1$ **đổi**: từ $S_{xy}/S_{xx}$
   thành $S_{xy}/S_{yy}$. Hai đường hồi quy khác nhau — hồi quy không đối xứng.</details>
2. Vì sao $df = n-2$ chứ không phải $n-1$?
   <details><summary>đáp</summary>
   Đã tiêu hai bậc tự do để ước lượng $b_0$ và $b_1$. Với $n = 2$ thì $df = 0$ —
   đường thẳng đi hoàn hảo qua 2 điểm, $R^2 = 1$, và không suy diễn được gì.</details>
3. $R^2 = 0{,}95$ có bảo đảm mô hình tuyến tính là phù hợp không?
   <details><summary>đáp</summary>
   Không. Dữ liệu cong nhẹ vẫn cho $R^2$ rất cao. Phải xem **đồ thị phần dư** — nếu
   phần dư có hình chữ U thì quan hệ là phi tuyến dù $R^2$ đẹp. Bộ tứ Anscombe là
   ví dụ kinh điển.</details>
