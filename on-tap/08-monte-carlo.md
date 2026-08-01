# 08 — Phương pháp mô phỏng Monte Carlo (chương 11)

Mục lục chương: 11.1 Một số khái niệm · 11.2 Mô hình hoá hệ thống ·
11.3 Phương pháp mô phỏng · 11.4 Phương pháp Monte Carlo · 11.5 Bài tập.

Chương này thiên về **mô tả thuật toán** hơn là tính tay. Đề hay hỏi: viết các bước
của một thuật toán, hoặc giải thích vì sao Monte Carlo hoạt động.

## 1. Khái niệm nền (11.1–11.2)

| Thuật ngữ | Định nghĩa theo book |
|---|---|
| **Đối tượng** | tất cả những sự vật, sự kiện mà hoạt động của con người có liên quan tới |
| **Hệ thống** | tập hợp các đối tượng mà giữa chúng có những mối quan hệ nhất định |
| **Trạng thái hệ thống** | tập hợp các tham số, biến số dùng để mô tả hệ thống tại một thời điểm |
| **Mô hình** | đối tượng thay thế, cho phép nghiên cứu bản gốc qua thực nghiệm |
| **Mô phỏng** | phương pháp mô hình hoá dựa trên xây dựng mô hình số và dùng phương pháp số để tìm lời giải |

## 2. Ba trụ cột của Monte Carlo (11.4)

### Trụ 1 — Số ngẫu nhiên

| Loại | Nguồn |
|---|---|
| **Số ngẫu nhiên thực** | hiện tượng vật lý (nhiễu nhiệt, phân rã phóng xạ) |
| **Số gần ngẫu nhiên** | dãy tất định phủ đều không gian (Sobol, Halton) |
| **Số giả ngẫu nhiên** | sinh bằng thuật toán tất định — thứ máy tính thật sự dùng |

**Bốn tiêu chí của một dãy tốt:** chu kỳ lặp dài · có xu hướng phân bố đều · các
giá trị độc lập thống kê · sinh nhanh.

Điểm hay bị hỏi: số giả ngẫu nhiên **hoàn toàn tất định** — cùng hạt giống thì cùng
dãy. Đó là **ưu điểm**, vì nó làm kết quả mô phỏng tái lập được.

### Trụ 2 — Luật số lớn

*"Khi ta chọn ngẫu nhiên các giá trị (mẫu thử) trong một dãy các giá trị (quần thể),
kích thước dãy mẫu thử càng lớn thì các đặc trưng thống kê của mẫu thử càng gần với
quần thể."*

Đây là lý do Monte Carlo **hội tụ** về đáp án đúng.

### Trụ 3 — Định lý giới hạn trung tâm

*"Trung bình số học của một lượng đủ lớn các phép lặp của các biến ngẫu nhiên độc
lập sẽ được xấp xỉ theo phân bố chuẩn."*

Đây là lý do ta **ước lượng được sai số** của kết quả mô phỏng.

> Luật số lớn nói *sẽ đúng*. Định lý giới hạn trung tâm nói *sai bao nhiêu*. Cần
> cả hai.

## 3. Bốn thành phần của một mô phỏng MC

1. **Hàm mật độ xác suất (PDF)** — hệ vật lý phải được mô tả bằng một bộ PDF
2. **Bộ sinh số ngẫu nhiên (RNG)** — sinh biến ngẫu nhiên theo PDF đã định
3. **Ghi điểm (scoring)** — gom kết quả vào các khoảng giá trị
4. **Ước lượng sai số** — tính phương sai qua các lần thử

Kỹ thuật tăng cường: **giảm phương sai**, **song song hoá và vector hoá**.

## 4. Bộ sinh đồng dư tuyến tính (LCG)

$$x_i = (a\,x_{i-1} + c) \bmod m$$

rồi chuẩn hoá $x_i / m$ để đưa về $[0,1)$.

Tham số book khuyến nghị: $m = 2^{32}$, $a = 1\,664\,525$, $c = 1\,013\,904\,223$.

### Bài mẫu 1 — chạy tay

$m = 16$, $a = 5$, $c = 3$, $x_0 = 7$:

| $i$ | tính | $x_i$ | $x_i/m$ |
|---|---|---|---|
| 1 | $(5 \cdot 7 + 3) \bmod 16 = 38 \bmod 16$ | 6 | 0,375 |
| 2 | $(5 \cdot 6 + 3) \bmod 16 = 33 \bmod 16$ | 1 | 0,0625 |
| 3 | $(5 \cdot 1 + 3) \bmod 16 = 8 \bmod 16$ | 8 | 0,500 |
| 4 | $(5 \cdot 8 + 3) \bmod 16 = 43 \bmod 16$ | 11 | 0,6875 |

Chu kỳ tối đa là $m = 16$ — sau nhiều nhất 16 bước dãy phải lặp lại. Đó là lý do
$m$ thực tế lấy $2^{32}$ trở lên.

## 5. Sinh biến ngẫu nhiên

### 5.1 Box–Muller — sinh $\mathcal{N}(0,1)$

1. Sinh $u_1, u_2 \sim \mathcal{U}(0,1)$
2. Tính $\theta = 2\pi u_1$ và $r = \sqrt{-2\ln u_2}$
3. Trả về $x = r\cos\theta$ và $y = r\sin\theta$ — **hai** biến chuẩn chuẩn tắc
   **độc lập**

Muốn $\mathcal{N}(\mu, \sigma^2)$ thì lấy $\mu + \sigma x$.

### 5.2 Biến đổi nghịch đảo

**Nguyên lý:** nếu $F$ là hàm phân phối tích luỹ và $u \sim \mathcal{U}(0,1)$ thì
$X = F^{-1}(u)$ có phân phối $F$.

**Trường hợp rời rạc:** sinh $u$, chọn $X = x_i$ nếu
$F(x_{i-1}) \le u < F(x_i)$.

**Trường hợp liên tục:** giải phương trình $F(x) = u$ theo $x$.

*Ví dụ mũ:* $F(x) = 1 - e^{-\lambda x}$. Giải $u = 1 - e^{-\lambda x}$ được
$x = -\dfrac{\ln(1-u)}{\lambda}$.

### 5.3 Sinh Poisson

$$p_i = P(X = i) = \frac{\lambda^i}{i!}e^{-\lambda}, \quad i = 0,1,\ldots$$

Thuật toán:

1. Sinh $u \sim \mathcal{U}(0,1)$
2. Khởi tạo $i = 0$, $\alpha = e^{-\lambda}$, $F = \alpha$
3. Nếu $u < F$: chọn $X = i$, dừng
4. Ngược lại: $i \leftarrow i+1$, $\alpha \leftarrow \dfrac{\lambda\alpha}{i}$,
   $F \leftarrow F + \alpha$, quay lại bước 3

Mẹo hay của thuật toán: không tính lại $\frac{\lambda^i}{i!}e^{-\lambda}$ từ đầu mỗi
vòng, mà cập nhật $\alpha$ theo quan hệ truy hồi $p_i = \frac{\lambda}{i}p_{i-1}$ —
tránh tràn số ở $i!$.

### 5.4 Chấp nhận – bác bỏ (acceptance–rejection)

Cho $p(x)$ là phân phối đích (khó lấy mẫu), $q(x)$ dễ lấy mẫu, và hằng số $M$ sao
cho $p(x) \le M q(x)$ với **mọi** $x$.

1. Sinh $x \sim q(x)$
2. Sinh $u \sim \mathcal{U}(0,\, Mq(x))$
3. **Chấp nhận** $x$ nếu $u < p(x)$, ngược lại **bác bỏ** và làm lại

Hiệu suất $= 1/M$. $M$ càng gần 1, tức $q$ càng giống $p$, càng ít lần bác bỏ. Chọn
$q$ dở thì thuật toán chạy rất lâu.

### 5.5 Lấy mẫu quan trọng (importance sampling)

$$\mathbb{E}_{x \sim p}[f(x)] = \int f(x)p(x)\,dx
= \int f(x)\frac{p(x)}{q(x)}q(x)\,dx
= \mathbb{E}_{x \sim q}\!\left[f(x)\frac{p(x)}{q(x)}\right]$$

Lấy mẫu từ $q$ nhưng vẫn tính đúng kỳ vọng dưới $p$, nhờ **trọng số**
$w(x) = p(x)/q(x)$.

Dùng khi biến cố cần đo **hiếm** dưới $p$: lấy mẫu từ $q$ tập trung vào vùng hiếm
đó, rồi bù bằng trọng số. Là một kỹ thuật giảm phương sai.

## 6. Tích phân Monte Carlo

$$I = \int_a^b f(x)\,dx \;\approx\; (b-a)\cdot\frac{1}{n}\sum_{i=1}^{n} f(u_i),
\qquad u_i \sim \mathcal{U}(a,b)$$

**Sai số:**

$$SE = \frac{\sigma_f}{\sqrt{n}}$$

> **Hệ quả quan trọng nhất của cả chương:** sai số giảm theo $1/\sqrt{n}$, **không
> phụ thuộc số chiều**. Cầu phương truyền thống cần $n^d$ điểm với $d$ chiều; Monte
> Carlo thì không. Đó là lý do MC thống trị ở bài toán nhiều chiều. Đổi lại, ở 1
> chiều nó **thua** hình thang.
>
> Muốn giảm sai số một nửa → tăng $n$ **gấp bốn**.

### Bài mẫu 2 — ước lượng $\pi$

Sinh ngẫu nhiên các điểm trong hình vuông, đếm điểm rơi vào đường tròn nội tiếp:

$$\pi \approx 4 \times \frac{k}{n}$$

với $n$ là tổng số điểm sinh ra trong hình vuông và $k$ là số điểm rơi vào đường tròn.

Vì sao có số 4: hình vuông cạnh 2 có diện tích 4, tròn bán kính 1 có diện tích $\pi$,
nên tỉ lệ điểm rơi vào tròn là $\pi/4$.

Với $n = 10\,000$ thì $SE \approx \sqrt{\frac{0{,}785 \times 0{,}215}{10000}} \times 4
\approx 0{,}016$ — chỉ đúng tới chữ số thập phân thứ hai. Muốn thêm một chữ số phải
tăng $n$ lên **100 lần**.

## 7. Bài tập chương (11.5)

### Bài 1 — thời gian dự án e-learning

Ba công việc **tuần tự**, ước lượng lạc quan / khả năng nhất / bi quan (tuần):

| Công việc | Tốt nhất | Khả năng nhất | Xấu nhất |
|---|---|---|---|
| Viết nội dung | 4 | 6 | 8 |
| Tạo đồ hoạ | 5 | 7 | 9 |
| Tích hợp đa phương tiện | 2 | 4 | 6 |

*Hỏi: xác suất dự án xong trong 17 tuần?*

**Thuật toán mô phỏng:**

```
lap = 0
for k in 1..N:                    # N = 10.000
    t1 = sinh_tam_giac(4, 6, 8)
    t2 = sinh_tam_giac(5, 7, 9)
    t3 = sinh_tam_giac(2, 4, 6)
    if t1 + t2 + t3 <= 17: lap += 1
tra_ve lap / N
```

Sinh phân phối tam giác bằng biến đổi nghịch đảo. Với $a \le m \le b$ và
$u \sim \mathcal{U}(0,1)$, đặt $F_m = \dfrac{m-a}{b-a}$:

$$x = \begin{cases}
a + \sqrt{u(b-a)(m-a)} & u < F_m \\[4pt]
b - \sqrt{(1-u)(b-a)(b-m)} & u \ge F_m
\end{cases}$$

**Kiểm tra bằng giải tích** — nên làm để biết mô phỏng có chạy đúng không.

Phân phối tam giác có trung bình $\dfrac{a+m+b}{3}$ và phương sai
$\dfrac{a^2+m^2+b^2-am-ab-mb}{18}$:

| Công việc | Trung bình | Phương sai |
|---|---|---|
| 1 | $(4+6+8)/3 = 6$ | $(16+36+64-24-32-48)/18 = 12/18 = 0{,}667$ |
| 2 | $(5+7+9)/3 = 7$ | $(25+49+81-35-45-63)/18 = 12/18 = 0{,}667$ |
| 3 | $(2+4+6)/3 = 4$ | $(4+16+36-8-12-24)/18 = 12/18 = 0{,}667$ |
| **Tổng** | **17** | **2,00** → $\sigma = 1{,}41$ |

Trung bình tổng đúng bằng **17**, và cả ba phân phối đều **đối xứng**, nên tổng
cũng đối xứng quanh 17:

$$P(T \le 17) \approx \mathbf{0{,}50}$$

Mô phỏng chạy đúng thì phải cho ra khoảng 0,50 ± 0,01. Lệch xa là code sai.

> Đây là mẹo làm bài đáng giá: luôn tìm một trường hợp **giải tích được** để kiểm
> chứng mô phỏng trước khi tin nó.

### Bài 2 — doanh thu dịch vụ thuê bao

Phí 10 USD/thuê bao/tháng · 10.000 người dùng hiện tại · chi phí duy trì
1.000.000 USD/năm (cố định) · có dữ liệu tốc độ tăng trưởng 60 tháng (2016–2020).

**Giả định:** mỗi tháng trong 12 tháng tới giống một tháng **rút ngẫu nhiên** từ dữ
liệu lịch sử.

*Hỏi: xác suất dịch vụ có lãi trong năm tới?*

```
lai = 0
for k in 1..N:
    users = 10000
    doanh_thu = 0
    for t in 1..12:
        g = rut_ngau_nhien_co_hoan_lai(tang_truong_lich_su)   # 1 trong 60 giá trị
        users = users * (1 + g)
        doanh_thu += users * 10
    if doanh_thu > 1_000_000: lai += 1
tra_ve lai / N
```

Điểm cần nhận ra: bài này **không giả định phân phối nào cả**. Nó lấy mẫu **có hoàn
lại** thẳng từ dữ liệu lịch sử — đó chính là **bootstrap**.

## 8. Bootstrap — liên hệ đồ án

Bootstrap là Monte Carlo áp lên **dữ liệu thật** thay vì lên một phân phối giả định.

**Thuật toán:**

1. Từ mẫu $n$ quan sát, rút **có hoàn lại** đúng $n$ quan sát → một mẫu bootstrap
2. Tính lại thống kê quan tâm trên mẫu đó
3. Lặp $B$ lần ($B = 2000$–$5000$)
4. Độ lệch chuẩn của $B$ giá trị đó **chính là sai số chuẩn**; phân vị 2,5% và
   97,5% cho **khoảng tin cậy 95%**

Ba điểm hay bị hỏi lại:

- **"Rút hết rổ thì khác gì nhau?"** Vì rút **có hoàn lại**. Rút 155 lần từ rổ 155
  món, mỗi lần rút xong bỏ lại vào — nên có món trúng hai ba lần, có món không trúng
  lần nào.
- **Bao nhiêu món khác nhau trong một vòng?** Xác suất một món cụ thể không bao giờ
  được rút là $\left(1 - \frac{1}{n}\right)^n \to e^{-1} \approx 0{,}368$. Nên mỗi
  vòng chỉ chứa khoảng **63,2%** số món riêng biệt.
- **Sai số chuẩn đến từ đâu?** Từ chính việc lặp lại ngẫu nhiên đó — không cần công
  thức giải tích nào cho $SE$.

Đồ án nhóm dùng $B = 5000$ vòng, rút riêng trong từng nhóm, giữ nguyên cỡ mỗi nhóm.

## Tự kiểm tra

1. Sai số MC là 0,01 với $n = 10^4$. Muốn còn 0,001 cần bao nhiêu?
   <details><summary>đáp</summary>
   $n = 10^6$. Sai số giảm 10 lần cần $n$ tăng $10^2 = 100$ lần, vì $SE \propto 1/\sqrt{n}$.</details>
2. Vì sao MC thắng cầu phương ở tích phân nhiều chiều?
   <details><summary>đáp</summary>
   Cầu phương lưới cần $n^d$ điểm cho $d$ chiều — bùng nổ tổ hợp. Sai số MC là
   $\sigma/\sqrt{n}$ **không phụ thuộc $d$**. Ở $d = 1$ hay $d = 2$ thì MC thua;
   từ khoảng $d \ge 4$ trở đi MC thắng.</details>
3. Chọn $q$ trong chấp nhận–bác bỏ với $M = 100$. Vấn đề gì?
   <details><summary>đáp</summary>
   Hiệu suất $1/M = 1\%$ — trung bình phải sinh 100 mẫu mới nhận được 1. Cực kỳ
   lãng phí. Phải tìm $q$ ôm sát $p$ hơn để $M$ gần 1.</details>
