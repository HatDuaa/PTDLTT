# Phase 03 — Hai phương pháp ước lượng

**Người:** C · **Chương phủ:** 9, 10 · **Phụ thuộc:** phase 0, 1, 2 · **Chặn:** phase 4, 5

> Toàn bộ đặc tả đã khóa ở [`dac-ta-khoa.md`](dac-ta-khoa.md). Phase này **thi hành**, không quyết định.
>
> 🔴 Cổng chẩn đoán 1 **đã chạy và KHÔNG ĐẠT** ([§9](dac-ta-khoa.md)). Quy tắc hạ cấp đã kích hoạt: cả hai phương pháp trình bày là **so sánh có điều chỉnh**, không phải ước lượng nhân quả sạch.

---

## 1. Bảng estimand × phương pháp × mẫu

Lập bảng này **trước** khi viết dòng mã nào, để không ai trộn lẫn các mẫu:

| Vai trò | Ước lượng | Biến can thiệp | Mẫu | Phương pháp |
|---|---|---|---|---|
| **Chính** | ITT | **`Z`** | 155 vs 132 | PP1 **và** PP2 |
| Phụ | Per-protocol | `D` | T vs ĐC-A (153 vs 132) | PP1 và PP2 |
| Phụ | Per-protocol | `D` | T vs ĐC-B (153 vs 137) | PP1 |
| Phụ | Per-protocol | `D` | T vs ĐC-C (153 vs 157) | PP1 |
| Độ nhạy | Per-protocol | `D` | T vs ĐC-8% (153 vs 1908) | PP1 |
| Phụ lục | Wald | `Z` → `D` | như ITT | — |

🔴 **Cấm trộn mẫu C8 vào phân tích ITT.** Nhóm 8% đã ở diện giảm từ NQ 174/2024, không chịu tác động của NQ 204/2025 — nó là độ nhạy, không phải đối chứng của `Z`.

---

## 2. Định nghĩa cố định — đọc từ roster, không tự tính lại

`roster-sku.csv` phải chứa trực tiếp, để Phase 3/4 không bao giờ phải suy lại:

| Cột | Nội dung |
|---|---|
| `grp` | T / C10 / C8 |
| `Z` | 1 / 0 / −1 (chưa phân loại) |
| `D` | 0 / 1 |
| `loai_sp` | trạng thái phân loại |
| `vat_hoa` | **cờ mới** — SKU có mode thuế suất hòa 8/10 ở hậu kỳ |
| `pre_p`, `pre_q`, `pre_w` | hiệp biến tiền kỳ |

⚠️ **9 SKU hòa:** `D` của chúng **không được định nghĩa duy nhất** — chúng có cả giao dịch 8% lẫn 10% ở hậu kỳ. Cờ `vat_hoa` để mọi phân tích phụ lục chạy được biến thể loại chúng (T=144).

---

## 3. Phương pháp 1 — Hồi quy

### Hai đặc tả, khóa trước

```
(1a) y_i = α + τ·Z_i + ε_i                                   OLS, HC3
(1b) y_i = α + τ·Z_i + β₁·log(pre_p) + β₂·log(1+pre_q)
                     + β₃·pre_w + ε_i                        OLS, HC3
```

**Danh sách hiệp biến đã khóa, không thêm không bớt.** Chỉ ba biến, tất cả từ tiền kỳ. Tuyến tính, không tương tác, không đa thức.

🔴 **Cấm thêm hiệp biến sau khi thấy cổng cân bằng trượt.** Đó là quyết định hậu kiểm.

### 🔴 `τ` KHÔNG mặc nhiên là ATT

Hệ số OLS có điều chỉnh chỉ bằng ATT dưới các điều kiện mô hình cụ thể. Bắt buộc chọn **một** trong hai:

⚠️ **Bản trước của kế hoạch này mô tả sai regression standardization.** Nếu khớp mô hình trên **toàn mẫu** với dạng tuyến tính không tương tác rồi lấy trung bình hiệu dự đoán trên nhóm `Z=1`, kết quả **đúng bằng hệ số OLS `τ`**. Không tạo ra gì mới.

Hai lựa chọn đúng:

| Cách | Nội dung |
|---|---|
| **A** | Giữ mô hình (1b), gọi đúng tên: **"chênh lệch tuyến tính có điều chỉnh"**, **không** gọi là ATT |
| **B** | **g-computation cho ATT**: khớp mô hình phản thực **chỉ trên nhóm `Z=0`** |

Cách B:

```
m̂₀(X) = Ê[y | Z=0, X]        ← khớp CHỈ trên nhóm Z=0, ba hiệp biến, tuyến tính
ATT   = (1/n₁) · Σ_{i: Z=1} { y_i − m̂₀(X_i) }
```

**Báo cáo CẢ HAI.** Cách A là con số minh bạch; cách B là ước lượng ATT thật sự, nối vào khung Kết quả tiềm năng chương 8.6.

🔴 **Cách B có nguy cơ ngoại suy nghiêm trọng ở đồ án này**, vì `pre_q` và `pre_w` lệch rất mạnh (SMD −0,87 và −0,60): `m̂₀` phải dự đoán ở vùng hiệp biến mà nhóm `Z=0` gần như không có. **Bắt buộc** báo cáo tỉ lệ SKU `Z=1` nằm ngoài khoảng hiệp biến quan sát của nhóm `Z=0`.

Standardization chỉ có diễn giải nhân quả khi thêm exchangeability, positivity và mô hình kết quả đúng dạng — cả ba đều đáng ngờ ở đây.

**Sai số chuẩn cho cách B: bootstrap SKU**, không phải HC3 của một hệ số.

```
lặp 5.000 lần, seed 42:
  1. lấy mẫu lại SKU riêng trong Z=1 và trong Z=0
  2. khớp lại m̂₀ trên nhóm Z=0 mới
  3. dự đoán lại, tính lại ATT
SE = độ lệch chuẩn bootstrap ; KTC = phân vị 2,5%–97,5%
```

Delta method cũng đúng nếu dùng influence function đầy đủ (gồm cả bất định của hệ số **và** của phép lấy trung bình trên nhóm đích), nhưng bootstrap dễ kiểm chứng hơn ở quy mô này.

---

## 4. Phương pháp 2 — Phân tầng

### Dựng tầng LẠI trên mẫu ITT

🔴 **Không tái sử dụng** kiểm tra tầng của T–ĐC-A/B/C. Tầng phải dựng trên `Z=1 ∪ Z=0`:

- 5 phân vị `pre_p` tính trên mẫu gộp `Z=1 ∪ Z=0`
- Kiểm tra tầng rỗng / mỏng / common support
- Báo cáo SMD trong từng tầng

Đã đo trước: 5 tầng, **0 rỗng, 0 mỏng**, min n = 19 (`Z=1`) và 20 (`Z=0`).

### Công thức

```
τ̂_s   = ȳ(Z=1, tầng s) − ȳ(Z=0, tầng s)
w_s   = n_{Z=1,s} / Σ n_{Z=1,s}          ← trọng số ATT
τ̂_ATT = Σ_s w_s · τ̂_s
```

### Giải thích chênh lệch giữa PP1 và PP2

Nếu hai con số khác nhau, **không được chọn bên nào**. Phải:
1. Lập bảng `τ̂_s` và `w_s` theo từng tầng
2. Chỉ ra tầng nào tạo ra chênh lệch
3. Giải thích bằng cơ cấu tầng — đây chính là nghịch lý Simpson ở dạng thực

---

## 5. Suy diễn

| Hạng mục | PP1 cách A | PP1 cách B | PP2 |
|---|---|---|---|
| Sai số chuẩn | **HC3** | **Bootstrap** | **Bootstrap** |
| Số lần lặp | — | 5.000, `seed=42` | 5.000, `seed=42` |
| Đơn vị lấy mẫu lại | — | SKU trong `Z=1` / `Z=0` | SKU trong `Z=1` / `Z=0` |
| Đơn vị báo cáo | **"điểm log ×100"** | như trái | như trái |

### 🔴 Bootstrap PP2 — bản trước TỰ MÂU THUẪN

Bản trước vừa nói "lấy mẫu lại trong nhóm × **tầng cũ**" vừa nói "**tính lại** điểm cắt mỗi lần lặp". Không làm được cả hai. Phải chọn một:

| Cách | Nội dung | Trả lời câu hỏi gì |
|---|---|---|
| Có điều kiện trên thiết kế | Lấy mẫu trong tầng cũ, **giữ điểm cắt cố định** | Bất định *có điều kiện trên thiết kế đã quan sát* |
| **Bootstrap toàn bộ estimator** ✅ | Lấy mẫu SKU trong `Z=1`/`Z=0` từ mẫu **chưa chia tầng**, gộp lại, **tính lại `qcut`**, áp lại quy tắc tầng mỏng, tính lại trọng số và ATT | Bất định của *toàn bộ thủ tục* |

**Chọn cách 2.** Cũng phải sửa một khẳng định sai ở bản trước: giữ điểm cắt cố định **không** mặc nhiên "đánh giá thấp bất định" — nó trả lời một câu hỏi khác.

### Chi tiết bootstrap phải khóa

| Tình huống | Quy tắc |
|---|---|
| `qcut` mất tầng do giá trị trùng | `duplicates='drop'`, ghi nhận số tầng thực tế |
| Lần lặp tạo tầng rỗng/mỏng | Áp quy tắc gộp §9; nếu vẫn không đủ → **đánh dấu lần lặp thất bại**, không bỏ im lặng |
| Loại khoảng tin cậy | **Percentile** (2,5%–97,5%) |
| P-value bootstrap | Từ phân phối **tái định tâm dưới H₀**, không phải tỉ lệ `τ*` khác 0 |
| Số lần lặp hợp lệ tối thiểu | **≥ 4.750/5.000**; dưới ngưỡng thì báo cáo là thất bại |
| Số lần thất bại | **Bắt buộc báo cáo**, kể cả bằng 0 |

Ngoài ra báo cáo song song, **kèm đúng nhãn vai trò** ([§10](dac-ta-khoa.md)):
- Gộp cụm theo nhóm hàng (3 cụm) — **độ nhạy**, không tin cậy
- Hoán vị nhãn trong tầng — **độ nhạy**, không phải suy diễn ngẫu nhiên hóa hợp lệ

🔴 **Cấm viết "đã xử lý ngụy lặp".**

---

## 6. Cổng chẩn đoán — thi hành, không quyết định lại

| # | Chẩn đoán | Tiêu chí | Hành động nếu trượt |
|---|---|---|---|
| 1 | SMD trong tầng | > 1/3 cặp \|SMD\| > 0,25 | Hạ cấp **cả hai** phương pháp |
| 2 | Giả dược 05→06 cho `Z` + ĐC-A/B/C/8%, thô và có hiệp biến | \|ước lượng\| > **0,918** | Hạ cấp; nêu ở kết luận |
| 3 | TOST tiền xu hướng, biên **±0,918** | | Ghi "không chứng minh được song song" |

**Cổng 1 đã trượt.** Cổng 2 và 3 chạy ở phase này.

🔴 **Cấm dùng `p > 0,05` làm bằng chứng xu hướng song song.**

---

## 7. Lưới độ nhạy — định trước, chạy TOÀN BỘ

Chạy **từng yếu tố một** trên nền đặc tả chính, không chạy tổ hợp đầy đủ (sẽ nổ tổ hợp và mở đường chọn bảng đẹp). Báo cáo **hết**, kể cả kết quả bất lợi:

🔴 **Mỗi trục chỉ áp cho đúng estimand của nó.** Bản trước trộn lẫn — trục "23 SKU" chỉ có nghĩa với ITT, trục "ĐC-A/B/C/8%" chỉ có nghĩa với per-protocol.

| Trục | Các mức | Áp cho |
|---|---|---|
| Cửa sổ | chính · có tháng 4 · hẹp 1 tháng · sau dời chỗ | **cả hai** |
| Ngưỡng survivorship | ≥1 · ≥2 · ≥3 · ≥4 · ≥5 tuần | **cả hai** |
| 9 SKU hòa | giữ (T=153) · loại (T=144) | **cả hai** |
| 23 SKU chưa phân loại | loại · gán `Z=1` · gán `Z=0` | **chỉ ITT** |
| Định nghĩa đối chứng | ĐC-A · ĐC-B · ĐC-C · ĐC-8% | **chỉ per-protocol** |
| Biến kết quả | giá gồm thuế · giá chưa thuế | **cả hai** |

---

## Tiêu chí nghiệm thu

- [ ] Bảng estimand × phương pháp × mẫu có trong báo cáo
- [ ] ITT theo `Z` trình bày **trước** per-protocol
- [ ] PP1 dùng regression standardization, báo cáo cả hệ số thô
- [ ] Tầng PP2 dựng lại trên mẫu ITT, có bảng SMD trong tầng
- [ ] Bootstrap **tính lại điểm cắt** mỗi lần lặp
- [ ] Bảng `τ̂_s`, `w_s` theo tầng, có giải thích chênh lệch PP1/PP2
- [ ] Lưới độ nhạy chạy đủ, báo cáo hết
- [ ] Mọi hệ số ghi đơn vị "điểm log ×100"
- [ ] Không câu nào trong [danh sách cấm](dac-ta-khoa.md) xuất hiện
- [ ] Mọi con số sinh từ script, không gõ tay

## Rủi ro

| Rủi ro | Xử lý |
|---|---|
| Gọi `τ` là ATT theo quán tính | Dùng regression standardization, hoặc đổi tên |
| Thêm hiệp biến để "sửa" cân bằng | Danh sách khóa ở §8 đặc tả; cổng trượt thì hạ cấp, không vá |
| Chọn bảng độ nhạy đẹp | Chạy toàn bộ, báo cáo hết, có script sinh bảng |
| Trình bày hai con số khớp nhau như xác nhận nhân quả | Câu cảnh báo ở §14 là bắt buộc |
