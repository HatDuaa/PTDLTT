---
status: in_progress
created: 2026-07-25
topic: Đánh giá tác động chính sách giảm thuế GTGT 10%→8% (01/07/2025) lên giá bán lẻ
---

# Kế hoạch & nhật ký — Đồ án cuối kỳ Phân tích dữ liệu

> **Mở file này trước.** Đây là bản đồ toàn cảnh: đã làm gì, đang ở đâu, tài liệu nào nằm đâu.

| | |
|---|---|
| **Nhóm** | 4 người |
| **Dữ liệu** | `60.xlsx` — 67.562 hóa đơn / 233.996 dòng hàng, cửa hàng tiện lợi TP.HCM, 12/2024–08/2025 |
| **Đề bài** | `da-final-project.pdf` — bắt buộc **hai mô hình nhân quả khác nhau**, trình bày dạng web |
| **Giai đoạn** | P0–P4 ✅ · **P5 ✅** (web + slide) · P6 🟡 đang rà soát |
| **Đang chặn** | Câu hỏi DiD **chặn phase 3** (§5b) |
| **Đổi thiết kế lớn** | 🔴 Chuyển sang khung **không tuân thủ**: ITT theo `Z` (luật) là kết quả chính, không phải `D` (thuế cửa hàng thực áp) — xem [đặc tả §5](dac-ta-khoa.md) |
| **Tái lập** | ✅ Chạy hai lần → **22 đầu ra hash giống hệt**, kể cả bảng bootstrap 5.000 lần |
| **Sản phẩm** | `bao-cao/` 3 chương · `web/backend` FastAPI 14 endpoint · `web/frontend` Next.js 7 route, 5 biểu đồ |

## 0. Hai phương pháp — ĐÃ CHỐT

Thầy trả lời: *"dùng 2 phương pháp khác nhau"*.

**Phát hiện quyết định khi tra slide:** môn học **không dạy bất kỳ phương pháp nào** để ước lượng tác động nhân quả từ dữ liệu quan sát. Chương 8.6 dừng đúng ở câu *"để ước lượng ATE khi không thể thực hiện RCT, chúng ta cần các điều kiện bổ sung"* rồi không phát triển tiếp. Chương 4 chỉ có "câu hỏi nghiên cứu" và "thiết kế nghiên cứu" ở mức định nghĩa.

→ Đề bài yêu cầu dữ liệu quan sát + hai phương pháp nhân quả, nên **buộc phải đi ra ngoài slide**. Câu hỏi "có được dùng DiD không" tự trả lời.

**Khung nội dung:** báo cáo mở phần phương pháp đúng chỗ chương 8.6 dừng lại — *"đồ án này bắt đầu từ đúng chỗ đó: chỉ ra các điều kiện bổ sung ấy là gì, và áp dụng hai phương pháp ước lượng khác nhau."* Nhóm **tiếp nối** giáo trình, không đi lệch.

| | Phương pháp 1 | Phương pháp 2 |
|---|---|---|
| Tên | Hồi quy ước lượng ATT | Phân tầng theo khung Kết quả tiềm năng |
| Cách làm | `Δlog(giá) = α + τ·Z + β·X`, đọc hệ số τ | Chia SKU thành **5 tầng phân vị giá nền**; tính hiệu trong từng tầng; trung bình có trọng số ATT |
| Neo vào chương | 9, 10 | 8.4 (Simpson), 8.6 (ATE), 3 |
| Mượn ngoài | Ý tưởng dùng đối chứng + trước/sau dựng Y(0) | Rất ít |

Chọn **phân tầng** thay vì so khớp: chương 8.4 dạy nghịch lý Simpson — chính là hiện tượng xảy ra khi phân tầng. Không phải khái niệm mới.

⚠️ **Cả hai dùng chung một chiến lược nhận dạng (DiD / xu hướng song song).** Phải nói thẳng: hai con số khớp nhau **không** xác nhận nhân quả — cả hai cùng sai nếu xu hướng không song song.

---

## 1. Bản đồ tài liệu

Bốn nguồn, mỗi nguồn một vai trò khác nhau:

| Nguồn | Vai trò | Mở khi nào |
|---|---|---|
| [**`dac-ta-khoa.md`**](dac-ta-khoa.md) | 🔒 **Văn bản ràng buộc** — mọi con số phải sinh từ đúng đặc tả này | **Trước khi viết bất kỳ dòng mã nào** |
| **`plans/2026-07-23-thue-gtgt-passthrough/`** | Kế hoạch & nhật ký (file này) + [báo cáo brainstorm](brainstorm-thiet-ke-nhan-qua-giam-thue-gtgt.md) | Đầu tiên |
| **`claude-opus-4.8/`** | Hồ sơ phân tích đầy đủ: dữ liệu, pháp lý, thiết kế, kết quả, hạn chế, 16 script | Khi cần chi tiết hoặc số liệu |
| **`codex-gpt-5.6-review/`** | Review độc lập từ agent khác — 3 vòng phản biện | Khi cần biết vì sao một quyết định bị đổi |
| **`brainstorm-huong-do-an.html`** | Trang tổng quan "phải làm gì" (agent khác làm) | Khi cần định hướng trình tự |
| [Bảng tình trạng (artifact)](https://claude.ai/code/artifact/b67351b0-b289-4f3f-9745-7fa8f4ddf01d) | Trang "đang biết gì, con số ra sao, cấm viết gì" | Trước khi viết báo cáo |

### Trong `claude-opus-4.8/`

| File | Nội dung |
|---|---|
| [README](../../claude-opus-4.8/README.md) | Trạng thái, tóm tắt điều hành, cách chạy lại |
| [01 Dữ liệu & làm sạch](../../claude-opus-4.8/01-du-lieu-va-lam-sach.md) | 5 vấn đề dữ liệu, quy tắc lọc, hạn chế nền tảng |
| [02 Cơ sở pháp lý](../../claude-opus-4.8/02-co-so-phap-ly.md) | NQ 174/2024 vs NQ 204/2025, cơ chế tạo hai nhóm |
| [03 Thiết kế nhân quả](../../claude-opus-4.8/03-thiet-ke-nhan-qua.md) | Estimand, giả định, **5 phương án đã loại**, cặp mô hình treo |
| [04 Kết quả ước lượng](../../claude-opus-4.8/04-ket-qua-uoc-luong.md) | Mọi con số (bản 2, sau sửa lỗi code) |
| [05 Hạn chế & rủi ro](../../claude-opus-4.8/05-han-che-va-rui-ro.md) | Sức mạnh kiểm định, survivorship, **19 lỗi đã sửa** |
| [06 Phụ lục đồ thị](../../claude-opus-4.8/06-phu-luc-do-thi-nghich-ly.md) | Berkson, mạng Bayes, Simpson |
| [07 Nhật ký phản biện](../../claude-opus-4.8/07-nhat-ky-phan-bien.md) | 3 vòng phản biện, chỗ nào tiếp thu / chỗ nào sai |
| [08 Chia việc](../../claude-opus-4.8/08-chia-viec-4-nguoi.md) | Phân công, việc còn nợ, tiêu chí nghiệm thu |
| [09 Nhật ký sửa lỗi code](../../claude-opus-4.8/09-nhat-ky-sua-loi-code.md) | 2 lỗi đặc tả kèm diff, kết quả trước/sau |

---

## 2. Nhật ký công việc

### Giai đoạn 1 — Khảo sát và chọn đề tài
- Đọc đề bài + slide môn học (11 chương, công cụ Python/Excel; **slide không dạy** DiD, IV, RDD, propensity score)
- Profile `60.xlsx`: 2 sheet, nối 100%, phát hiện `type` phân loại 3 nhóm hàng và cột thuế suất 0/5/8/10%
- **Phát hiện thí nghiệm tự nhiên**: 156 SKU chuyển 10%→8% đúng ngày 01/07/2025, 161 SKU giữ 10% *(con số lúc mới khảo sát, đặc tả còn tháng 4 — đặc tả khóa sau này cho **153/157**)*
- Cân nhắc 3 hướng đề tài → chọn hướng thuế vì là thứ duy nhất có **can thiệp ngoại sinh thật**

### Giai đoạn 2 — Xác minh cơ sở pháp lý
- Ban đầu **suy đoán** đây là Nghị quyết Quốc hội → người dùng chất vấn → tra cứu thật
- Xác nhận: **NQ 204/2025/QH15** bỏ "sản phẩm hóa chất" khỏi danh mục loại trừ; hàng chịu **thuế TTĐB** vẫn bị loại trừ
- Khớp hoàn hảo với dữ liệu: treated = khăn ướt/VPP/chăm sóc cá nhân; đối chứng = bia/rượu/thuốc lá

### Giai đoạn 3 — Làm sạch dữ liệu
Xử lý xong 5 vấn đề: hóa đơn mua vào lẫn trong mẫu · hóa đơn tổng hợp 12/2024–01/2025 · khoảng trống 02–10/06 và địa chỉ hóa đơn đổi từ 24/06 · cờ `daxoa=2` · **mã vạch chỉ có từ ~04/2025** (vấn đề nghiêm trọng nhất — kỳ tiền can thiệp thực chỉ 3 tháng)

### Giai đoạn 4 — Ba vòng phản biện
| Vòng | Nguồn | Thay đổi lớn nhất |
|---|---|---|
| 1 | subagent nội bộ | Đổi nhóm đối chứng sang nhóm TTĐB · bỏ propensity score · chuyển sang sai phân cấp SKU · MDE sản lượng thực là 87% |
| 2 | agent ngoài | **Loại mô hình hồi quy cắt ngang** khỏi vị trí mô hình nhân quả (vi phạm positivity) · ngừng né tên DiD · rút lại việc chọn đối chứng bằng biến kết quả |
| 3 | agent ngoài (addendum) | Phát hiện **2 lỗi đặc tả code** → sửa xong kết quả đổi theo hướng bất lợi, sinh ra 2 cờ đỏ |

Tổng: **19 lỗi đã sửa**. Mẫu hình chung — *tìm được con số đẹp rồi diễn giải chắc chắn hơn mức dữ liệu cho phép.*

### Giai đoạn 5 — Chạy kiểm chứng thiết kế
16 script, mọi con số tái lập được.

### Giai đoạn 6 — Truy nguyên hai cờ đỏ → phát hiện lỗ hổng dữ liệu
- Giả thuyết ban đầu (SKU mới gia nhập) **bị bác bỏ** — lọc panel cân bằng làm hệ số tháng 4 xấu đi
- Phát hiện **lỗ hổng 39 ngày (13/03 → 20/04/2025)** chưa từng được ghi nhận, và mã vạch bắt đầu điền **đúng ngày 21/04**
- ⇒ "Tháng 4" thực chất chỉ là **10 ngày**, ngay sau lỗ hổng, lúc hệ thống vừa khởi động
- Loại tháng 4 → **cả hai cờ đỏ biến mất**, hai nhóm đối chứng nhất quán
- Kết quả: [10-truy-nguyen-hai-co-do.md](../../claude-opus-4.8/10-truy-nguyen-hai-co-do.md) · 20 script

---

## 3. Quyết định đã chốt

| Quyết định | Lý do |
|---|---|
| Đề tài = tác động giảm VAT lên giá bán lẻ | Duy nhất có can thiệp ngoại sinh (do luật định) |
| Kết quả chính = **giá**, không phải sản lượng | MDE sản lượng lớn → kiểm định gần như không mang thông tin. *(Con số cũ 87% thuộc thiết kế theo `D`; đặc tả `Z` hiện tại cho MDE = 31,5 điểm log ×100)* |
| Đối chứng chính = **157** SKU giữ 10% | Giá nền và tần suất đổi giá tiền can thiệp gần treated hơn nhóm 8% |
| Đơn vị phân tích = SKU (sai phân), không phải panel SKU×tuần | Panel quá thưa; sai phân miễn nhiễm và dễ bảo vệ |
| **Loại** hồi quy cắt ngang khỏi vị trí mô hình nhân quả | Vi phạm positivity — treated tất định theo phân loại pháp lý |
| **Loại** mô phỏng Monte Carlo khỏi vị trí mô hình nhân quả | Không dựng được Y(0) |
| Gọi **đúng tên** DiD, giải thích bằng Potential Outcomes | Né tên phương pháp là không trung thực học thuật |
| Mạng Bayes xuống phụ lục | Quan hệ tất định vi phạm giả định causal discovery |

---

## 4. Trạng thái kết quả

**Đặc tả chính (sạch):** tiền kỳ 05+06/2025, hậu kỳ 07+08/2025 — loại tháng 4 vì chỉ có 10 ngày, nằm ngay sau lỗ hổng 39 ngày, trùng lúc hệ thống mã vạch khởi động.

**Kết quả cuối — xem [chương 5](../../bao-cao/chuong-05-ket-qua.md).** Bốn ước lượng chính (ITT theo `Z`, n=287):

| Phương pháp | Ước lượng | p | KTC 95% |
|---|---|---|---|
| PP1-A thô | −0,398 | 0,507 | [−1,57; +0,78] |
| PP1-A có hiệp biến | −0,270 | 0,713 | [−1,71; +1,17] |
| PP1-B g-computation (ATT) | −0,664 | 0,397 | [−2,20; +0,84] |
| PP2 phân tầng | −0,257 | 0,661 | [−1,41; +0,91] |

Mọi KTC chứa 0. Ổn định qua 4 cửa sổ, 3 cách xử lý SKU chưa phân loại, 2 cách xử lý SKU hòa VAT.

🔴 **Kết luận "bác bỏ chuyển hoàn toàn" đã bị hạ cấp** — phụ thuộc phương pháp (3 bác bỏ, g-computation không, p=0,131).

🔴 **Estimand phải gọi đúng tên:** không phải ITT vô điều kiện, mà là **so sánh theo `Z` trong nhóm SKU có giá quan sát ở cả hai kỳ** — tỉ lệ sống sót hai nhóm chênh **7,2 điểm %**.

🔴 **Biên TOST ±0,918 quá hẹp** so với độ chính xác dữ liệu (cần ±1,47–1,93). "TOST thất bại" **không** phải bằng chứng chống tương đương.

🔴 **Cổng cân bằng TRƯỢT** (12/15 cặp \|SMD\|>0,25 sau phân tầng; đã thử 6 cách chia tầng, không cách nào đạt). Cả hai phương pháp hạ cấp thành **so sánh có điều chỉnh**.

| | ĐC 10% | ĐC 8% |
|---|---|---|
| ATT giá gồm thuế | −0,252% [−1,38; +0,88] | −0,115% [−1,13; +0,90] |
| ATT giá chưa thuế | +1,528% (p=0,008) | +1,665% (p=0,001) |
| Pass-through | +0,138 [−0,48; +0,75] | +0,063 [−0,49; +0,62] |
| **Bác bỏ chuyển hoàn toàn** | **p=0,0061** | **p=0,0009** |
| Giả dược tiền kỳ 05→06 | −0,384 (p=0,474) ✅ | −0,562 (p=0,274) ✅ |

**Đứng vững:** bác bỏ giả thuyết chuyển hoàn toàn. Hai nhóm đối chứng **nhất quán**.

**Không kết luận được:** pass-through tương đương 0 — TOST thất bại ở mọi biên.

**Hai cờ đỏ:** ✅ **đã giải quyết** — cả hai truy về tháng 4/2025, xem [10](../../claude-opus-4.8/10-truy-nguyen-hai-co-do.md).

---

## 5. Việc tiếp theo, xếp theo thứ tự chặn

| # | Việc | Chặn gì | Người |
|---|---|---|---|
| 1 | **Gửi câu hỏi cho giảng viên** — câu hỏi thật là **"nhóm có được dùng DiD không"**, xem §5b | Chặn **toàn bộ** phần mô hình | Cả nhóm |
| 2 | Lưới độ nhạy theo ngưỡng lọc số tuần (ngưỡng **định trước**) — survivorship là hạn chế lớn nhất còn lại | Chặn kết luận cuối | A |
| 3 | Chạy lại toàn bộ phân tích phụ (sản lượng, logistic, Berkson) trên đặc tả sạch | — | C, D |
| 4 | Bổ sung mô tả lỗ hổng 39 ngày vào chương dữ liệu | — | A |
| 5 | Dọn 20 script thành pipeline một lệnh + bảng luồng mẫu | Chặn khâu nộp bài | Cả nhóm |

✅ **Đã xong:** truy nguyên cờ đỏ 1 và 2 (giai đoạn 6).

---

## 5b. Câu hỏi gửi giảng viên — đã sửa sau review của Codex

**Câu hỏi thật không phải "hai mô hình hay hai chiến lược".** Codex chỉ ra: mọi thứ nhóm đang làm — sai phân cấp SKU, hồi quy có biến tương tác, so khớp theo đặc trưng tiền kỳ — **đều là Difference-in-Differences** về bản chất. Với

Y_i = Δlog(giá), hồi quy `Y_i = α + τ·T_i + ε_i` cho ra chính xác:

```
τ̂ = (Ȳ_T,sau − Ȳ_T,trước) − (Ȳ_C,sau − Ȳ_C,trước)
```

Đó là DiD 2×2. Thêm hiệp biến chỉ tạo adjusted DiD. **Vậy câu hỏi duy nhất cần thầy trả lời là: có được dùng DiD không.**

> Thưa thầy, nhóm em đánh giá tác động của chính sách giảm VAT 10% xuống 8% từ 01/07/2025 lên giá bán lẻ, dùng dữ liệu hóa đơn theo mặt hàng, so sánh nhóm hàng được giảm thuế với nhóm hàng chịu thuế tiêu thụ đặc biệt vẫn giữ 10%.
>
> Phương pháp này về bản chất là Difference-in-Differences, tuy không được trình bày trực tiếp trong slide. Nhóm em có được sử dụng và diễn giải nó bằng khung Kết quả tiềm năng đã học ở chương 8 không ạ? Nếu được, nhóm em dự định so sánh hai phương pháp ước lượng: một là hồi quy ước lượng ATT, hai là phân tầng theo nhóm hàng và mức giá rồi trung bình có trọng số.

**Ba kịch bản:**

| Thầy trả lời | Hệ quả |
|---|---|
| **Cho phép DiD** | Tiếp tục. Cặp phương pháp = hồi quy ước lượng ATT + phân tầng, xem [đặc tả khóa §8–§9](dac-ta-khoa.md) |
| **Yêu cầu hai chiến lược *nhận dạng* khác nhau** | 🔴 **Cặp hiện tại không đáp ứng** — cả hai cùng dựa trên xu hướng song song. Dữ liệu này không có biến công cụ, không có ngưỡng, chỉ một cửa hàng ⇒ phải đổi dữ liệu |
| **Cấm DiD tuyệt đối** | **Phải đổi đề tài hoặc đổi dữ liệu.** Không được ghép DAG, logistic hay Monte Carlo để giả làm mô hình nhân quả thứ hai |

⚠️ **Vì vậy câu hỏi này CHẶN phase 3.** Phase 1 và 2 chạy được ngay, nhưng không được khóa phần phương pháp trước khi có câu trả lời.

**Rủi ro nền tảng:** dữ liệu này chỉ hỗ trợ **một** chiến lược nhận dạng. Không có biến công cụ, không có ngưỡng, chỉ một cửa hàng.

---

## 6. Phân công và nghiệm thu

Chi tiết: [08-chia-viec-4-nguoi.md](../../claude-opus-4.8/08-chia-viec-4-nguoi.md)

| Người | Mảng | Chương phủ |
|---|---|---|
| A | Dữ liệu & Mô tả | 1, 2, 3 |
| B | Đồ thị & Nghịch lý | 7, 8 |
| C | Lõi nhân quả | 4, 8, 9, 10 |
| D | Suy diễn & Mô phỏng | 5, 6, 11 |

Tiêu chí nghiệm thu quan trọng nhất: **mọi con số tái lập được bằng một lệnh** · **mọi hệ số ghi rõ đơn vị** · **không phát biểu vượt quá dữ liệu** (danh sách 8 câu cấm viết ở [bảng tình trạng](https://claude.ai/code/artifact/b67351b0-b289-4f3f-9745-7fa8f4ddf01d)).
