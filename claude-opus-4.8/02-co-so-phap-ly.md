# 02 — Cơ sở pháp lý của can thiệp

Đây là phần làm cho đề tài trở thành **phân tích nhân quả** chứ không phải phân tích tương quan: can thiệp do Quốc hội quyết định, hoàn toàn ngoài tầm ảnh hưởng của cửa hàng.

Script kiểm chứng: [`code/02a-thanh-phan-nhom-doi-chung.py`](code/02a-thanh-phan-nhom-doi-chung.py)

---

## 1. Hai giai đoạn chính sách

| Văn bản | Hiệu lực | Nội dung |
|---|---|---|
| **NQ 174/2024/QH15** + NĐ 180/2024/NĐ-CP | 01/01/2025 – 30/06/2025 | Giảm VAT 10% → 8%. Danh mục **loại trừ** gồm: viễn thông, CNTT, tài chính - ngân hàng - chứng khoán - bảo hiểm, bất động sản, kim loại và sản phẩm kim loại đúc sẵn, sản phẩm khai khoáng (trừ than), than cốc, dầu mỏ tinh chế, **sản phẩm hóa chất**, và hàng chịu **thuế tiêu thụ đặc biệt** |
| **NQ 204/2025/QH15** + NĐ 174/2025/NĐ-CP | 01/07/2025 – 31/12/2026 | Giảm VAT 10% → 8%, **mở rộng danh mục**: bỏ khỏi danh sách loại trừ các mặt hàng than, dầu mỏ tinh chế, **sản phẩm hóa chất**, kim loại đúc sẵn, xăng. Vẫn **giữ loại trừ** hàng chịu **thuế tiêu thụ đặc biệt** (trừ xăng) |

**Nguồn chính thức** (dùng cho báo cáo, không dùng trang tổng hợp luật):
- NQ 204/2025/QH15 — https://vanban.chinhphu.vn/?docid=214209&pageid=27160
- NĐ 174/2025/NĐ-CP — https://vanban.chinhphu.vn/?classid=1&docid=214310&pageid=27160&typegroupid=4

---

## 2. Cơ chế tạo ra hai nhóm

```
                    NQ 174 (1/1-30/6)          NQ 204 (từ 1/7)
Sản phẩm hóa chất   → LOẠI TRỪ, chịu 10%   →   ĐƯỢC GIẢM, còn 8%     ← NHÓM CAN THIỆP
Hàng chịu TTĐB      → LOẠI TRỪ, chịu 10%   →   VẪN LOẠI TRỪ, 10%     ← NHÓM ĐỐI CHỨNG
Hàng tiêu dùng khác → ĐƯỢC GIẢM, 8%        →   ĐƯỢC GIẢM, 8%         ← đối chứng phụ
```

Cả hai nhóm **cùng xuất phát từ mức 10%** trước 1/7, cùng bị loại trừ vì lý do pháp lý. Điểm khác biệt duy nhất: NQ 204 gỡ "sản phẩm hóa chất" khỏi danh sách, còn TTĐB thì không.

---

## 3. Khớp với dữ liệu

Xác định nhóm bằng chính dữ liệu: so sánh thuế suất phổ biến nhất (mode) của mỗi SKU trước và sau 01/07/2025.

| Nhóm | Ký hiệu | Số SKU | Trước 1/7 | Sau 1/7 |
|---|---|---|---|---|
| **Can thiệp** | T | **156** | 10% | 8% |
| **Đối chứng chính** | C10 | **161** | 10% | 10% |
| **Đối chứng phụ** | C8 | **1.951** | 8% | 8% |

### Nhóm can thiệp — mặt hàng tiêu biểu

FRESSI Khăn Ướt Face 20 tờ · FRESSI Khăn Ướt All Care · BELLO Khăn Ướt Không Mùi · MAMAMY Khăn Ướt · Yuniku Khăn ướt có hương · Max Cool Khăn Ướt · Aloe Vera Khăn ướt · Okamura Tăm chỉ kẻ răng · VPP Đức Trí Keo dán 502 · Listerine Nước súc miệng cool mint

→ Đúng là nhóm **sản phẩm hóa chất / chăm sóc cá nhân / văn phòng phẩm** mà NQ 204 vừa gỡ khỏi danh mục loại trừ.

### Nhóm đối chứng chính — mặt hàng tiêu biểu

SABECO Lager · MARLBORO Gold · 333 Bia · TIGER CRYSTAL · CRAVEN Demi Silver · TIGER Bia lon cao · CAMEL Dưa Hấu · SAPPORO Premium · REDHORSE · KENT Iswitch · HEINEKEN · 555 King Gold · MEVIUS Sky Blue · SOMERSBY · BLANC 1664 · Budweiser · Rượu Soju Jinro

→ Đúng là **bia, rượu, thuốc lá** — hàng chịu thuế tiêu thụ đặc biệt, bị loại trừ ở cả hai nghị quyết.

**Sự khớp này giữa dữ liệu và văn bản pháp luật là bằng chứng mạnh nhất cho tính ngoại sinh của can thiệp.** Không có cách nào cửa hàng tự chọn mặt hàng nào được giảm thuế.

---

## 4. Mức giảm thuế lý thuyết

Giá đã gồm thuế = giá chưa thuế × (1 + τ).

Nếu chuyển **hoàn toàn** phần giảm thuế vào giá bán (giá chưa thuế giữ nguyên):

```
Δlog(giá gồm thuế) = log(1,08 / 1,10) = −0,01835 = −1,835%
```

Đây là **mốc so sánh (benchmark)** cho toàn bộ phân tích: pass-through = ATT thực tế / (−1,835%).

- pass-through = 1 → chuyển hoàn toàn cho người tiêu dùng
- pass-through = 0 → giá thanh toán không đổi, phần giảm thuế ở lại trong chuỗi cung ứng

---

## 5. Lưu ý khi viết báo cáo

**Phải nêu rõ:** chính sách áp dụng cho **toàn quốc và toàn chuỗi cung ứng**, không riêng khâu bán lẻ. Giá vốn nhà cung cấp bán cho cửa hàng cũng chịu mức thuế mới. Vì vậy cái đo được là **mức chuyển giá ròng qua toàn chuỗi tới người tiêu dùng cuối**, không phải quyết định định giá riêng của nhà bán lẻ.

Kết hợp với việc dữ liệu hóa đơn mua vào chỉ có tháng 3–4/2025 (trước chính sách), **không thể tách được** phần lợi ích thuộc về nhà bán lẻ hay nhà cung cấp.
