# 10 — Truy nguyên hai cờ đỏ và đặc tả hậu kiểm loại tháng 4/2025

> ⚠️ **Đọc §0 trước.** Đây là một **đặc tả hậu kiểm** (post-hoc), không phải quy tắc tiền định. Cách trình bày sai sẽ biến nó thành p-hacking trá hình.

## 0. Trình tự thật — phải công khai trong báo cáo

Trình tự thực tế đã diễn ra:

1. Sửa lỗi đặc tả code (vòng 3) → thấy **hệ số lead tháng 4 bất thường** (−1,37 rồi −1,84)
2. Bất thường đó là **tác nhân** khiến nhóm mở cuộc kiểm tra chất lượng dữ liệu
3. Kiểm tra phát hiện lỗ hổng 39 ngày và mốc mã vạch 21/04
4. Thử loại tháng 4 → hai cờ đỏ biến mất

**Không được viết** rằng quy tắc loại tháng 4 được đặt ra trước khi xem kết quả. Nó không được đặt trước. Cách trình bày trung thực: gọi đây là **"đặc tả hậu kiểm dựa trên chẩn đoán chất lượng dữ liệu"**, công khai trình tự trên, và **báo cáo song song cả ba cửa sổ** (04+05+06, 05+06, chỉ 06) — không chỉ trình bày cửa sổ cho kết quả đẹp nhất.

**Lý do loại phải nêu cho đúng.** Lý do **không phải** "tháng 4 chỉ có 10 ngày" — vì phân tích vẫn dùng tháng 6 (20 ngày) và tháng 8 (17 ngày), nên "tháng không đầy đủ" không phải một quy tắc nhất quán. Lý do mạnh nhất và duy nhất giữ được là **đứt gãy chế độ thu thập dữ liệu**: trường mã vạch chuyển từ 0% lên 100% đúng ngày 21/04, ngay sau lỗ hổng 39 ngày. Đó là hai chế độ ghi nhận khác nhau, không so sánh trực tiếp được.

**Giới hạn của bằng chứng.** Lỗ hổng và thay đổi hệ thống chứng minh tháng 4 **khó so sánh**; chúng **không chứng minh** giá tháng 4 bị ghi sai, cũng không chứng minh hệ thống mã vạch là nguyên nhân chắc chắn của hệ số lead.

Script: [`code/12`](code/12-lo-hong-du-lieu-va-ma-vach.py) · [`code/13`](code/13-chan-doan-thang-4.py) · [`code/14`](code/14-kiem-chung-bo-thang-4.py) · [`code/15`](code/15-DAC-TA-SACH-ket-qua-chinh.py)

---

## 1. Phát hiện: dữ liệu có lỗ hổng lớn chưa từng được ghi nhận

Kiểm tra ngày có hóa đơn bán ra (`daxoa=0`) từ 01/02/2025:

| Khoảng thiếu | Số ngày |
|---|---|
| 08/02 → 11/02 | 4 |
| 15/02 → 16/02 | 2 |
| **13/03 → 20/04** | **39** ⚠️ |
| 04/05 → 05/05 | 2 |
| **02/06 → 10/06** (trùng thời điểm dời cửa hàng) | **9** |

**Chỉ 136/196 ngày trong kỳ có dữ liệu.**

## 2. Trường mã vạch bắt đầu được điền đúng ngày 21/04/2025

| Tuần | Tỷ lệ dòng có `ma_hh_ct` |
|---|---|
| 03/02 → 16/03 | **0,0%** |
| **21/04 → 27/04** | **100,0%** |
| Từ đó về sau | 100,0% |

Không có giai đoạn chuyển tiếp — mã vạch chuyển từ 0% sang 100% ngay lập tức, đúng ngày đầu tiên sau lỗ hổng 39 ngày.

## 3. Vì thế "tháng 4" trong event study thực chất là gì

| Tháng | Số ngày có dữ liệu | Ghi chú |
|---|---|---|
| **2025-04** | **10** (21/04 → 30/04) | 10 ngày đầu sau lỗ hổng 39 ngày, hệ thống mã vạch vừa chạy, sát lễ 30/4–1/5 |
| 2025-05 | 28 | |
| 2025-06 | 20 | thiếu 02–10/06 do dời cửa hàng |
| 2025-07 | 31 | |
| 2025-08 | 17 | cắt tại 17/08 |

Số SKU quan sát được trong tháng 4 cũng thấp hẳn: treated **74/156**, ĐC 10% **101/161**.

---

## 4. Bác bỏ giả thuyết ban đầu

Giả thuyết tôi đưa ra trước đó: hệ số lead tháng 4 âm là do **SKU mới gia nhập** khi mã vạch bắt đầu được điền.

**Kiểm chứng:** lọc chỉ giữ SKU có mặt ở **cả ba** tháng tiền kỳ (04, 05, 06) — panel cân bằng, không còn hiệu ứng gia nhập.

| Đặc tả | Lead tháng 4, ĐC 10% | Lead tháng 4, ĐC 8% |
|---|---|---|
| Toàn mẫu | −1,374 (p=0,123) | −1,352 (p=0,074) |
| **Panel cân bằng** (T=54, C10=81) | **−1,842 (p=0,033)** | **−1,769 (p=0,019)** |

→ **Giả thuyết bị bác bỏ.** Lọc panel cân bằng làm hệ số *xấu đi* và trở nên có ý nghĩa thống kê. Nguyên nhân không phải thành phần SKU.

## 5. Cái gì đang xảy ra trong 10 ngày cuối tháng 4

Thay đổi giá trong cùng SKU giữa tháng 4 và tháng 5:

| Nhóm | n SKU | % SKU đổi giá 4→5 | Thay đổi TB |
|---|---|---|---|
| **Treated** | 63 | **15,9%** | **+1,44%** |
| ĐC 10% | 85 | 8,2% | +0,47% |
| ĐC 8% | 1.319 | 9,4% | +0,34% |

Nhóm treated có tỷ lệ đổi giá gần **gấp đôi** trong cửa sổ này. Nhưng đó chỉ là **10 SKU** trên tổng 63 quan sát được — một cửa sổ 10 ngày, ngay sau khi hệ thống mã vạch khởi động, sau lỗ hổng 39 ngày.

**Diễn giải — nêu ở mức giả thuyết, không phải kết luận:** giá ghi nhận trong 10 ngày đầu của một chế độ thu thập dữ liệu mới có thể chưa phản ánh trạng thái định giá ổn định. Đây là **cách giải thích hợp lý**, chưa được chứng minh. Không viết "nguyên nhân thật là…".

---

## 6. Bỏ tháng 4 thì hai cờ đỏ có biến mất không?

> ⚠️ Việc "hai cờ đỏ biến mất" **không phải lý do để loại dữ liệu**. Nó là quan sát về độ nhạy của kết quả với cửa sổ mẫu, và phải được báo cáo đúng như vậy.

### Cờ đỏ 2 — độ nhạy theo nhóm đối chứng

Đặc tả "+ hiệp biến tiền kỳ", nhóm đối chứng 8%:

| Định nghĩa tiền kỳ | ATT | p |
|---|---|---|
| 04+05+06 (gốc) | +1,225% | **0,038** ⚠️ |
| 05+06 (bỏ tháng 4) | +0,960% | 0,121 |
| Chỉ 06 | +0,423% | 0,451 |

Hệ số **suy giảm đơn điệu** khi giảm trọng số của tháng 4 và mất ý nghĩa thống kê. → Đây là **hiện vật của tháng 4**, không phải phát hiện bền vững.

### Cờ đỏ 1 — xu hướng song song

Giả dược trong nội bộ cửa sổ 05 → 06, không dính tháng 4:

| Nhóm đối chứng | β | se | p |
|---|---|---|---|
| ĐC 10% | −0,384 | 0,536 | 0,474 |
| ĐC 8% | −0,562 | 0,513 | 0,274 |

**Phát biểu đúng:** *trong cửa sổ 05→06 không phát hiện phân kỳ giá giữa hai nhóm; do chỉ có một kỳ lead, kết quả này **không xác nhận** giả định xu hướng song song.*

Không viết "giả định xu hướng song song đã được giải quyết".

### Kết luận chính không đổi qua mọi định nghĩa tiền kỳ

| Tiền kỳ | ATT (ĐC 10%) | ATT (ĐC 8%) |
|---|---|---|
| 04+05+06 | +0,011 (p=0,984) | +0,289 (p=0,565) |
| 05+06 | −0,252 (p=0,662) | −0,115 (p=0,823) |
| Chỉ 06 | −0,381 (p=0,538) | −0,245 (p=0,657) |

---

## 7. Đặc tả hậu kiểm — khuyến nghị dùng làm đặc tả chính

**Mẫu:** tiền kỳ = 05+06/2025, hậu kỳ = 07+08/2025. Loại tháng 4 vì **đứt gãy chế độ thu thập dữ liệu** (mã vạch 0% → 100% ngày 21/04, ngay sau lỗ hổng 39 ngày).

> ⚠️ **Đây là đặc tả hậu kiểm.** Xem §0 về trình tự thật và cách trình bày trung thực. Khóa đặc tả này **kể từ 25/07/2026** và áp dụng đồng nhất cho mọi phân tích còn lại; mọi thay đổi sau mốc này phải ghi ngày và lý do.

153 SKU treated · 157 ĐC 10% · 1.908 ĐC 8% · 82.109 dòng hàng.

### Kết quả chính

| | ĐC 10% (n=310) | ĐC 8% (n=2.061) |
|---|---|---|
| **ATT giá gồm thuế** | **−0,252%** [−1,382; +0,878] | **−0,115%** [−1,128; +0,897] |
| p | 0,662 | 0,823 |
| **ATT giá chưa thuế** | **+1,528%** (p=0,0081) | **+1,665%** (p=0,0013) |
| **Pass-through** | **+0,138** [−0,478; +0,753] | **+0,063** [−0,489; +0,615] |
| **H₀ chuyển hoàn toàn (−1,835%)** | **BÁC BỎ, p=0,0061** | **BÁC BỎ, p=0,0009** |
| TOST biên ±0,459% (25% pass-through) | p=0,360 ❌ | p=0,253 ❌ |
| TOST biên ±0,917% (50% pass-through) | p=0,124 ❌ | p=0,060 ❌ |
| Bootstrap KTC 95% | [−1,340; +0,866] | [−1,108; +0,876] |

**Hai nhóm đối chứng giờ nhất quán** — điểm ước lượng cùng dấu, cùng độ lớn, khoảng tin cậy chồng nhau gần hoàn toàn. Đây là cải thiện lớn nhất so với bản 2.

### Kiểm định vững — tất cả đều sạch

| Kiểm định | ĐC 10% | ĐC 8% |
|---|---|---|
| Giả dược trong tiền kỳ (05→06) | −0,384 (p=0,474) | −0,562 (p=0,274) |
| Cửa sổ hẹp từ 11/06 (chỉ địa điểm mới) | −0,289 (p=0,655) | −0,171 (p=0,767) |

---

## 8. Điều gì thay đổi, điều gì không

| | Bản 2 | Bản 3 (đặc tả sạch) |
|---|---|---|
| Bác bỏ chuyển hoàn toàn | ✅ p=0,0009 | ✅ p=0,0061 / 0,0009 |
| Kết luận tương đương 0 | ❌ không được | ❌ không được (không đổi) |
| Giá chưa thuế tăng | ✅ +1,79% | ✅ +1,53% / +1,67% |
| **Hai nhóm đối chứng nhất quán** | ❌ mâu thuẫn (p=0,038) | ✅ **nhất quán** |
| **Xu hướng song song** | ⚠️ hai tín hiệu xấu | ✅ **giả dược tiền kỳ sạch** |
| Sản lượng | ⚠️ MDE 87% | ⚠️ không đổi |

**Kết luận cốt lõi không đổi**, nhưng **độ tin cậy tăng đáng kể**: không còn mâu thuẫn giữa hai nhóm đối chứng, và giả định nhận dạng có bằng chứng hỗ trợ thay vì tín hiệu cảnh báo.

---

## 9. Hệ quả phải ghi vào báo cáo

1. **Bổ sung lỗ hổng 39 ngày (13/03–20/04) vào phần mô tả dữ liệu.** Đây là thiếu sót của các bản trước — chưa từng ghi nhận.
2. **Công khai trình tự hậu kiểm** (§0): bất thường ở hệ số lead là tác nhân mở cuộc kiểm tra dữ liệu. Gọi đúng tên là *đặc tả hậu kiểm dựa trên chẩn đoán chất lượng dữ liệu*.
3. **Báo cáo song song cả ba cửa sổ** (04+05+06 / 05+06 / chỉ 06) kèm hệ số, KTC và p-value. Chỉ nhấn mạnh **kết luận ổn định qua các cửa sổ** — mà ở đây kết luận "bác bỏ chuyển hoàn toàn" đúng là ổn định qua cả ba.
4. **Lý do loại phải là đứt gãy chế độ thu thập**, không phải "tháng không đủ ngày" — vì tháng 6 (20 ngày) và tháng 8 (17 ngày) vẫn được giữ.
5. **Kỳ tiền can thiệp chỉ còn 2 tháng, 1 kỳ lead.** Không được viết "xu hướng song song đã được xác nhận". Câu đúng: *"Trong cửa sổ 05→06 không phát hiện phân kỳ giá (p = 0,474 và 0,274); do chỉ có một kỳ lead, kết quả không xác nhận giả định xu hướng song song."*
6. **Khóa đặc tả từ 25/07/2026.** Ghi ngày khóa, áp dụng đồng nhất, mọi thay đổi sau đó phải có ngày và lý do — để chống việc mở rộng không gian đặc tả (20 script × nhiều đối chứng × nhiều cửa sổ tạo ra rất nhiều bậc tự do cho người phân tích).
7. Vẫn phải làm: lưới độ nhạy survivorship, chạy lại giả dược 01/05 và toàn bộ phân tích phụ trên đặc tả đã khóa.
