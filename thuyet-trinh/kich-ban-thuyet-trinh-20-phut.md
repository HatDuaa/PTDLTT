# Kịch bản thuyết trình — 20 phút

Bám theo 25 slide ở `/trinh-bay`. Chèn demo trang `/demo` sau slide 23.

**Mọi con số dưới đây gõ tay từ `ket-qua/*.csv`.** Chạy lại pipeline thì phải đối
chiếu lại — không như slide và web (đọc thẳng từ pipeline nên không thể lệch).

## Ngân sách thời gian

| Đoạn | Slide | Phút |
|---|---|---|
| Mở đầu và dữ liệu | 1–7 | 4:05 |
| Đại lượng đo và vấn đề | 8–10 | 2:40 |
| Phương pháp | 11–19 | 5:40 |
| Kết quả | 20–23 | 3:40 |
| **Demo trực tiếp** | — | **2:30** |
| Hạn chế và kết luận | 24–25 | 1:15 |
| | | **19:50** |

Còn dư 10 giây so với 20 phút — coi như không có. Cắt ba slide đánh dấu *cắt được*
thì dôi ra thêm **1 phút 20**, đủ đệm cho phần hỏi đáp giữa chừng.

**Nếu bị hối, cắt theo thứ tự này:** slide 5 → slide 13 → slide 4. Ba slide này
là chi tiết kỹ thuật, bỏ đi không ai hỏi. **Đừng bao giờ cắt** slide 9, 10, 21, 23
— cắt là mất mạch lập luận.

---

# Phần 1 — Mở đầu và dữ liệu

### Slide 1 — Bìa · 20s

> Chào thầy và các bạn. Nhóm 5 làm đề tài: việc giảm thuế giá trị gia tăng từ 10%
> xuống 8% có thật sự làm giảm giá bán lẻ mà người mua phải trả không.

**Chuyển:** Vì sao câu hỏi này không hiển nhiên như nghe qua.

### Slide 2 — Đặt vấn đề · 50s

> Nhà nước giảm thuế để hỗ trợ người tiêu dùng. Nhưng nhà nước chỉ quyết định thuế
> suất, còn cửa hàng mới là bên quyết định giá niêm yết. Hai quyết định đó độc lập
> với nhau.
>
> Nên chuyện thuế giảm mà giá có giảm theo hay không là một câu hỏi **thực nghiệm**,
> phải đi đo, chứ không suy ra được.

**Chuyển:** Nhóm đo bằng dữ liệu gì.

### Slide 3 — Dữ liệu · 40s

> Hóa đơn điện tử của một cửa hàng tiện lợi ở TP.HCM, ghi ở cấp từng dòng hàng.
> Mỗi dòng có mã hàng, thuế suất được áp, và số tiền sau thuế.
>
> Cấp dòng là điểm quan trọng: nó cho phép theo dõi **cùng một mã hàng** trước và
> sau ngày chính sách, thay vì so hai giỏ hàng khác nhau.

**Chuyển:** Dữ liệu thô phải qua vài bước lọc.

### Slide 4 — Xử lý dữ liệu · 30s · *cắt được*

> Mỗi bước lọc đều ghi rõ quy tắc và số dòng còn lại, để ai đọc cũng dựng lại được.
> Cuối cùng còn 287 mã hàng đủ điều kiện so sánh.

**Chuyển:** Trước khi chọn cửa sổ thời gian, nhóm rà độ phủ.

### Slide 5 — Phân bổ theo thời gian · 25s · *cắt được*

> Nhóm đếm số hóa đơn theo từng tháng để xem đoạn nào dữ liệu mỏng, rồi mới chọn
> cửa sổ phân tích — chứ không chọn trước rồi mới nhìn.

**Chuyển:** Còn một thứ phải kiểm trước khi phân tích.

### Slide 6 — Đánh giá sơ bộ · 40s

> Nhóm đếm thuế suất ghi trên hóa đơn của từng mặt hàng, trước và sau ngày chính
> sách. Đây là chỗ phát hiện ra một chuyện quan trọng: **có những mặt hàng luật cho
> giảm nhưng cửa hàng vẫn xuất 10%.**
>
> Nên phải tách bạch hai thứ: mặt hàng có **đủ điều kiện** giảm thuế theo luật, và
> thuế suất cửa hàng **thực sự áp**. Hai cái này không trùng nhau.

**Chuyển:** Cơ sở pháp lý là thứ tạo ra nhóm đối chứng.

### Slide 7 — Cơ sở pháp lý · 40s

> Nghị quyết 204 năm 2025, hiệu lực mùng 1 tháng 7. Điểm hay là nó **không giảm cho
> tất cả**: rượu bia, thuốc lá, xăng dầu, viễn thông vẫn giữ 10%.
>
> Chính chỗ loại trừ đó cho nhóm mình một nhóm đối chứng có sẵn — cùng cửa hàng,
> cùng khoảng thời gian, chỉ khác ở chỗ được giảm thuế hay không. Đây là một **thí
> nghiệm tự nhiên**.

**Chuyển:** Vậy đo cái gì trên từng mặt hàng.

---

# Phần 2 — Đại lượng đo và vấn đề

### Slide 8 — Đại lượng cần đo · 55s

> Mỗi mặt hàng cho đúng một con số: giá sau so với giá trước, tính bằng log rồi nhân
> 100.
>
> Dùng log chứ không lấy hiệu giá thô vì hai lý do. Một là giá bán lẻ lệch phải rất
> mạnh — vài mặt hàng đắt gấp trăm lần mặt hàng rẻ, nếu lấy hiệu thì mấy món đắt
> chi phối hết. Hai là ta quan tâm **thay đổi bao nhiêu phần trăm**, chứ không phải
> bao nhiêu đồng.
>
> Nhân 100 chỉ để con số dễ đọc: một điểm log xấp xỉ một phần trăm.

**Chuyển:** Đo xong thì ra thế này.

### Slide 9 — Kết quả đo được · 55s · **KHÔNG CẮT**

> Đây là chỗ đầu tiên gây bất ngờ. Nhóm được giảm thuế: 155 mặt hàng, giá trung bình
> **tăng 0,62 điểm**. Nhóm không được giảm: 132 mặt hàng, **tăng 1,02 điểm**.
>
> Cả hai nhóm đều **tăng** giá. Không nhóm nào giảm.
>
> Nhưng nhóm được giảm thuế tăng **ít hơn** — chênh lệch là 0,40 điểm.

**Chuyển:** Câu hỏi tiếp theo là 0,40 điểm đó có phải do chính sách không.

### Slide 10 — Vì sao chưa dùng thẳng được · 50s · **KHÔNG CẮT**

> Chưa. Vì hai nhóm này khác nhau sẵn từ đầu — một bên là rượu bia thuốc lá, một bên
> là hàng tiêu dùng thường ngày. Chúng vốn đã có nhịp đổi giá khác nhau, kể cả khi
> **không có chính sách nào cả**.
>
> Nên 0,40 điểm này đang trộn hai thứ: phần do chính sách, và phần do hai nhóm vốn
> khác nhau. Việc còn lại của bài là tách hai phần đó ra.

**Chuyển:** Nhóm dùng khung nào để tách.

---

# Phần 3 — Phương pháp

### Slide 11 — Khung phương pháp · 45s

> Ý tưởng: lấy mức đổi giá của nhóm được giảm thuế, trừ đi mức đổi giá của nhóm đối
> chứng. Phần còn lại là ước lượng tác động.
>
> Cách này đứng được là nhờ một giả định: **nếu không có chính sách, hai nhóm sẽ đổi
> giá theo cùng một xu hướng.** Lát nữa nhóm sẽ nói thẳng là giả định này có vấn đề.

**Chuyển:** Để nói rõ cái gì cần kiểm soát, nhóm vẽ đồ thị nhân quả.

### Slide 12 — Đồ thị nhân quả · 45s

> Đây là bản đồ cái gì ảnh hưởng cái nào.
>
> Điểm cần chú ý: **thuế suất cửa hàng thực áp nằm ở giữa** — giữa việc mặt hàng có
> đủ điều kiện giảm thuế và giá cuối cùng. Nó là **biến trung gian**.
>
> Vì thế nhóm ước lượng theo **đủ điều kiện theo luật**, chứ không hồi quy theo thuế
> suất thực áp. Kiểm soát biến trung gian là chặn mất đúng con đường mình cần đo.

**Chuyển:** Từng biến trong sơ đồ được đo bằng gì.

### Slide 13 — Gắn biến vào dữ liệu · 25s · *cắt được*

> Mỗi biến trong khung ứng với một trường cụ thể trên hóa đơn — không có biến nào
> là suy diễn hay gán tay.

**Chuyển:** Nhóm ước lượng bằng bốn cách.

### Slide 14 — Bốn cách — tổng quan · 35s

> Bốn cách này **giống nhau ở đại lượng đo và ở nhóm can thiệp**. Chúng chỉ khác nhau
> ở một chỗ: xử lý các biến kiểm soát thế nào.
>
> Làm bốn cách không phải để chọn ra cái đúng nhất, mà để xem kết luận có đổi khi
> đổi cách làm không.

### Slide 15 — Cách 1: hồi quy thô · 35s

> Không trừ gì cả, lấy thẳng chênh lệch hai nhóm. Ra **−0,40 điểm**.
>
> Đây không phải để tin, mà là mốc so sánh — để biết ba cách sau kéo con số đi được
> bao nhiêu.

### Slide 16 — Cách 2: hồi quy có hiệp biến · 40s

> Thêm các đặc điểm nền vào cùng một phương trình, cho nó hút bớt phần khác biệt sẵn
> có. Ra **−0,27 điểm**.
>
> Một chi tiết đáng nói: thêm biến vào mà **sai số chuẩn lại tăng**, từ 0,60 lên
> 0,73. Nghe như lỗi, nhưng đúng — vì các biến kiểm soát tương quan với biến can
> thiệp, tức là đa cộng tuyến. Nhóm có kiểm lại bằng công thức và nó khớp.

### Slide 17 — Cách 3: g-computation · 45s

> Cách này khác hẳn về tư duy. Nhóm dựng mô hình **chỉ trên nhóm đối chứng** — tức
> là học xem "không có chính sách thì giá đổi thế nào".
>
> Rồi lấy đúng mô hình đó áp lên nhóm được giảm thuế, để dự đoán: nếu nhóm này không
> có chính sách thì giá lẽ ra đã đổi bao nhiêu. Lấy thực tế trừ đi dự đoán đó.
>
> Ra **−0,66 điểm** — con số lớn nhất trong bốn cách.

### Slide 18 — Cách 4: phân tầng theo mức giá · 35s

> Chia thành 5 tầng theo mức giá nền, chỉ so những mặt hàng giá gần nhau, rồi gộp
> lại theo trọng số. Ra **−0,26 điểm**.

**Chuyển:** Trước khi đọc kết quả, phải nói một chuyện.

### Slide 19 — Kiểm tra thiết kế · 35s

> Bốn cách này **không kiểm chứng lẫn nhau**, vì cả bốn cùng dựa trên một giả định
> gốc là xu hướng song song. Bốn cách cùng ra kết quả giống nhau không chứng minh
> giả định đó đúng.
>
> Và nhóm phải nói thẳng: **cổng kiểm tra cân bằng đã trượt.** Đó là hạn chế thật,
> lát nữa quay lại.

---

# Phần 4 — Kết quả

### Slide 20 — Bốn ước lượng · 60s · **KHÔNG CẮT**

> Bốn con số: **−0,40 · −0,27 · −0,66 · −0,26**.
>
> Hai điều đọc được. Thứ nhất, **cả bốn đều âm** — tức đều cùng chiều với việc chính
> sách có tác dụng phần nào.
>
> Thứ hai, và quan trọng hơn: **cả bốn khoảng tin cậy đều phủ qua 0**, p-value từ
> 0,40 tới 0,71. Nghĩa là với cỡ mẫu này, nhóm **không thể loại trừ khả năng tác
> động bằng 0**.

**Chuyển:** Từ chênh lệch này ra tỉ lệ chuyển thuế thế nào.

### Slide 21 — Từ chênh lệch ra tỉ lệ · 60s · **KHÔNG CẮT — CHỖ DỄ HIỂU SAI NHẤT**

Nói chậm slide này. Đây là chỗ người nghe hay hiểu ngược.

> Gốc so sánh **không phải số 0**. Nếu không có chính sách, giá lẽ ra đã tăng 1,02
> điểm. Thực tế nhóm được giảm thuế chỉ tăng 0,62. Vậy chính sách kéo lại được 0,40.
>
> Còn nếu chuyển hết phần thuế vào giá thì lẽ ra phải kéo được **1,835 điểm** — đó
> là con số số học từ 1,08 chia 1,10.
>
> Lấy 0,40 chia 1,835 ra **22%**.
>
> **Xin nhấn mạnh: 22% không có nghĩa là giá giảm 22%.** Giá vẫn tăng. 22% là phần
> trăm **của mức lẽ ra kéo được**. Nói cách khác: lẽ ra giá phải thấp hơn 1,8%, nhóm
> chỉ đo được 0,4%.
>
> Bốn cách cho khoảng **14% đến 36%**.

**Chuyển:** Nhưng con số này thừa hưởng toàn bộ bất định của giả định. Nên nhóm làm
thêm một kiểm chứng không cần giả định nào.

### Slide 22 — Hai câu hỏi khác nhau · 45s

> Bảng này để tránh hiểu nhầm là nhóm đang mâu thuẫn với chính mình.
>
> Tỉ lệ chuyển thuế là ước lượng **nhân quả** — mạnh về ý nghĩa, nhưng phụ thuộc giả
> định xu hướng song song, mà giả định đó đang lung lay.
>
> Bám chuẩn cơ học thì **không cần giả định nào**, nhưng nó chỉ **mô tả** — nó không
> nói được nguyên nhân.
>
> Mỗi cái mạnh đúng chỗ cái kia yếu.

### Slide 23 — Chuẩn giá cơ học · 55s · **KHÔNG CẮT**

> Cách làm rất đơn giản, không dùng nhóm đối chứng gì cả. Với mỗi mặt hàng, lấy giá
> trước nhân 1,08 chia 1,10, làm tròn về bội số 1000 đồng. Đó là **giá lẽ ra phải
> có**. Rồi đối chiếu với giá thật.
>
> Trong 155 mặt hàng được giảm thuế, có **135 mặt hàng lẽ ra phải đổi giá**. Kết quả:
> **đúng 1 mặt hàng** rơi vào mức đó. Một trên một trăm ba mươi lăm.
>
> Và **110 mặt hàng giữ nguyên y nguyên giá cũ**, không xê dịch một đồng.
>
> Nhóm có chạy giả dược trên nhóm đối chứng: 1 trên 92 — tức là tỉ lệ bám chuẩn ở
> nhóm được giảm thuế **không hề cao hơn** nhóm lẽ ra không chịu tác động nào.

**Chuyển:** Để thấy rõ, nhóm demo trực tiếp.

---

# Demo trực tiếp · 2:30

Mở tab `/demo`. Ba thao tác, không nói gì về phương pháp — chỉ cho thấy kết quả.

**1. Món duy nhất đạt chuẩn · 50s**

Bấm nút gợi ý **SUNLIGHT NLS Hương Lavender 997ml**.

> Đây là mặt hàng duy nhất trong 135 món rơi đúng mức: 39.000 xuống 38.000.

**2. Món giữ nguyên giá · 50s**

Bấm **VASELINE Son dưỡng môi**.

> Còn đây là trường hợp phổ biến hơn nhiều. Giá lẽ ra phải là 94.000. Thực tế vẫn
> 96.000 — y hệt trước ngày chính sách.

**3. Máy tính giá · 50s**

Gõ **10.000** vào ô giá.

> Và đây là một phần lý do. Với hàng giá thấp, sau khi làm tròn về bội số 1000 đồng
> thì giá quay về đúng mức cũ — mức giảm không đủ để vượt một bước làm tròn.
>
> Nhóm có mô phỏng: nếu cửa hàng làm tròn tới 100 đồng thì cả 155 mặt hàng đều phải
> đổi giá. Nên làm tròn giải thích được một phần, **nhưng không giải thích được 110
> mặt hàng đứng yên**.

*Nếu mạng hỏng hoặc web không lên: bỏ qua demo, nói thẳng ba con số 1/135, 110, và
ví dụ VASELINE. Slide 23 đã có đủ.*

---

# Phần 5 — Hạn chế và kết luận

### Slide 24 — Hạn chế · 40s

> Ba hạn chế, nhóm nói thẳng.
>
> Một, **cỡ mẫu nhỏ** — 287 mặt hàng, nên khoảng tin cậy rộng và dữ liệu chưa đủ
> mạnh để khẳng định có tác động.
>
> Hai, **cổng cân bằng đã trượt**, nên giả định xu hướng song song không được dữ liệu
> ủng hộ hoàn toàn.
>
> Ba, **một cửa hàng**, không suy rộng ra cả thị trường được.
>
> Ba hạn chế này ảnh hưởng tới **độ lớn** con số ước lượng. Chúng **không** lật ngược
> được phần đếm cơ học, vì phần đó không dùng giả định nào.

### Slide 25 — Kết luận · 35s

> Kết luận của nhóm: **cửa hàng đã không chuyển hết phần giảm thuế vào giá bán lẻ.**
>
> Chỗ dựa chắc nhất không phải con số 14 đến 36% — con số đó còn bất định. Chỗ dựa
> chắc nhất là phép đếm: **1 trên 135 mặt hàng rơi đúng mức, và 110 mặt hàng giữ
> nguyên giá cũ.** Phép đếm đó không cần giả định nào.
>
> Và dù lý do là gì đi nữa — làm tròn, chi phí đổi nhãn, hay cửa hàng giữ lại phần
> chênh — thì **người mua vẫn đang trả giá cũ**.
>
> Nhóm xin hết. Cảm ơn thầy và các bạn.

---

# Q&A dự phòng

**"Khoảng tin cậy phủ 0 mà sao vẫn kết luận được?"**
> Nhóm không kết luận từ phần ước lượng nhân quả. Phần đó nhóm báo cáo là *chưa đủ
> bằng chứng*. Kết luận dựa trên phép đếm cơ học: 1 trên 135. Phép đếm đó không cần
> giả định xu hướng song song, cũng không cần nhóm đối chứng.

**"Sao không hồi quy theo thuế suất cửa hàng thực áp?"**
> Vì nó là biến trung gian, nằm giữa việc đủ điều kiện giảm thuế và giá. Kiểm soát
> biến trung gian sẽ chặn mất chính con đường cần đo. Nhóm ước lượng theo đủ điều
> kiện pháp lý, tức là ITT.

**"Bốn cách ra bốn số khác nhau, tin cái nào?"**
> Không tin riêng cái nào. Khoảng 14 đến 36% chính là câu trả lời trung thực — nó
> cho thấy kết quả nhạy với cách xử lý biến kiểm soát tới mức nào. Nếu chỉ báo một
> con số thì là giấu bớt thông tin.

**"Có phải chỉ vì làm tròn 1000 đồng không?"**
> Một phần, với hàng giá thấp. Nhưng nhóm mô phỏng lại: ở bước 1000 đồng vẫn có 135
> trên 155 mặt hàng lẽ ra phải đổi giá. Làm tròn không giải thích được 110 mặt hàng
> đứng yên.

**"Một cửa hàng thì nói lên được gì?"**
> Không suy rộng ra thị trường được, và nhóm ghi rõ điều đó trong phần hạn chế. Nhưng
> nó đủ để bác bỏ mệnh đề "giảm thuế thì đương nhiên giá giảm" — chỉ cần một phản ví
> dụ là đủ.

**"Nhóm đối chứng là rượu bia thuốc lá, so vậy có hợp lý không?"**
> Đây là điểm yếu nhóm tự nhận. Nhóm có chạy thêm ba định nghĩa nhóm đối chứng khác
> nhau, kết quả vẫn cùng chiều. Nhưng cổng cân bằng vẫn trượt, nên nhóm không nhận
> phần ước lượng nhân quả là bằng chứng mạnh.

**"Sao thêm biến kiểm soát mà sai số lại tăng?"**
> Do đa cộng tuyến — các biến kiểm soát tương quan với biến can thiệp. Nhóm kiểm lại
> bằng công thức hệ số phóng đại phương sai và con số khớp.
