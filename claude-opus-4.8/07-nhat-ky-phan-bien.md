# 07 — Nhật ký phản biện

Thiết kế này đã qua **hai vòng phản biện** trước khi tới bản hiện tại. Tài liệu ghi lại đầy đủ để agent review biết chỗ nào đã tranh luận rồi, chỗ nào còn mở, và chỗ nào tôi đã sai.

---

## Vòng 1 — subagent brainstormer nội bộ

### Phản biện đưa ra

1. Nhóm đối chứng nên là **161 SKU giữ 10%** (bia/rượu/thuốc lá), không phải 1.977 SKU giữ 8% — vì cùng chế độ thuế trước 1/7, cân bằng giá tốt hơn
2. Sản lượng không đáng kiểm định, MDE ước đoán 20–40%
3. **Bỏ PSM/IPW** — nó giải bài toán selection on observables, nhưng SKU được giảm thuế không do cửa hàng chọn
4. Cú sốc dời cửa hàng đe dọa nghiêm trọng phương trình sản lượng, nhẹ với phương trình giá
5. Chuyển sang **sai phân bậc nhất cấp SKU** thay vì panel SKU×tuần
6. Bỏ `log(1+q)` cho sản lượng
7. Nghi ngờ: tháng 3–4 có còn hóa đơn bán ra không? Danh mục hàng có gãy khi dời cửa hàng không?
8. Đề xuất **Cặp A**: hồi quy điều chỉnh cửa sau theo DAG vs ATT bằng sai phân có đối chứng

### Kiểm chứng bằng dữ liệu

| Nghi ngờ | Kết quả kiểm chứng |
|---|---|
| Nhóm 10% là hàng gì? | Bia, thuốc lá, rượu Soju — đúng như lo ngại. Nhưng cân bằng giá tốt hơn hẳn (31k vs 36k, so với 14k của nhóm 8%) |
| Tháng 3–4 có hóa đơn bán ra? | **CÓ** — 4.498 và 4.954. Panel liên tục, không có lỗ hổng |
| Danh mục gãy khi dời cửa hàng? | **KHÔNG** — 152/158 SKU treated bán ở cả hai địa điểm, 0 SKU chỉ bán ở chỗ cũ |
| Sai phân bậc nhất khả thi? | **CÓ** — 156/161/1.951 SKU có giá cả trước và sau |
| MDE sản lượng | **≈ 87%**, tệ hơn nhiều so với ước đoán 20–40% |

### Kết quả vòng 1

Tiếp thu 1–7. Chốt Cặp A. **→ Điểm 8 sau đó bị vòng 2 bác bỏ, và đúng là sai.**

---

## Vòng 2 — agent bên ngoài (do người dùng cung cấp), hai lượt

### Lượt 1 — các phản biện chính

| # | Phản biện | Đánh giá | Xử lý |
|---|---|---|---|
| 1 | **Mô hình 1 không phải mô hình nhân quả hợp lệ.** Không thể vừa gọi là mô hình nhân quả vừa thừa nhận nó không nhận dạng được gì. Hệ số −31% chỉ phản ánh hai tập sản phẩm có giá khác nhau | ✅ **Đúng — lỗi nặng nhất** | Hạ xuống mục minh họa "mô hình ngây thơ" |
| 2 | **Vi phạm positivity.** Treatment gần như tất định theo phân loại pháp lý → điều chỉnh đầy đủ theo nhóm sản phẩm thì mất overlap | ✅ **Đúng, và sắc hơn lập luận của tôi** | Đây là lý do kỹ thuật của #1 |
| 3 | **Đổi tên DiD là né tránh.** Nên gọi đúng tên, giải thích bằng Potential Outcomes, hỏi thầy | ✅ Đúng | Sửa toàn bộ cách gọi |
| 4 | **Giá trung vị gần nhau không chứng minh xu hướng song song.** Cần kiểm tra: đường giá trước chính sách, hệ số lead, tần suất đổi giá, phân phối giá, độ nhạy theo nhóm đối chứng | ✅ Đúng về nguyên tắc | Đã chạy bổ sung, xem dưới |
| 5 | **"Pass-through = 0" quá chắc.** P-value lớn không chứng minh tương đương 0; cần khoảng tin cậy và kiểm định tương đương | ✅ Đúng | Đã chạy TOST |
| 6 | **"Nhà bán lẻ giữ trọn lợi nhuận" chưa được hỗ trợ.** Không có giá vốn, chiết khấu NCC | ✅ **Đúng, và tệ hơn tôi tưởng**: hóa đơn mua vào chỉ có tháng 3–4/2025, tức trước chính sách | Sửa phát biểu |
| 7 | **Mạng Bayes bị làm quá.** Quan hệ tất định vi phạm faithfulness → "thuật toán trượt" là kết luận sai. χ² khác df không so trực tiếp được | ✅ Đúng | Hạ xuống phụ lục, thêm 2 cảnh báo |
| 8 | Dùng nguồn chính thức `vanban.chinhphu.vn` | ✅ Đúng | Đã đổi |
| 9 | Đề xuất cặp: **DiD + weighted/matched DiD** | ⚠️ Đúng một phần — cả hai cùng dựa parallel trends, chính họ cũng thừa nhận | Đưa vào làm P1 |

**Kiểm chứng bổ sung đã chạy sau lượt 1:**

| Kiểm tra | Kết quả |
|---|---|
| Tần suất đổi giá tiền can thiệp | T=0,035; C10=0,029; C8=0,048. KS p=0,907 và 0,901 → không phát hiện khác biệt |
| Event study theo tháng (chuẩn = 06/2025) | Lead tháng 4: −0,727 điểm % (p=0,373); tháng 5: −0,003 (p=0,996) |
| Kiểm định tương đương (TOST) | Pass-through = −0,006, KTC95 [−0,601; +0,589]. **H₀ chuyển hoàn toàn: BÁC BỎ, p=0,0009**. Tương đương ±0,5%: chưa đạt |

### Lượt 2 — các phản biện tiếp theo

| # | Phản biện | Đánh giá | Xử lý |
|---|---|---|---|
| 10 | **"Pre-trend đạt ✅" vẫn nói quá.** Hai p-value lớn với 2 kỳ lead không chứng minh gì; kiểm định thiếu power | ✅ **Đúng** | Sửa thành "không phát hiện bằng chứng khác biệt, sức mạnh kiểm định thấp" |
| 11 | Hệ số −0,727 là log-point hay điểm %? | ✅ Câu hỏi hợp lý | **Trả lời dứt điểm**: code tính `log(p/p₀)×100` → là **điểm phần trăm**, không bất thường. Lỗi là không ghi đơn vị → thêm quy ước đơn vị |
| 12 | **KS test chưa chứng minh control tốt.** Đặc biệt: **nếu dùng phân phối Δ giá trước→sau để chọn nhóm đối chứng thì đó là chọn theo outcome** | ✅ **Đúng — đây là lỗi phương pháp thật của tôi** | Rút bỏ lập luận đó; chỉ giữ bằng chứng tiền can thiệp |
| 13 | 101/158 và 117/161 cần giải thích; nguy cơ survivorship | ✅ Đúng | Đã điều tra: SKU bị loại đắt gấp 1,5–2,8 lần → survivorship thật, xem [05 §2](05-han-che-va-rui-ro.md) |
| 14 | **Phản biện matched DiD của tôi chưa đúng.** So khớp không cần cùng nhóm pháp lý — có thể so khớp theo giá nền, tần suất, độ biến động | ✅ **Đúng, tôi sai** | Rút lại lập luận. Matched DiD hợp lệ, chỉ không tạo chiến lược nhận dạng mới |
| 15 | **P3 (Monte Carlo làm tròn) không phải mô hình nhân quả thứ hai.** Không dựng được Y(1)−Y(0). "Design-based vs model-based" nghe hay nhưng không đủ | ✅ **Đúng hoàn toàn** | Hạ xuống phân tích cơ chế |
| 16 | P2 (ITS) cũng yếu: 3 tháng tiền kỳ, một cửa hàng, dời chỗ sát mốc | ✅ Đúng | Chỉ dùng làm kiểm định vững |
| 17 | **Có thể thầy chỉ muốn hai khung đã học** (hồi quy tương tác + ATT bằng matching/weighting) — đừng tự làm phức tạp trước khi hỏi | ✅ **Nhiều khả năng đúng nhất** | Ghi vào [03 §6.5](03-thiet-ke-nhan-qua.md) |
| 18 | Câu hỏi gửi thầy nên ngắn, bỏ Monte Carlo | ✅ Đúng | Dùng bản ngắn |

**Điều tra bổ sung sau lượt 2:**

| Việc | Kết quả |
|---|---|
| `daxoa=2` là gì? | **Bản ghi trùng lặp** — 3.917 HĐ chỉ 01–16/05, `nguoitao=BOT` (bản kia `DNCS`), 1.589 trùng số hóa đơn, tiền TB tương đương. Loại là đúng |
| Vì sao tháng 2–3 rớt khỏi event study? | **Mã vạch chỉ có từ ~04/2025** — nhóm treated và ĐC 10% có **0 SKU** giao dịch trong tháng 2–3. Kỳ tiền can thiệp hiệu dụng chỉ 3 tháng, 2 kỳ lead |
| Survivorship có thật không? | **Có, mạnh.** SKU bị loại: giá trung vị 76k (T) và 104,5k (C10) vs giữ lại 49k và 37k |

---

## Tổng kết: những gì tôi đã sai

Danh sách đầy đủ ở [05 §5](05-han-che-va-rui-ro.md). Ba lỗi nặng nhất:

1. **Đưa một mô hình biết là không nhận dạng được vào vị trí mô hình nhân quả**, biện hộ bằng "giá trị sư phạm" — đó là ngụy biện
2. **Chọn nhóm đối chứng theo biến kết quả** (phân phối Δ giá trước→sau)
3. **Kết luận vượt quá dữ liệu**: "pass-through = 0", "nhà bán lẻ giữ trọn lợi nhuận", "pre-trend đạt"

Mẫu hình chung của cả ba: tìm được con số đẹp rồi diễn giải thành câu chuyện chắc chắn hơn mức dữ liệu cho phép.

---

## Vòng 3 — `codex-gpt-5.6-review`, addendum sau khi đọc bản hoàn chỉnh

8 điểm, **cả 8 đều đúng**. Hai điểm đầu là **lỗi code thật**, đã sửa và chạy lại; kết quả thay đổi theo hướng bất lợi. Sáu điểm còn lại là lỗi phát biểu.

Chi tiết đầy đủ kèm diff code và bảng trước/sau: **[09-nhat-ky-sua-loi-code.md](09-nhat-ky-sua-loi-code.md)**

Tóm tắt:

| # | Phản biện | Loại | Kết quả sau sửa |
|---|---|---|---|
| 1 | Event study thiếu SKU FE | 🔴 Lỗi code | Lead tháng 4: −0,73 → **−1,37** (ĐC 10%), **−1,35 p=0,074** (ĐC 8%) → **pre-trend yếu đi** |
| 2 | Hiệp biến "tiền kỳ" dùng cả dữ liệu hậu kỳ | 🔴 Lỗi code | ĐC 8%: +0,916 (p=0,113) → **+1,225 (p=0,038)** → **kết luận nhạy với nhóm đối chứng** |
| 3 | TOST gọi tên không chính xác | 🟡 Thiếu triển khai | Cài đúng → **không kết luận được tương đương** ở mọi biên |
| 4 | MDE 87% và bootstrap không có mã tái lập | 🟡 Thiếu mã | Bổ sung `code/11`, mô phỏng khớp con số giải tích |
| 5 | `daxoa=2` chưa giải mã dứt điểm (chỉ 40,6% trùng số HĐ) | 🟢 Phát biểu | Loại vì ngữ nghĩa cờ xóa, không phải vì đã chứng minh trùng lặp |
| 6 | Placebo p=0,580 không "loại bỏ" đe dọa | 🟢 Phát biểu | "Làm giảm bớt, không loại bỏ" |
| 7 | "Phần giảm VAT không được phản ánh vào giá" quá tuyệt đối | 🟢 Phát biểu | "Rất ít phản ánh; KTC còn tương thích với chuyển một phần" |
| 8 | Mô phỏng làm tròn không bác bỏ toàn bộ menu cost | 🟢 Phát biểu | Chỉ bác bỏ hai quy tắc làm tròn đã giả định |

Năm câu hỏi mở ở cuối bản 1 cũng đã được reviewer trả lời — xem [09 §D](09-nhat-ky-sua-loi-code.md).

---

## Còn mở sau vòng 3

1. **Hệ số lead tháng 4 = −1,37** — vì sao giá hai nhóm phân kỳ trong tháng 4? Giả thuyết cần kiểm chứng: hiệu ứng gia nhập của SKU mới đúng lúc trường mã vạch bắt đầu được điền
2. **ĐC 8% + hiệp biến tiền kỳ cho kết quả ngược dấu có ý nghĩa** (+1,225%, p=0,038) — cần giải thích, không được im lặng chọn ĐC 10%
3. **Cặp mô hình vẫn chưa chốt** — chờ giảng viên

---

## Câu hỏi mở của bản 1 (đã được vòng 3 trả lời, giữ lại để đối chiếu)

1. **Cặp mô hình chưa chốt.** P1 (DiD + matched DiD) cùng chiến lược nhận dạng; P2 (ITS) quá yếu. Dữ liệu chỉ hỗ trợ một chiến lược. Có phương án nào tôi và cả hai vòng phản biện đều bỏ sót không?
2. **Giả dược mốc 01/05 có p = 0,061.** Chưa chạy lại sau khi đã xác định `daxoa=2` là bản trùng. Nếu vẫn ở mức đó thì diễn giải thế nào?
3. **Survivorship**: ngưỡng lọc nào là hợp lý, và có nên báo cáo ước lượng theo nhiều ngưỡng thay vì chọn một?
4. **Nghịch lý Simpson**: cách phân tầng nào cho mẫu đủ lớn, khi nhóm "Sản phẩm khác" chỉ có 6 SKU đối chứng?
5. Với kỳ tiền can thiệp **chỉ 3 tháng**, thiết kế này có còn đủ chuẩn cho một đồ án cuối kỳ không, hay nên đổi đề tài?
