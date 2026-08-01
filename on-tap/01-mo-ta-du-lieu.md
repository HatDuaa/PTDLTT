# 01 — Phân tích mô tả dữ liệu (chương 3)

Mục lục chương: 3.1 Dữ liệu số · 3.2 Dữ liệu định danh · 3.3 Hệ số tương quan ·
3.4 Case study phân biệt đối xử theo giới tính.

## 1. Đo xu thế trung tâm

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

**Trung vị** — sắp tăng dần rồi lấy giá trị chia đôi dãy. $n$ lẻ thì lấy phần tử
giữa, $n$ chẵn thì lấy trung bình hai phần tử giữa.

**Tứ phân vị** — $Q_1$ là phân vị 25, $Q_3$ là phân vị 75.

$$IQR = Q_3 - Q_1$$

**Ngưỡng ngoại lệ** (râu của boxplot):

$$\text{trên} = Q_3 + 1{,}5 \times IQR \qquad \text{dưới} = Q_1 - 1{,}5 \times IQR$$

> Trung bình bị giá trị ngoại lệ kéo, trung vị thì không. Dữ liệu lệch (thu nhập,
> giá nhà) thì báo cáo trung vị. Đây là câu hỏi lý thuyết hay ra.

## 2. Phương sai và độ lệch chuẩn

$$s^2 = \frac{\sum_{i=1}^{n} (x_i - \bar{x})^2}{n - 1}
\qquad\qquad
s = \sqrt{s^2}$$

Ba điều dễ mất điểm:

- **Mẫu số là $n-1$, không phải $n$.** Chia cho $n$ là phương sai *quần thể*
  $\sigma^2$. Đề cho "một mẫu gồm 25 sinh viên" thì luôn là $n-1$.
- **Đơn vị.** $s^2$ mang đơn vị bình phương (giờ², đồng²) nên vô nghĩa khi diễn
  giải. $s$ mới cùng đơn vị với dữ liệu — đó là lý do tồn tại của $s$.
- **Bình phương độ lệch** làm hai việc cùng lúc: xoá dấu âm để hai quan sát cách
  đều trung bình có trọng số bằng nhau, và phạt nặng các độ lệch lớn.

### Bài mẫu 1 — tính tay

Dữ liệu: $2,\ 4,\ 4,\ 5,\ 7,\ 8$ với $n = 6$.

| $x_i$ | 2 | 4 | 4 | 5 | 7 | 8 | Σ |
|---|---|---|---|---|---|---|---|
| $x_i - \bar{x}$ | −3 | −1 | −1 | 0 | 2 | 3 | 0 |
| $(x_i - \bar{x})^2$ | 9 | 1 | 1 | 0 | 4 | 9 | **24** |

$\bar{x} = 30/6 = 5$

$$s^2 = \frac{24}{6-1} = 4{,}8 \qquad s = \sqrt{4{,}8} = 2{,}19$$

Cột "$x_i - \bar{x}$" phải cộng lại đúng bằng 0 — dùng nó để tự kiểm tra trước
khi bình phương. Sai trung bình thì cột này lộ ra ngay.

**Công thức tính nhanh** khi số xấu:

$$\sum (x_i - \bar{x})^2 = \sum x_i^2 - \frac{\left(\sum x_i\right)^2}{n}$$

Kiểm lại: $\sum x_i^2 = 4+16+16+25+49+64 = 174$, và $174 - 30^2/6 = 174 - 150 = 24$ ✓

## 3. Hệ số tương quan

### Pearson — quan hệ TUYẾN TÍNH

$$r = \frac{\sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})}{(n-1)\, s_x s_y}$$

Dạng tính tay gọn hơn, không cần tính $s_x, s_y$ trước:

$$r = \frac{S_{xy}}{\sqrt{S_{xx} \cdot S_{yy}}}
\quad\text{với}\quad
S_{xy} = \sum (x_i-\bar{x})(y_i-\bar{y}),\;
S_{xx} = \sum (x_i-\bar{x})^2,\;
S_{yy} = \sum (y_i-\bar{y})^2$$

Hai dạng bằng nhau vì $(n-1)s_x s_y = (n-1)\sqrt{\tfrac{S_{xx}}{n-1}}\sqrt{\tfrac{S_{yy}}{n-1}} = \sqrt{S_{xx}S_{yy}}$.
Dạng thứ hai luôn nhanh hơn khi làm bài — dùng nó.

### Spearman — quan hệ ĐƠN ĐIỆU

$$\rho = 1 - \frac{6 \sum d_i^2}{n(n^2 - 1)}$$

với $d_i$ là hiệu của **hạng** giữa hai biến.

Thực chất Spearman *chính là* Pearson tính trên hạng thay vì trên giá trị gốc.
Công thức $1 - 6\sum d^2 / n(n^2-1)$ là dạng rút gọn, và **chỉ đúng khi không có
hạng đồng (ties)**. Có ties thì hoặc chấp nhận sai số nhỏ, hoặc quay về tính
Pearson trên cột hạng.

### Kendall τ

$$\tau = \frac{\text{số cặp đồng hạng} - \text{số cặp nghịch hạng}}{n(n-1)/2}$$

Duyệt tất cả $\binom{n}{2}$ cặp; cặp $(i,j)$ là *đồng hạng* nếu $x$ và $y$ cùng
tăng hoặc cùng giảm, *nghịch hạng* nếu ngược chiều.

### Chọn cái nào

| | Pearson $r$ | Spearman $\rho$ |
|---|---|---|
| Đo | tuyến tính | đơn điệu (không cần thẳng) |
| Dữ liệu | định lượng | định lượng **hoặc thứ bậc** |
| Ngoại lệ | rất nhạy | bền |
| $y = x^3$ | $r < 1$ | $\rho = 1$ chính xác |
| $y = 2x + 5$ | $r = 1$ | $\rho = 1$ |

Nhớ một câu: **Pearson hỏi "có thẳng không", Spearman hỏi "có cùng chiều không".**

### Bài mẫu 2 — tính cả hai trên cùng dữ liệu

| $x$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $y$ | 2 | 4 | 5 | 4 | 9 |

$\bar{x} = 3$, $\bar{y} = 24/5 = 4{,}8$

| | $x-\bar x$ | $y-\bar y$ | tích | $(x-\bar x)^2$ | $(y-\bar y)^2$ |
|---|---|---|---|---|---|
| | −2 | −2,8 | 5,6 | 4 | 7,84 |
| | −1 | −0,8 | 0,8 | 1 | 0,64 |
| | 0 | 0,2 | 0,0 | 0 | 0,04 |
| | 1 | −0,8 | −0,8 | 1 | 0,64 |
| | 2 | 4,2 | 8,4 | 4 | 17,64 |
| **Σ** | 0 | 0 | **14,0** | **10** | **26,8** |

$$r = \frac{14}{\sqrt{10 \times 26{,}8}} = \frac{14}{\sqrt{268}} = \frac{14}{16{,}37} = 0{,}855$$

**Spearman.** Hạng của $x$: $1,2,3,4,5$. Hạng của $y$: dãy sắp là $2,4,4,5,9$ nên
$y=2 \to 1$; hai giá trị $y=4$ chia nhau hạng 2 và 3 nên **cùng nhận 2,5**;
$y=5 \to 4$; $y=9 \to 5$.

| hạng $x$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| hạng $y$ | 1 | 2,5 | 4 | 2,5 | 5 |
| $d$ | 0 | −0,5 | −1 | 1,5 | 0 |
| $d^2$ | 0 | 0,25 | 1 | 2,25 | 0 |

$\sum d^2 = 3{,}5$

$$\rho = 1 - \frac{6 \times 3{,}5}{5(25-1)} = 1 - \frac{21}{120} = 0{,}825$$

Ở đây có ties nên con số 0,825 là xấp xỉ. Nếu đề bảo "tính chính xác", phải chạy
Pearson trên hai cột hạng.

## 4. Dữ liệu định danh (3.2)

Bảng chéo (contingency table) với tần suất, tần suất tương đối theo hàng và theo
cột. Điểm hay bị hỏi: **tần suất theo hàng và theo cột trả lời hai câu hỏi khác
nhau**, chọn sai chiều là diễn giải sai.

Case study 3.4 (phân biệt đối xử theo giới tính) là bản mở màn cho nghịch lý
Simpson ở chương 8 — xem [file 05](05-phan-tich-nhan-qua.md).

## Tự kiểm tra

1. Nhân mọi $x_i$ với 3. $s^2$, $s$, $r$ thay đổi thế nào?
   <details><summary>đáp</summary>
   $s^2 \times 9$, $s \times 3$, $r$ **không đổi**. Pearson bất biến với mọi phép
   biến đổi tuyến tính hệ số dương, đó là lý do nó không có đơn vị.</details>
2. $r = 0$ có suy ra hai biến độc lập không?
   <details><summary>đáp</summary>
   Không. $y = x^2$ với $x$ đối xứng quanh 0 cho $r = 0$ nhưng $y$ hoàn toàn xác
   định bởi $x$. $r=0$ chỉ nói "không có thành phần tuyến tính".</details>
3. Vì sao chia $n-1$ chứ không phải $n$?
   <details><summary>đáp</summary>
   Vì $\bar{x}$ tính từ chính mẫu đó, các độ lệch bị ràng buộc $\sum(x_i-\bar x)=0$
   nên chỉ còn $n-1$ giá trị tự do. Chia $n$ sẽ ước lượng thấp hơn $\sigma^2$ một
   cách hệ thống.</details>
