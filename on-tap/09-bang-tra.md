# 09 — Bảng tra công thức

In ra một mặt giấy là đủ dùng. Mỗi công thức có link về file giải thích.

## Bảng giá trị tới hạn

| Độ tin cậy / $\alpha$ | 90% / 0,10 | 95% / 0,05 | 98% / 0,02 | 99% / 0,01 |
|---|---|---|---|---|
| $z^{*}$ (hai phía) | 1,645 | **1,96** | 2,33 | 2,576 |
| $z_\alpha$ (một phía) | 1,282 | **1,645** | 2,054 | 2,326 |

$t^{*}_{0{,}025}$ theo $df$: 3 → 3,182 · 5 → 2,571 · 10 → 2,228 · 20 → 2,086 ·
25 → 2,060 · 30 → 2,042 · ∞ → 1,96

$\chi^2_{0{,}05}$ theo $df$: 1 → 3,841 · 2 → 5,991 · 3 → 7,815 · 4 → 9,488

## [Mô tả dữ liệu](01-mo-ta-du-lieu.md)

$$s^2 = \frac{\sum(x_i-\bar x)^2}{n-1} \qquad s = \sqrt{s^2} \qquad IQR = Q_3 - Q_1$$

$$\text{ngoại lệ: } Q_3 + 1{,}5\,IQR \;\text{ hoặc }\; Q_1 - 1{,}5\,IQR$$

$$r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}} \qquad
\rho_{\text{Spearman}} = 1 - \frac{6\sum d_i^2}{n(n^2-1)}$$

$$\sum(x_i-\bar x)^2 = \sum x_i^2 - \frac{(\sum x_i)^2}{n} \quad \text{(tính nhanh)}$$

## [Khoảng tin cậy](02-khoang-tin-cay.md)

$$\text{ước lượng điểm} \pm z^{*} \times SE$$

| Tham số | Khoảng tin cậy |
|---|---|
| Tỉ lệ $p$ | $\hat p \pm z^{*}\sqrt{\dfrac{\hat p(1-\hat p)}{n}}$ |
| Trung bình, biết $\sigma$ | $\bar x \pm z^{*}\dfrac{\sigma}{\sqrt n}$ |
| Trung bình, không biết $\sigma$ | $\bar x \pm t^{*}_{n-1}\dfrac{s}{\sqrt n}$ |
| Hệ số góc | $b_1 \pm t^{*}_{n-2}\,SE_{b_1}$ |

$$n \ge \frac{(z^{*})^2 p(1-p)}{ME^2} \quad (\text{chưa biết } p \to \text{lấy } 0{,}5)$$

Điều kiện CLT cho tỉ lệ: $np \ge 10$ **và** $n(1-p) \ge 10$

## [Kiểm định](03-kiem-dinh-gia-thuyet.md)

| Bài toán | Thống kê | $df$ |
|---|---|---|
| 1 trung bình, biết $\sigma$ | $z = \dfrac{\bar x - \mu_0}{\sigma/\sqrt n}$ | — |
| 1 trung bình, không biết $\sigma$ | $t = \dfrac{\bar x - \mu_0}{s/\sqrt n}$ | $n-1$ |
| 1 phương sai | $q = \dfrac{(n-1)s^2}{\sigma_0^2}$ | $n-1$ |
| 1 tỉ lệ | $z = \dfrac{\hat p - p_0}{\sqrt{p_0(1-p_0)/n}}$ | — |
| 2 trung bình, $\sigma$ bằng nhau | $t = \dfrac{\bar x_1-\bar x_2}{\sqrt{s_p^2(1/n_1+1/n_2)}}$ | $n_1+n_2-2$ |
| 2 trung bình, $n>30$ | $z = \dfrac{\bar x_1-\bar x_2}{\sqrt{s_1^2/n_1+s_2^2/n_2}}$ | — |
| 2 phương sai | $f = \dfrac{s_1^2}{s_2^2}$ | $n_1-1,\,n_2-1$ |
| 2 tỉ lệ | $z = \dfrac{\hat p_1-\hat p_2}{\sqrt{\bar p(1-\bar p)(1/n_1+1/n_2)}}$ | — |
| Độc lập (bảng chéo) | $q = \sum\dfrac{(O-E)^2}{E}$ | $(h-1)(k-1)$ |
| Jarque–Bera | $q = n\left(\dfrac{\text{skew}^2}{6}+\dfrac{\text{kurt}^2}{24}\right)$ | 2 |
| Kolmogorov–Smirnov | $d = \max\lvert F_o - F_m\rvert$ | — |

$$s_p^2 = \frac{(n_1-1)s_1^2+(n_2-1)s_2^2}{n_1+n_2-2}
\qquad
\bar p = \frac{n_1\hat p_1+n_2\hat p_2}{n_1+n_2}
\qquad
E_{ij} = \frac{\text{hàng}_i \times \text{cột}_j}{n}$$

Bác bỏ khi **p-value $< \alpha$**, hoặc thống kê rơi vào miền bác bỏ.
Hai phía dùng $\alpha/2$.

## [Mô hình đồ thị](04-mo-hinh-do-thi.md)

| Cấu trúc | Vai trò | Chưa điều kiện | Điều kiện |
|---|---|---|---|
| $X \to Z \to Y$ | trung gian | mở | **chặn** |
| $X \leftarrow Z \to Y$ | gây nhiễu | mở | **chặn** |
| $X \to Z \leftarrow Y$ | hội tụ | **chặn** | **mở** ⚠️ |

$$p(x_1,\ldots,x_n) = \prod_i p(x_i \mid pa(x_i))$$

Kiểm soát **gây nhiễu**. Không kiểm soát **trung gian**, **hội tụ**, hậu duệ hội tụ.

## [Nhân quả](05-phan-tich-nhan-qua.md)

$$ATE = \mathbb{E}[Y(1)] - \mathbb{E}[Y(0)]$$

$$\underbrace{\mathbb{E}[Y|T{=}1] - \mathbb{E}[Y|T{=}0]}_{\text{đo được}}
= ATT + \underbrace{\mathbb{E}[Y(0)|T{=}1] - \mathbb{E}[Y(0)|T{=}0]}_{\text{chệch chọn lọc}}$$

RCT → chệch $= 0$ → liên hệ = nhân quả.

Simpson = bẫy **gây nhiễu**. Berkson = bẫy **hội tụ**.

## [Hồi quy tuyến tính](06-hoi-quy-tuyen-tinh.md)

$$b_1 = \frac{s_y}{s_x}R = \frac{S_{xy}}{S_{xx}} \qquad b_0 = \bar y - b_1\bar x$$

$$R^2 = (\text{hệ số tương quan})^2 = 1 - \frac{SS_{\text{Error}}}{SS_{\text{Total}}}
\qquad e_i = y_i - \hat y_i$$

$$s_e = \sqrt{\frac{SS_{\text{Error}}}{n-2}} \qquad
SE_{b_1} = \frac{s_e}{\sqrt{S_{xx}}} \qquad
T = \frac{b_1 - 0}{SE_{b_1}},\; df = n-2$$

Đường luôn qua $(\bar x, \bar y)$ · $\sum e_i = 0$ · $b_1$ cùng dấu $R$

## [Hồi quy đa biến](07-hoi-quy-da-bien.md)

$$R^2_{adj} = 1 - \left(\frac{SS_{\text{Error}}}{SS_{\text{Total}}}\cdot\frac{n-1}{n-p-1}\right)$$

$$\text{odds} = \frac{p}{1-p} \qquad
\text{logit}(p) = \log\frac{p}{1-p} \qquad
p = \frac{e^{\eta}}{1+e^{\eta}}$$

Ba bước logistic: **logit → odds ($e^{\text{logit}}$) → xác suất ($\frac{o}{1+o}$)**

$e^{\beta_j}$ = tỉ số odds · biến $k$ mức → $k-1$ dummy · mốc không tác dụng là $OR = 1$

$$\text{Sens} = \frac{TP}{TP+FN} \qquad \text{Spec} = \frac{TN}{FP+TN}$$

## [Monte Carlo](08-monte-carlo.md)

$$x_i = (a x_{i-1} + c) \bmod m
\qquad
\int_a^b f \approx (b-a)\overline{f(u)}
\qquad
SE = \frac{\sigma_f}{\sqrt n}$$

Box–Muller: $\theta = 2\pi u_1$, $r = \sqrt{-2\ln u_2}$, lấy $r\cos\theta$, $r\sin\theta$

Chấp nhận–bác bỏ: sinh $x \sim q$, nhận nếu $u < p(x)$ với $u \sim \mathcal U(0, Mq(x))$; hiệu suất $1/M$

Lấy mẫu quan trọng: $\mathbb{E}_p[f] = \mathbb{E}_q\!\left[f\frac{p}{q}\right]$

Bootstrap: rút **có hoàn lại** đúng $n$, lặp $B$ lần; mỗi vòng chứa ~**63,2%** món riêng biệt

Giảm sai số một nửa → tăng $n$ **gấp bốn**

---

## Sáu câu dễ mất điểm nhất

1. p-value **không phải** xác suất $H_0$ đúng.
2. Không viết "chấp nhận $H_0$" — viết "**chưa đủ bằng chứng để bác bỏ**".
3. Phương sai mẫu chia $n-1$; hồi quy dùng $df = n-2$.
4. Kiểm định 1 tỉ lệ dùng $p_0$ ở mẫu số, dựng CI dùng $\hat p$.
5. Hồi quy trên dữ liệu quan sát → viết "**đi kèm**", không viết "**làm cho**".
6. Điều kiện hoá **collider** tạo ra liên hệ giả — thêm biến kiểm soát không phải
   lúc nào cũng an toàn hơn.
