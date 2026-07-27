# Hồ sơ phân tích — Claude Opus 4.8

Toàn bộ phát hiện, số liệu và mã nguồn cho đồ án cuối kỳ môn Phân tích dữ liệu.
Thư mục này dành cho **agent khác review**.

**Ngày:** 23/07/2026 (**bản 2** — đã sửa lỗi code sau review vòng 3) · **Nhóm:** 4 người · **Dữ liệu:** `../60.xlsx` · **Đề bài:** `../da-final-project.pdf`

---

## Trạng thái

| Hạng mục | Trạng thái |
|---|---|
| Đề tài | ✅ Chốt — tác động chính sách giảm VAT 10%→8% (01/07/2025) lên giá bán lẻ |
| Biến kết quả chính | ✅ Chốt — Δlog(giá đã gồm thuế) cấp SKU → pass-through |
| Nhóm can thiệp / đối chứng | ✅ Chốt — 156 SKU hóa chất vs 161 SKU chịu thuế TTĐB |
| **Cặp mô hình nhân quả** | ⛔ **CHƯA CHỐT** — chờ giảng viên trả lời, xem [03](03-thiet-ke-nhan-qua.md#6-cặp-mô-hình--chưa-chốt) |
| Phân tích sản lượng | ⚠️ Thiếu sức mạnh thống kê (MDE ≈ 87%, tái lập được ở [`code/11`](code/11-mde-va-duong-cong-suc-manh.py)) — chỉ làm phân tích phụ |
| **Độ bền của kết quả chính** | ✅ **Hai cờ đỏ đã truy nguyên và giải quyết** — xem [10](10-truy-nguyen-hai-co-do.md) |
| Đặc tả chính | Tiền kỳ **05+06/2025**, hậu kỳ 07+08/2025 (loại tháng 4) |

### Bản 3 — hai cờ đỏ đã giải quyết

Cả hai cờ đỏ của bản 2 truy về **cùng một gốc: tháng 4/2025 không phải một tháng dữ liệu hợp lệ.**

- Dữ liệu có **lỗ hổng 39 ngày (13/03 → 20/04)** chưa từng được ghi nhận ở các bản trước
- Trường mã vạch bắt đầu được điền **đúng ngày 21/04**, nhảy từ 0% lên 100% không qua chuyển tiếp
- Nên "tháng 4" thực chất chỉ là **10 ngày** (21–30/04), ngay sau lỗ hổng, lúc hệ thống vừa khởi động

Sau khi loại tháng 4: **hai nhóm đối chứng cho kết quả nhất quán**, giả dược trong tiền kỳ sạch (p=0,474 và 0,274), kết luận chính không đổi. Chi tiết: [10-truy-nguyen-hai-co-do.md](10-truy-nguyen-hai-co-do.md)

### Bản 2 — hai lỗi code đã sửa

Review `../codex-gpt-5.6-review/04-addendum-ban-hoan-chinh.md` nêu 8 điểm, **cả 8 đều đúng**, trong đó 2 là lỗi code thật:

1. Hiệp biến "tiền kỳ" trước đây tính trên toàn kỳ (rò rỉ dữ liệu hậu can thiệp)
2. Event study thiếu SKU FE và chuẩn hóa bằng trung vị toàn kỳ
3. TOST cài đúng → **không kết luận được tương đương** ở bất kỳ biên nào
4. Bổ sung mã tái lập cho MDE, đường cong sức mạnh, bootstrap

Chi tiết: [09-nhat-ky-sua-loi-code.md](09-nhat-ky-sua-loi-code.md)

---

## Mục lục

| File | Nội dung |
|---|---|
| [01-du-lieu-va-lam-sach.md](01-du-lieu-va-lam-sach.md) | Cấu trúc 2 sheet, 5 vấn đề dữ liệu, nhật ký làm sạch, hạn chế không khắc phục được |
| [02-co-so-phap-ly.md](02-co-so-phap-ly.md) | NQ 174/2024 vs NQ 204/2025, vì sao nhóm treated và control được luật xác định |
| [03-thiet-ke-nhan-qua.md](03-thiet-ke-nhan-qua.md) | Can thiệp, kết quả, nhiễu, giả định nhận dạng, các phương án đã loại, cặp mô hình còn treo |
| [04-ket-qua-uoc-luong.md](04-ket-qua-uoc-luong.md) | Toàn bộ con số: ATT, pass-through, TOST, event study, sản lượng, cơ chế làm tròn |
| [05-han-che-va-rui-ro.md](05-han-che-va-rui-ro.md) | Survivorship, sức mạnh kiểm định, những gì dữ liệu KHÔNG nói được |
| [06-phu-luc-do-thi-nghich-ly.md](06-phu-luc-do-thi-nghich-ly.md) | Berkson/collider, Simpson, mạng Bayes — kèm cảnh báo phương pháp |
| [07-nhat-ky-phan-bien.md](07-nhat-ky-phan-bien.md) | Các phản biện đã nhận, chỗ nào tiếp thu, chỗ nào bác, lỗi đã tự phát hiện |
| [08-chia-viec-4-nguoi.md](08-chia-viec-4-nguoi.md) | Phân công theo chương môn học, việc còn nợ, tiêu chí nghiệm thu |
| [09-nhat-ky-sua-loi-code.md](09-nhat-ky-sua-loi-code.md) | Hai lỗi code đã sửa kèm diff, kết quả trước/sau, 6 sửa cách phát biểu |
| **[10-truy-nguyen-hai-co-do.md](10-truy-nguyen-hai-co-do.md)** | **Lỗ hổng 39 ngày, mốc mã vạch 21/04, vì sao loại tháng 4, đặc tả sạch và kết quả bản 3** |
| [code/](code/) | 20 script Python tái lập mọi con số |

Bản brainstorm gốc theo định dạng ClaudeKit: `../plans/2026-07-23-thue-gtgt-passthrough/brainstorm-thiet-ke-nhan-qua-giam-thue-gtgt.md`

---

## Tóm tắt điều hành

**Câu hỏi:** Khi Nhà nước giảm thuế GTGT từ 10% xuống 8% cho một nhóm mặt hàng từ 01/07/2025, người tiêu dùng có được trả giá thấp hơn không?

**Thiết kế:** Thí nghiệm tự nhiên. Nghị quyết 204/2025/QH15 đưa "sản phẩm hóa chất" (khăn ướt, chăm sóc cá nhân, VPP) vào diện giảm thuế từ 1/7/2025, trong khi hàng chịu thuế tiêu thụ đặc biệt (bia, rượu, thuốc lá) tiếp tục bị loại trừ. Cả hai nhóm được xác định bởi văn bản pháp luật, không do cửa hàng chọn.

**Kết quả chính:**

Đặc tả sạch: tiền kỳ 05+06/2025, hậu kỳ 07+08/2025.

| | ĐC 10% (n=310) | ĐC 8% (n=2.061) |
|---|---|---|
| ATT giá đã gồm thuế | −0,252% [−1,382; +0,878] | −0,115% [−1,128; +0,897] |
| ATT giá chưa thuế | +1,528% (p=0,0081) | +1,665% (p=0,0013) |
| **Pass-through** | **+0,138** [−0,478; +0,753] | **+0,063** [−0,489; +0,615] |
| **H₀: chuyển hoàn toàn (−1,835%)** | **BÁC BỎ**, p=0,0061 | **BÁC BỎ**, p=0,0009 |
| TOST tương đương (25% / 50%) | p = 0,360 / 0,124 ❌ | p = 0,253 / 0,060 ❌ |
| Giả dược trong tiền kỳ (05→06) | −0,384 (p=0,474) ✅ | −0,562 (p=0,274) ✅ |

**Hai nhóm đối chứng nhất quán** — cùng dấu, cùng độ lớn, khoảng tin cậy chồng nhau.

**Phát biểu chuẩn (sau ba vòng phản biện + một vòng truy nguyên):**

> Điểm ước lượng cho thấy **rất ít** phần giảm VAT được phản ánh vào giá thanh toán, nhưng khoảng tin cậy vẫn **tương thích với mức chuyển một phần đáng kể**. Nghiên cứu **bác bỏ được** giả thuyết chuyển hoàn toàn (p = 0,006 và 0,0009 với hai nhóm đối chứng); **không kết luận được** pass-through tương đương 0 ở bất kỳ biên tương đương nào đã xét.
>
> Trong tiền kỳ sạch không phát hiện phân kỳ giá giữa hai nhóm. Tuy nhiên chỉ còn **một kỳ lead** nên kiểm định xu hướng song song vẫn có sức mạnh thấp.
>
> Do thiếu dữ liệu giá vốn và chuỗi cung ứng, nghiên cứu **chưa xác định được** phần lợi ích cuối cùng thuộc về nhà bán lẻ hay nhà cung cấp.

**Vấn đề mở lớn nhất:** dữ liệu này chỉ hỗ trợ **một** chiến lược nhận dạng (so sánh nhóm qua thời gian). Không có biến công cụ, không có ngưỡng, chỉ một cửa hàng. Nếu giảng viên yêu cầu hai chiến lược nhận dạng thực sự khác nhau thì đề tài phải đổi hướng. **Cần hỏi thầy trước khi triển khai** — câu hỏi soạn sẵn ở [03 §6.4](03-thiet-ke-nhan-qua.md).

---

## Cách chạy lại

```bash
cd code
python 00-xlsx-to-csv.py      # xuất goc.csv, chitiet.csv từ ../60.xlsx
python 03-hai-mo-hinh-uoc-luong.py
python 05-pretrend-phanphoi-tost.py
```

Cần: `pandas`, `numpy`, `statsmodels`, `scipy`, `openpyxl`; riêng script 08 cần `pgmpy`.

> ⚠️ Các script này là **bản khám phá**, chạy trong thư mục tạm và chưa được dọn thành pipeline. Đường dẫn dữ liệu là tương đối tới file CSV cùng thư mục. Chúng dùng để kiểm chứng số liệu, không phải mã nguồn nộp bài.
