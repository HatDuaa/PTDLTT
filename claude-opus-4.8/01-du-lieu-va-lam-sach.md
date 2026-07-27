# 01 — Dữ liệu và nhật ký làm sạch

Nguồn: `../60.xlsx` (48,7 MB). Script: [`code/00-xlsx-to-csv.py`](code/00-xlsx-to-csv.py), [`code/01a`](code/01a-profile-goc.py), [`code/01b`](code/01b-profile-chitiet.py), [`code/01c`](code/01c-kiem-tra-ngay-va-loai-hoadon.py), [`code/06`](code/06-daxoa-thangthieu-survivorship.py)

---

## 1. Cấu trúc

Hóa đơn điện tử máy tính tiền của **CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN KELLY** (MST 317477930), cửa hàng tiện lợi tại TP.HCM.

| Sheet | Số dòng | Số cột | Khóa |
|---|---|---|---|
| `goc` | 67.562 | 86 | `soid` (duy nhất) |
| `chitiet` | 233.996 | 34 | `id`; khóa ngoại `soid` |

Nối được 100% (`chitiet.soid` → `goc.soid`, không dòng nào rớt). Ngày trên dòng chi tiết trùng khớp 100% với ngày hóa đơn.

### Cột dùng được ở `goc`

`soid`, `ngayct`, `ma_ncc_hddt` (BANRA/MUAVAO), `diachi_ban`, `hoadon_ten_tinhtrang`, `daxoa`, `nguoitao`, `sotien`, `sotien_vat`, `sotien_sauvat`, `ten_doituong_mua`

Rất nhiều cột rỗng hoàn toàn: `tyle_ck`, `sotien_ck`, `loai_vat`, `tyle_vat`, `email_*`, `sotk_nh_*`, `noidung`, `ghichu`, toàn bộ nhóm `*_thaythe_dieuchinh`.

### Cột dùng được ở `chitiet`

`soid`, `ngayct_ct`, `ma_hh_ct` (barcode), `ten_hh_ct`, `ten_dvt_ct`, `soluong_ct`, `dongia_ct`, `sotien_ct` (chưa thuế), `tyle_vat_ct` (0/5/8/10), `sotien_vat_ct`, `sotien_sauvat_ct` (đã thuế), `type` ∈ {Nước uống, Đồ ăn, Sản phẩm khác}, `daxoa`, `nguoitao`

`tyle_ck` và `sotien_ck` đều bằng 0 ở **toàn bộ** 233.996 dòng → **không có dữ liệu chiết khấu**.

---

## 2. Phân bố cơ bản

**Thuế suất (số dòng hàng):** 8% → 213.730 · 10% → 13.491 · 5% → 6.620 · 0% → 155

**Nhóm hàng (`type`):**

| | Nước uống | Đồ ăn | Sản phẩm khác |
|---|---|---|---|
| Số dòng | 129.976 | 73.607 | 30.413 |

**Số hóa đơn theo tháng (chỉ bán ra, `daxoa=0`):**

| Tháng | 12/24 | 01/25 | 02 | 03 | 04 | 05 | 06 | 07 | 08 |
|---|---|---|---|---|---|---|---|---|---|
| Số HĐ | 31 | 34 | 6.554 | 4.498 | 4.954 | 8.564 | 8.857 | 10.855 | 5.963 |

**Số món/hóa đơn:** trung bình 3,46 · trung vị 2 · tối đa **1.469** (bất thường — xem vấn đề #2)

---

## 3. Năm vấn đề dữ liệu

### Vấn đề 1 — Trộn hóa đơn mua vào và bán ra

`ma_ncc_hddt` có 2 giá trị: `THUE_BANRA` (54.227) và `THUE_MUAVAO` (13.335).

| Tháng | THUE_BANRA | THUE_MUAVAO |
|---|---|---|
| 03/2025 | 4.498 | **6.480** |
| 04/2025 | 4.954 | **6.855** |
| Các tháng khác | tất cả | 0 |

Hóa đơn mua vào là giao dịch với nhà cung cấp, bản chất hoàn toàn khác giao dịch bán lẻ.

**→ Xử lý:** chỉ giữ `ma_ncc_hddt = 'THUE_BANRA'`.

**→ Hệ quả kèm theo:** ta có dữ liệu **giá vốn/đầu vào chỉ cho tháng 3–4/2025**, tức toàn bộ *trước* chính sách 1/7. Không thể quan sát chuyển giá ở khâu cung ứng sau chính sách. Đây là hạn chế nền tảng, xem §5.

### Vấn đề 2 — Hóa đơn tổng hợp giai đoạn đầu

12/2024 có 31 hóa đơn nhưng 21.564 dòng chi tiết; 01/2025 có 34 hóa đơn nhưng 22.842 dòng. Có hóa đơn chứa 1.469 dòng.

→ Đây là **hóa đơn tổng hợp / bảng kê cuối kỳ**, không phải giao dịch bán lẻ từng lần. Không dùng được cho phân tích cấp giỏ hàng.

**→ Xử lý:** cắt mẫu từ **01/02/2025**.

### Vấn đề 3 — Cửa hàng dời địa điểm giữa kỳ

`diachi_ban` theo tháng (số hóa đơn):

| Tháng | 08 Vũ Tông Phan (Thủ Đức) | The Opera Residence (Thủ Thiêm) |
|---|---|---|
| 12/2024 – 05/2025 | tất cả | 0 |
| 06/2025 | 6.375 | 2.482 |
| 07–08/2025 | **0** | tất cả |

Đây là **một cửa hàng đổi địa điểm** khoảng 10/06/2025, không phải hai điểm bán song song. Cú sốc tệp khách hàng xảy ra **20 ngày trước** mốc chính sách 01/07/2025.

**→ Xử lý:** không lọc bỏ, mà kiểm chứng bằng thiết kế:
- Giả dược đặt tại mốc dời (01/06): β = 0,314, p = 0,580 → không tạo phân kỳ giá giữa hai nhóm
- Cửa sổ hẹp chỉ dùng địa điểm mới (10/06–17/08): β = −0,289, p = 0,655 → kết quả không đổi
- Kiểm tra danh mục hàng: **152/158 SKU treated bán ở cả hai địa điểm; 0 SKU chỉ bán ở chỗ cũ** → panel SKU không gãy

### Vấn đề 4 — `daxoa=2` là bản ghi trùng lặp ✅ đã giải mã

3.917 hóa đơn có cờ `daxoa=2`.

| | `daxoa=2` | `daxoa=0` cùng tháng 5 |
|---|---|---|
| Số hóa đơn | 3.917 | 8.564 |
| Khoảng ngày | **chỉ 01/05 – 16/05/2025** | cả tháng 5 |
| `nguoitao` | **BOT** (100%) | **DNCS** (100%) |
| Tiền trung bình | 66.300đ | 68.636đ |
| Ký hiệu hóa đơn | C25MBK (100%) | C25MBK (100%) |
| Trùng `hoadon_so` với nhóm kia | **1.589 / 3.917** | — |

Cùng khoảng ngày, cùng ký hiệu, tiền trung bình tương đương, khác nguồn nạp (`BOT` vs `DNCS`), và **1.589/3.917 (40,6%) trùng số hóa đơn**.

**→ Kết luận thận trọng:** khối `BOT` đã bị hệ thống đánh dấu xóa và **có dấu hiệu trùng lặp** với khối `DNCS` cùng kỳ. Tuy nhiên tỷ lệ trùng `hoadon_so` chỉ 40,6%, nên **chưa đủ căn cứ để khẳng định toàn bộ 3.917 hóa đơn là bản nạp hai lần** nếu không có xác nhận nghiệp vụ từ phía doanh nghiệp.

**→ Xử lý:** loại `daxoa=2`. Lý do là **ngữ nghĩa của cờ xóa** (bản ghi đã bị hủy), không phải vì đã chứng minh được trùng lặp hoàn toàn. Viết đúng như vậy trong báo cáo.

### Vấn đề 5 — Mã vạch bắt đầu được điền đúng ngày 21/04/2025 ⚠️ nghiêm trọng

`ma_hh_ct` chỉ có giá trị ở 138.982/233.996 dòng (59%). Tỷ lệ dòng có mã vạch theo tuần:

| Tuần | Tỷ lệ có `ma_hh_ct` |
|---|---|
| 03/02 → 16/03 | **0,0%** |
| **21/04 → 27/04** | **100,0%** |
| Từ đó về sau | 100,0% |

Chuyển từ 0% sang 100% ngay lập tức, không có giai đoạn chuyển tiếp — đúng ngày đầu tiên sau lỗ hổng 39 ngày (vấn đề 6).

Số SKU có giao dịch theo tháng, trong hai nhóm phân tích:

| Tháng | Treated | Đối chứng 10% |
|---|---|---|
| 02/2025 | **0** | **0** |
| 03/2025 | **0** | **0** |
| 04/2025 | 74 | 101 |
| 05/2025 | 127 | 129 |
| 06/2025 | 126 | 145 |
| 07/2025 | 139 | 155 |
| 08/2025 | 112 | 114 |

**→ Kỳ tiền can thiệp hiệu dụng chỉ có 3 tháng (04–06/2025)**, không phải 5 tháng. Đây là lý do kỹ thuật khiến tháng 2–3 rớt khỏi event study.

**→ Và sau khi loại tháng 4 (vấn đề 6), tiền kỳ thực chỉ còn 2 tháng: 05 và 06/2025.**

### Vấn đề 6 — Lỗ hổng 39 ngày và các khoảng trống khác ⚠️ nghiêm trọng nhất

Kiểm tra các ngày **không có bất kỳ hóa đơn bán ra nào** (từ 01/02/2025):

| Khoảng thiếu | Số ngày | Ghi chú |
|---|---|---|
| 08/02 → 11/02 | 4 | |
| 15/02 → 16/02 | 2 | |
| **13/03 → 20/04** | **39** | Lỗ hổng lớn nhất, nguyên nhân chưa rõ |
| 04/05 → 05/05 | 2 | |
| **02/06 → 10/06** | **9** | Trùng thời điểm dời cửa hàng |

**Chỉ 136/196 ngày trong kỳ có dữ liệu.** Số ngày có dữ liệu theo tháng:

| Tháng | 04 | 05 | 06 | 07 | 08 |
|---|---|---|---|---|---|
| Số ngày | **10** | 28 | 20 | 31 | 17 |

**→ "Tháng 4" thực chất chỉ là 10 ngày (21–30/04)**, nằm ngay sau lỗ hổng 39 ngày, trùng thời điểm hệ thống mã vạch khởi động, và sát lễ 30/4–1/5.

**→ Xử lý: LOẠI tháng 4 khỏi kỳ tiền can thiệp.** Quy tắc này được đặt ra dựa trên **đặc tính dữ liệu** (10 ngày, sau lỗ hổng, hệ thống vừa chạy), không dựa trên kết quả ước lượng. Chi tiết kiểm chứng: [10-truy-nguyen-hai-co-do.md](10-truy-nguyen-hai-co-do.md).

---

## 4. Quy tắc lọc chốt

```
Bắt đầu:                       233.996 dòng chi tiết / 67.562 hóa đơn
1. Chỉ THUE_BANRA           →  loại 13.335 hóa đơn mua vào
2. Chỉ daxoa = '0'          →  loại 3.917 hóa đơn bị đánh dấu xóa
3. Ngày >= 2025-05-01       →  loại hóa đơn tổng hợp 12/2024-01/2025,
                               giai đoạn chưa có mã vạch (02-03/2025),
                               và cửa sổ 10 ngày của tháng 4 (vấn đề 6)
4. soluong_ct > 0           →  loại dòng số lượng bằng 0
5. sotien_sauvat_ct > 0     →  loại dòng giá bằng 0 (hàng tặng)
6. ma_hh_ct không rỗng      →  chỉ giữ dòng có mã vạch
Kết quả (đặc tả sạch):      82.109 dòng hàng
                            153 SKU treated / 157 ĐC 10% / 1.908 ĐC 8%
```

Đặc tả cũ (mốc 2025-02-01, giữ tháng 4) cho 97.092 dòng — vẫn báo cáo song song làm kiểm định độ nhạy.

Mỗi bước phải ghi số quan sát còn lại vào báo cáo cuối.

---

## 5. Hạn chế dữ liệu không khắc phục được

| Hạn chế | Hệ quả |
|---|---|
| **Không có giá vốn / chiết khấu nhà cung cấp sau 1/7** | Không xác định được phần lợi ích giảm thuế cuối cùng thuộc về nhà bán lẻ hay nhà cung cấp |
| **Một cửa hàng duy nhất** | Không có đơn vị đối chứng theo không gian; không làm được synthetic control |
| **Kỳ tiền can thiệp 3 tháng, 2 kỳ lead** | Kiểm định xu hướng song song có sức mạnh thấp |
| **Không có dữ liệu chiết khấu** (`tyle_ck` = 0 toàn bộ) | Không quan sát được khuyến mại — một kênh chuyển giảm thuế thay thế |
| **Không có thông tin khách hàng** | 99,9% là "KHÁCH HÀNG VÃNG LAI", không theo dõi được hành vi cá nhân |
| **`ngaytao` không đáng tin làm giờ giao dịch** | Phân bố giờ bất thường (17h chiếm 56.010 dòng) → nghi là thời điểm nạp theo lô, không phải giờ mua |
