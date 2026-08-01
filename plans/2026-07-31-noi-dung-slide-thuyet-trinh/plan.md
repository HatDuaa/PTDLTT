---
status: draft
created: 2026-07-31
topic: Nội dung slide thuyết trình — bám theo đúng thứ tự suy luận của phân tích
---

# Kế hoạch — Viết lại nội dung slide theo mạch suy luận

> **Mục đích.** Bộ slide hiện tại (20 slide, `web/frontend/app/trinh-bay/page.tsx`) trình bày
> đúng *phương pháp*, nhưng bỏ qua ba bước đầu của mạch suy luận: **đo cái gì → đo ra cái gì →
> vì sao cái đó chưa dùng được**. Người nghe nhảy thẳng vào "bốn cách ước lượng" mà chưa biết
> con số gốc là bao nhiêu và vì sao không dùng thẳng được.
>
> File này chốt nội dung TRƯỚC, dựng slide SAU. Mọi con số đã tra ngược về file kết quả.

## Vì sao cần

Buổi trao đổi ngày 31/07 làm lộ ra ba chỗ mà slide hiện tại không trả lời được, dù người
trình bày hiểu rõ:

1. **`−0,398` là gì.** Rất dễ đọc thành "giá giảm 0,4%". Thực tế **giá cả hai nhóm đều tăng** —
   `+0,624` và `+1,022`. Con số `−0,398` là *chênh lệch mức tăng*, không phải mức giảm.
2. **Vì sao sai số lớn thế.** Slide đưa `±0,6` mà không nói nó từ đâu ra, cũng không nói vì sao
   thêm biến kiểm soát lại làm nó **to lên** chứ không nhỏ đi.
3. **Vì sao Y dương mà tỉ lệ chuyển thuế lại 22%.** Đây là chỗ dễ bị hỏi nhất và slide hiện tại
   không có câu trả lời.

Ba chỗ này không phải chi tiết kỹ thuật cần giấu — chúng **là nội dung phân tích**.

## Bản đồ slide sau khi sửa

| # | Slide | Trạng thái | Chi tiết |
|---|---|---|---|
| 1–5 | Bìa · Đặt vấn đề · Dữ liệu · Xử lý · Phân bổ thời gian | giữ nguyên | — |
| 6 | Đánh giá sơ bộ dữ liệu | giữ nguyên | — |
| 7 | Cơ sở pháp lý | giữ nguyên | — |
| **8** | **Đo cái gì — biến Y** | 🆕 thêm | [phase 01](phase-01-mo-dau-va-do-luong.md#slide-a) |
| **9** | **Đo ra cái gì — cả hai nhóm đều tăng** | 🆕 thêm | [phase 01](phase-01-mo-dau-va-do-luong.md#slide-b) |
| **10** | **Vì sao chưa dùng thẳng được — hai nhóm khác nhau sẵn** | 🆕 thêm | [phase 01](phase-01-mo-dau-va-do-luong.md#slide-c) |
| 11 | Khung phương pháp | giữ nguyên | — |
| 12 | Đồ thị nhân quả | giữ nguyên | — |
| 13 | Gắn biến vào dữ liệu | giữ nguyên | — |
| 14 | Bốn cách ước lượng — tổng quan | giữ nguyên | — |
| **15** | **Cách 1 — hồi quy thô** | ✏️ tách | [phase 02](phase-02-bon-cach-uoc-luong.md#cach-1) |
| **16** | **Cách 2 — hồi quy có hiệp biến** | ✏️ tách | [phase 02](phase-02-bon-cach-uoc-luong.md#cach-2) |
| 17 | Cách 3 — g-computation | ✏️ sửa | [phase 02](phase-02-bon-cach-uoc-luong.md#cach-3) |
| 18 | Cách 4 — phân tầng | ✏️ sửa | [phase 02](phase-02-bon-cach-uoc-luong.md#cach-4) |
| 19 | Kiểm tra thiết kế — ba cổng | giữ nguyên | — |
| 20 | Kết quả — bốn ước lượng | giữ nguyên | — |
| 21 | Từ chênh lệch ra tỉ lệ chuyển thuế | ✏️ sửa | [phase 03](phase-03-doc-ket-qua-va-bay.md#slide-pass-through) |
| **22** | **Hai cách đọc — cần giả định vs không cần** | 🆕 thêm | [phase 03](phase-03-doc-ket-qua-va-bay.md#slide-hai-cach-doc) |
| 23 | Kiểm chứng bổ sung — chuẩn giá cơ học | giữ nguyên | — |
| 24 | Hạn chế | giữ nguyên | — |
| 25 | Kết luận | giữ nguyên | — |

**20 → 25 slide.** Thêm 4, tách 1 thành 2, sửa 3.

### Ba quyết định về bố cục, và lý do

**Tách cách 1 và cách 2 thành hai slide.** Slide gộp hiện tại là slide nặng nhất bộ: hai công
thức, hai con số lớn, ba gạch đầu dòng, một đoạn kết. Tách ra thì mỗi slide có chỗ cho phần
đang thiếu — cách 1 nhận công thức sai số, cách 2 nhận bảng hệ số đầy đủ.

**Bỏ slide "sai số chuẩn đến từ đâu" riêng.** Bản kế hoạch đầu tiên tách nó ra một slide.
Nhưng sai số chuẩn không phải một chủ đề độc lập — nó là thuộc tính của từng ước lượng. Tách
ra thì người nghe phải nhớ ngược lại hai slide trước. Nên gộp vào đúng chỗ nó thuộc về:

| Nội dung sai số | Về slide nào |
|---|---|
| Công thức `√(s₁²/n₁ + s₀²/n₀) = 0,598`, ý nghĩa "±0,6 là gì" | 15 — cách 1 |
| Vì sao thêm biến kiểm soát làm sai số TĂNG lên 0,733 | 16 — cách 2 |
| Bootstrap là gì, "bốc 155 lần ≠ bốc hết 155 món" | 18 — cách 4 |

**Giữ slide 10 (ba biến nền) dù đề xuất ban đầu bỏ nó.** Đây là slide trả lời câu *"vì sao
phải có tới bốn cách tính"*. Không có nó thì bốn phương pháp phía sau chỉ còn là bốn công thức
xuất hiện không lý do. Đây là slide đắt nhất phần phương pháp.

### Nguồn nội dung

Nội dung ba file phase chép từ phần giải thích ngày 31/07, nhưng **không chép nguyên**. Văn
bản đó viết để đọc dọc trong khung chat; slide thì chiếu lên tường và người nghe chỉ có vài
chục giây mỗi trang. Hai khác biệt bắt buộc:

| Trong tin nhắn | Trên slide |
|---|---|
| Một mục dài gồm nhiều ý | mỗi ý một slide, cắt ở chỗ đổi loại việc |
| Câu văn đầy đủ, có mệnh đề phụ | bảng, gạch đầu dòng, câu ngắn |
| Giải thích rồi mới ra số | số trước, giải thích sau |

Ví dụ rõ nhất: mục 0 của tin nhắn gồm sáu ý — công thức Y, ví dụ, vì sao dùng log, cỡ mẫu,
bảng hai nhóm, hai nhận xét. Sáu ý đó thành **hai** slide (8 và 9), cắt giữa ý 4 và ý 5 vì đó
là chỗ chuyển từ *định nghĩa* sang *báo cáo kết quả*.

## Nguyên tắc viết

| | |
|---|---|
| Mỗi slide **một ý** | nếu phải nói "và" giữa hai ý lớn thì tách slide |
| Con số phải **tra ngược được** | mỗi bảng ghi rõ lấy từ file nào, cột nào |
| Không gõ tay số suy ra được | tính từ hằng số trong `lib/hang-so-chinh-sach.ts` |
| Giọng trình bày, không cảm thán | "đánh giá sơ bộ" chứ không "điều đáng ngờ" |
| Nói hạn chế bằng câu khẳng định | "chưa tách được X" chứ không "rất tiếc là..." |

## Tiêu chí nghiệm thu

- [ ] Người nghe hiểu `−0,398` là **chênh lệch mức tăng**, không phải mức giảm
- [ ] Người nghe biết sai số `±0,6` đến từ đâu, và vì sao thêm biến kiểm soát làm nó to lên
- [ ] Trả lời được câu "Y dương mà sao tỉ lệ chuyển thuế 22%"
- [ ] Không slide nào chứa câu trong bảng cấm ([phase 03](phase-03-doc-ket-qua-va-bay.md#bang-cau-cam))
- [ ] `python code/b6_ra_soat_ngon_ngu.py` không tăng số vấn đề so với mốc hiện tại (8)
- [ ] Không slide nào tràn dọc hay tràn ngang ở khổ 1600×1000

## Bảng con số gốc

Mọi con số trong ba file phase đều lấy từ đây. Nếu chạy lại pipeline mà số đổi, sửa **ở đây trước**.

| Đại lượng | Giá trị | Nguồn |
|---|---|---|
| n nhóm Z=1 · Z=0 | 155 · 132 | `kq-theo-tang.csv`, cộng `n1`/`n0` mẫu *so sánh theo Z* |
| Trung bình Y — Z=1 · Z=0 | +0,6244 · +1,0222 | tính từ `mau-phan-tich-chinh.csv` cột `y` |
| Độ lệch chuẩn Y — Z=1 · Z=0 | 6,070 · 3,972 | như trên |
| Giữ nguyên giá y hệt — Z=1 · Z=0 | 126/155 · 103/132 | `\|pg_hau − pg_tien\| < 1` |
| Giá nền trung bình — Z=1 · Z=0 | 72.319đ · 108.913đ | cột `pre_p` |
| Sức bán trung bình — Z=1 · Z=0 | 6,2 · 33,3 | cột `pre_q` |
| Số tuần bán trung bình — Z=1 · Z=0 | 3,31 · 4,73 | cột `pre_w` |
| Bốn ước lượng | −0,398 · −0,270 · −0,664 · −0,257 | `kq-uoc-luong-chinh.csv` cột `uoc_luong` |
| Bốn sai số chuẩn | 0,600 · 0,733 · 0,776 · 0,592 | cột `se` |
| Bốn tỉ lệ chuyển thuế | 22% · 15% · 36% · 14% | cột `pass_through` |
| p với H₀ chuyển hoàn toàn | 0,017 · 0,033 · **0,131** · 0,008 | cột `p_chuyen_hoan_toan` |
| Mốc chuyển hoàn toàn | −1,835 | `100·log(1,08/1,10)` |
| Bám chuẩn cơ học Z=1 | 1/135 đạt · 110/135 giữ nguyên giá | `kq-bam-chuan-co-hoc.csv` |
| Bám chuẩn cơ học Z=0 (giả dược) | 1/92 đạt | như trên |
| Tỉ lệ buộc đổi mức, lưới 1.000đ | 135/155 | `kq-mo-phong-lam-tron.csv` |
| Số lần bootstrap | 5.000, hợp lệ 5.000, thất bại 0 | `kq-uoc-luong-chinh.csv` |

## Ba file nội dung

1. [phase-01 — Mở đầu và đo lường](phase-01-mo-dau-va-do-luong.md) · slide 8, 9, 10
2. [phase-02 — Bốn cách ước lượng](phase-02-bon-cach-uoc-luong.md) · slide 15, 16, 17, 18
3. [phase-03 — Đọc kết quả và các bẫy](phase-03-doc-ket-qua-va-bay.md) · slide 21, 22 + bảng câu cấm
