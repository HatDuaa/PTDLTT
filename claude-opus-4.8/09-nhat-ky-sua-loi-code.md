# 09 — Nhật ký sửa lỗi code sau review vòng 3

Nguồn phản biện: `../codex-gpt-5.6-review/04-addendum-ban-hoan-chinh.md` — 8 điểm. **Cả 8 đều đúng.** Hai điểm đầu là **lỗi code thật**, sáu điểm còn lại là lỗi phát biểu.

Script sửa: [`code/10-SUA-eventstudy-hiepbien-tost-bootstrap.py`](code/10-SUA-eventstudy-hiepbien-tost-bootstrap.py) · [`code/11-mde-va-duong-cong-suc-manh.py`](code/11-mde-va-duong-cong-suc-manh.py)

---

## A. Hai lỗi code — đã sửa, kết quả THAY ĐỔI

### Lỗi 1 — Hiệp biến "tiền kỳ" thực chất tính trên toàn kỳ

**Code sai** (`code/03`, dòng 29–31):

```python
cov = d.groupby('sku').agg(..., pre_p=('pg','median'), nq=('soluong_ct','sum'))
```

`d` là **toàn bộ mẫu**, gồm cả sau 01/07. Biến đặt tên `pre_p` (giá nền) và `nq` (sản lượng nền) nhưng thực tế chứa thông tin hậu can thiệp → điều chỉnh trên biến hậu can thiệp, một dạng rò rỉ.

**Code đúng** (`code/10`):

```python
PRE = d[~d.post]
cov = PRE.groupby('sku').agg(..., pre_p=('pg','median'), pre_q=('soluong_ct','sum'),
                             pre_w=('dg', lambda s: s.dt.to_period('W').nunique()))
```

**Kết quả thay đổi:**

| Đặc tả | Bản 1 (rò rỉ) | Bản 2 (đúng) | Nhận xét |
|---|---|---|---|
| ATT + hiệp biến, ĐC 10% | +0,343 (p=0,610) | +0,096 (p=0,884) | Không đổi kết luận |
| **ATT + hiệp biến, ĐC 8%** | +0,916 (p=0,113) | **+1,225 (p=0,038)** | **Chuyển từ không có ý nghĩa sang CÓ ý nghĩa** |

→ Với nhóm đối chứng 8% và hiệp biến đúng, ước lượng là **pass-through âm có ý nghĩa thống kê**. Đây là cảnh báo độ nhạy nghiêm túc: **kết luận phụ thuộc vào lựa chọn nhóm đối chứng**. Phải báo cáo cả hai.

### Lỗi 2 — Event study thiếu SKU FE và chuẩn hóa bằng dữ liệu toàn kỳ

**Code sai** (`code/05`, dòng 30–36):

```python
base = d.groupby(['sku','grp'])['pg'].median().rename('p0')     # toan ky!
mm['y'] = np.log(mm.pg / mm.p0) * 100
smf.ols("y ~ C(thang, Treatment('2025-06')) * T", s)             # khong co C(sku)
```

Hai vấn đề: mẫu số `p0` tính trên toàn kỳ nên biến kết quả tiền kỳ đã chứa thông tin hậu kỳ; và không có hiệu ứng cố định SKU nên đặc tả không phải event study đúng nghĩa.

**Code đúng** (`code/10`):

```python
mm['ly'] = np.log(mm.pg) * 100
smf.ols("ly ~ C(thang, Treatment('2025-06'))*T + C(sku)", s).fit(
    cov_type='cluster', cov_kwds={'groups': s.sku})
```

**Kết quả thay đổi — theo hướng bất lợi:**

| Hệ số lead | Bản 1 (sai) | Bản 2 (đúng), ĐC 10% | Bản 2, ĐC 8% |
|---|---|---|---|
| Tháng 04/2025 | −0,727 (p=0,373) | **−1,374 (p=0,123)** | **−1,352 (p=0,074)** |
| Tháng 05/2025 | −0,003 (p=0,996) | −0,030 (p=0,963) | +0,343 (p=0,560) |

→ **Bằng chứng xu hướng song song YẾU ĐI.** Hệ số lead tháng 4 gần gấp đôi độ lớn, và với đối chứng 8% thì p = 0,074. Cùng với giả dược 01/05 (p = 0,061), có **hai tín hiệu độc lập** cảnh báo về xu hướng tiền can thiệp khác nhau giữa hai nhóm.

---

## B. Bốn phần bổ sung mã tái lập

### 3 — TOST đầy đủ (trước đây gọi sai tên)

Bản 1 chỉ làm: (a) kiểm định điểm H₀: ATT = −1,835%, và (b) kiểm tra KTC có nằm trong ±0,5%. **Đó không phải TOST.**

Bản 2 cài đúng hai kiểm định một phía với biên định trước:

```python
p_lo = 1 - norm.cdf((est + delta)/se)   # H01: ATT <= -delta
p_hi = norm.cdf((est - delta)/se)       # H02: ATT >= +delta
p_TOST = max(p_lo, p_hi)
```

| Biên tương đương | ĐC 10% | ĐC 8% | Kết luận |
|---|---|---|---|
| ±0,459% (25% pass-through) | 0,2107 | 0,3675 | ❌ |
| ±0,917% (50% pass-through) | 0,0518 | 0,1052 | ❌ (sát ngưỡng) |
| ±0,500% (tuyệt đối) | 0,1900 | 0,3370 | ❌ |

→ **Không kết luận được tương đương ở bất kỳ biên nào.** Chỉ giả thuyết chuyển hoàn toàn bị bác bỏ (p = 0,0009).

### 4 — Bootstrap cụm theo SKU (5.000 lần)

| | ATT bootstrap TB | KTC 95% percentile | Pass-through KTC |
|---|---|---|---|
| ĐC 10% | +0,035% | [−1,047; +1,118] | [−0,609; +0,571] |
| ĐC 8% | +0,284% | [−0,692; +1,271] | [−0,693; +0,377] |

Khớp với HC3 giải tích.

### 5 — MDE và đường cong sức mạnh

Bản 1 ghi MDE ≈ 87% nhưng **không có mã tái lập** — đó là phép tính nhẩm. Bản 2 có `code/11`:

| Tác động thật | % nền | Tỷ lệ bác bỏ H₀ (2.000 mô phỏng) |
|---|---|---|
| 20% | 0,209 | 13,4% |
| 30% | 0,313 | 27,6% |
| 50% | 0,521 | 53,1% |
| 80% | 0,834 | 88,4% |
| 100% | 1,043 | 97,4% |

MDE giải tích = (1,96 + 0,8416) × 0,325 = 0,910 đơn vị = **87% nền**. Mô phỏng khớp.

---

## C. Sáu điểm sửa cách phát biểu

| # | Phản biện | Đã sửa thành |
|---|---|---|
| 5 | `daxoa=2` chưa "giải mã dứt điểm" — chỉ 1.589/3.917 trùng `hoadon_so` | "Có dấu hiệu trùng lặp; loại vì **ngữ nghĩa của cờ xóa**, không phải vì đã chứng minh toàn bộ là bản nạp hai lần" |
| 6 | Placebo p=0,580 không "loại bỏ" đe dọa | "Không phát hiện phân kỳ giá tại mốc dời cửa hàng; **làm giảm bớt, nhưng không loại bỏ** lo ngại" |
| 7 | "Phần giảm VAT không được phản ánh vào giá" quá tuyệt đối | "Điểm ước lượng cho thấy **rất ít** phản ánh vào giá, nhưng KTC **còn tương thích với mức chuyển một phần**; bác bỏ chuyển hoàn toàn trong đặc tả hiện tại" |
| 8 | Mô phỏng làm tròn không bác bỏ toàn bộ menu cost | "Bác bỏ **các quy tắc làm tròn 500đ/1.000đ đã giả định**; không bác bỏ khái niệm menu cost nói chung (cập nhật POS, in bảng giá, phối hợp NCC, chính sách giá toàn chuỗi)" |

---

## D. Năm câu trả lời cho câu hỏi mở — đã tiếp nhận

| Câu hỏi | Trả lời của reviewer | Xử lý |
|---|---|---|
| Có bỏ sót mô hình thứ hai? | Không thấy chiến lược nhận dạng thứ hai đủ mạnh. Nếu thầy chấp nhận hai estimator thì dùng DiD + doubly robust/weighted DiD | Ghi vào [03 §6.2](03-thiet-ke-nhan-qua.md) |
| Placebo 1/5 p=0,061? | Không xử lý như ngưỡng đặc biệt; xem là tín hiệu về độ bất ổn pre-trend | Đã sửa [04 §3.1](04-ket-qua-uoc-luong.md) |
| Survivorship? | **Không chọn ngưỡng sau khi xem kết quả.** Đặc tả chính dùng điều kiện tối thiểu **định trước**; báo cáo toàn bộ lưới độ nhạy và estimand của từng mẫu | Ghi vào [08](08-chia-viec-4-nguoi.md) |
| Simpson? | **Không cố tìm.** Nếu không có phân tầng có ý nghĩa miền và đủ mẫu thì bỏ, tránh data dredging | Hạ ưu tiên, có thể cắt |
| 3 tháng tiền kỳ có đủ? | Đủ cho **đồ án khám phá** nếu thầy chấp nhận và nhóm trình bày hạn chế; **không đủ** để gọi là bằng chứng nhân quả mạnh | Ghi vào [05](05-han-che-va-rui-ro.md) và README |

---

## E. Trạng thái sau vòng 3

✅ Đã sửa 2 lỗi code, bổ sung 4 mã tái lập, sửa 6 cách phát biểu.

⚠️ **Phát sinh 2 vấn đề mới từ chính việc sửa:**
1. Kết luận **nhạy với nhóm đối chứng** — ĐC 8% + hiệp biến tiền kỳ cho ATT = +1,225% (p = 0,038)
2. Bằng chứng **xu hướng song song yếu hơn** so với bản 1 — lead tháng 4 khoảng −1,35 điểm %

Cả hai phải đưa vào báo cáo cuối như hạn chế, không được giấu.
