# Phase 01 — Pipeline dữ liệu & EDA

**Người:** A · **Chương phủ:** 1, 2, 3 · **Phụ thuộc:** phase 0 · **Chặn:** phase 3, 4, 5

**Trạng thái 26/07/2026:** ✅ **XONG phần mã.** Còn phần viết văn bản chương 1–3.

```bash
python code/chay_tat_ca.py --sach
```

Chạy từ `60.xlsx` → bảng luồng 11 bước kết thúc đúng **82.109 dòng**, roster **2.218 SKU** (T=153/C10=157/C8=1908), 5 bảng EDA + 2 hình. Mọi kiểm chứng tự động.

| Xong | Còn lại |
|---|---|
| ✅ `code/` — pipeline một lệnh, có manifest + hash nguồn | ⬜ Viết chương 1 (đặt vấn đề) |
| ✅ Bảng luồng 11 bước, tách rõ cửa sổ / sống sót / phân loại thuế | ⬜ Viết chương 2 (pháp lý) |
| ✅ `dong-hang-phan-tich.csv` 82.109 dòng cho Phase 3/4 | ⬜ Viết chương 3 từ 5 bảng EDA |
| ✅ Bước 1 **giữ tháng 4** → mọi cửa sổ độ nhạy chạy từ cùng dữ liệu | ⬜ Từ điển biến |
| ✅ 5 bảng EDA + bản đồ độ phủ + ECDF chồng lấn tiền kỳ | |
| ✅ `requirements.txt`, 20 script cũ đánh dấu legacy | |

## Sáu lỗi thật phát hiện khi dựng pipeline

Tất cả đều là loại **âm thầm** — không báo lỗi mà vẫn cho số sai:

1. **Cột `daxoa` có ở CẢ HAI sheet.** Mã cũ lọc sau khi nối, dựa vào hậu tố `_x`/`_y` pandas tự đặt. Sửa bằng tiền tố tường minh `goc_daxoa`.
2. **`mode().iloc[0]` chọn giá trị nhỏ nhất khi hòa.** 9 SKU thuế suất hậu kỳ hòa 8/10 được gán T **do thứ tự sắp xếp**. Thay bằng quy tắc có lập luận pháp lý ([§5](dac-ta-khoa.md)) — cùng kết quả, đúng lý do.
3. **`astype('int64')` trên mã vạch** → chuẩn hóa giữ chuỗi. 3.280 mã, độ dài 7–14.
4. **Bảng luồng mẫu kết thúc ở 88.231, không phải 82.109.** Hai bước cuối chỉ được `print`, không ghi vào bảng.
5. **Tháng 4 bị lọc trước khi xuất dữ liệu chuẩn** → cửa sổ độ nhạy `co_thang_4` không thể chạy. Đã dời việc áp cửa sổ sang bước 2.
6. 🔴 **Khớp chuỗi con trong phân loại sản phẩm.** `"esse"` bắt *"QBB Cheese **desse**rt"*, `"camel"` bắt *"**Camel** Hazelnut Coffee"*, `"kéo "` bắt *"phô mai **kéo** sợi"* — sữa chua và cà phê bị xếp vào thuốc lá. Sửa bằng regex biên từ.

## Hai phát hiện chặn Phase 3

**A. Biến `type` không dùng được để chia tầng.** 1.866/2.193 (85%) SKU mã thương mại có nhiều hơn một nhãn trong tiền kỳ; nhóm T chỉ 39/153 SKU có nhãn duy nhất. `type` là nhãn cấp **dòng hóa đơn**. → [§9](dac-ta-khoa.md) đổi sang **5 phân vị giá nền**, đã kiểm chứng 0 tầng rỗng, 0 tầng mỏng.

**B. Nhóm đối chứng bị ô nhiễm.** 15/157 SKU trong C10 là hàng hóa chất (COLGATE, Gillette, Garnier, mặt nạ) — ở 10% do **cửa hàng không cập nhật**, không do luật. → [§5](dac-ta-khoa.md) lập ba định nghĩa đối chứng ĐC-A/B/C, bắt buộc báo cáo song song.

## Phát hiện mới từ EDA — cần cho Phase 3

🔴 **9/12 cặp biến có |SMD| > 0,25.** Nhóm can thiệp lệch hệ thống so với mọi nhóm đối chứng:

| Biến tiền kỳ | ĐC-A | ĐC-B | ĐC-C | ĐC-8% |
|---|---|---|---|---|
| log(1+sản lượng) | −0,83 | −0,84 | −0,74 | −0,82 |
| Số tuần xuất hiện | −0,57 | −0,58 | −0,50 | −0,70 |
| log(giá nền) | ok | ok | ok | **+1,40** |

SKU được giảm thuế **bán ít hơn và xuất hiện thưa hơn** đáng kể. Ba hệ quả cho Phase 3:
- Đặc tả có hiệp biến và phân tầng **có việc thật để làm**, không phải nghi thức
- Là đe dọa với giả định xu hướng song song — hàng bán chậm có thể có động lực đổi giá khác
- Góp phần giải thích sức mạnh kiểm định thấp

**Độ phủ dữ liệu:** chỉ **161/259 ngày** có giao dịch — 98 ngày trống, nhiều hơn lỗ hổng 39 ngày.

**Ma trận chuyển thuế** chỉ có 4 đường: 10→10 (157), 10→8 (144), 10→hòa (9), 8→8 (1.908). **Không SKU nào chuyển ngược 8→10.**

> Mục tiêu: biến đống 20 script rời rạc thành **một lệnh chạy lại được**, và viết chương mô tả dữ liệu.
>
> Ràng buộc tuyệt đối: mọi quy tắc lấy từ [`dac-ta-khoa.md`](dac-ta-khoa.md), **không tự chế thêm**.

---

## 1. Sửa lỗi tái lập — làm trước hết

🔴 Hiện trạng: `goc.csv` và `chitiet.csv` nằm trong thư mục tạm của phiên làm việc cũ, sẽ bị xóa. **Không script nào chạy lại được từ repo.**

| Việc | Chi tiết |
|---|---|
| Tạo `du-lieu-tam/` trong repo | Chứa CSV trung gian, thêm vào `.gitignore` nếu sau này dùng git |
| Sửa `00-xlsx-to-csv.py` | Đọc `60.xlsx` ở gốc repo, ghi vào `du-lieu-tam/` |
| Sửa toàn bộ script còn lại | Đường dẫn **tương đối từ gốc repo**, không hard-code thư mục tạm |
| Kiểm chứng | Xóa `du-lieu-tam/`, chạy lại một lệnh, ra đúng 82.109 dòng |

**Nghiệm thu:** người khác clone repo về, có `60.xlsx`, chạy một lệnh → ra đủ số.

---

## 2. Pipeline một lệnh

Gộp 20 script thành chuỗi có thứ tự rõ ràng. Đề xuất cấu trúc:

```
code/
  chay-tat-ca.py          ← điểm vào duy nhất
  b0-doc-du-lieu.py       ← xlsx → csv
  b1-lam-sach.py          ← 7 quy tắc lọc §3, xuất bảng luồng mẫu
  b2-roster-sku.py        ← gán nhóm, xuất roster-sku.csv
  b3-eda.py               ← thống kê mô tả + biểu đồ chương 3
  b4-...                  ← (phase 3, 4 nối vào đây)
```

Quy tắc:
- Mỗi bước ghi ra file trung gian có tên rõ ràng
- Mỗi bước in ra số dòng vào / số dòng ra
- Không script nào phụ thuộc vào biến toàn cục của script khác
- Seed cố định **42** ở mọi nơi có ngẫu nhiên

---

## 3. Bảng luồng mẫu

Bảng bắt buộc có trong báo cáo. Mỗi dòng = một quy tắc lọc ở [`dac-ta-khoa.md` §3](dac-ta-khoa.md), theo **đúng thứ tự**:

| Bước | Quy tắc | Dòng vào | Dòng ra | Mất |
|---|---|---|---|---|
| 0 | Dữ liệu thô `chitiet` | — | 233.996 | — |
| 1 | Chỉ hóa đơn bán ra | | | |
| … | … | | | |
| 7 | Thuộc 1 trong 3 nhóm | | **82.109** | |

Con số cuối **phải bằng 82.109**. Lệch là dấu hiệu quy tắc bị hiểu sai.

---

## 4. Roster SKU

Xuất `du-lieu-tam/roster-sku.csv`, **2.218 dòng**, các cột:

`sku, grp, type, pre_p, pre_q, pre_w`

Đây là danh sách SKU chính thức. **Phase 3 và 4 đọc từ file này, không tự tính lại nhóm.**

Kiểm tra bắt buộc: `grp` đếm được **T=153, C10=157, C8=1908**.

---

## 5. Từ điển biến

Bảng mô tả mọi biến dùng trong đồ án: tên, ý nghĩa, đơn vị, cách tính, phạm vi giá trị. Bao gồm cả biến gốc trong `60.xlsx` lẫn biến do nhóm tạo.

Cột **đơn vị** là bắt buộc — nhóm đã từng nhầm điểm log với điểm phần trăm.

---

## 6. Chương 3 — Thống kê mô tả

Khối lớn nhất chưa động tới. Nội dung:

| Mục | Nội dung |
|---|---|
| Quy mô | Số hóa đơn, số dòng hàng, số SKU, khoảng thời gian |
| Phân bố giá | Theo nhóm hàng, theo nhóm T/C10/C8 — dùng trung vị và tứ phân vị |
| Chuỗi thời gian | Doanh thu và số hóa đơn theo ngày/tuần — **phải thấy rõ lỗ hổng 39 ngày** |
| Cơ cấu nhóm hàng | Tỉ trọng Nước uống / Đồ ăn / Sản phẩm khác |
| Cân bằng tiền can thiệp | Bảng so sánh T vs C10 vs C8 trên `pre_p`, `pre_q`, `pre_w`, `type` |

⚠️ **Bảng cân bằng chỉ dùng biến tiền can thiệp.** Cấm đưa biến kết quả vào — nhóm đã từng chọn nhóm đối chứng bằng phân phối biến kết quả và phải rút lại.

---

## 7. Các vấn đề dữ liệu — viết thành mục riêng

Sáu vấn đề đã phát hiện, phải mô tả đầy đủ chứ không giấu:

| # | Vấn đề | Trạng thái |
|---|---|---|
| 1 | 13.335 hóa đơn mua vào lẫn trong mẫu | Đã lọc |
| 2 | Hóa đơn tổng hợp 12/2024–01/2025 (31 hóa đơn / 44k dòng) | Ngoài cửa sổ chính |
| 3 | Cửa hàng **dời địa điểm** ~10/06/2025 | Có cửa sổ độ nhạy riêng |
| 4 | Cờ `daxoa=2` — 3.917 bản ghi | Đã lọc, ghi rõ lý do là **ngữ nghĩa cờ xóa** |
| 5 | Mã vạch chỉ được điền từ **21/04/2025** | Giới hạn tiền kỳ thật còn 2 tháng |
| 6 | 🔴 **Lỗ hổng 39 ngày 13/03 → 20/04/2025** | **Chưa có trong chương dữ liệu — phải bổ sung** |

Vấn đề 5 và 6 là lý do loại tháng 4. Phải trình bày trước khi người đọc gặp mục công bố hậu kiểm.

---

## 8. Lưới độ nhạy survivorship

Chạy và xuất bảng theo [`dac-ta-khoa.md` §7](dac-ta-khoa.md):

| Ngưỡng | T | C10 | C8 |
|---|---|---|---|
| ≥1 (chính) | 153 | 157 | 1.908 |
| ≥2 → ≥5 tuần | … | | |

Phase 1 chỉ xuất **số SKU**. Phần chạy lại ATT theo từng ngưỡng thuộc phase 3.

Kèm một đoạn giải thích vì sao ngưỡng lỏng nhất là lựa chọn ít can thiệp nhất — lập luận có sẵn ở §7 đặc tả khóa.

---

## 9. Chương 1, 2 — Bối cảnh

| Chương | Nội dung |
|---|---|
| 1 | Đặt vấn đề: chính sách giảm VAT, câu hỏi ai được hưởng lợi |
| 2 | Cơ sở pháp lý — NQ 174/2024/QH15 vs NQ 204/2025/QH15, cơ chế tạo ra hai nhóm. Lấy từ [`02-co-so-phap-ly.md`](../../claude-opus-4.8/02-co-so-phap-ly.md) |

---

## Tiêu chí nghiệm thu

- [ ] Xóa `du-lieu-tam/`, chạy **một lệnh**, ra đúng **82.109 dòng**
- [ ] `roster-sku.csv` có **2.218 dòng**, đếm được 153/157/1908
- [ ] Bảng luồng mẫu đầy đủ 7 bước, số cuối khớp
- [ ] Từ điển biến có cột **đơn vị**
- [ ] Chương 3 có bảng cân bằng **chỉ dùng biến tiền can thiệp**
- [ ] Lỗ hổng 39 ngày đã có trong chương dữ liệu và **nhìn thấy được trên biểu đồ chuỗi thời gian**
- [ ] Mọi biểu đồ sinh từ script, không gõ tay

## Rủi ro

| Rủi ro | Xử lý |
|---|---|
| Sửa đường dẫn làm lệch kết quả | So số cuối với 82.109 sau **mỗi** lần sửa |
| Vô tình đổi quy tắc lọc khi dọn code | Bảng luồng mẫu là chốt kiểm tra |
| EDA phình to thành mô tả vô hướng | Mỗi biểu đồ phải trả lời một câu hỏi cụ thể, nếu không thì bỏ |
