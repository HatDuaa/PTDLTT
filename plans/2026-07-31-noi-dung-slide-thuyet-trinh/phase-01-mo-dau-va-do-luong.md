# Phase 01 — Mở đầu và đo lường (slide 8, 9, 10)

> Ba slide này trả lời ba câu theo đúng thứ tự: **đo cái gì → đo ra cái gì → vì sao chưa dùng
> thẳng được**. Không có chúng thì bốn cách ước lượng phía sau treo lơ lửng, người nghe không
> biết chúng đang sửa vấn đề gì.

---

<a id="slide-a"></a>
## Slide 8 — Đo cái gì: biến Y

**Tiêu đề:** Đại lượng cần đo

**Câu chốt:** Mỗi mặt hàng cho một con số duy nhất: giá sau so với giá trước, tính bằng log.

### Nội dung

Với mỗi mặt hàng, lấy **giá trung vị trước 01/07** và **giá trung vị sau 01/07**:

```
Y = 100 × log( giá sau / giá trước )
```

Ba ví dụ để người nghe bám vào:

| Mặt hàng | Giá trước | Giá sau | Y |
|---|---|---|---|
| Giữ nguyên giá | 50.000đ | 50.000đ | **0** |
| Giảm 1.000đ | 50.000đ | 49.000đ | **−2,02** |
| Tăng 2.000đ | 50.000đ | 52.000đ | **+3,92** |

### Vì sao dùng log thay vì phần trăm

Log **đối xứng**: tăng rồi giảm cùng một lượng thì về đúng chỗ cũ. Phần trăm thì không —
tăng 10% rồi giảm 10% ra 99%, không phải 100%.

Đơn vị gọi là **điểm log ×100**, xấp xỉ phần trăm khi giá trị nhỏ. Ví dụ `−2,02` điểm log
tương ứng giá giảm khoảng 2%.

### 🔴 Chỗ người nghe hay lẫn — phải tách rõ hai tầng

| | Làm gì | Ra bao nhiêu con số |
|---|---|---|
| **Tầng 1** — mỗi mặt hàng | chia giá sau cho giá trước, lấy log | 287 con số |
| **Tầng 2** — hai nhóm | trừ trung bình nhóm này cho nhóm kia | 1 con số |

"Chênh lệch hai nhóm" ở tầng 2 là **phép trừ**, không phải phép chia log. Phép chia log đã
xong từ tầng 1. Nếu không tách rõ, người nghe sẽ tưởng `−0,398` là kết quả của một phép log
nào đó.

### Đơn vị phân tích

Một dòng dữ liệu = **một mặt hàng**, không phải một hóa đơn. Câu hỏi nghiên cứu là về quyết
định định giá theo mặt hàng, nên mỗi mặt hàng đếm đúng một lần dù nó xuất hiện trên bao nhiêu
hóa đơn.

Mẫu so sánh chính: **287 mặt hàng** — 155 nhóm Z=1 (luật cho giảm), 132 nhóm Z=0 (bia, rượu,
thuốc lá — luật loại trừ).

---

<a id="slide-b"></a>
## Slide 9 — Đo ra cái gì: cả hai nhóm đều tăng giá

**Tiêu đề:** Kết quả đo được

**Câu chốt:** Giá của cả hai nhóm đều tăng. Nhóm được giảm thuế tăng ít hơn 0,4 điểm log.

### Bảng chính

| | Z=1 (được giảm) | Z=0 (đối chứng) |
|---|---|---|
| Số mặt hàng | 155 | 132 |
| **Y trung bình** | **+0,624** | **+1,022** |
| Y trung vị | 0,000 | 0,000 |
| **Độ lệch chuẩn** | **6,07** | **3,97** |
| Giữ nguyên giá y hệt | 126/155 | 103/132 |

### Ba điều phải nói ra, theo đúng thứ tự này

**Một — không nhóm nào giảm giá.** Cả hai trung bình đều **dương**. Đây là chỗ dễ hiểu nhầm
nhất của cả đồ án: `−0,398` mà mọi bảng phía sau đều nhắc **không phải "giá giảm 0,4%"**. Nó là
*chênh lệch giữa hai mức tăng*.

```
+1,022   nhóm đối chứng tăng
+0,624   nhóm được giảm thuế tăng
───────
−0,398   chênh lệch
```

**Hai — trung vị bằng 0 ở cả hai nhóm.** Nghĩa là **quá nửa số mặt hàng không đổi giá một
đồng nào**. Đếm chính xác: 126/155 và 103/132. Toàn bộ biến động nằm ở phần thiểu số còn lại.

**Ba — nhiễu gấp 15 lần tín hiệu.** Độ lệch chuẩn `6,07` trong khi thứ cần đo chỉ `0,4`.

Đây là **nguyên nhân gốc** khiến mọi khoảng tin cậy phía sau đều rộng và đều phủ qua 0. Không
phải phương pháp yếu — mà dữ liệu một cửa hàng, 287 mặt hàng, không đủ để tách một tín hiệu
nhỏ như vậy khỏi nhiễu. Nói trước điều này ở slide 9 thì đến slide 20 người nghe đã hiểu sẵn
vì sao khoảng tin cậy rộng.

---

<a id="slide-c"></a>
## Slide 10 — Vì sao chưa dùng thẳng được

**Tiêu đề:** Hai nhóm vốn đã khác nhau từ trước

**Câu chốt:** Kể cả không có chính sách nào, hai nhóm này vẫn sẽ đổi giá khác nhau.

### Bảng chính — ba đặc điểm nền, đo trước 01/07

| Đặc điểm | Z=1 (hóa chất, mỹ phẩm) | Z=0 (bia, rượu, thuốc lá) |
|---|---|---|
| Giá trung bình | 72.319đ | 108.913đ |
| **Số lượng bán trung bình** | **6,2** | **33,3** |
| Số tuần có giao dịch | 3,31 | 4,73 |

### Đọc bảng

Dòng giữa là dòng quan trọng nhất: **bia rượu bán gấp hơn năm lần** hàng hóa chất.

Đây không phải chi tiết nhỏ, vì nó nối thẳng tới hành vi định giá:

> Món bán chạy thì cửa hàng theo dõi giá sát và đổi giá thường xuyên theo chi phí đầu vào.
> Món bán ế thì giá nằm im hàng tháng.

Nên chênh lệch `−0,398` đo được ở slide 9 đang **trộn hai thứ vào nhau**:

```
−0,398  =  phần do chính sách  +  phần do "hóa chất khác bia rượu"
```

Không tách được hai phần đó thì không nói được gì về chính sách.

### Chốt slide — dẫn sang phần phương pháp

Bốn cách ước lượng ở phần sau là **bốn cách khác nhau để trừ phần thứ hai đi**. Chúng khác
nhau đúng ở chỗ đó, không khác ở cách đo Y hay cách chia nhóm.

---

## Ghi chú dựng slide

| Slide | Dữ liệu lấy từ | Cách lấy |
|---|---|---|
| 8 | không cần API | bảng ví dụ gõ tay — là minh họa công thức, không phải kết quả |
| 9 | cần bổ sung endpoint | xem mục dưới |
| 10 | cần bổ sung endpoint | xem mục dưới |

### 🔴 Việc kỹ thuật phải làm trước

Slide 9 và 10 cần các con số **chưa có trong bất kỳ CSV nào**: trung bình/độ lệch chuẩn Y theo
nhóm, và trung bình ba biến nền theo nhóm.

Hiện chúng chỉ tính được bằng cách đọc `mau-phan-tich-chinh.csv`, mà file đó **không** nằm
trong `ket-qua/` (nó ở `du-lieu-tam/`, không nộp kèm). Gõ tay các số này vào slide là vi phạm
nguyên tắc một nguồn duy nhất — và đúng loại lỗi đã xảy ra ba lần trong đồ án này.

Cách xử lý: thêm vào `b3_eda.py` một hàm ghi ra `eda-mo-ta-theo-nhom.csv` với các cột

```
nhom, n, y_tb, y_trung_vi, y_do_lech_chuan, n_giu_nguyen_gia,
pre_p_tb, pre_q_tb, pre_w_tb
```

rồi thêm endpoint `/api/eda/mo-ta-theo-nhom` như các bảng EDA khác. Sau đó slide đọc qua hook,
không gõ tay số nào.
