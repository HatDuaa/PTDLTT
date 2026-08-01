# Phase 03 — Đọc kết quả và các bẫy (slide 21, 22)

> Hai slide cuối phần kết quả là chỗ dễ nói sai nhất. Câu hỏi "Y dương mà sao tỉ lệ chuyển thuế
> lại 22%" là câu người chấm rất dễ hỏi, và slide hiện tại không trả lời được.

---

<a id="slide-pass-through"></a>
## Slide 21 — Từ chênh lệch ra tỉ lệ chuyển thuế

**Tiêu đề:** giữ nguyên

**Câu chốt:** giữ nguyên

**Giữ nguyên** hai con số lớn, phép chia, ô "Đọc con số này thế nào" và bảng bốn cách.
**Bổ sung** khối giải thích gốc so sánh dưới đây — đây là phần đang thiếu.

### Mốc chuyển hoàn toàn từ đâu ra

Nếu cửa hàng giữ nguyên giá chưa thuế và chuyển toàn bộ phần giảm thuế vào giá bán:

```
100 × log( 1,08 / 1,10 ) = −1,835      (tương đương giá thấp hơn 1,8%)
```

Con số này **do luật quyết định**, không phải kết quả ước lượng. Nó suy ra từ hai thuế suất
trong `lib/hang-so-chinh-sach.ts`, không gõ tay.

### 🔴 Gốc so sánh KHÔNG phải số 0

Đây là khối quan trọng nhất của slide.

Câu hỏi nhân quả **không phải** "giá có giảm không". Nó là:

> Giá bây giờ khác **cái lẽ ra xảy ra nếu không có chính sách** bao nhiêu?

Mà "cái lẽ ra xảy ra" **không phải giá đứng im**. Nhóm đối chứng cho biết trong cùng hai tháng
đó, giá ở cửa hàng này **đang tăng** `+1,022`. Đó mới là gốc so sánh.

```
   +1,022  ← nếu không có chính sách, giá lẽ ra tăng chừng này
   +0,624  ← thực tế nhóm được giảm thuế chỉ tăng chừng này
   ───────
   −0,398  ← chính sách kéo lại được chừng này

   −1,835  ← nếu chuyển hết phần thuế, phải kéo được chừng này

   0,398 / 1,835 = 22%
```

### Câu trả lời cho "Y dương mà sao 22%"

> **22% là tỉ lệ kéo lại được so với mức lẽ ra kéo được — không phải giá giảm 22%.**
> Giá vẫn tăng, chỉ là tăng ít hơn kịch bản không có chính sách.

Ví von dùng được khi thuyết trình: giá cả cửa hàng như **thang cuốn đang đi lên**. Chính sách
không kéo giá xuống — nó làm thang **chậm lại một chút** ở nhóm được giảm thuế. Chậm được 22%
mức đáng lẽ chậm.

### Ngay sau đó phải nói phần trung thực

Toàn bộ con số 22% **đứng hay sập theo một giả định**: rằng nếu không có chính sách, giá hóa
chất sẽ tăng đúng như bia rượu đã tăng.

Giả định đó **không kiểm chứng trực tiếp được**, và cổng cân bằng của đồ án cho thấy nó đáng
ngờ — hai nhóm khác nhau đáng kể ngay từ trước chính sách (slide 10). Bia rượu có thể đã tăng
`+1,022` vì lý do riêng của bia rượu, chẳng liên quan gì tới hóa chất.

Chính vì thế mới cần slide tiếp theo.

---

<a id="slide-hai-cach-doc"></a>
## Slide 22 — Hai cách đọc kết quả 🆕

**Tiêu đề:** Hai câu hỏi khác nhau, hai câu trả lời khác nhau

**Câu chốt:** Một cách đọc cần giả định về nhóm đối chứng, cách còn lại không cần gì cả.

### Bảng chính

| | Câu hỏi nó trả lời | Kết quả | Cần giả định gì |
|---|---|---|---|
| **Tỉ lệ chuyển thuế**<br>14% – 36% | So với **kịch bản không có chính sách**, giá thấp hơn được bao nhiêu? | 14–36% mức lẽ ra | 🔴 xu hướng song song — **cổng cân bằng đã trượt** |
| **Bám chuẩn cơ học**<br>1 / 135 | Giá có rơi đúng **con số số học** phải có không? | gần như không | ✅ không cần giả định nào |

### Bám chuẩn cơ học làm gì

Chỉ một phép số học trên từng mặt hàng, không dùng nhóm đối chứng:

```
giá lẽ ra phải có = làm_tròn_nghìn( giá cũ × 1,08 / 1,10 )
đạt chuẩn nếu     | giá thật − giá lẽ ra |  <  1 đồng
```

| Nhóm được giảm thuế (Z=1) | |
|---|---|
| Số mặt hàng buộc phải đổi mức giá | 135 / 155 |
| **Rơi đúng mức lẽ ra** | **1** / 135 |
| **Giữ nguyên giá cũ y hệt** | **110** / 135 |
| Nhóm giả dược (Z=0), để đối chiếu | 1 / 92 |

Nhóm giả dược cho tỉ lệ ngang bằng, nghĩa là nhóm được giảm thuế **không hành xử khác** nhóm
không được giảm.

### Vì sao phải có cả hai cách đọc trên slide

Hai con số không mâu thuẫn — chúng trả lời hai câu khác nhau, và mỗi cái mạnh ở chỗ cái kia
yếu:

- **14–36%** là ước lượng nhân quả, nhưng thừa hưởng toàn bộ bất định của giả định xu hướng
  song song, và khoảng tin cậy của cả bốn cách đều phủ qua 0.
- **1/135** không cần giả định nào, nhưng chỉ mô tả — nó không nói được nguyên nhân, chỉ nói
  giá đã không rơi vào con số số học đáng lẽ phải có.

Đặt cạnh nhau, chúng là hai chân của cùng một kết luận.

### 🔴 Cảnh báo trình bày: tránh đặt cạnh hai tỉ lệ dễ trùng

Tỉ lệ mặt hàng buộc phải đổi mức giá (135/155) và tỉ lệ cửa hàng cập nhật thuế suất là **hai
con số đến từ hai tập mặt hàng hoàn toàn khác nhau**, nhưng làm tròn ra gần bằng nhau. Đặt sát
nhau trên cùng một slide là mời người nghe hiểu nhầm rằng chúng liên quan.

`code/b6_ra_soat_ngon_ngu.py` có kiểm tra tự động cho đúng chuyện này — nếu hai con số xuất
hiện cách nhau dưới 15 dòng trong bất kỳ file nào, script sẽ báo.

---

## Kiểm định mốc chuyển hoàn toàn — kết quả phụ thuộc phương pháp

Nếu định làm slide riêng về việc "đã chuyển hết chưa", phải để nguyên bảng này, không rút gọn.

| Cách | Ước lượng | SE | p với H₀: chuyển hoàn toàn | |
|---|---|---|---|---|
| 1 · thô | −0,398 | 0,600 | 0,017 | bác bỏ |
| 2 · hiệp biến | −0,270 | 0,733 | 0,033 | bác bỏ |
| **3 · g-computation** | **−0,664** | **0,776** | **0,131** | **KHÔNG bác bỏ** |
| 4 · phân tầng | −0,257 | 0,592 | 0,008 | bác bỏ |

**Vì sao cách 3 lệch:** nó vừa cho ước lượng xa 0 nhất (`−0,664`, tức tỉ lệ chuyển thuế cao
nhất 36%) vừa có sai số lớn nhất (`0,776`). Cả hai đều làm việc bác bỏ khó hơn. Khoảng cách từ
`−0,664` tới `−1,835` chỉ là `1,17` sai số chuẩn, trong khi cách 4 cách tới `2,66`.

Đồ án đã **khóa trước** quy tắc: không lấy "ba trên bốn" làm biểu quyết. Ba đặc tả bác bỏ,
một không — đó là **kết quả nhạy với mô hình**, không phải kết luận.

Câu dùng được trên slide:

> Cả bốn ước lượng điểm đều gần 0 hơn mốc chuyển hoàn toàn. Việc bác bỏ mốc đó phụ thuộc vào
> lựa chọn phương pháp, nên đây là kết quả nhạy với mô hình.

---

<a id="bang-cau-cam"></a>
## Bảng câu cấm — không được viết trên slide

Danh sách này đã khóa từ đặc tả §13 và được `code/b6_ra_soat_ngon_ngu.py` quét tự động trên
`bao-cao/`, `web/frontend/` và thư mục kế hoạch. Cột phải là câu thay thế đúng.

| ❌ Cấm viết | Vì sao sai | ✅ Thay bằng |
|---|---|---|
| "chính sách không có tác động" | không bác bỏ được ≠ bằng 0 | "không bác bỏ được giả thuyết tác động bằng 0" |
| "pass-through bằng 0" | TOST không kết luận được | "khoảng tin cậy phủ qua 0" |
| "cửa hàng giữ lại phần giảm thuế" | không có dữ liệu chi phí đầu vào | "phần giảm thuế không đi hết vào giá bán lẻ" |
| "hai phương pháp xác nhận lẫn nhau" | chung một chiến lược nhận dạng | "hai phương pháp cho kết quả gần nhau" |
| "đồ án chứng minh được quan hệ nhân quả" | cổng cân bằng đã trượt | "so sánh có điều chỉnh, chưa phải ước lượng nhân quả sạch" |
| "kết quả suy rộng cho ngành bán lẻ Việt Nam" | chỉ một cửa hàng | "kết quả trong phạm vi một cửa hàng" |
| "xu hướng song song đã được chứng minh" | cổng 3 không đạt | "giả định xu hướng song song không kiểm chứng đầy đủ được" |
| "giá có xu hướng giảm" | diễn giải vượt quá khoảng tin cậy | "ước lượng điểm âm, khoảng tin cậy phủ qua 0" |
| "suýt có ý nghĩa thống kê" | p-value không có ngưỡng "suýt" | nêu thẳng p bằng bao nhiêu |
| "đã xử lý ngụy lặp" | bất định cấp chính sách không ước lượng được | "bất định cấp chính sách nằm ngoài phạm vi đo" |

---

## Ba câu hỏi có khả năng bị hỏi cao nhất

| Câu hỏi | Trả lời ngắn | Slide nào chứa |
|---|---|---|
| "Vậy chính sách có tác dụng không?" | Chưa kết luận nhân quả được vì cổng cân bằng trượt. Nhưng đo được chắc chắn là giá bán lẻ đã không rơi vào mức số học lẽ ra phải có: 1/135. | 22 |
| "Sao mẫu chỉ có 287 mà đề bài đòi 2000?" | Dữ liệu có 233.996 dòng thô, 82.109 sau lọc, 2.218 mặt hàng trong danh mục. 287 là **mẫu so sánh chính** — số mặt hàng có giá quan sát được ở cả hai kỳ và phân loại được theo luật. | 3, 13 |
| "Tại sao cách 4 ra âm?" | Do một tầng giá 64k–96k. Bốn tầng còn lại cộng lại ra dương. | 18 |

---

## Việc kỹ thuật kèm theo

- [ ] Thêm `eda-mo-ta-theo-nhom.csv` vào `b3_eda.py` (xem [phase 01](phase-01-mo-dau-va-do-luong.md#ghi-chú-dựng-slide))
- [ ] Thêm endpoint `/api/eda/mo-ta-theo-nhom` và hook tương ứng
- [ ] Cập nhật `TONG` trong `trinh-bay/page.tsx` từ 20 lên 25
- [ ] Chạy `python code/b6_ra_soat_ngon_ngu.py`, xác nhận không tăng quá mốc 8 vấn đề
- [ ] Đo lại tràn dọc/ngang ở khổ 1600×1000 cho toàn bộ 25 slide
