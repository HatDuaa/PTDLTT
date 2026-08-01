# 01 — Phân tích mô tả dữ liệu (chương 3)

Mục lục chương: 3.1 Dữ liệu số · 3.2 Dữ liệu định danh · 3.3 Hệ số tương quan ·
3.4 Case study phân biệt đối xử theo giới tính.

## 1. Đo xu thế trung tâm

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

**Trung vị** — sắp tăng dần rồi lấy giá trị chia đôi dãy. $n$ lẻ thì lấy phần tử
giữa, $n$ chẵn thì lấy trung bình hai phần tử giữa.

**Tứ phân vị** — $Q_1$ là phân vị 25, $Q_3$ là phân vị 75.

$$IQR = Q_3 - Q_1$$

**Ngưỡng ngoại lệ** (râu của boxplot) — râu trên $= Q_3 + 1{,}5 \times IQR$, râu dưới
$= Q_1 - 1{,}5 \times IQR$.

> Trung bình bị giá trị ngoại lệ kéo, trung vị thì không. Dữ liệu lệch (thu nhập,
> giá nhà) thì báo cáo trung vị. Đây là câu hỏi lý thuyết hay ra.

**Thống kê bền (robust)** — book gọi tên riêng cặp **trung vị + IQR** vì chúng
kháng được ngoại lệ và dữ liệu lệch. Cặp không bền là **trung bình + độ lệch
chuẩn**. Đề hỏi "nên báo cáo cặp nào" thì trả lời theo hình dạng phân phối:

| Phân phối | Xu thế trung tâm | Độ phân tán |
|---|---|---|
| Đối xứng, không ngoại lệ | trung bình $\bar x$ | độ lệch chuẩn $s$ |
| Lệch, hoặc có ngoại lệ | **trung vị** | **IQR** |

## 1b. Hình dạng phân phối

Phần này của 3.1 không có công thức nhưng hay ra câu hỏi mô tả.

**Biểu đồ dùng cho dữ liệu số:** biểu đồ phân tán (hai biến số) · biểu đồ chấm ·
biểu đồ tần suất (histogram) · biểu đồ hộp (box plot).

**Độ rộng ô (bin width)** của histogram — chọn quá hẹp thì thấy nhiễu, quá rộng
thì mất chi tiết. Cùng một dữ liệu, đổi bin width có thể làm phân phối trông
một đỉnh hoặc hai đỉnh.

**Tính yếu vị (modality)** — đếm số đỉnh: một đỉnh (unimodal) · hai đỉnh
(bimodal) · nhiều đỉnh (multimodal) · đều (uniform, không đỉnh nào).

Hai đỉnh thường là dấu hiệu dữ liệu **trộn hai nhóm** — nên tách ra phân tích
riêng thay vì báo cáo một con số trung bình vô nghĩa nằm giữa hai đỉnh.

**Độ lệch (skewness)** — nhìn theo **đuôi dài**, không nhìn theo chỗ dồn cục:

| Hình dạng | Đuôi dài về | Quan hệ |
|---|---|---|
| Lệch phải (dương) | bên **phải** | trung bình **>** trung vị |
| Đối xứng | không | trung bình ≈ trung vị |
| Lệch trái (âm) | bên **trái** | trung bình **<** trung vị |

Nhớ bằng: **trung bình bị đuôi kéo về phía đuôi.** Thu nhập lệch phải nên thu
nhập trung bình luôn cao hơn trung vị.

> Độ lệch quay lại ở chương 6 trong kiểm định Jarque–Bera
> ($q = n(\text{skew}^2/6 + \text{kurt}^2/24)$) — phân phối chuẩn có độ lệch 0.
> Xem [file 03](03-kiem-dinh-gia-thuyet.md).

**Biến đổi log** — cách xử lý dữ liệu lệch phải mạnh. Lấy $\log x$ kéo đuôi phải
lại gần, làm phân phối đối xứng hơn, và biến quan hệ nhân thành quan hệ cộng.

Đây chính là lý do đồ án nhóm đo bằng

$$Y = 100 \times \log\!\left(\frac{P_1}{P_0}\right)$$

với $P_0$ là giá trước chính sách và $P_1$ là giá sau, thay vì lấy hiệu giá thô
$P_1 - P_0$: giá bán lẻ lệch phải mạnh (vài mặt hàng rất đắt), và ta quan tâm
**thay đổi bao nhiêu phần trăm** chứ không phải bao nhiêu đồng.

## 2. Phương sai và độ lệch chuẩn

$$s^2 = \frac{\sum_{i=1}^{n} (x_i - \bar{x})^2}{n - 1}
\qquad\qquad
s = \sqrt{s^2}$$

Ba điều dễ mất điểm:

- **Mẫu số là $n-1$, không phải $n$.** Chia cho $n$ (và dùng trung bình quần thể
  $\mu$) mới là phương sai quần thể $\sigma^2$. Đề nói "một **mẫu** gồm 25 sinh
  viên" thì luôn là $n-1$.
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

$$r = \frac{S_{xy}}{\sqrt{S_{xx} \cdot S_{yy}}}$$

$$S_{xy} = \sum (x_i-\bar{x})(y_i-\bar{y}) \qquad
S_{xx} = \sum (x_i-\bar{x})^2 \qquad
S_{yy} = \sum (y_i-\bar{y})^2$$

Hai dạng bằng nhau vì $(n-1)s_x s_y = (n-1)\sqrt{\tfrac{S_{xx}}{n-1}}\sqrt{\tfrac{S_{yy}}{n-1}} = \sqrt{S_{xx}S_{yy}}$.
Dạng thứ hai luôn nhanh hơn khi làm bài — dùng nó.

### Spearman — quan hệ ĐƠN ĐIỆU

$$\rho = 1 - \frac{6 \sum d_i^2}{n(n^2 - 1)}$$

với $d_i$ là hiệu của **hạng** giữa hai biến.

Thực chất Spearman *chính là* Pearson tính trên hạng thay vì trên giá trị gốc.
Công thức $1 - 6\sum d^2 / n(n^2-1)$ là dạng **rút gọn**, và **chỉ đúng khi không
có trùng hạng**. Có trùng hạng thì hoặc chấp nhận sai số nhỏ, hoặc quay về định
nghĩa gốc: tính Pearson trên hai cột hạng.

### Kendall τ

$$\tau = \frac{C - D}{n(n-1)/2}$$

với $C$ là số cặp **đồng hạng** và $D$ là số cặp **nghịch hạng**.

Duyệt tất cả $\binom{n}{2}$ cặp; cặp $(i,j)$ là *đồng hạng* nếu $x$ và $y$ cùng
tăng hoặc cùng giảm, *nghịch hạng* nếu ngược chiều.

> **Cẩn thận hai từ gần giống nhau.** "Đồng hạng" ở công thức Kendall nghĩa là
> **cùng chiều** (concordant), còn "**trùng hạng**" nghĩa là hai giá trị bằng nhau
> nên chia nhau một hạng (ties). Hai khái niệm khác hẳn nhau.

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

**Giá trị chính xác khi có trùng hạng.** Dữ liệu này có hai giá trị $y = 4$ chia
nhau hạng 2,5 nên công thức rút gọn chỉ là xấp xỉ. Chạy Pearson trên hai cột hạng:

hạng $x$ trung bình 3, hạng $y$ cũng trung bình 3 ($15/5$)

| $r_x - 3$ | −2 | −1 | 0 | 1 | 2 | Σ |
|---|---|---|---|---|---|---|
| $r_y - 3$ | −2 | −0,5 | 1 | −0,5 | 2 | 0 |
| tích | 4 | 0,5 | 0 | −0,5 | 4 | **8,0** |
| $(r_x-3)^2$ | 4 | 1 | 0 | 1 | 4 | **10** |
| $(r_y-3)^2$ | 4 | 0,25 | 1 | 0,25 | 4 | **9,5** |

$$\rho = \frac{8}{\sqrt{10 \times 9{,}5}} = \frac{8}{\sqrt{95}} = \frac{8}{9{,}747} = 0{,}8208$$

Chênh với 0,825 là **0,004** — nhỏ, nhưng nếu đề ghi "tính chính xác" thì phải ra
con số này. Dấu hiệu nhận biết: cột $(r_y - 3)^2$ cộng lại được **9,5** chứ không
phải 10; khi không có trùng hạng thì hai cột đó **luôn bằng nhau**, và đó đúng là
lúc công thức rút gọn khớp tuyệt đối.

**Kendall trên cùng dữ liệu.** Duyệt cả 10 cặp: 8 cặp đồng hạng, 1 cặp nghịch hạng
(cặp $x = 3,4$ vì $y$ giảm từ 5 xuống 4), 1 cặp trùng hạng ($y$ bằng nhau).

$$\tau = \frac{8 - 1}{5(4)/2} = \frac{7}{10} = 0{,}70$$

Ba hệ số cho ba con số khác nhau trên **cùng một dữ liệu**: $r = 0{,}855$,
$\rho = 0{,}821$, $\tau = 0{,}70$. Chúng đo ba thứ khác nhau nên không việc gì phải
bằng nhau — chỉ cần cùng dấu và cùng nói "quan hệ dương mạnh".

## 4. Dữ liệu định danh (3.2)

**Bảng ngẫu nhiên** (contingency table) — tóm tắt hai biến định tính bằng tần suất.

**Tỷ lệ hàng và tỷ lệ cột trả lời hai câu hỏi khác nhau.** Với bảng hút thuốc ×
bệnh phổi:

- tỷ lệ **hàng**: trong số người hút, bao nhiêu phần trăm mắc bệnh?
- tỷ lệ **cột**: trong số người mắc bệnh, bao nhiêu phần trăm có hút?

Chọn sai chiều là diễn giải sai hoàn toàn — cùng một bảng ra hai kết luận khác
nhau. Đây là cùng một bẫy với độ nhạy/độ đặc hiệu ở [file 07](07-hoi-quy-da-bien.md)
và với việc đảo ngược xác suất có điều kiện ở [file 03](03-kiem-dinh-gia-thuyet.md).

**Biểu đồ cho dữ liệu định tính:**

| Biểu đồ | Dùng khi |
|---|---|
| Cột (bar plot) | một biến, theo số đếm |
| Cột tần suất tương đối | một biến, theo tỷ lệ |
| Cột chồng (stacked) | hai biến, số đếm |
| Cột cạnh nhau (side-by-side) | hai biến, dễ so trực tiếp từng nhóm |
| Cột chồng chuẩn hoá | hai biến, so **tỷ lệ** khi các nhóm lệch cỡ nhau |
| Mosaic | hai biến, diện tích ô phản ánh cả cỡ nhóm lẫn tỷ lệ |
| Tròn (pie) | tỷ lệ tương đối — kém chính xác, chỉ dùng khi ít nhóm |
| Hộp cạnh nhau | một biến **số** so giữa các nhóm **định tính** |

Cột chồng chuẩn hoá là lựa chọn đúng khi hai nhóm **chênh lệch cỡ** — cột chồng
thường sẽ làm nhóm nhỏ trông như không có gì.

## 5. Case study 3.4 — phân biệt đối xử theo giới tính

Nghiên cứu năm 1972: **48 quản lý ngân hàng** đánh giá các hồ sơ **giống hệt nhau**,
giới tính được gán **ngẫu nhiên** (24 hồ sơ ghi nam, 24 ghi nữ). Tổng cộng 35 hồ sơ
được thăng chức.

| | Được thăng chức | Tỷ lệ |
|---|---|---|
| Nam | 21/24 | **87,5%** |
| Nữ | 14/24 | **58,3%** |
| **Chênh lệch** | | **29,2 điểm phần trăm** |

**Cách phân tích:** không dùng công thức nào cả, mà **mô phỏng**. Dưới giả thuyết
không ($H_0$: giới tính không ảnh hưởng), 35 lần thăng chức được chia ngẫu nhiên cho
48 hồ sơ — mô hình hoá bằng cách xáo bộ bài rồi chia. Lặp nhiều lần để xem chênh
lệch 29,2 điểm phần trăm có hay xuất hiện do may rủi không.

Vì sao case study này quan trọng hơn vẻ ngoài của nó — nó là **bản thu nhỏ của ba
chương sau**:

| Yếu tố | Nối tới |
|---|---|
| Hồ sơ giống hệt, giới tính gán **ngẫu nhiên** | RCT ở [chương 8](05-phan-tich-nhan-qua.md) — chính vì ngẫu nhiên hoá nên ở đây được phép nói **nhân quả** |
| Đặt $H_0$ rồi hỏi "chênh lệch này có do may rủi không" | kiểm định giả thuyết ở [chương 6](03-kiem-dinh-gia-thuyet.md) |
| Xáo bài mô phỏng thay vì tra bảng | Monte Carlo ở [chương 11](08-monte-carlo.md) |

> Đây **không** phải nghịch lý Simpson. Không có chuyện gộp nhóm làm đảo chiều kết
> luận — chỉ là một so sánh hai tỷ lệ, kiểm chứng bằng mô phỏng. Nghịch lý Simpson
> nằm ở [chương 8](05-phan-tich-nhan-qua.md).

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
4. Thu nhập một khu dân cư có trung bình 25 triệu, trung vị 18 triệu. Phân phối
   lệch chiều nào? Nên báo cáo con số nào?
   <details><summary>đáp</summary>
   Trung bình **>** trung vị → **lệch phải**, đuôi dài về phía thu nhập cao. Vài
   người rất giàu kéo trung bình lên. Báo cáo **trung vị 18 triệu** cùng với IQR,
   vì đó là cặp bền.</details>
5. Đổi bin width của histogram thì phân phối từ một đỉnh thành hai đỉnh. Cái nào đúng?
   <details><summary>đáp</summary>
   Không cái nào "đúng" tự thân — bin width là lựa chọn hiển thị, không phải tính
   chất của dữ liệu. Phải xem ở nhiều bin width; nếu hai đỉnh còn giữ qua nhiều lựa
   chọn thì mới có khả năng là dữ liệu trộn hai nhóm thật.</details>
6. Bảng: 100 người hút thì 30 mắc bệnh; 150 người không hút thì 20 mắc. Câu "trong
   số người mắc bệnh, 60% có hút" là tỷ lệ hàng hay tỷ lệ cột?
   <details><summary>đáp</summary>
   **Tỷ lệ cột** — mẫu số là tổng cột "mắc bệnh" ($30+20 = 50$), và $30/50 = 60\%$.
   Tỷ lệ hàng sẽ là $30/100 = 30\%$ người hút mắc bệnh. Hai con số, hai câu hỏi.</details>
