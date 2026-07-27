# 05 — Hạn chế và rủi ro

Tài liệu này liệt kê những gì thiết kế **không** làm được. Đọc kỹ trước khi viết bất kỳ kết luận nào.

---

## 1. Sức mạnh kiểm định

| Kiểm định | Vấn đề |
|---|---|
| **Xu hướng song song** | Chỉ **2 kỳ lead** (tháng 4 và 5, mốc chuẩn tháng 6) vì mã vạch chỉ có từ ~04/2025. Sau khi sửa đặc tả event study (thêm SKU FE), **hệ số lead tháng 4 là −1,374 (p=0,123) với ĐC 10% và −1,352 (p=0,074) với ĐC 8%** — độ lớn đáng kể. Cùng giả dược 01/05 (p=0,061) là **hai tín hiệu độc lập cảnh báo xu hướng tiền can thiệp khác nhau giữa hai nhóm**. Xem [09](09-nhat-ky-sua-loi-code.md) |
| **Độ nhạy theo nhóm đối chứng** | Với ĐC 8% và hiệp biến tiền kỳ, ATT = **+1,225% (p=0,038)** — pass-through âm có ý nghĩa, ngược hướng với kết quả dùng ĐC 10% (+0,096, p=0,884). **Kết luận không bền qua lựa chọn nhóm đối chứng** |
| **Kiểm định tương đương** | TOST đầy đủ **không kết luận được tương đương** ở bất kỳ biên nào đã xét (25% pass-through: p=0,211; 50%: p=0,052; ±0,5 điểm %: p=0,190) |
| **Sản lượng** | **MDE ≈ 87%**. Kiểm định gần như không mang thông tin. Điểm ước lượng +13,6% với p=0,661 |
| **Pass-through** | KTC của pass-through là [−0,601; +0,589] — đủ để bác bỏ chuyển hoàn toàn, **không đủ** để khẳng định tương đương 0 |
| **Dị biệt theo mức giá / nhóm hàng** | Với 156 SKU treated, mọi phân tích dị biệt sẽ rất yếu. Chỉ trình bày như khám phá, không tuyên bố |
| **Nghịch lý Simpson theo `type`** | Nhóm "Sản phẩm khác" chỉ có **6 SKU đối chứng** → chưa dùng được, cần cách phân tầng khác |

---

## 2. Survivorship / chọn mẫu — chưa giải quyết

Nhiều phân tích yêu cầu SKU phải có đủ số tuần quan sát giá. Yêu cầu ≥3 tuần loại bỏ:

| Nhóm | | n SKU | Giá trung vị | Số tuần trung vị |
|---|---|---|---|---|
| Treated | **bị loại** | 55 | **76.000đ** | 1 |
| Treated | giữ lại | 101 | 49.000đ | 4 |
| ĐC 10% | **bị loại** | 44 | **104.500đ** | 2 |
| ĐC 10% | giữ lại | 117 | 37.000đ | 6 |

SKU bị loại là **hàng đắt tiền, bán thưa** — giá gấp 1,5–2,8 lần nhóm giữ lại. Lọc theo số tuần quan sát làm mẫu **lệch mạnh về hàng rẻ, bán chạy**.

**Bắt buộc phải làm:**
- Phân tích độ nhạy theo nhiều ngưỡng lọc (≥1, ≥2, ≥3, ≥5 tuần)
- Báo cáo đặc tính nhóm bị loại so với nhóm giữ lại
- Nêu rõ ước lượng áp dụng cho tổng thể nào ("hàng bán thường xuyên", không phải "toàn bộ danh mục")

Ngoài ra, bản thân việc **SKU chỉ xuất hiện trong dữ liệu khi có bán** nghĩa là "có mặt trong tuần đó" tự nó là một kết quả (biên mở rộng). Panel không cân bằng theo cách nội sinh.

---

## 2b. Ngụy lặp trong suy diễn (pseudo-replication) — rủi ro mới, chưa xử lý

Phát hiện ở vòng review thứ 5 (Codex). **Chưa vòng phản biện nào trước đó nêu.**

Mẫu có hàng nghìn SKU, nhưng:
- chỉ **một** cửa hàng
- chỉ **một** ngày chính sách
- treatment gần **tất định** theo phân loại pháp lý của ngành hàng

Nhiều SKU **không** tương đương nhiều lần phân bổ chính sách độc lập. Sai số chuẩn tính như thể các SKU độc lập với nhau có nguy cơ **quá lạc quan** — khoảng tin cậy thật rộng hơn cái đang báo cáo.

**Hệ quả:** mọi p-value và KTC trong [04](04-ket-qua-uoc-luong.md) nên được đọc như **giới hạn dưới của độ bất định**. Cần nêu rõ trong phần hạn chế; nếu có thời gian, thử gộp cụm ở cấp nhóm hàng thay vì cấp SKU và báo cáo song song.

## 2c. Đa đặc tả (researcher degrees of freedom)

20 script × 2 nhóm đối chứng × 3 cửa sổ mẫu × nhiều bộ hiệp biến × nhiều mốc giả dược = không gian lựa chọn rất lớn. Nguy cơ vô tình chọn kết quả đẹp.

**Giảm thiểu:** khóa **một** estimand, **một** đặc tả chính, **một** nhóm đối chứng chính kể từ 25/07/2026; mọi thứ khác trình bày dưới dạng lưới độ nhạy đầy đủ, không chọn lọc.

## 3. Những gì dữ liệu KHÔNG nói được

| Câu hỏi | Vì sao không trả lời được |
|---|---|
| Nhà bán lẻ hay nhà cung cấp hưởng phần giảm thuế? | Không có giá vốn sau 1/7 (hóa đơn mua vào chỉ có tháng 3–4/2025, tức trước chính sách) |
| Cửa hàng có lãi hơn không? | Không có dữ liệu chi phí, lợi nhuận |
| Kết quả có khái quát cho ngành bán lẻ VN không? | **Một cửa hàng duy nhất**, tại TP.HCM, tệp khách đặc thù. Không khái quát hóa được |
| Chính sách có tác động tới sản lượng không? | MDE 87% — không kết luận được theo cả hai chiều |
| Cửa hàng có chuyển giảm thuế qua khuyến mại thay vì giá không? | `tyle_ck` và `sotien_ck` bằng 0 ở toàn bộ 233.996 dòng — **không có dữ liệu chiết khấu** |
| Hành vi mua theo khung giờ? | `ngaytao` phân bố bất thường (17h có 56.010 dòng) — nghi là thời điểm nạp theo lô |

---

## 4. Rủi ro của thiết kế

| # | Rủi ro | Khả năng | Giảm thiểu |
|---|---|---|---|
| 1 | **Giảng viên yêu cầu hai chiến lược nhận dạng thực sự khác nhau** | Trung bình | Dữ liệu chỉ hỗ trợ một chiến lược → **phải hỏi thầy trước khi triển khai**; nếu đúng vậy thì đổi hướng đề tài |
| 2 | Cú sốc dời cửa hàng phá xu hướng song song | Thấp cho giá (giả dược mốc 1/6 cho p=0,580), cao cho sản lượng | Giá làm kết quả chính; cửa sổ hẹp làm kiểm định vững |
| 3 | Kết quả bị đọc thành "đồ án không có phát hiện" | Trung bình | Phát hiện chính là **bác bỏ chuyển hoàn toàn** (p=0,0009), không phải kết quả null |
| 4 | Bị chê "1,835% chỉ là số học" | Trung bình | Nêu rõ 1,835% là **hệ quả** của việc giữ giá; phát hiện là **quyết định giữ giá**; chứng minh bằng nhóm đối chứng (quán tính giữ giá ~80% ở mọi nhóm) |
| 5 | Survivorship làm sai lệch ước lượng | Trung bình | Phân tích độ nhạy theo ngưỡng lọc (§2) |
| 6 | Bị cho là lệch chương trình | Trung bình | Gọi đúng tên phương pháp, giải thích bằng khung Potential Outcomes, hỏi thầy trước |

---

## 5. Các lỗi đã tự phát hiện và sửa

Ghi lại để tránh tái phạm, và để agent review kiểm tra xem còn sót không.

| # | Lỗi | Bản chất | Đã sửa thành |
|---|---|---|---|
| 1 | Đưa hồi quy cắt ngang "bị chệch có chủ đích" vào vị trí mô hình nhân quả thứ nhất | Không thể vừa gọi là mô hình nhân quả vừa thừa nhận nó không nhận dạng được gì. Nguyên nhân kỹ thuật: vi phạm positivity | Hạ xuống mục minh họa "mô hình ngây thơ" |
| 2 | **Chọn nhóm đối chứng bằng phân phối Δ giá trước→sau** | Δ giá trước→sau **chính là biến kết quả** → chọn theo outcome | Chỉ dùng bằng chứng tiền can thiệp: giá nền, tần suất đổi giá |
| 3 | Viết "pre-trend đạt ✅" | Hai p-value lớn với 2 kỳ lead không chứng minh xu hướng song song | "Không phát hiện bằng chứng khác biệt, nhưng kiểm định sức mạnh thấp" |
| 4 | Kết luận "pass-through = 0" | P-value lớn không chứng minh tương đương 0 | "Bác bỏ chuyển hoàn toàn; chưa chứng minh tương đương 0" |
| 5 | Kết luận "nhà bán lẻ giữ trọn phần giảm thuế" | Không có dữ liệu giá vốn | "Chưa xác định được lợi ích thuộc về ai" |
| 6 | Đề xuất mô phỏng Monte Carlo làm mô hình nhân quả thứ hai | Không dựng được Y(0); cụm "design-based vs model-based" là tu từ | Hạ xuống phân tích cơ chế |
| 7 | Phản biện rằng matched DiD cũng vi phạm positivity | **Sai** — so khớp không cần cùng nhóm pháp lý, có thể so khớp theo giá nền/tần suất/độ biến động | Rút lại; matched DiD hợp lệ, chỉ là không tạo chiến lược nhận dạng mới |
| 8 | Nói mạng Bayes "thuật toán đã trượt" | Quan hệ tất định vi phạm giả định faithfulness → đầu vào sai, không phải lỗi thuật toán | Xem [06](06-phu-luc-do-thi-nghich-ly.md) |
| 9 | So sánh trực tiếp χ² 4.395 / 9.572 / 13.057 để nói "tăng 2–3 lần" | Khác bậc tự do và số tầng → không so trực tiếp được | Phải dùng p-value kèm df, Cramér's V |
| 10 | Không ghi đơn vị hệ số | Hệ số −0,727 gây hiểu nhầm là log-point | Quy ước: mọi "%" đã nhân 100 từ log-point; ghi rõ ở đầu [04](04-ket-qua-uoc-luong.md) |
| 11 | Gán chính sách cho "Nghị quyết Quốc hội" theo suy đoán | Dữ liệu chỉ cho thấy thuế suất đổi; quy kết pháp lý là suy luận chưa kiểm chứng | Tra cứu và trích nguồn chính thức, xem [02](02-co-so-phap-ly.md) |
| 12 | **Hiệp biến "tiền kỳ" thực chất tính trên toàn kỳ** (lỗi code) | Rò rỉ dữ liệu hậu can thiệp vào biến điều chỉnh | Tính lại chỉ từ dữ liệu trước 01/07 → kết quả ĐC 8% đổi từ p=0,113 sang **p=0,038** |
| 13 | **Event study thiếu SKU FE, chuẩn hóa bằng trung vị toàn kỳ** (lỗi code) | Không phải event study đúng nghĩa; biến kết quả tiền kỳ chứa thông tin hậu kỳ | Đặc tả lại có `C(sku)` → **bằng chứng pre-trend yếu đi** |
| 14 | Gọi "TOST" cho thứ không phải TOST | Chỉ là kiểm định điểm + kiểm tra KTC nằm trong biên | Cài đúng hai kiểm định một phía → **không kết luận được tương đương ở mọi biên** |
| 15 | Ghi MDE 87% và bootstrap là "đã có" nhưng không có mã tái lập | Con số tính nhẩm | Bổ sung [`code/11`](code/11-mde-va-duong-cong-suc-manh.py) — mô phỏng khớp con số giải tích |
| 16 | Viết placebo mốc dời cửa hàng "loại bỏ đe dọa bằng thực nghiệm" | p lớn ≠ không có hiệu ứng; sức mạnh chưa xác định | "Làm giảm bớt, nhưng không loại bỏ, lo ngại" |
| 17 | Viết "phần giảm VAT không được phản ánh vào giá" | KTC [−1,081; +1,103] vẫn tương thích với chuyển một phần đáng kể | "Điểm ước lượng cho thấy rất ít phản ánh; KTC còn tương thích với chuyển một phần" |
| 18 | Nói mô phỏng làm tròn bác bỏ giả thuyết menu cost | Chỉ bác bỏ hai quy tắc làm tròn đã giả định | Menu cost còn gồm cập nhật POS, in bảng giá, phối hợp NCC, chính sách giá toàn chuỗi |
| 19 | Kết luận `daxoa=2` là bản trùng lặp một cách dứt khoát | Chỉ 40,6% trùng `hoadon_so` | Loại vì **ngữ nghĩa cờ xóa**, không phải vì đã chứng minh trùng lặp |
