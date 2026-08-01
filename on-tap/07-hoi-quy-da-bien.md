# 07 — Hồi quy đa biến và hồi quy logistic (chương 10)

Mục lục chương: 10.1 Giới thiệu hồi quy đa biến · 10.2 Lựa chọn mô hình ·
10.3 Kiểm tra điều kiện bằng đồ thị · 10.4 Hồi quy logistic.

## PHẦN A — HỒI QUY ĐA BIẾN

## 1. Mô hình

$$\hat{y} = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p$$

**Diễn giải $\beta_j$:** khi $x_j$ tăng 1 đơn vị và **giữ nguyên mọi biến còn lại**,
$\hat y$ thay đổi $\beta_j$ đơn vị.

Cụm "giữ nguyên mọi biến còn lại" là toàn bộ khác biệt so với hồi quy đơn. Bỏ cụm
đó khi làm bài là **mất điểm diễn giải**. Cùng một biến, hệ số trong mô hình đơn và
mô hình đa biến có thể khác nhau, thậm chí đổi dấu.

## 2. Phân rã tổng bình phương

$$SS_{\text{Total}} = \sum(y - \bar y)^2 \qquad
SS_{\text{Error}} = \sum e_i^2 \qquad
SS_{\text{Model}} = SS_{\text{Total}} - SS_{\text{Error}}$$

$$R^2 = \frac{SS_{\text{Model}}}{SS_{\text{Total}}}$$

$$R^2_{adj} = 1 - \left(\frac{SS_{\text{Error}}}{SS_{\text{Total}}} \times \frac{n-1}{n-p-1}\right)$$

với $n$ = số quan sát, $p$ = số biến dự báo.

**Vì sao cần $R^2_{adj}$:** $R^2$ **không bao giờ giảm** khi thêm biến, kể cả biến
rác hoàn toàn. Nên $R^2$ vô dụng để so sánh mô hình khác số biến. $R^2_{adj}$ phạt
theo $p$, nên **có thể giảm** — đó là tính năng, không phải lỗi.

> So mô hình khác số biến → dùng $R^2_{adj}$. Báo cáo mức khớp của một mô hình →
> dùng $R^2$.

### Bài mẫu 1 — tính $R^2$ và $R^2_{adj}$

Mô hình nghèo đói theo `female_house`, $n = 51$ bang, $p = 1$:

$SS_{\text{Total}} = 480{,}25$ · $SS_{\text{Model}} = 132{,}57$ · $SS_{\text{Error}} = 347{,}68$

$$R^2 = \frac{132{,}57}{480{,}25} = 0{,}276 \approx 0{,}28$$

$$R^2_{adj} = 1 - \left(\frac{347{,}68}{480{,}25} \times \frac{50}{49}\right)
= 1 - (0{,}7240 \times 1{,}0204) = 1 - 0{,}7387 = 0{,}261 \approx 0{,}26$$

## 3. Biến định tính (dummy)

Biến $k$ mức → tạo $k-1$ biến chỉ báo. Mức bị bỏ ra là **mức tham chiếu**, và hệ
số chặn đại diện cho nó.

### Bài mẫu 2 — vùng miền

Đặt $y$ = % dân số nghèo:

$$\hat{y} = 9{,}50 + 0{,}03\,\text{midwest} + 1{,}79\,\text{west} + 4{,}16\,\text{south}$$

| | Ước lượng | $p$ |
|---|---|---|
| (Chặn) — *northeast* | 9,50 | 0,00 |
| midwest | 0,03 | 0,98 |
| west | 1,79 | 0,12 |
| south | **4,16** | **0,00** |

Bốn vùng → ba biến dummy. **Northeast là mức tham chiếu**, mức nghèo trung bình
9,50%.

Đọc: miền Nam nghèo hơn Đông Bắc **4,16 điểm phần trăm**, và chênh lệch này có ý
nghĩa thống kê ($p = 0{,}00$). Midwest chênh 0,03 — về cơ bản là như nhau.

> **Mọi hệ số dummy đều so với mức tham chiếu, không so với trung bình chung.**
> Muốn so midwest với south thì lấy hiệu $4{,}16 - 0{,}03 = 4{,}13$.

### Bài mẫu 3 — dummy + biến liên tục

Đặt $y$ = cân nặng (gam), $V$ = thể tích (cm³), $B = 1$ nếu bìa mềm và $0$ nếu bìa
cứng:

$$\hat{y} = 197{,}96 + 0{,}72\,V - 184{,}05\,B$$

Tách thành hai đường **song song**:

- Bìa cứng (tham chiếu, $B = 0$): $\hat y = 197{,}96 + 0{,}72\,V$
- Bìa mềm ($B = 1$): $\hat y = 13{,}91 + 0{,}72\,V$

Cùng hệ số góc 0,72 (mỗi cm³ thêm 0,72 gam), khác hệ số chặn 184,05 gam.

Muốn hai đường **khác hệ số góc** thì phải thêm số hạng tương tác $V \times B$.

### Bài mẫu 4 — nhiều biến hỗn hợp

Điểm kiểm tra của trẻ:

| Biến | Ước lượng | SE | $t$ | $p$ |
|---|---|---|---|---|
| (Chặn) | 19,59 | 9,22 | 2,13 | 0,03 |
| mom_hs: có | 5,09 | 2,31 | 2,20 | 0,03 |
| mom_iq | 0,56 | 0,06 | 9,26 | 0,00 |
| mom_work: có | 2,54 | 2,35 | 1,08 | 0,28 |
| mom_age | 0,22 | 0,33 | 0,66 | 0,51 |

Đọc `mom_iq`: mỗi điểm IQ của mẹ đi kèm điểm con cao hơn **0,56**, giữ nguyên
trình độ học vấn, tình trạng việc làm và tuổi của mẹ.

Hai biến `mom_work` và `mom_age` có $p$ lớn → ứng viên loại bỏ ở bước chọn mô hình.

## 4. Lựa chọn mô hình (10.2)

**Loại lùi (backward elimination)** — thường dùng hơn:

1. Bắt đầu từ mô hình **đầy đủ**.
2. Bỏ biến có $p$-value **cao nhất** (hoặc biến mà bỏ đi làm $R^2_{adj}$ **tăng**
   nhiều nhất).
3. Khớp lại, lặp cho tới khi không cải thiện được nữa.

**Chọn tiến (forward selection):**

1. Khớp hồi quy đơn cho **từng** biến dự báo.
2. Thêm biến có $p$-value **nhỏ nhất**.
3. Lặp, mỗi lần thêm một biến.

Hai cách **không nhất thiết cho cùng kết quả**. Nếu đề yêu cầu, phải nói rõ đang
dùng tiêu chí gì ($p$-value hay $R^2_{adj}$).

## 5. Đa cộng tuyến

Ví dụ trong book:

| Mô hình | $R^2$ | $R^2_{adj}$ |
|---|---|---|
| nghèo ~ female_house | 0,28 | 0,26 |
| nghèo ~ female_house + white | 0,29 | **0,26** |

Thêm `white` làm $R^2$ nhích lên 0,01 nhưng $R^2_{adj}$ **đứng yên** → biến mới
gần như không mang thông tin mới, vì nó tương quan với biến đã có.

Hậu quả của đa cộng tuyến: **sai số chuẩn phình to**, hệ số bất ổn định, có thể
đổi dấu khi thêm/bớt dữ liệu. Ưu tiên mô hình gọn.

## 6. Bốn điều kiện chẩn đoán (10.3)

1. Phần dư xấp xỉ chuẩn — histogram / Q-Q plot
2. Phương sai không đổi — đồ thị phần dư theo $\hat y$
3. Phần dư độc lập — đồ thị phần dư theo thứ tự quan sát
4. Quan hệ tuyến tính giữa **từng** biến dự báo và kết quả — đồ thị phần dư theo
   từng $x_j$

---

## PHẦN B — HỒI QUY LOGISTIC (10.4)

Dùng khi $y$ là **nhị phân** (0/1). Hồi quy tuyến tính không dùng được vì nó có thể
dự đoán $\hat y < 0$ hoặc $> 1$.

## 7. Odds và logit

$$\text{odds}(E) = \frac{P(E)}{1 - P(E)}$$

$$\text{logit}(p) = \log\!\left(\frac{p}{1-p}\right), \qquad 0 \le p \le 1$$

**Hàm logistic** — nghịch đảo của logit:

$$g^{-1}(x) = \frac{1}{1 + \exp(-x)}$$

Logit kéo $p \in [0,1]$ ra thành $(-\infty, +\infty)$ — nhờ vậy mới đặt được mô
hình tuyến tính lên.

## 8. Mô hình

$$p_i = \frac{\exp(\beta_0 + \beta_1 x_{1,i} + \cdots + \beta_n x_{n,i})}
{1 + \exp(\beta_0 + \beta_1 x_{1,i} + \cdots + \beta_n x_{n,i})}$$

Tương đương và dễ dùng hơn khi làm bài:

$$\log\!\left(\frac{p}{1-p}\right) = \beta_0 + \beta_1 x_1 + \cdots + \beta_n x_n$$

**Diễn giải hệ số:**

| Đại lượng | Ý nghĩa |
|---|---|
| $\beta_j$ | thay đổi **log-odds** khi $x_j$ tăng 1 |
| $e^{\beta_j}$ | **tỉ số odds** — odds nhân với chừng đó |
| $e^{\beta_j} > 1$ | $x_j$ làm tăng khả năng |
| $e^{\beta_j} < 1$ | $x_j$ làm giảm khả năng |

> **Tỉ số odds không phải tỉ số nguy cơ (risk ratio).** Chúng chỉ gần nhau khi
> biến cố hiếm. Đây là bẫy diễn giải hay ra thi.

## 9. Bài mẫu 5 — đoàn Donner (tính đủ 3 bước)

| Hệ số | Ước lượng | SE | $z$ | $p$ |
|---|---|---|---|---|
| (Chặn) | 1,8185 | 0,9994 | 1,82 | 0,0688 |
| Age | −0,0665 | 0,0322 | −2,06 | 0,0391 |

$$\log\!\left(\frac{p}{1-p}\right) = 1{,}8185 - 0{,}0665 \times \text{Age}$$

**Người 25 tuổi:**

$$\text{logit} = 1{,}8185 - 0{,}0665(25) = 1{,}8185 - 1{,}6625 = 0{,}1560$$

$$\frac{p}{1-p} = e^{0{,}1560} = 1{,}169
\qquad
p = \frac{1{,}169}{1 + 1{,}169} = \frac{1{,}169}{2{,}169} = \mathbf{0{,}539}$$

**Người 50 tuổi:**

$$\text{logit} = 1{,}8185 - 0{,}0665(50) = -1{,}5065$$

$$\frac{p}{1-p} = e^{-1{,}5065} = 0{,}2217
\qquad
p = \frac{0{,}2217}{1{,}2217} = \mathbf{0{,}181}$$

**Tỉ số odds theo tuổi:** $e^{-0{,}0665} = 0{,}936$ → mỗi năm tuổi, odds sống sót
**nhân 0,936**, tức giảm khoảng 6,4%.

Ba bước cần nhớ: **logit → odds ($e^{\text{logit}}$) → xác suất
($\frac{\text{odds}}{1+\text{odds}}$).** Nhảy tắt là sai.

## 10. Bài mẫu 6 — thêm biến định tính

| Hệ số | Ước lượng | SE | $z$ | $p$ |
|---|---|---|---|---|
| (Chặn) | 1,6331 | 1,1102 | 1,47 | 0,1413 |
| Age | −0,0782 | 0,0373 | −2,10 | 0,0359 |
| SexFemale | **1,5973** | 0,7555 | 2,11 | 0,0345 |

$$e^{1{,}5973} = 4{,}94$$

Đọc: **giữ nguyên tuổi**, odds sống sót của nữ cao gấp khoảng **4,9 lần** nam.

> Đừng viết "nữ có xác suất sống cao gấp 5 lần nam". Gấp 5 lần là **odds**, không
> phải xác suất.

Ví dụ chim và ung thư phổi trong book cũng cùng dạng: $e^{1{,}3626} = 3{,}91$
(nuôi chim), $e^{0{,}0729} = 1{,}08$ (mỗi năm hút thuốc).

## 11. Độ nhạy, độ đặc hiệu và ngưỡng

$$\text{Sensitivity} = \frac{TP}{TP + FN}
\qquad
\text{Specificity} = \frac{TN}{FP + TN}$$

- **Sensitivity** (độ nhạy) = trong số ca **thật sự dương**, bắt được bao nhiêu.
- **Specificity** (độ đặc hiệu) = trong số ca **thật sự âm**, loại đúng bao nhiêu.

Đổi ngưỡng phân loại thì **hai chỉ số đi ngược chiều nhau**. Không có ngưỡng "đúng"
về mặt toán học — chọn ngưỡng là quyết định **kinh doanh**, phụ thuộc vào cái giá
của mỗi loại sai.

### Bài mẫu 7 — lọc thư rác, ngưỡng 0,75

$TP = 27$, $TN = 3545$, $FP = 9$, $FN = 340$

$$\text{Sensitivity} = \frac{27}{27 + 340} = 0{,}073
\qquad
\text{Specificity} = \frac{3545}{9 + 3545} = 0{,}997$$

Bắt được có 7,3% thư rác, nhưng gần như không bao giờ chặn nhầm thư thật. Với lọc
thư rác đó là đánh đổi **hợp lý** — chặn nhầm một email quan trọng tệ hơn nhiều so
với để lọt một thư rác.

**Hàm tiện ích** lượng hoá đúng cái đánh đổi đó:

$$U = TP - 50 \times FP - 5 \times FN$$

$$U(0{,}75) = 27 + 3545 - 50(9) - 5(340) = 3572 - 450 - 1700 = 1422$$

Trọng số 50 và 5 nói rằng một lần chặn nhầm tệ gấp 10 lần một lần để lọt.

### Bài mẫu 8 — Bayes với độ nhạy/đặc hiệu

*Lupus: tỉ lệ mắc 2%, độ nhạy 0,98, độ đặc hiệu 0,74. Xét nghiệm dương tính thì
xác suất thật sự mắc là bao nhiêu?*

Ký hiệu: $B$ = có bệnh, $\bar{B}$ = không bệnh, $+$ = xét nghiệm dương tính.

$$P(B \cap +) = 0{,}02 \times 0{,}98 = 0{,}0196$$

$$P(\bar{B} \cap +) = 0{,}98 \times (1 - 0{,}74) = 0{,}98 \times 0{,}26 = 0{,}2548$$

$$P(B \mid +) = \frac{0{,}0196}{0{,}0196 + 0{,}2548} = \frac{0{,}0196}{0{,}2744} = \mathbf{0{,}0714}$$

Xét nghiệm rất nhạy (98%) nhưng dương tính chỉ cho **7%** khả năng mắc bệnh thật.
Nguyên nhân: bệnh hiếm nên nhóm không bệnh đông tới mức 26% dương tính giả của họ
vẫn áp đảo. **Tỉ lệ nền quyết định tất cả** — đây là câu hỏi lý thuyết kinh điển.

## Tự kiểm tra

1. Thêm một biến hoàn toàn ngẫu nhiên vào mô hình. $R^2$ và $R^2_{adj}$ thế nào?
   <details><summary>đáp</summary>
   $R^2$ **tăng** (hoặc đứng yên) — luôn luôn. $R^2_{adj}$ gần như chắc chắn
   **giảm** vì hình phạt $\frac{n-1}{n-p-1}$ lớn hơn phần $SS_{\text{Error}}$ giảm
   được.</details>
2. Hệ số logistic $\beta = 0$ nghĩa là gì?
   <details><summary>đáp</summary>
   $e^0 = 1$ → tỉ số odds bằng 1 → biến đó **không** đổi odds. Trong logistic, mốc
   "không tác dụng" là $OR = 1$, không phải 0.</details>
3. Biến 4 mức thì cần bao nhiêu dummy? Cho cả 4 vào được không?
   <details><summary>đáp</summary>
   Cần **3**. Cho cả 4 thì tổng của chúng luôn bằng 1, trùng với hệ số chặn → ma
   trận suy biến, không giải được. Đây gọi là bẫy biến giả (dummy variable trap).</details>
