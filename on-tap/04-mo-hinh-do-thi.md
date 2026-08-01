# 04 — Mô hình đồ thị (chương 7)

Mục lục chương: 7.1 Mô hình đồ thị xác suất · 7.2 Mô hình đồ thị nhân quả ·
7.3 Quy trình phân tích nhân quả bằng mô hình đồ thị · 7.4 Tham khảo.

**Chương rẻ điểm nhất trong danh sách** — không phải tính toán gì, chỉ cần đọc
đúng đồ thị. Nhưng book dạy qua ba cấu trúc rồi để người đọc tự suy ra tên gọi
"confounder", "mediator". File này gắn tên vào từng cấu trúc.

## 1. Mạng Bayes (7.1)

Đồ thị có hướng không chu trình (DAG). Mỗi đỉnh $i$ là một biến ngẫu nhiên $x_i$
kèm phân phối có điều kiện $p(x_i \mid pa(x_i))$, với $pa(\cdot)$ là tập nút cha.

**Phân rã phân phối đồng thời:**

$$p(x_1, \ldots, x_n) = \prod_{i=1}^{n} p\bigl(x_i \mid pa(x_i)\bigr)$$

**Giả định Markov cục bộ** — khi điều kiện hoá theo các nút cha, một nút trở nên
độc lập với mọi nút **không phải hậu duệ** của nó.

**Giả định cạnh nhân quả (7.2)** — trích book: *"Trong một đồ thị có hướng, mọi
nút cha là nguyên nhân trực tiếp của tất cả các nút con của nó."*

Đây là cái biến một mạng Bayes (thuần xác suất) thành một **đồ thị nhân quả**.
Cùng một phân phối xác suất có thể khớp nhiều DAG khác nhau; chọn được DAG nào là
nhân quả thì phải dựa vào **kiến thức lĩnh vực**, không phải dữ liệu.

## 2. Ba cấu trúc ba nút — TRÁI TIM CỦA CHƯƠNG

Học thuộc bảng này là gần như xong chương.

| Cấu trúc | Hình | Vai trò của $Z$ | Chưa điều kiện $Z$ | Điều kiện $Z$ |
|---|---|---|---|---|
| **Chuỗi** (chain) | $X \to Z \to Y$ | **trung gian** (mediator) | đường **mở** | đường **chặn** |
| **Rẽ nhánh** (fork) | $X \leftarrow Z \to Y$ | **gây nhiễu** (confounder) | đường **mở** | đường **chặn** |
| **Chữ V** (collider) | $X \to Z \leftarrow Y$ | **hội tụ** (collider) | đường **chặn** | đường **MỞ** ⚠️ |

**Collider đi ngược lại với hai cái kia.** Đó là toàn bộ độ khó của chương này.

### Quy tắc chặn đường (d-separation)

Một đường bị **chặn** nếu nó chứa:

- một **biến không hội tụ** (nút chuỗi hoặc nút rẽ nhánh) **được** điều kiện hoá,
  **hoặc**
- một **biến hội tụ** **không được** điều kiện hoá (và không có hậu duệ nào của nó
  được điều kiện hoá).

Đường **mở** khi không rơi vào hai trường hợp trên.

Hai biến **d-tách** (độc lập có điều kiện) khi **mọi** đường giữa chúng đều bị
chặn. Chỉ cần **một** đường mở là còn liên hệ.

> Cẩn thận với "hậu duệ của collider". Điều kiện hoá một biến là **con** của
> collider cũng mở đường ra, chỉ yếu hơn. Đề hay giấu bẫy này.

## 3. Sáu vai trò của biến — cái đề thi hỏi thẳng

Với $T$ = tác nhân, $Y$ = kết quả:

| Vai trò | Cấu trúc | Kiểm soát? | Vì sao |
|---|---|---|---|
| **Gây nhiễu** (confounder) | $T \leftarrow C \to Y$ | ✅ **PHẢI** | Không kiểm soát thì liên hệ $T$–$Y$ bị pha tạp |
| **Trung gian** (mediator) | $T \to M \to Y$ | ❌ **KHÔNG** (nếu muốn tác động tổng) | Kiểm soát $M$ là chặn mất một phần chính tác động cần đo |
| **Hội tụ** (collider) | $T \to K \leftarrow Y$ | ❌ **TUYỆT ĐỐI KHÔNG** | Kiểm soát nó **tạo ra** liên hệ giả |
| **Hậu duệ collider** | $K \to K'$ | ❌ không | Mở đường collider một phần |
| **Tiền định** (precision variable) | $P \to Y$, không nối $T$ | 🟡 nên | Không bắt buộc, nhưng giảm phương sai → CI hẹp hơn |
| **Công cụ** (instrument) | $I \to T$, không nối $Y$ | ❌ không | Kiểm soát nó làm **tăng** phương sai |

Một câu để nhớ toàn bộ bảng:

> **Chặn cửa sau, đừng chạm cửa trước, đừng bao giờ mở cửa hội tụ.**

## 4. Bài mẫu 1 — đồ thị SAT/điểm số của book

Book đưa phân rã:

$$p(l, g, i, d, s) = p(l \mid g)\,p(g \mid i, d)\,p(i)\,p(d)\,p(s \mid i)$$

**Đọc ngược ra DAG** — vế điều kiện chính là danh sách nút cha:

| thừa số | cha của | cạnh |
|---|---|---|
| $p(i)$ | $i$ không có cha | — |
| $p(d)$ | $d$ không có cha | — |
| $p(g \mid i,d)$ | $g$ có cha $i$ và $d$ | $i \to g$, $d \to g$ |
| $p(s \mid i)$ | $s$ có cha $i$ | $i \to s$ |
| $p(l \mid g)$ | $l$ có cha $g$ | $g \to l$ |

```
   d ────┐
         ▼
   i ──► g ──► l
   │
   └──► s
```

($i$ = trí thông minh, $d$ = độ khó môn, $g$ = điểm, $s$ = điểm SAT, $l$ = thư giới thiệu)

**Câu hỏi a — $s$ và $l$ có độc lập không?**

Đường duy nhất: $s \leftarrow i \to g \to l$. Có $i$ là nút rẽ nhánh (không điều
kiện → mở) và $g$ là nút chuỗi (không điều kiện → mở). Cả đường **mở** → **không
độc lập**.

Hợp lý: người thông minh vừa được SAT cao vừa được điểm cao rồi được thư tốt.

**Câu hỏi b — $s \perp l \mid g$ ?**

Cùng đường đó, giờ điều kiện hoá $g$. $g$ là nút chuỗi được điều kiện → **chặn**.
Không còn đường nào khác → **có, độc lập có điều kiện**.

Hợp lý: biết điểm rồi thì SAT không nói thêm gì về thư giới thiệu, vì thư chỉ phụ
thuộc vào điểm.

**Câu hỏi c — $s$ và $d$ có độc lập không?**

Đường duy nhất: $s \leftarrow i \to g \leftarrow d$. Nút $g$ là **collider** (hai
mũi tên đâm vào), không điều kiện hoá → **chặn** → **có, độc lập**.

Hợp lý: độ khó môn học chẳng liên quan gì tới điểm SAT.

**Câu hỏi d — $s \perp d \mid g$ ?**

Giờ điều kiện hoá đúng cái collider $g$ → **mở** → **KHÔNG còn độc lập**.

Đây là chỗ phản trực giác nhất, nhưng có lý giải rõ: biết một sinh viên bị **điểm
thấp**, nếu lại biết môn đó **dễ**, ta suy ra bạn ấy có lẽ **không thông minh**,
mà thế thì SAT có lẽ cũng thấp. Điều kiện hoá $g$ đã bơm thông tin chảy giữa $d$
và $s$ — hai thứ vốn không liên quan.

## 5. Bài mẫu 2 — chọn tập kiểm soát

DAG:

```
        C
      ↙   ↘
     T ──► M ──► Y
      ↘         ↙
        ──► K ◄──
```

Cạnh: $C \to T$, $C \to Y$, $T \to M$, $M \to Y$, $T \to K$, $Y \to K$.

**Bước 1 — liệt kê MỌI đường từ $T$ tới $Y$** (bỏ qua chiều mũi tên khi đi):

| # | Đường | Loại nút giữa | Trạng thái mặc định |
|---|---|---|---|
| 1 | $T \to M \to Y$ | $M$ chuỗi | mở — **đây là tác động thật** |
| 2 | $T \leftarrow C \to Y$ | $C$ rẽ nhánh | mở — **cửa sau, phải chặn** |
| 3 | $T \to K \leftarrow Y$ | $K$ hội tụ | chặn sẵn — **đừng đụng vào** |

**Bước 2 — chọn tập điều kiện.** Cần chặn đường 2, giữ nguyên 1 và 3.

→ Tập kiểm soát đúng: $\{C\}$

**Bước 3 — kiểm tra ba lựa chọn sai:**

| Kiểm soát | Hậu quả |
|---|---|
| $\{\}$ | Đường 2 mở → ước lượng bị nhiễu bởi $C$ |
| $\{C, M\}$ | Chặn cả đường 1 → chỉ còn **tác động trực tiếp**, mất phần qua $M$ |
| $\{C, K\}$ | Mở đường 3 → **tự tạo** ra liên hệ giả |
| $\{K\}$ | Sai cả hai chiều — vừa để nhiễu vừa mở collider |

> Bài học: **thêm biến kiểm soát không phải lúc nào cũng tốt hơn.** "Cho hết vào
> mô hình cho chắc" là sai lầm nghiêm trọng, và đây chính là điều chương 7 dạy.

## 6. Quy trình phân tích nhân quả (7.3)

Năm bước theo book:

1. **Định nghĩa biến** — $T$ (tác nhân), $Y$ (kết quả), $C$ (các biến khác).
2. **Dựng đồ thị** dựa trên **chuyên môn lĩnh vực**, không phải dựa vào dữ liệu.
3. **Nhận diện** biến gây nhiễu, biến trung gian, biến kiểm soát; truy vết các
   đường cần chặn để khử chệch.
4. **Ước lượng tham số** từ dữ liệu.
5. **Kiểm tra giả định** của mô hình và kết quả.

Bước 2 là bước không thể tự động hoá — và cũng là bước dễ bị phản biện nhất khi
bảo vệ đồ án.

## 7. Liên hệ đồ án nhóm

DAG trong đồ án thuế GTGT có đúng cấu trúc bài mẫu 2:

- $Z$ (đủ điều kiện giảm thuế) → $Y$ (log thay đổi giá) — cạnh cần đo
- Nhóm hàng, sản lượng trước kỳ, mức giá trước kỳ → vừa ảnh hưởng $Z$ vừa ảnh
  hưởng $Y$ → **gây nhiễu**, phải kiểm soát
- $D$ (thuế suất cửa hàng thực áp) nằm **giữa** $Z$ và $Y$ → **trung gian**. Đây
  là lý do đồ án ước lượng ITT theo $Z$ chứ không hồi quy theo $D$ — kiểm soát hay
  điều kiện hoá theo $D$ sẽ chặn mất chính con đường cần đo.

Câu này rất dễ bị hỏi khi vấn đáp, nên nhớ.

## Tự kiểm tra

1. $X \to Z \leftarrow Y$, biết $Z$ có con là $W$. Điều kiện hoá $W$ (không phải $Z$)
   thì đường $X$–$Y$ thế nào?
   <details><summary>đáp</summary>
   **Mở** (một phần). Điều kiện hoá hậu duệ của collider cũng mở đường, chỉ yếu hơn
   so với điều kiện hoá chính collider.</details>
2. Sao "cho hết biến vào mô hình cho chắc" lại nguy hiểm?
   <details><summary>đáp</summary>
   Vì trong đống đó có thể có collider (kiểm soát → tạo chệch từ không thành có) và
   mediator (kiểm soát → xoá mất phần tác động cần đo). Chỉ confounder mới nên
   kiểm soát.</details>
3. Dữ liệu quan sát được có tự nói cho ta biết đâu là confounder không?
   <details><summary>đáp</summary>
   **Không.** Ba cấu trúc chain/fork/collider có thể sinh ra cùng một mẫu tương quan.
   Phân biệt được là nhờ chiều mũi tên, mà chiều mũi tên đến từ kiến thức lĩnh vực
   và trình tự thời gian.</details>
