# Phase 02 — Bốn cách ước lượng (slide 15, 16, 17, 18)

> Slide hiện tại đã nói **cách làm** của từng phương pháp. Phần thiếu là **con số ra như thế
> nào** và **vì sao bốn con số khác nhau**. Phần thiếu đó mới là chỗ cho thấy nhóm hiểu việc
> mình làm.

---

<a id="cach-1-va-2"></a>
## Slide 15 — Cách 1 và 2: hồi quy chênh lệch

**Giữ nguyên** phần "Ý tưởng / Cách làm / Vì sao chạy hai lần" và hai công thức. **Bổ sung**
bảng hệ số dưới đây, vì hiện slide chỉ hiện `β₁` mà giấu ba hệ số còn lại — trong khi chính
ba hệ số đó giải thích mô hình đang trừ cái gì.

### Cách 1 — thô

Với biến `Z` chỉ nhận 0 hoặc 1, hồi quy `Y = β₀ + β₁·Z + ε` **đúng bằng hiệu hai trung bình**:

```
β₁ = 0,6244 − 1,0222 = −0,3978
```

Không có gì bí ẩn. Đây chính là con số ở slide 9, viết lại dưới dạng hồi quy để so sánh được
với cách 2.

### Cách 2 — hiệp biến

```
Y = β₀ + β₁·Z + γ₁·log(giá nền) + γ₂·log(1+sức bán) + γ₃·số tuần bán + ε
```

| Hệ số | Giá trị | Đọc thế nào |
|---|---|---|
| Chặn β₀ | +0,027 | mốc xuất phát |
| **Z → β₁** | **−0,270** | **con số cần tìm** |
| log giá nền | +0,097 | hàng đắt tăng giá nhỉnh hơn chút |
| **log sức bán** | **+0,993** | **bán càng chạy càng tăng giá mạnh** |
| số tuần bán | −0,557 | bán càng đều thì giá càng ít nhảy |

### Chốt slide

Hệ số `+0,993` là chỗ đáng chỉ tay vào: nó nói **hàng bán chạy tăng giá mạnh hơn hẳn**. Mà
nhóm đối chứng bán chạy gấp năm lần (slide 10). Mô hình dùng đúng thông tin này để trừ bớt
phần "bia rượu tăng giá vì bia rượu bán chạy" ra khỏi chênh lệch hai nhóm.

Kết quả: từ **−0,398** thành **−0,270**. Tức khoảng **một phần ba** chênh lệch thô đến từ đặc
điểm hàng hóa chứ không từ chính sách.

---

<a id="slide-sai-so"></a>
## Slide 16 — Sai số chuẩn đến từ đâu 🆕

**Tiêu đề:** Sai số chuẩn — con số ±0,6 nghĩa là gì

**Câu chốt:** Thêm biến kiểm soát lại làm sai số to lên, và có lý do rõ ràng cho việc đó.

### Sai số chuẩn trả lời câu gì

> Nếu cửa hàng này tình cờ có tập mặt hàng khác đi một chút, con số của mình sẽ nhảy cỡ nào?

Với cách 1 có công thức đóng, tính tay ra khớp với máy:

```
SE = √( 6,070²/155  +  3,972²/132 )  =  0,598
                                          (statsmodels HC3: 0,600)
```

Tử số là **độ dao động của Y**, mẫu số là **cỡ mẫu**. Y dao động 6 điểm mà chỉ có 287 mặt
hàng, nên sai số ra 0,6. Muốn sai số nhỏ đi một nửa thì cần mẫu gấp bốn.

### Nghịch lý: thêm biến kiểm soát mà sai số TĂNG

Từ **0,600** lên **0,733**. Nghe ngược đời. Đo ra thì rõ:

| | Cách 1 | Cách 2 |
|---|---|---|
| Độ lệch chuẩn phần dư | 5,212 | **5,204** |
| R² — mô hình giải thích được bao nhiêu Y | 0,15% | **1,48%** |
| R² của Z theo X | — | **26,3%** |

**Dòng 1–2.** Ba biến nền gần như không giải thích được Y. Phần dư từ `5,212` xuống `5,204`,
tức giảm 0,15%. Mức đổi giá của một mặt hàng gần như **không đoán được** từ giá nền, sức bán
hay tần suất bán. Cửa hàng đổi giá vì lý do nằm ngoài dữ liệu hóa đơn.

**Dòng 3.** Nhưng `Z` thì lại đoán được từ `X` — 26,3%. Hợp lý thôi, vì hóa chất và bia rượu
vốn khác nhau ở đúng ba biến đó. Mà khi `X` đã "biết trước" phần nào `Z` là ai, mô hình khó
tách riêng công của `Z` hơn.

Hệ số phóng đại phương sai: `1/(1 − 0,263) = 1,357`, căn ra **1,165**. Nhân vào sai số cũ:

```
0,600 × 1,165 = 0,699
```

gần đúng `0,733` — phần lệch còn lại do HC3 và mẫu hữu hạn.

### Chốt slide

> Biến kiểm soát chỉ làm sai số nhỏ đi nếu nó **thật sự giải thích được Y**. Ở đây nó không
> giải thích được gì nhưng lại chồng lấn với `Z`, nên chỉ nhận cái giá mà không nhận cái lợi.

Đây là một phát hiện thật của đồ án, không phải chi tiết cần giấu. Nó cũng giải thích luôn vì
sao đồ án báo cáo cả hai con số thay vì chỉ giữ cái "đã điều chỉnh".

### Ghi chú — HC3 là gì

Nếu bị hỏi: **HC3** là công thức sai số không đòi hỏi mọi mặt hàng phải có cùng độ dao động.
Ở đây cần thiết vì hai nhóm lệch nhau rõ (`6,07` và `3,97`). Dùng công thức thường sẽ cho sai
số nhỏ giả tạo.

---

<a id="cach-3"></a>
## Slide 17 — Cách 3: g-computation

**Giữ nguyên** ba bước và công thức. **Bổ sung** ba khối dưới đây.

### Ký hiệu phải nói đúng

Mỗi mặt hàng về lý thuyết có hai kết quả tiềm năng:

| | Ý nghĩa | Quan sát được không |
|---|---|---|
| **Y₁** | mức đổi giá **khi có** chính sách | ✅ với nhóm Z=1 — chính là `+0,624` |
| **Y₀** | mức đổi giá **nếu không có** chính sách | ❌ không bao giờ thấy được |

```
ATT = trung bình( Y₁ − Ŷ₀ )  trên nhóm Z=1
    = 0,6244 − 1,2882
    = −0,6638
```

Cái mô hình dự đoán ra là **Ŷ₀**, không phải Y₁. Nhớ nhầm chỗ này là lỗi dễ bị bắt nhất khi
hỏi bài.

### Bốn hệ số học từ nhóm Z=0 ra sao

Bằng **bình phương tối thiểu** trên **đúng 132 dòng nhóm Z=0** — cùng phép tính mà cách 2 làm,
chỉ khác dữ liệu đưa vào. Cách 2 khớp trên cả 287 món; cách 3 khớp chỉ trên 132 món đối chứng.

| Hệ số học từ Z=0 | |
|---|---|
| Chặn | +7,431 |
| log giá nền | −0,479 |
| log sức bán | +0,547 |
| số tuần bán | −0,546 |

Phân rã dự báo phản thực để thấy máy đang làm gì:

```
Trung bình Y nhóm Z=0                                       1,0222
  + (−0,479) × (chênh lệch log giá nền  = +0,0086)         −0,0041
  + (+0,547) × (chênh lệch log sức bán  = −0,9297)         −0,5085
  + (−0,546) × (chênh lệch số tuần bán  = −1,4252)         +0,7785
  ────────────────────────────────────────────────────────────────
  = dự báo phản thực cho nhóm Z=1                           1,2882
```

Nhóm Z=1 bán ế hơn nên kéo dự báo **xuống** 0,51; nhưng cũng bán thưa hơn nên kéo **lên** 0,78.
Giá nền gần như không đóng góp gì — tuy giá trung bình chênh 72k/109k, sau khi lấy log và bỏ
đuôi lệch thì hai nhóm gần bằng nhau.

### 🔴 Vì sao ra −0,664 trong khi cách 2 ra −0,270

Đây là câu hỏi hay nhất về phần phương pháp, và trả lời được **chính xác đến từng chữ số**.

Hai cách chỉ khác nhau ở chỗ tin hệ số của ai:

| Hệ số | Khớp trên **cả hai** nhóm | Khớp **chỉ** Z=0 |
|---|---|---|
| log giá nền | +0,097 | −0,479 |
| **log sức bán** | **+0,993** | **+0,547** |
| số tuần bán | −0,557 | −0,546 |

Chênh lệch giữa hai ước lượng = (chênh lệch hệ số) × (chênh lệch đặc điểm hai nhóm):

```
log giá nền :  ( 0,097 − (−0,479)) × ( +0,0086) = +0,005
log sức bán :  ( 0,993 −   0,547 ) × ( −0,9297) = −0,414
số tuần bán : (−0,557 − (−0,546)) × ( −1,4252) = +0,015
─────────────────────────────────────────────────────────
                                          tổng  = −0,394

Kiểm:  −0,270 − (−0,664)  =  +0,394   ✓
```

**Toàn bộ khoảng cách giữa hai ước lượng nằm ở một biến duy nhất: sức bán.** Mô hình gộp nói
một đơn vị log sức bán kéo Y lên `0,99`; mô hình chỉ học từ bia rượu nói chỉ `0,55`. Vì nhóm
Z=1 bán ế hơn `0,93` đơn vị log, hai con số đó dẫn tới hai phản thực cách nhau `0,39`.

Ai đúng thì **không biết được** — đó chính là bản chất của giả định. Cách 2 đánh cược rằng hai
nhóm chung một quy luật; cách 3 đánh cược rằng quy luật của bia rượu áp được cho dầu gội.
Dữ liệu trong tay không phân xử được. Đây là lý do đồ án báo cáo cả bốn con số thay vì chọn một.

### Chồng lấn — điều kiện để cách 3 hợp lệ

Muốn áp quy luật của Z=0 lên Z=1 thì các mặt hàng Z=1 phải nằm **trong tầm** dữ liệu của Z=0.
Nếu có món dầu gội rẻ hơn mọi chai bia trong dữ liệu thì mô hình đang **ngoại suy**.

Đo được: **2,6%** mặt hàng Z=1 nằm ngoài khoảng của Z=0, toàn bộ ở biến giá nền. Sức bán và
tần suất chồng lấn 100%. Con số 2,6% đủ nhỏ để dùng được, nhưng phải nói ra.

---

<a id="cach-4"></a>
## Slide 18 — Cách 4: phân tầng theo mức giá

**Giữ nguyên** phần "Ý tưởng / Vì sao mức giá quyết định / Cách làm" và bảng năm tầng.
**Bổ sung** ba khối dưới đây.

### Trọng số — mẫu số là 155, không phải 287

```
w_tầng = n₁ trong tầng / tổng n₁ = 19/155 = 0,123
```

Vì sao chỉ đếm nhóm Z=1: đại lượng cần đo là tác động **trên nhóm được luật cho giảm**. Nhóm
đối chứng chỉ đóng vai **thước đo**, không phải đối tượng nghiên cứu — nên không được tham gia
định trọng số.

### Bảng gộp — hiện cả cột đóng góp

| Tầng | Khoảng giá | Z=1 | Z=0 | τ (hiệu trong tầng) | w | **w × τ** |
|---|---|---|---|---|---|---|
| 0 | 9k–26k | 19 | 39 | −0,076 | 0,123 | −0,009 |
| 1 | 27k–42k | 39 | 20 | +0,066 | 0,252 | +0,017 |
| 2 | 43k–62k | 32 | 24 | −0,256 | 0,207 | −0,053 |
| 3 | 64k–96k | 31 | 27 | **−1,662** | 0,200 | **−0,332** |
| 4 | 99k–804k | 34 | 22 | +0,551 | 0,219 | +0,121 |
| | | **155** | **132** | | **1,000** | **−0,257** |

🔴 **Cột cuối là cột phải nói.** Tầng 3 đóng góp `−0,332` trong khi tổng chỉ `−0,257`. Bốn tầng
còn lại cộng lại ra `+0,075`, tức **dương**. Bỏ tầng 3 ra thì cách 4 đổi dấu.

Con số `−0,257` **không phải** "năm tầng cùng cho thấy một hướng" — nó là một tầng kéo cả kết
quả. Báo cáo ghi điều này ở mục 5.2 dưới dạng "kết quả giữa năm tầng không tạo thành quy luật
rõ ràng". Nếu bị hỏi thẳng "tại sao cách 4 ra âm", câu trả lời trung thực là **do tầng
64k–96k**.

Và nói tiếp ngay: 31 mặt hàng trong một tầng, độ lệch chuẩn ~6, nên `−1,662` rất có thể chỉ là
nhiễu. Nhóm **không** đào sâu riêng tầng đó, vì tách một tầng ra rồi kể chuyện về nó là cách
chắc chắn nhất để tự lừa mình.

### Bootstrap — sai số tính bằng mô phỏng

Cách 4 không có công thức đóng: chia phân vị giá → gộp tầng mỏng → tính hiệu từng tầng → nhân
trọng số → cộng lại. Cả chuỗi đó không rút gọn thành một biểu thức đại số. Khi không tính được
thì **mô phỏng**.

```
Lặp 5.000 lần:
  · bốc 155 lần từ rổ Z=1  (mỗi lần bốc 1 món, bốc xong BỎ LẠI vào rổ)
  · bốc 132 lần từ rổ Z=0  (như trên)
  · chia lại 5 tầng từ đầu, tính lại trọng số
  · ghi con số thu được

→ 5.000 con số
→ độ lệch chuẩn của chúng          = SE  = 0,592
→ cắt phân vị 2,5% và 97,5%        = KTC = [−1,414 · +0,911]
```

### 🔴 "Bốc 155 lần" ≠ "bốc hết 155 món"

Chỗ này ai nghe lần đầu cũng vướng, nên slide phải có ví dụ.

Vì bốc xong **bỏ lại vào rổ**, nên một món có thể trúng nhiều lần và món khác không trúng lần
nào. Giống tung xúc xắc 6 mặt 6 lần: không ra `1 2 3 4 5 6` mà ra kiểu `3 3 1 6 3 4`.

Một vòng thật trên 155 mặt hàng nhóm Z=1:

| | |
|---|---|
| Món trúng ít nhất 1 lần | **95** / 155 |
| Món **không trúng lần nào** | **60** / 155 |
| Trúng 2 lần | 32 món |
| Trúng 3 lần | 12 món |
| Trúng 5 lần | 1 món |
| **Trung bình Y của vòng này** | **+0,823** (mẫu gốc: +0,624) |

Con số nhảy từ `0,62` lên `0,82` chỉ vì bốc trúng tập món khác. Độ tản mát của 5.000 vòng như
vậy chính là sai số chuẩn.

> ⚠️ Bảng một vòng ở trên là **minh họa**, sinh bằng một hạt giống ngẫu nhiên riêng để trình
> bày — không phải đầu ra của pipeline và không nằm trong file kết quả nào. Vòng khác sẽ ra số
> khác, đó chính là điều nó muốn cho thấy. Chỉ `SE = 0,592` và `KTC = [−1,414 · +0,911]` mới là
> con số chính thức, lấy từ `kq-uoc-luong-chinh.csv`.

Về mặt toán: xác suất một món không trúng lần nào là `(1 − 1/155)¹⁵⁵ ≈ 1/e ≈ 36,8%`, nên trung
bình mỗi vòng khoảng 57 món biến mất — vòng đo thật ra 60, đúng như dự đoán.

**Vì sao phải bốc đúng 155:** sai số phụ thuộc cỡ mẫu. Bốc gấp bốn thì sai số tụt còn nửa, và
kết quả sẽ trông như có ý nghĩa thống kê trong khi thực ra chỉ là giả vờ có 1.148 mặt hàng.

Trong code, `rng.integers(0, len(d1), len(d1))` — tham số thứ hai là **rổ có bao nhiêu món**,
tham số thứ ba là **bốc bao nhiêu lần**, cả hai đều `len(d1)`. Chính chỗ `len(d1)` lặp hai lần
đó là quy tắc "bốc đúng bằng cỡ mẫu gốc", viết thẳng trong code.

Chi tiết nữa: mỗi vòng phải **chia lại tầng từ đầu**, không giữ ranh giới tầng cũ — vì ranh
giới tầng cũng ước lượng từ dữ liệu nên cũng phải chịu bất định.

---

## Slide 16 phụ — nếu còn chỗ: bốn sai số đến từ hai nguồn khác nhau

| Cách | Sai số tính bằng | Vì sao |
|---|---|---|
| 1 · thô | công thức HC3 | hệ số OLS có công thức đóng sẵn |
| 2 · hiệp biến | công thức HC3 | như trên |
| 3 · g-computation | bootstrap 5.000 | không có công thức đóng |
| 4 · phân tầng | bootstrap 5.000 | không có công thức đóng |

Khoảng tin cậy cũng theo hai kiểu: cách 1–2 dùng `ước lượng ± 1,96 × SE`; cách 3–4 cắt trực
tiếp phân vị 2,5%/97,5% trên 5.000 con số. Cách sau không ép khoảng tin cậy phải đối xứng, nên
nếu phân phối lệch một bên thì khoảng cũng lệch theo.

p-value bootstrap tính bằng `(số vòng cực đoan + 1)/(5.000 + 1)`. Cộng 1 để **không bao giờ ra
p = 0** — 5.000 vòng không đủ để khẳng định một xác suất bằng 0 tuyệt đối.

### Điều cả bốn sai số đều KHÔNG đo

Cả công thức lẫn bootstrap chỉ trả lời: *nếu cửa hàng có tập mặt hàng khác đi thì con số nhảy
bao nhiêu*. Chúng không đo:

| Bất định nằm ngoài SE | |
|---|---|
| Nhóm bia rượu có phải đối chứng hợp lệ không | cổng cân bằng đã trượt |
| Phân loại Z theo tên hàng có đúng không | 23 SKU chưa rõ, chạy độ nhạy riêng |
| Một cửa hàng đại diện được cho cái gì | không |
| Chỉ có **một** chính sách, **một** thời điểm | không lặp lại được |

Ý cuối là chỗ dễ bị bắt lỗi nhất: dù có 287 hay 287.000 mặt hàng thì vẫn chỉ có một chính sách
áp một lần ở một cửa hàng. Bất định ở cấp đó không ước lượng được, nên đồ án khóa sẵn quy tắc
cấm viết những câu tương ứng — xem [phase 03](phase-03-doc-ket-qua-va-bay.md#bang-cau-cam).

Câu nói gọn khi thuyết trình:

> Sai số ±0,6 là bất định về việc bốc trúng mặt hàng nào, không phải bất định về việc kết luận
> có đúng hay không. Cái thứ hai lớn hơn nhiều và không có con số nào diễn tả được.
