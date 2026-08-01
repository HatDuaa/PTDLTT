# 05 — Phân tích nhân quả (chương 8)

Mục lục chương: 8.1 Ba cấp độ · 8.2 Suy luận nhân quả · 8.3 Tương quan ≠ nhân quả ·
8.4 Các nghịch lý · 8.5 Framework kết quả tiềm năng · 8.6 Ước lượng tác động nhân quả.

Chương ngắn nhất, thiên về khái niệm. Book dừng ở **ATE + RCT** — không có
backdoor, không có `do(·)`, không có điểm xu hướng. Mục 7 dưới đây là phần ngoài
book, để dành cho vấn đáp đồ án.

## 1. Ba cấp độ (8.1)

| Cấp | Tên | Câu hỏi | Ví dụ |
|---|---|---|---|
| 1 | **Liên hệ** (association) | Thấy gì? | $P(A \mid B)$ — mua chỉ nha khoa, biết đã mua kem đánh răng |
| 2 | **Can thiệp** (intervention) | Nếu ta làm thì sao? | Tăng giá thì doanh số ra sao? |
| 3 | **Phản thực** (counterfactual) | Giá như đã không làm thì sao? | Nếu hồi đó không uống thuốc, bệnh nhân này có sống không? |

Cấp 1 học được từ dữ liệu quan sát thụ động. Cấp 2 cần mô hình nhân quả hoặc thí
nghiệm có kiểm soát. Cấp 3 cần thêm giả định về từng cá thể — mạnh nhất và cũng
khó nhất.

**Học máy thông thường nằm ở cấp 1.** Dự đoán giỏi không đồng nghĩa với hiểu nhân
quả. Đây là câu hỏi lý thuyết hay ra.

## 2. Framework kết quả tiềm năng (8.5)

Với cá thể $i$:

- $T_i$ — tác nhân, $T_i = 1$ được can thiệp, $T_i = 0$ không
- $Y_i(1)$ — kết quả **giá như** được can thiệp
- $Y_i(0)$ — kết quả **giá như** không được can thiệp
- $Y_i$ — kết quả **thực sự quan sát được**

**Tác động nhân quả cá thể:**

$$Y_i(1) - Y_i(0)$$

**Bài toán nền tảng của suy luận nhân quả:** với mỗi cá thể ta chỉ quan sát được
**một** trong hai kết quả tiềm năng. Nếu $T_i = 1$ ta thấy $Y_i(1)$, còn $Y_i(0)$
mãi mãi ẩn. **Tác động nhân quả cá thể là không quan sát được** — không phải vì
thiếu dữ liệu, mà vì logic.

Vì thế ta chuyển sang đại lượng **trung bình**:

$$ATE = \mathbb{E}\bigl[Y_i(1) - Y_i(0)\bigr] = \mathbb{E}[Y(1)] - \mathbb{E}[Y(0)]$$

Cái không đo được ở mức cá thể lại đo được ở mức trung bình — đó là toàn bộ mẹo
của chương này.

## 3. Bất đẳng thức trung tâm (8.3)

$$\mathbb{E}[Y(1)] - \mathbb{E}[Y(0)] \;\;\neq\;\; \mathbb{E}[Y \mid T=1] - \mathbb{E}[Y \mid T=0]$$

| Vế trái | Vế phải |
|---|---|
| **nhân quả** | **liên hệ** |
| so cùng một nhóm người ở hai kịch bản | so hai nhóm người khác nhau |
| không quan sát trực tiếp được | tính thẳng từ dữ liệu |

**Chệch chọn lọc** — chênh lệch giữa hai vế:

$$\underbrace{\mathbb{E}[Y \mid T{=}1] - \mathbb{E}[Y \mid T{=}0]}_{(1)}
\;=\; \underbrace{ATT}_{(2)}
\;+\; \underbrace{\bigl(\mathbb{E}[Y(0) \mid T{=}1] - \mathbb{E}[Y(0) \mid T{=}0]\bigr)}_{(3)}$$

| | Là gì |
|---|---|
| **(1)** | chênh lệch **đo được** thẳng từ dữ liệu |
| **(2)** | tác động nhân quả — **cái ta cần** |
| **(3)** | **chệch chọn lọc** — phần bị tính nhầm thành tác động |

Số hạng chệch hỏi: *hai nhóm có khác nhau ngay cả khi không ai được can thiệp
không?* Nếu có, phần chênh lệch đó bị tính nhầm thành tác động.

Ví dụ: người đi tập gym khoẻ hơn người không đi. Nhưng người vốn khoẻ mới hay đi
gym — $\mathbb{E}[Y(0) \mid T=1] > \mathbb{E}[Y(0) \mid T=0]$, chệch dương, hiệu
quả gym bị thổi phồng.

## 4. Vì sao RCT giải quyết được (8.6)

Phân bổ ngẫu nhiên làm $T$ **độc lập** với mọi kết quả tiềm năng:

$$\bigl(Y(1), Y(0)\bigr) \perp T$$

Nên $\mathbb{E}[Y(0) \mid T{=}1] = \mathbb{E}[Y(0) \mid T{=}0]$, chệch chọn lọc
bằng 0, và liên hệ **trở thành** nhân quả:

$$\mathbb{E}[Y(1)] - \mathbb{E}[Y(0)] = \mathbb{E}[Y \mid T=1] - \mathbb{E}[Y \mid T=0]$$

Điểm mấu chốt: ngẫu nhiên hoá cân bằng **cả những biến gây nhiễu ta không biết
và không đo được**. Không phương pháp thống kê nào trên dữ liệu quan sát làm được
điều đó.

### Bài mẫu — RCT 6 người (bài trong book)

| $i$ | $T$ | $Y$ | $Y(1)$ | $Y(0)$ | $Y(1)-Y(0)$ |
|---|---|---|---|---|---|
| 1 | 0 | 0 | ? | 0 | ? |
| 2 | 1 | 1 | 1 | ? | ? |
| 3 | 1 | 0 | 0 | ? | ? |
| 4 | 0 | 0 | ? | 0 | ? |
| 5 | 0 | 1 | ? | 1 | ? |
| 6 | 1 | 1 | 1 | ? | ? |

Cột $Y(1)-Y(0)$ **toàn dấu hỏi** — đúng như bài toán nền tảng nói.

Nhóm can thiệp $\{2,3,6\}$, nhóm chứng $\{1,4,5\}$.

$$\mathbb{E}[Y \mid T{=}1] = \frac{1+0+1}{3} = \frac{2}{3}
\qquad
\mathbb{E}[Y \mid T{=}0] = \frac{0+0+1}{3} = \frac{1}{3}$$

$$ATE = \frac{2}{3} - \frac{1}{3} = \frac{1}{3}$$

Chỉ vì đây là RCT nên mới được phép gọi con số này là ATE. Nếu là dữ liệu quan
sát, $1/3$ chỉ là chênh lệch liên hệ.

## 5. Hai nghịch lý (8.4)

### Simpson — xu hướng đảo chiều khi gộp nhóm

*Một xu hướng xuất hiện trong từng nhóm con lại đảo ngược hoặc biến mất khi gộp
chung.*

Ví dụ sỏi thận, tỉ lệ chữa khỏi:

| | Sỏi nhỏ | Sỏi lớn | **Gộp chung** |
|---|---|---|---|
| Cách A | 81/87 = **93%** | 192/263 = **73%** | 273/350 = **78%** |
| Cách B | 234/270 = 87% | 55/80 = 69% | 289/350 = **83%** |
| | A thắng | A thắng | **B thắng** ⚠️ |

A tốt hơn trong **cả hai** nhóm, nhưng thua khi gộp.

**Vì sao:** kích thước sỏi vừa ảnh hưởng việc chọn cách chữa ($T$) vừa ảnh hưởng
khả năng khỏi ($Y$) — đúng cấu trúc **rẽ nhánh**, tức **biến gây nhiễu**. Bác sĩ
dành cách A cho ca sỏi lớn khó chữa, nên A gánh phần lớn ca nặng.

**Con số nào đúng?** Con số **theo nhóm con** — vì kích thước sỏi là confounder,
phải điều kiện hoá theo nó. Đây là chỗ chương 7 và chương 8 nối vào nhau: nghịch
lý Simpson không giải được bằng thống kê, chỉ giải được bằng đồ thị nhân quả.

### Berkson — liên hệ giả trong một nhóm con

*Một nhóm con thể hiện liên hệ mà quần thể rộng không hề có.*

Ví dụ của book: trong giới nổi tiếng, tài năng và ngoại hình có tương quan **âm**
giả tạo — vì muốn nổi tiếng thì cần **hoặc** tài **hoặc** đẹp. Ai vừa kém tài vừa
kém sắc thì không lọt vào mẫu.

Đây chính là **điều kiện hoá theo collider**: tài năng → nổi tiếng ← ngoại hình.
Chọn mẫu chỉ gồm người nổi tiếng = điều kiện hoá đúng nút hội tụ = mở đường = tạo
tương quan từ hư không.

> **Simpson là bẫy confounder, Berkson là bẫy collider.** Nhớ cặp này là trả lời
> được mọi câu hỏi lý thuyết của 8.4.

## 6. Tương quan không phải nhân quả (8.3) — bốn lý do

Thấy $X$ và $Y$ tương quan, có bốn khả năng:

1. $X \to Y$ — đúng là nhân quả
2. $Y \to X$ — ngược chiều
3. $X \leftarrow C \to Y$ — biến gây nhiễu chung
4. Ngẫu nhiên, hoặc chệch chọn mẫu (Berkson)

Dữ liệu quan sát **không tự phân biệt** được bốn khả năng này. Cần thêm: chiều
thời gian, kiến thức lĩnh vực, hoặc can thiệp.

## 7. ⚠️ Ngoài book — dùng cho vấn đáp đồ án

Ba thứ dưới đây **không có trong chương 8**. Nếu chỉ ôn thi thì bỏ qua.

**Tiêu chuẩn cửa sau (backdoor).** Tập $C$ thoả tiêu chuẩn cửa sau với $(T,Y)$ nếu
$C$ chặn mọi đường cửa sau từ $T$ tới $Y$, và $C$ không chứa hậu duệ nào của $T$.
Khi đó:

$$P\bigl(Y \mid do(T{=}t)\bigr) = \sum_{c} P(Y \mid T{=}t,\, C{=}c)\, P(C{=}c)$$

**g-computation.** Khớp $\hat m_0(X)$ **chỉ trên nhóm chứng**, rồi lấy chính mô
hình đó dự đoán kết quả phản thực cho nhóm can thiệp:

$$\widehat{ATT} = \frac{1}{n_1}\sum_{i: T_i = 1}\bigl(Y_i - \hat m_0(X_i)\bigr)$$

**ITT (intention-to-treat).** Ước lượng theo **ý định can thiệp** $Z$ chứ không
theo cái thực sự nhận $D$. Đồ án nhóm dùng ITT vì $D$ (thuế suất cửa hàng thực áp)
là **biến trung gian** giữa $Z$ và $Y$ — hồi quy theo $D$ sẽ chặn mất con đường
cần đo. Xem [file 04 mục 7](04-mo-hinh-do-thi.md).

## Tự kiểm tra

1. Vì sao tác động nhân quả cá thể là không quan sát được?
   <details><summary>đáp</summary>
   Vì $Y_i(1)$ và $Y_i(0)$ là hai kịch bản loại trừ nhau cho **cùng một người ở
   cùng một thời điểm**. Quan sát được cái này thì cái kia là phản thực. Đây là
   giới hạn logic, không phải giới hạn dữ liệu.</details>
2. Trong nghịch lý Simpson, nên báo cáo con số gộp hay con số theo nhóm?
   <details><summary>đáp</summary>
   Tuỳ vào đồ thị nhân quả. Nếu biến phân nhóm là **confounder** (ảnh hưởng cả $T$
   và $Y$, như kích thước sỏi) → dùng **theo nhóm**. Nếu nó là **mediator** (nằm
   sau $T$) → dùng **gộp**. Cùng một bảng số, câu trả lời ngược nhau tuỳ cấu trúc.</details>
3. RCT hơn dữ liệu quan sát ở điểm nào mà thống kê không bù được?
   <details><summary>đáp</summary>
   Cân bằng cả confounder **không biết và không đo được**. Điều chỉnh thống kê chỉ
   xử lý được biến đã đo. Đó là lý do RCT là chuẩn vàng.</details>
