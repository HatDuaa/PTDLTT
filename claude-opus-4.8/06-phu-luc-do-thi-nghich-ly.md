# 06 — Phụ lục: mô hình đồ thị và các nghịch lý

Phần này phục vụ chương 7 (mô hình đồ thị) và chương 8 (nghịch lý Simpson, Berkson) của môn học. **Đây là mục minh họa, không phải trụ chính ngang với phân tích VAT.**

Script: [`code/07`](code/07-berkson-va-mophong-lamtron.py), [`code/08a`](code/08a-mang-bayes-hoc-mu.py), [`code/08b`](code/08b-mang-bayes-tri-thuc-mien.py), [`code/09`](code/09-diemgia-simpson-giohang.py)

---

## 1. Nghịch lý Berkson / thiên lệch collider — dùng được, n lớn

Dữ liệu: 50.234 hóa đơn (bán ra, `daxoa=0`, từ 02/2025). Biến: tổng chi tiêu theo từng nhóm hàng trong mỗi hóa đơn.

**Tương quan chi tiêu giữa Nước uống và Đồ ăn:**

| Tập dữ liệu | n | r(Nước uống, Đồ ăn) | r(Nước, Khác) | r(Đồ ăn, Khác) |
|---|---|---|---|---|
| **Toàn bộ** | 50.234 | **+0,860** | +0,087 | +0,095 |
| Giỏ nhỏ (<50k) | 30.829 | **−0,437** | −0,312 | −0,140 |
| Giỏ vừa (50–150k) | 14.526 | **−0,494** | −0,340 | −0,211 |
| Giỏ lớn (>150k) | 4.879 | +0,871 | +0,075 | +0,083 |

**Cấu trúc nhân quả:** tổng tiền hóa đơn là **collider** (nút hội tụ) của các khoản chi theo nhóm:

```
Chi Nước uống ──┐
Chi Đồ ăn     ──┼──► Tổng tiền hóa đơn
Chi SP khác   ──┘
```

Điều kiện hóa trên collider (phân tầng theo tổng tiền) tạo ra **tương quan âm giả tạo** giữa các nhóm chi: trong một giỏ có tổng tiền cố định, mua nhiều nước uống hơn nghĩa là mua ít đồ ăn hơn.

**Đây vừa là Berkson vừa là Simpson** — dấu tương quan đảo ngược hoàn toàn khi phân tầng, trên dữ liệu thật với n = 50.000. Không phải ví dụ sách giáo khoa đi mượn.

**Ứng dụng cho báo cáo:** đây là minh chứng trực quan nhất cho thông điệp trung tâm của chương 8 — điều kiện hóa sai biến có thể tạo ra quan hệ không tồn tại.

---

## 2. Học cấu trúc mạng Bayes — hạ xuống phụ lục

**Dữ liệu:** 50.234 hóa đơn. Biến rời rạc: `NuocUong`, `DoAn`, `SPKhac` (có/không trong giỏ), `SoMon` (1/2/3/4+), `TongTien` (tứ phân vị), `CuaHang` (cũ/mới), `CuoiTuan`, `SauChinhSach`.

### 2.1 Học "mù" — không tri thức miền

Thuật toán PC (kiểm định chi bình phương, α=0,01) và Hill-Climbing với điểm BIC đều cho ra các cạnh **vô lý về mặt nhân quả**:

| Cạnh học được | Vì sao vô lý |
|---|---|
| `TongTien → NuocUong` | Tổng tiền hóa đơn gây ra việc mua nước uống? Ngược chiều |
| `SoMon → DoAn` | Số món trong giỏ gây ra việc mua đồ ăn? Ngược chiều |
| `DoAn → CuaHang` | Mua đồ ăn gây ra việc cửa hàng nằm ở địa chỉ nào? Vô nghĩa |
| `CuaHang → CuoiTuan` | Cửa hàng gây ra ngày cuối tuần? Vô nghĩa |
| `SauChinhSach → CuaHang` | Chính sách thuế gây ra vị trí cửa hàng? Vô nghĩa |

### 2.2 Thêm tri thức miền

Ràng buộc: cấm cạnh **đi ra** từ biến tổng hợp (`SoMon`, `TongTien`); cấm cạnh **đi vào** biến ngoại sinh (`CuaHang`, `CuoiTuan`, `SauChinhSach`).

Kết quả — đồ thị hợp lý, trùng với DAG chuyên gia:

```
CuaHang ──► NuocUong, DoAn, SPKhac
CuoiTuan ──► DoAn, SPKhac
NuocUong, DoAn, SPKhac ──► SoMon
NuocUong, DoAn, SPKhac ──► TongTien
```

### 2.3 Kiểm định độc lập có điều kiện

| Giả thuyết độc lập | χ² |
|---|---|
| Nước uống ⊥ Đồ ăn (không điều kiện) | 4.395 |
| Nước uống ⊥ Đồ ăn \| TongTien | 9.572 |
| Nước uống ⊥ Đồ ăn \| SoMon | 13.057 |
| Nước uống ⊥ SP khác (không điều kiện) | 2.415 |
| Nước uống ⊥ SP khác \| SoMon | 7.620 |

### 2.4 ⚠️ Hai cảnh báo phương pháp — bắt buộc nêu trong báo cáo

**(a) KHÔNG được kết luận "thuật toán đã trượt".**

`SoMon` và `TongTien` là **hàm tất định** của các món trong giỏ. Các thuật toán khám phá nhân quả (PC, Hill-Climbing) dựa trên các giả định như *causal sufficiency*, *faithfulness*, và dữ liệu không có quan hệ tất định quá mạnh. Ở đây **đầu vào đã vi phạm giả định của thuật toán**, nên việc nó tạo cạnh ngược không phải bằng chứng về sự yếu kém của thuật toán.

Cách phát biểu đúng: *"khi đưa vào các biến có quan hệ tất định, giả định của thuật toán bị vi phạm và kết quả không diễn giải nhân quả được; điều này minh họa rằng học cấu trúc từ dữ liệu quan sát cần tri thức miền để cho kết quả có nghĩa."*

**(b) KHÔNG so sánh trực tiếp các giá trị χ².**

4.395 vs 9.572 vs 13.057 có **bậc tự do và số tầng khác nhau** → không thể nói "phụ thuộc tăng 2–3 lần". Phải dùng:
- p-value kèm bậc tự do
- Cramér's V hoặc thước đo cỡ hiệu ứng tương ứng
- Kiểm tra kích thước ô kỳ vọng
- Phân tầng hợp lý

### 2.5 Vị trí trong báo cáo

Mục minh họa hoặc phụ lục. **Không** phục vụ trực tiếp câu hỏi VAT. Nếu cần rút gọn khối lượng, đây là mục cắt đầu tiên.

---

## 3. Nghịch lý Simpson — mẫu chưa đủ

Tỷ lệ SKU tăng giá (Δlog > 0,5%) sau 01/07:

**Gộp:**

| Nhóm | Tỷ lệ tăng giá | n |
|---|---|---|
| Treated | 0,147 | 156 |
| ĐC 10% | 0,161 | 161 |

**Tách theo nhóm hàng:**

| Nhóm hàng | Nhóm | Tỷ lệ tăng giá | n |
|---|---|---|---|
| Nước uống | Treated | 0,189 | 74 |
| Nước uống | ĐC 10% | 0,189 | 122 |
| Sản phẩm khác | Treated | 0,188 | 16 |
| Sản phẩm khác | ĐC 10% | 0,167 | **6** ⚠️ |
| Đồ ăn | Treated | 0,091 | 66 |
| Đồ ăn | ĐC 10% | 0,061 | 33 |

Gộp lại thì treated **thấp hơn** đối chứng (0,147 < 0,161); tách ra thì treated **bằng hoặc cao hơn** ở cả ba nhóm. Đây là dạng đảo chiều của nghịch lý Simpson.

⚠️ **Chưa dùng được:** nhóm "Sản phẩm khác" chỉ có **6 SKU đối chứng**. Cần tìm cách phân tầng khác (theo phân vị giá, theo ĐVT) hoặc dùng tập dữ liệu lớn hơn.

---

## 4. Điểm giá tâm lý — dữ liệu nền cho phân tích cơ chế

| Mức làm tròn | % giá niêm yết chia hết |
|---|---|
| 1.000đ | **91,7%** |
| 500đ | 93,0% |
| 100đ | 93,0% |

Các mức giá phổ biến nhất: 12.000 · 13.000 · 4.000 · 14.000 · 18.000 · 15.000 · 25.000 · 6.999 · 10.000 · 7.000 · 11.000 · 16.000

Dùng làm nền cho mô phỏng cơ chế ở [04 §5](04-ket-qua-uoc-luong.md).
