---
trang_thai: DA_KHOA
ngay_khoa: 2026-07-26
phien_ban: 1.0
---

# Đặc tả khóa — Đồ án tác động giảm thuế GTGT lên giá bán lẻ

> **Đây là văn bản ràng buộc.** Mọi con số trong báo cáo, slide và web phải sinh ra từ đúng đặc tả này.
>
> Sau ngày khóa, **không ai được sửa bất kỳ mục nào** mà không đi qua [§12 Quy trình sửa đổi](#12-quy-trình-sửa-đổi). Sửa lén là lỗi nặng nhất trong đồ án này — nhóm đã mắc đúng lỗi đó một lần (xem [§11](#11-công-bố-các-quyết-định-hậu-kiểm)).

Mục đích: **triệt tiêu bậc tự do của người phân tích.** Khi mọi lựa chọn đã cố định trước lúc nhìn kết quả cuối, không ai — kể cả chính nhóm — có thể vô tình chọn con số đẹp.

---

## 1. Câu hỏi và ước lượng đích

| | |
|---|---|
| **Câu hỏi** | Việc giảm thuế GTGT từ 10% xuống 8% ngày 01/07/2025 có làm giảm giá bán lẻ mà người tiêu dùng trả không? |
| **Ước lượng đích** | **ATT** — tác động trung bình lên chính nhóm hàng được giảm thuế |
| **Không phải ATE** | Nhóm được giảm thuế do luật định, không đại diện toàn bộ hàng hóa. Báo cáo **không được** phát biểu về ATE |
| **Tổng thể mà ATT đại diện** | 153 SKU được giảm thuế, **có bán ở cả tiền kỳ và hậu kỳ**, tại **một** cửa hàng tiện lợi TP.HCM |

⚠️ Mệnh đề "tổng thể" ở dòng cuối là hạn chế nền tảng, phải nhắc lại ở phần kết luận. Không ngoại suy ra ngành bán lẻ Việt Nam.

---

## 2. Nguồn dữ liệu và phiên bản

| | |
|---|---|
| File gốc | `60.xlsx` (47,5 MB), 2 sheet: `goc` (67.562 hóa đơn × 86 cột), `chitiet` (233.996 dòng × 34 cột) |
| Khóa nối | `soid`, nối 100% |
| Bản trung gian | `du-lieu-tam/` — sinh bởi `code/b0_doc_du_lieu.py` |
| Phạm vi thời gian file | 12/2024 – 08/2025 |

### Schema bắt buộc

Ép kiểu tường minh khi đọc, **không để pandas đoán**:

| Cột | Kiểu | Vì sao quan trọng |
|---|---|---|
| `soid` | **chuỗi** | Khóa nối; để số sẽ mất số 0 đầu |
| `ma_hh_ct` | **chuỗi** | Mã vạch. Đường `float → int64 → str` mà mã cũ đang dùng **có thể làm hỏng mã dài hoặc mất số 0 đầu** — phải bỏ |
| `ngayct`, `ngayct_ct` | datetime | Ép có kiểm tra, báo lỗi nếu không phân tích được |
| `soluong_ct`, `sotien_ct`, `sotien_sauvat_ct`, `tyle_vat_ct` | số | Ép có kiểm tra |

### Phép nối

| | |
|---|---|
| Khóa | `soid` |
| Quan hệ | `chitiet` **nhiều** → `goc` **một** (`validate='m:1'`) |
| Ngày dùng để phân kỳ | **`goc.ngayct`** (không dùng `chitiet.ngayct_ct`) |
| Cờ xóa dùng để lọc | **`goc.daxoa`** — ⚠️ **cả hai sheet đều có cột `daxoa`**, phải chỉ rõ dùng cái nào |
| Yêu cầu | `goc.soid` duy nhất; nối không rớt dòng ngoài dự kiến |

### Tái lập

```bash
python code/chay_tat_ca.py          # bỏ qua bước 0 nếu CSV khớp hash 60.xlsx
python code/chay_tat_ca.py --sach   # xóa du-lieu-tam/ và đọc lại từ xlsx
```

Runner **so hash `60.xlsx`** với dấu lưu ở `du-lieu-tam/nguon-xlsx.sha` trước khi dùng lại CSV cũ. Manifest ở `ket-qua/manifest-tai-lap.json` ghi phiên bản Python/thư viện, hash nguồn, tham số, số dòng và hash từng đầu ra.

---

## 3. Quy tắc lọc — theo đúng thứ tự

Thứ tự có ý nghĩa: bảng luồng mẫu phải báo cáo số dòng còn lại sau **từng** bước.

| # | Quy tắc | Điều kiện | Lý do |
|---|---|---|---|
| 1 | Chỉ hóa đơn bán ra | `ma_ncc_hddt == 'THUE_BANRA'` | 13.335 hóa đơn mua vào lẫn trong mẫu, chỉ có ở 03–04/2025 |
| 2 | Bỏ bản ghi có cờ xóa | `daxoa == '0'` | 3.917 bản ghi `daxoa=2`, toàn bộ 01–16/05, `nguoitao` BOT vs DNCS. **Loại vì ngữ nghĩa cờ xóa**, không phải vì đã chứng minh trùng lặp |
| 3 | Giữ từ `2025-04-01` | `ngayct >= 2025-04-01` | **Cố ý giữ tháng 4 ở bước này** để cửa sổ độ nhạy §6 chạy được từ cùng dữ liệu chuẩn. Cửa sổ cụ thể áp ở bước 2 |
| 4 | Số lượng dương | `soluong_ct > 0` | Loại trả hàng và bản ghi lỗi |
| 5 | Thành tiền dương | `sotien_sauvat_ct > 0` | Cần thiết để lấy log |
| 6 | Có mã vạch | `ma_hh_ct` không rỗng | Không có mã vạch thì không định danh được SKU. Trường này chỉ được điền từ **21/04/2025** |
| 7a | Áp cửa sổ §6 | `ngayct >= bắt_đầu` | Cửa sổ chính: từ `2025-05-01` |
| 7b | SKU có mặt ở **cả hai** kỳ | — | Ngưỡng survivorship §7 |
| 7c | Thuộc 1 trong 3 nhóm | `grp ∈ {T, C10, C8}` | Loại SKU đổi thuế suất hướng khác (8%→10%) |

⚠️ Bản đầu gộp 7a–7c thành một quy tắc. Tách ra vì khi số cuối lệch phải biết lệch do cửa sổ, do chọn lọc sống sót, hay do phân loại thuế.

**Không có quy tắc loại ngoại lệ giá.** Cố ý: mọi ngưỡng ngoại lệ đều là một bậc tự do. Thay vào đó dùng **trung vị** ở §4, vốn đã kháng ngoại lệ.

**Không có xử lý chiết khấu.** `tyle_ck` và `sotien_ck` bằng 0 trên toàn bộ 233.996 dòng — cửa hàng không ghi nhận chiết khấu.

**Kết quả sau lọc (đã xác minh 26/07/2026):** `82.109 dòng hàng`

---

## 4. Xây dựng biến

### Giá

| Biến | Công thức | Ghi chú |
|---|---|---|
| Giá đơn vị **gồm thuế** | `pg = sotien_sauvat_ct / soluong_ct` | Đây là giá **người tiêu dùng thực trả** |
| Giá đơn vị **chưa thuế** | `pn = sotien_ct / soluong_ct` | Doanh thu về tay cửa hàng |

Gộp về mức SKU × kỳ bằng **trung vị** (`median`), **không** phải trung bình. Lý do: kháng ngoại lệ và kháng thay đổi cơ cấu quy cách bán trong kỳ.

### Biến kết quả

| Vai trò | Biến | Công thức | Đơn vị |
|---|---|---|---|
| **Chính** | `y` | `log(pg_hậu / pg_tiền) × 100` | **điểm log ×100** ≈ phần trăm |
| Phụ | `yn` | `log(pn_hậu / pn_tiền) × 100` | như trên |

⚠️ **Đơn vị bắt buộc ghi rõ mọi nơi.** Nhóm đã từng nhầm lẫn "điểm log" và "điểm phần trăm". Quy ước: **luôn ghi "điểm log ×100"**, và chỉ nói "xấp xỉ %" khi giá trị nhỏ.

### Trọng số

**Mỗi SKU đếm ngang nhau.** Không trọng số theo doanh thu hay sản lượng.

Lý do: câu hỏi là "cửa hàng có hạ giá không", một quyết định định giá theo mặt hàng — không phải "người tiêu dùng tiết kiệm được bao nhiêu tiền". Trọng số theo doanh thu sẽ trả lời câu hỏi thứ hai, không phải câu hỏi đã đặt.

---

## 5. Danh sách SKU và phân nhóm

### Quy tắc gán nhóm

Với mỗi SKU, lấy **mode** của `tyle_vat_ct` riêng trong tiền kỳ và hậu kỳ:

**Quy tắc khi mode hòa** *(bổ sung 26/07 — trước đó `mode().iloc[0]` chọn ngầm theo thứ tự sắp xếp, một bậc tự do không ai kiểm soát)*:

| Trường hợp | Quy tắc |
|---|---|
| **Hậu kỳ hòa 8/10, tiền kỳ = 10** | → **T** (xem lập luận dưới) |
| Mọi trường hợp hòa khác | **Loại SKU**, đếm và báo cáo |
| `type` hòa | Lấy giá trị ở dòng có **ngày sớm nhất** trong tiền kỳ |

**Lập luận cho dòng đầu** — có hai lý do độc lập, không lý do nào phụ thuộc vào biến kết quả:

1. **Pháp lý.** Hàng bị loại trừ khỏi diện giảm thuế **không thể** được xuất hóa đơn ở mức 8%. Việc một SKU có phần đáng kể giao dịch hậu kỳ ở mức 8% chứng tỏ nó **thuộc diện được giảm**. Phần giao dịch còn ở 10% là do cập nhật thuế suất tại quầy chưa dứt điểm — lỗi vận hành, không phải địa vị pháp lý.
2. **Tránh chọn lọc hậu can thiệp.** Loại SKU vì đặc điểm quan sát được **ở hậu kỳ** chính là chọn lọc theo biến hậu can thiệp. Đồ án đã tránh lỗi này ở mọi chỗ khác; không có lý do làm ngược lại ở đây.

⚠️ **Công bố trung thực:** quy tắc này được viết ra **sau khi** thấy 9 SKU hòa và biết rằng loại chúng làm nhóm T còn 144 thay vì 153. Hai lý do trên đứng độc lập với con số, nhưng thứ tự thời gian là như vậy nên **bắt buộc báo cáo song song biến thể loại-khi-hòa (T=144)** ở bảng độ nhạy.

Mã cũ dùng `mode().iloc[0]` cũng cho ra 153, nhưng **do tình cờ**: pandas trả mode theo thứ tự tăng dần nên `.iloc[0]` lấy 8. Đúng kết quả, sai lý do — không được dựa vào hành vi đó.

Phase 1 phải in ra: số SKU hòa, số được gán T theo quy tắc trên, số bị loại.

| Nhóm | Ký hiệu | Điều kiện | Số SKU |
|---|---|---|---|
| Can thiệp | `T` | tiền 10% → hậu 8% | **153** |
| **Đối chứng chính** | `C10` | tiền 10% → hậu 10% | **157** |
| Đối chứng phụ | `C8` | tiền 8% → hậu 8% | **1.908** |

**Cơ sở pháp lý:** Nghị quyết 204/2025/QH15 bỏ "sản phẩm hóa chất" khỏi danh mục loại trừ giảm thuế. Hàng chịu **thuế tiêu thụ đặc biệt** (bia, rượu, thuốc lá) bị loại trừ ở **cả hai** nghị quyết → giữ 10% suốt kỳ.

### 🔴 Đối chứng bị ô nhiễm — phát hiện 26/07/2026

Bản đầu của đặc tả này viết: *"cả hai nhóm do luật định, không do cửa hàng chọn."* **Câu đó sai.** Đối chiếu 157 SKU trong C10 với định danh sản phẩm cho thấy:

| Loại hàng trong C10 | Số SKU | Ở 10% là do |
|---|---|---|
| Rượu, bia, thuốc lá | **132** | ✅ **Luật** — thuế TTĐB, bị loại trừ ở cả hai nghị quyết |
| **Hàng hóa chất / chăm sóc cá nhân** | **20** | 🔴 **Cửa hàng không cập nhật** — lẽ ra được giảm về 8% |
| Không xác định được từ tên | 5 | ❓ |

15 SKU đó gồm: *COLGATE kem đánh răng (2 loại), Garnier sữa rửa mặt, Gillette lưỡi dao cạo, mặt nạ Banobagi (2), Sur.Medic mặt nạ, BIORE lột mụn, MAYAN lột mụn, DHC son môi, Hatomugi sữa rửa mặt, dao cạo bikini, Kai dao cạo, bấm mi, SUKKIRI khử mùi.*

**Bằng chứng quyết định:** cùng dòng sản phẩm nằm ở hai nhóm khác nhau. `Gillette Lưỡi Dao Cạo Mach 3 Clean` ở **C10** trong khi `Gillette Dao cạo Mach 3 Clean` và 5 dao cạo Gillette khác ở **T**. `COLGATE KDR Optic White` ở **C10** còn `COLGATE kem đánh răng sensitive` ở **T**. Không có cách giải thích nào bằng luật.

⇒ **Việc thuộc nhóm nào không hoàn toàn ngoại sinh.** Với ~10% đối chứng, nó phản ánh việc cửa hàng có cập nhật thuế suất hay không — một quyết định vận hành nội bộ.

### Ba định nghĩa đối chứng — BẮT BUỘC báo cáo song song

| Định nghĩa | n | Lập luận nhận dạng |
|---|---|---|
| **ĐC-A: chỉ hàng rượu/bia/thuốc lá** | 132 | **Mạnh nhất** — thuế suất do luật cố định, không phụ thuộc cửa hàng |
| ĐC-B: C10 bỏ hàng hóa chất | 137 | Trung gian — loại phần ô nhiễm nhận diện được |
| ĐC-C: C10 đầy đủ | 157 | **Yếu nhất** — lẫn 15 SKU ở 10% do cửa hàng |

🔴 **Không được chọn một định nghĩa làm "kết quả chính".** Báo cáo cả ba ở mọi bảng, theo đúng nguyên tắc §13.

⚠️ **Công bố trung thực:** phát hiện này đến **sau khi** đã có kết quả với C10 đầy đủ, và ba định nghĩa cho ba ước lượng điểm khác nhau đáng kể (−0,384 / −0,312 / −0,252). Lập luận rằng ĐC-A mạnh nhất về nhận dạng đứng độc lập với con số — nhưng thứ tự thời gian là như vậy, nên **cấm** trình bày ĐC-A như thể nó được chọn từ đầu.

**Quy tắc phân loại sản phẩm** phải là đầu ra của pipeline (`roster-sku.csv`, cột `loai_sp`), sinh từ danh sách từ khóa **cố định ghi trong mã**, không sửa sau khi xem kết quả.

⚠️ **Sửa số cũ:** các tài liệu trước ghi 156/161 — đó là đặc tả **còn tháng 4**. Đặc tả khóa cho **153/157**. Mọi tài liệu phải dùng con số mới.


### 🔴 Khung không tuân thủ — tách `Z` khỏi `D` (bổ sung 26/07/2026)

Việc phát hiện đối chứng bị ô nhiễm dẫn tới một vấn đề sâu hơn ba định nghĩa đối chứng không giải quyết được: **nhóm can thiệp `T` là các SKU mà cửa hàng THỰC SỰ đã cập nhật thuế suất.** Điều kiện hóa trên đó là điều kiện hóa trên một quyết định vận hành.

Cách xử lý đúng là khung **không tuân thủ** (noncompliance) — tách hai đại lượng:

| | Định nghĩa | Nhận dạng bằng |
|---|---|---|
| **`Z`** | **Đủ điều kiện theo luật** — hàng hóa chất/CSCN ở mức 10% trong tiền kỳ | ✅ **Luật** (NQ 204/2025) + định danh sản phẩm. Cửa hàng không tác động được |
| **`D`** | **Thuế suất cửa hàng thực áp** ở hậu kỳ | ❌ Một phần là **quyết định của cửa hàng** |

| Đại lượng | Số SKU |
|---|---|
| `Z=1` (luật cho giảm) | **155** |
| ↳ cửa hàng **đã** cập nhật (`D=1`) | 135 |
| ↳ cửa hàng **không** cập nhật (`D=0`) | **20** |
| **Tỉ lệ tuân thủ** | **87,1%** |
| `Z=0` (luật loại trừ — thuế TTĐB) | **132** |
| ↳ bị áp 8% trái luật | **0** ✅ |
| Chưa phân loại được từ tên hàng (trong T/C10) | 23 (18 trong T, 5 trong C10) |

### Ba ước lượng, ba ý nghĩa khác nhau

| Ước lượng | Cách tính | Diễn giải | Giả định cần thêm |
|---|---|---|---|
| **ITT** | Hồi quy `y` theo **`Z`** | Tác động của việc **luật cho giảm thuế** | Chỉ cần xu hướng song song |
| Per-protocol | Hồi quy `y` theo **`D`** | Tác động của **thuế thực nhận** | **Thêm**: quyết định cập nhật không liên quan xu hướng giá phản thực |
| LATE (Wald) | `ITT / (tỉ lệ tuân thủ)` | Tác động lên nhóm tuân thủ | Thêm: monotonicity, exclusion restriction |

🔴 **`Z` là đại lượng nhận dạng tốt nhất mà dữ liệu này cho phép.** Báo cáo phải trình bày ITT theo `Z` **trước**, rồi mới tới per-protocol, và nói rõ per-protocol cần một giả định mà ITT không cần.

⚠️ **Exclusion restriction phải được thảo luận, không được giả định ngầm.** Nếu việc "cửa hàng cập nhật thuế suất" phản ánh **năng lực cập nhật giá nói chung**, thì có một cạnh trực tiếp từ nó tới giá, và ước lượng theo `D` bị nhiễu.

### 23 SKU chưa phân loại — độ nhạy, không tự chọn

**Cấm** gán chúng theo suy đoán. Bắt buộc báo cáo ba biến thể:

| Biến thể | Xử lý 23 SKU | n(Z=1) | n(Z=0) | First stage | ITT |
|---|---|---|---|---|---|
| **Cơ sở** | Loại khỏi phân tích theo `Z` | 155 | 132 | 0,871 | **−0,398%** (p=0,507) |
| Trên | Gán tất cả vào `Z=1` | 178 | 132 | 0,860 | −0,445% (p=0,418) |
| Dưới | Gán tất cả vào `Z=0` | 155 | 155 | 0,755 | −0,284% (p=0,620) |

Ba biến thể cho cùng kết luận — không biến thể nào bác bỏ được ATT = 0.

### LATE / Wald — CHỈ ở phụ lục

Phép chia `ITT / first stage` đúng về số học nhưng **chưa đủ để gọi là LATE**. Nó cần thêm: công cụ hợp lệ (`Z` chỉ ảnh hưởng giá **qua** `D`), monotonicity phản thực, và KTC phải ước lượng từ toàn bộ Wald/2SLS hoặc bootstrap **cả tử lẫn mẫu** — không phải chia hai ước lượng điểm.

Việc không quan sát SKU nào có `Z=0, D=1` **hỗ trợ** nhưng **không chứng minh** monotonicity.

⇒ Đặt ở phụ lục dưới tên **"ITT hiệu chỉnh theo Wald, có điều kiện trên các giả định IV mạnh"**, kèm first stage và cả ba biến thể phân loại. **Cấm** gọi là bằng chứng LATE nhân quả trong thân bài.

### Roster cố định

Phase 1 phải xuất `du-lieu-tam/roster-sku.csv` gồm `sku, grp, type, pre_p, pre_q, pre_w`. Đây là **danh sách SKU chính thức**. Mọi phân tích đọc từ file này, không tự tính lại.

### SKU đổi mã

Không xử lý. Nếu một mặt hàng được đổi mã vạch giữa kỳ, nó xuất hiện như hai SKU và bị loại vì thiếu một kỳ. Ghi vào phần hạn chế, **không** đi ghép mã thủ công — ghép thủ công là bậc tự do không kiểm soát được.

---

## 6. Cửa sổ thời gian

| Vai trò | Tiền kỳ | Hậu kỳ | Bắt buộc báo cáo |
|---|---|---|---|
| **Chính** | 05 + 06/2025 | 07 + 08/2025 | ✅ |
| Độ nhạy 1 | 04 + 05 + 06/2025 | 07 + 08/2025 | ✅ **song song** |
| Độ nhạy 2 | chỉ 06/2025 | chỉ 07/2025 | ✅ **song song** |
| Độ nhạy 3 | từ 11/06/2025 | 07 + 08/2025 | ✅ (chỉ địa điểm mới) |

🔴 **Bắt buộc:** báo cáo cả bốn, **kể cả khi độ nhạy 1 cho kết quả xấu**. Chỉ trình bày cửa sổ thuận lợi là gian lận. Tháng 4 đã bị loại **sau khi nhìn thấy kết quả bất thường** — lý do chính đáng có tồn tại (xem §11), nhưng vì thứ tự thời gian như vậy nên **nghĩa vụ báo cáo song song là tuyệt đối**.

---

## 7. Ngưỡng survivorship

| | |
|---|---|
| **Ngưỡng chính** | SKU phải có ≥ 1 giao dịch ở **cả** tiền kỳ và hậu kỳ |
| **Lưới độ nhạy bắt buộc** | ≥2, ≥3, ≥4, ≥5 tuần lịch xuất hiện trong tiền kỳ |

Số SKU còn lại theo ngưỡng (đã đo trước, tiền kỳ có tối đa 9 tuần lịch):

| Ngưỡng | T | C10 | C8 |
|---|---|---|---|
| **≥1 (chính)** | **153** | **157** | **1.908** |
| ≥2 tuần | 117 | 129 | 1.694 |
| ≥3 tuần | 92 | 111 | 1.462 |
| ≥4 tuần | 57 | 92 | 1.263 |
| ≥5 tuần | 40 | 67 | 1.036 |

**Vì sao chọn ngưỡng lỏng nhất làm chính** — và đây là lập luận thật, không phải sự tiện lợi:

Đặc tả **đã** điều kiện hóa trên việc SKU xuất hiện ở hậu kỳ (cần giá hậu kỳ mới tính được thay đổi giá). Đó vốn đã là một dạng chọn lọc sau can thiệp. Nâng ngưỡng làm việc chọn lọc **nặng thêm**, không nhẹ đi. Ngưỡng lỏng nhất là lựa chọn ít can thiệp nhất.

Sự chọn lọc còn lại là **hạn chế nền tảng không khắc phục được** bằng dữ liệu này, phải ghi vào chương hạn chế: đồ án không quan sát được biên độ mở rộng (SKU biến mất khỏi kệ).

---

## 8. Phương pháp 1 — Hồi quy ước lượng ATT

### Đặc tả cơ bản

```
y_i = α + τ·T_i + ε_i        (OLS, sai số chuẩn HC3)
```

`τ̂` chính là ước lượng ATT.

### Đặc tả có hiệp biến

```
y_i = α + τ·T_i + β₁·type_i + β₂·log(pre_p_i) + β₃·log(1+pre_q_i) + β₄·pre_w_i + ε_i
```

| Hiệp biến | Định nghĩa | Nguồn |
|---|---|---|
| `type` | Nhóm hàng: Nước uống / Đồ ăn / Sản phẩm khác (biến giả) | mode trong **tiền kỳ** |
| `pre_p` | Giá nền = trung vị `pg` trong **tiền kỳ** | " |
| `pre_q` | Tổng `soluong_ct` trong **tiền kỳ** | " |
| `pre_w` | Số tuần lịch xuất hiện trong **tiền kỳ** | " |

🔴 **Bất biến tuyệt đối: mọi hiệp biến chỉ tính từ dữ liệu TIỀN can thiệp.** Nhóm đã mắc đúng lỗi này một lần — hiệp biến rò rỉ dữ liệu hậu kỳ làm p đổi từ 0,113 thành 0,038. Phase 3 phải có một khẳng định kiểm tra (`assert`) rằng khung dữ liệu tính hiệp biến không chứa dòng nào có `post == True`.

**Không thêm hiệp biến nào ngoài bốn biến trên.** Danh sách này đã khóa.

### Dạng hàm

Tuyến tính, không tương tác, không đa thức. Bất kỳ dạng nào phức tạp hơn đều mở lại bậc tự do.

---

## 9. Phương pháp 2 — Phân tầng theo khung Kết quả tiềm năng

### Ý tưởng

Thay vì áp một mô hình hồi quy, chia mẫu thành các tầng đồng nhất, tính hiệu treated − control **trong từng tầng**, rồi trung bình có trọng số. Đây chính là hiện tượng đứng sau **nghịch lý Simpson** (chương 8.4) và định nghĩa **ATE/ATT** (chương 8.6).

### Định nghĩa tầng

**Tầng = phân vị 5 của giá nền tiền kỳ (`pre_p`) = 5 tầng.**

Điểm cắt tính **riêng cho từng cặp so sánh**, trên mẫu gộp T ∪ đối chứng, **chỉ dùng giá tiền kỳ**.

### 🔴 Vì sao KHÔNG dùng `type` để chia tầng — sửa 26/07/2026

Bản đầu định nghĩa tầng là **nhóm hàng × phân vị giá = 9 tầng**. Phải bỏ chiều "nhóm hàng": **biến `type` không phải thuộc tính hàng hóa.**

| Kiểm chứng trên dữ liệu | Kết quả |
|---|---|
| SKU mã thương mại có >1 nhãn `type` trong tiền kỳ | **1.866/2.193 (85%)** |
| Riêng nhóm T: số SKU có đúng 1 nhãn | **39/153** — còn 63 SKU có cả **ba** nhãn |
| Cùng mã vạch, cùng tên hàng, nhiều nhãn | "Ly đá vừa x ly" mang cả *Nước uống*, *Đồ ăn*, *Sản phẩm khác* |
| Có phải lỗi hàng pha chế tại quầy? | **Không** — chỉ 25/2.218 SKU dùng mã nội bộ |

⇒ `type` là nhãn cấp **dòng hóa đơn**, gán theo ngữ cảnh giao dịch. Chia tầng bằng nó thì tầng không có nghĩa, và kết quả phụ thuộc thứ tự dòng CSV.

Thay bằng `pre_p` — trung vị giá tiền kỳ của SKU. Đây là đại lượng **tính được, ổn định, hoàn toàn tiền can thiệp**.

### Kiểm chứng tính khả thi (đã đo trước khi khóa)

| Cặp so sánh | Số tầng | Tầng rỗng | Tầng mỏng (<3/phía) | min n | min n |
|---|---|---|---|---|---|
| **`Z=1` vs `Z=0` (155 vs 132) — chính** | 5 | **0** | **0** | 19 | 20 |
| T vs ĐC-A (132) | 5 | **0** | **0** | 25 | 12 |
| T vs ĐC-C (157) | 5 | **0** | **0** | 21 | 27 |
| T vs ĐC-8% (1908) | 5 | **0** | **0** | 4 | 287 |

Quy tắc gộp tầng mỏng ở dưới **không kích hoạt lần nào** — nhưng vẫn phải hiện diện trong mã.


### 🔴 Phân tầng KHÔNG đạt cân bằng — kết quả chẩn đoán 26/07/2026

Cổng chẩn đoán khóa ở Phase 2 đã chạy. **Nó không đạt.**

Cân bằng của so sánh chính `Z=1` (155) vs `Z=0` (132), đo bằng SMD:

| Biến tiền kỳ | Trước phân tầng | Sau phân tầng theo giá (5 tầng) |
|---|---|---|
| log(giá nền) | **+0,010** ✅ | 3/5 tầng vượt ngưỡng, max **1,93** |
| log(1+sản lượng) | **−0,870** 🔴 | 5/5 tầng vượt ngưỡng, max **1,77** |
| Số tuần xuất hiện | **−0,601** 🔴 | 4/5 tầng vượt ngưỡng, max **1,25** |
| **Tổng cặp \|SMD\| > 0,25** | 2/3 biến | **12/15 cặp** |

Nguyên nhân rõ ràng khi nhìn cột đầu: với so sánh theo `Z`, **giá nền gần như cân bằng hoàn hảo**. Mất cân bằng nằm ở sản lượng và tần suất. Phân tầng theo đúng biến *đã cân bằng* rồi bỏ qua hai biến *lệch* làm mất cân bằng **nặng thêm**, vì trong mỗi tầng giá hẹp, hai nhóm càng khác nhau về độ bán chạy.

### Đã thử các biến chia tầng khác — không cái nào đạt

Chạy như **kiểm định định trước**, không phải đi tìm phương án đẹp:

| Phương án | Cặp \|SMD\| > 0,25 | max \|SMD\| |
|---|---|---|
| 5 phân vị giá nền *(đã khóa)* | 12/15 | 1,93 |
| 3 phân vị giá nền | 8/9 | 1,21 |
| 5 phân vị sản lượng | 7/15 | 1,37 |
| **3 phân vị số tuần** *(tốt nhất)* | **4/9** | 1,37 |
| 3 phân vị điểm tổng hợp | 6/9 | 1,49 |
| 3 sản lượng × 3 giá (9 tầng) | 19/24 | 2,44 |

**Không phương án nào đạt cân bằng.** Đây là đặc điểm thật của dữ liệu, không phải lỗi kỹ thuật: rượu bia và hàng chăm sóc cá nhân là hai loại hàng khác nhau về bản chất luân chuyển. Không cách chia tầng nào theo biến quan sát được làm chúng giống nhau.

### Hệ quả — hạ cấp theo đúng quy tắc đã khóa

🔴 **Giữ nguyên thiết kế 5 phân vị giá đã khóa.** Không đổi sang "3 phân vị số tuần" dù nó cân bằng hơn — đi tìm biến chia tầng để vượt cổng chính là quyết định sau khi thấy dữ liệu, đúng loại lỗi §12 cấm.

Áp dụng quy tắc hạ cấp:

| | Hạ cấp thành |
|---|---|
| **PP2 (phân tầng)** | **So sánh có điều chỉnh, mang tính mô tả.** Không được gọi là ước lượng nhân quả sạch |
| **PP1 (hồi quy)** | **Cũng hạ cấp.** Hai phương pháp dùng chung một chiến lược nhận dạng — vi phạm nền tảng ảnh hưởng cả hai, không riêng PP2 |

**Câu bắt buộc có trong báo cáo:**

> Nhóm can thiệp và nhóm đối chứng khác nhau đáng kể về sản lượng và tần suất bán trước chính sách, và không phương án phân tầng nào theo biến quan sát được khắc phục được. Kết luận nhân quả của đồ án vì vậy **phụ thuộc hoàn toàn vào giả định xu hướng song song**, thứ mà dữ liệu này không cho phép kiểm chứng đầy đủ.

Đây là **hạn chế nền tảng**, phải nằm ở phần kết luận chứ không giấu xuống phụ lục.

### Quy tắc tầng nhỏ — định trước

1. Tầng có **<3 SKU ở một phía** → gộp với tầng **liền kề phía giá thấp hơn**; tầng thấp nhất thì gộp lên trên. Hướng cố định để không tạo bậc tự do.

2. Sau khi gộp vẫn <3 → **bỏ tầng**, và **báo cáo số SKU treated bị mất**.
3. Tầng rỗng một phía → bỏ ngay, báo cáo số SKU mất.

Với thiết kế 5 phân vị giá, quy tắc này **không kích hoạt lần nào** ở bất kỳ định nghĩa đối chứng nào — xem bảng kiểm chứng ở trên. Bước 3 của pipeline có `assert` chặn nếu xuất hiện tầng mỏng.

### Công thức ATT

```
τ̂_s   = ȳ(T, tầng s) − ȳ(C, tầng s)
w_s   = n_T,s / Σ n_T,s                    ← trọng số ATT: đếm SKU treated
τ̂_ATT = Σ_s w_s · τ̂_s
```

Trọng số dùng **số SKU treated**, vì ước lượng đích là ATT chứ không phải ATE.

### Sai số chuẩn

Bootstrap phân tầng, **5.000 lần lặp, `seed = 42`**, lấy mẫu lại **SKU** trong từng nhóm × tầng. Không dùng công thức giải tích.

---

## 10. Suy diễn thống kê

| Hạng mục | Giá trị khóa |
|---|---|
| Mức ý nghĩa α | **0,05**, kiểm định hai phía |
| Khoảng tin cậy | **95%** |
| Sai số chuẩn PP1 | **HC3** (kháng phương sai thay đổi) |
| Sai số chuẩn PP2 | Bootstrap phân tầng |
| Đơn vị bootstrap | **SKU** (đơn vị can thiệp được gán) |
| Số lần lặp | **5.000** |
| Seed | **42** — cố định, ghi trong mọi script |
| Kiểm định hoán vị | Hoán vị nhãn `T` **trong từng tầng**, 5.000 lần |

### Giả thuyết và biên tương đương

| Vai trò | Giả thuyết | Trả lời câu hỏi gì |
|---|---|---|
| **H₀ CHÍNH** | **ATT = 0** | *Giá có giảm không?* — đúng câu hỏi của đồ án (§1) |
| H₀ bổ trợ | ATT = −1,835 | *Nếu có giảm thì có giảm đủ mức thuế không?* |

| | |
|---|---|
| Mốc **chuyển hoàn toàn** | `log(1,08/1,10) × 100 = −1,835` điểm log |
| Pass-through | `ATT / (−1,835)` — 1,0 là chuyển hoàn toàn, 0 là không chuyển gì |
| TOST biên hẹp | ±25% × 1,835 = **±0,459** |
| TOST biên rộng | ±50% × 1,835 = **±0,917** |

🔴 **Vì sao H₀ chính phải là ATT = 0** — sửa ngày 26/07 sau phản biện:

Bản đầu ghi H₀ chính là ATT = −1,835. Sai, và sai theo hướng nguy hiểm: kiểm định đó **có ý nghĩa** (p=0,006) trong khi kiểm định ATT = 0 **không có ý nghĩa** (p=0,66). Đặt cái có ý nghĩa vào vị trí "chính" là lặng lẽ dời trọng tâm từ một kết quả null sang một kết quả đẹp — đúng mẫu hình lỗi nhóm đã mắc nhiều lần.

Kết quả đúng phải trình bày theo thứ tự: **không tìm thấy bằng chứng giá giảm** (H₀ chính không bị bác bỏ), **và cũng bác bỏ được giả thuyết giá giảm đủ mức thuế** (H₀ bổ trợ bị bác bỏ). Câu thứ hai không được đứng trước câu thứ nhất.

**Vì sao hai biên này:** không có chuẩn ngành cho biên tương đương pass-through. 25% và 50% được chọn vì chúng là các mốc **dễ diễn giải** — "chuyển dưới một phần tư" và "chuyển dưới một nửa" — chứ không phải vì chúng cho kết quả mong muốn. Cả hai đều **đã thất bại** trên dữ liệu hiện có; ghi nhận trung thực.

### Ngụy lặp

Mẫu có 153 SKU nhưng chỉ **một** cửa hàng và **một** ngày chính sách. Các SKU không độc lập — chúng chịu chung quyết định định giá của một người quản lý.

Bắt buộc báo cáo song song, **kèm đúng nhãn vai trò**:

| # | Cách | Vai trò thật |
|---|---|---|
| 1 | Sai số chuẩn HC3 cấp SKU | **Chính** — bất định *có điều kiện ở cấp SKU* |
| 2 | Gộp cụm theo nhóm hàng (3 cụm) | Độ nhạy. 3 cụm quá ít để tin cậy |
| 3 | Hoán vị nhãn `T` trong tầng | Độ nhạy |

Nếu ba cách cho kết luận khác nhau → **báo cáo cả ba**, không chọn cái nào.

🔴 **Điều ba cách này KHÔNG làm được** — sửa ngày 26/07 sau phản biện:

Bản đầu trình bày ba cách trên như thể chúng *xử lý* ngụy lặp. Không đúng.

- **Hoán vị nhãn `T` không phải suy diễn ngẫu nhiên hóa hợp lệ.** Can thiệp được gán bởi **phân loại pháp lý**, không phải bốc thăm. Không tồn tại phân phối ngẫu nhiên hóa để hoán vị mô phỏng.
- **Gộp cụm theo 3 nhóm hàng không phải suy diễn đáng tin.** Lý thuyết tiệm cận của sai số chuẩn gộp cụm cần số cụm lớn; 3 cụm thì không.

Cả ba đều là bất định **có điều kiện ở cấp SKU**. Bất định ở **cấp chính sách** — một cửa hàng, một ngày, một người ra quyết định giá — **không ước lượng được bằng dữ liệu này**. Đây là hạn chế nền tảng, phải ghi vào chương hạn chế thay vì che bằng ba con số trông có vẻ chặt chẽ.

**Cấm viết:** "đã xử lý ngụy lặp", "kết quả vững trước ngụy lặp", hoặc bất kỳ câu nào ngụ ý ba cách trên giải quyết được vấn đề.

---

## 11. Công bố các quyết định hậu kiểm

> Mục này bắt buộc xuất hiện **nguyên văn** trong báo cáo. Không được rút gọn, không được chuyển xuống phụ lục.

**Việc loại tháng 4/2025 được quyết định SAU khi nhìn thấy hệ số bất thường của tháng đó.** Thứ tự thời gian đúng là:

1. Chạy nghiên cứu sự kiện → thấy hệ số dẫn tháng 4 bất thường (−1,374 / −1,352)
2. Đi truy nguyên nguyên nhân
3. Phát hiện **lỗ hổng dữ liệu 39 ngày** (13/03 → 20/04/2025) và mã vạch chỉ bắt đầu được điền **đúng ngày 21/04**
4. ⇒ "Tháng 4" thực chất chỉ có **10 ngày**, ngay sau lỗ hổng, đúng lúc hệ thống vừa khởi động
5. Loại tháng 4

**Lý do chính đáng là "gãy chế độ thu thập dữ liệu", không phải "tháng không đủ ngày."** Phân biệt này quan trọng: nhóm giữ tháng 6 (20 ngày) và tháng 8 (17 ngày), nên "tháng không đủ ngày" không phải quy tắc nhất quán — dùng nó sẽ là ngụy biện.

**Nghĩa vụ kèm theo:** vì đây là quyết định hậu kiểm, cửa sổ có tháng 4 phải được báo cáo song song ở mọi bảng kết quả chính (§6).

### Quyết định hậu kiểm thứ hai — ba định nghĩa đối chứng

**Việc phát hiện đối chứng bị ô nhiễm cũng xảy ra SAU khi đã có kết quả.** Thứ tự đúng:

1. Chạy và công bố ATT = −0,252% với C10 đầy đủ (157 SKU)
2. Trong lúc chẩn đoán biến `type`, đối chiếu **tên hàng** của nhóm đối chứng
3. Phát hiện 15 SKU là hàng hóa chất — Gillette, COLGATE, Garnier, mặt nạ — lẽ ra được giảm về 8%
4. Ba định nghĩa đối chứng cho ba ước lượng: **−0,384 / −0,312 / −0,252**

**Lập luận rằng ĐC-A mạnh nhất đứng độc lập với con số:** chỉ hàng chịu thuế TTĐB mới có thuế suất *do luật cố định*; với 15 SKU kia, việc ở 10% là hệ quả một quyết định vận hành của cửa hàng, nên không ngoại sinh.

**Nhưng thứ tự thời gian là như trên.** Vì vậy:

- **Cấm** trình bày ĐC-A như thể được chọn từ đầu
- **Cấm** chọn một trong ba làm "kết quả chính"
- **Bắt buộc** báo cáo cả ba ở mọi bảng, và nói rõ ước lượng điểm dao động từ −0,25 đến −0,40 tùy định nghĩa đối chứng
- Đây phải được trình bày như một **hạn chế**, không phải một kiểm định vững thành công

---

## 12. Quy trình sửa đổi

Muốn đổi bất kỳ mục nào sau ngày khóa:

1. **Không xóa** giá trị cũ — gạch ngang, giữ nguyên văn
2. Ghi **ngày**, **người đề xuất**, **lý do**
3. Ghi rõ **lý do có xuất phát từ việc đã nhìn thấy kết quả hay không**
4. Chạy lại và báo cáo **cả kết quả trước và sau** khi sửa
5. Cả nhóm xác nhận

Nếu sửa đổi bắt nguồn từ việc đã thấy kết quả → phải xuất hiện trong §11.

### Nhật ký sửa đổi

| Ngày | Mục | Cũ → Mới | Lý do | Do thấy kết quả? |
|---|---|---|---|---|
| 26/07 | §10 | H₀ chính: `ATT = −1,835` → **`ATT = 0`** | Câu hỏi của đồ án là "giá có giảm không". Đặt kiểm định *có ý nghĩa* vào vị trí chính là dời trọng tâm khỏi kết quả null | **Không** — lỗi khung phân tích, phát hiện qua phản biện |
| 26/07 | §10 | Hoán vị + gộp cụm: "xử lý ngụy lặp" → **"độ nhạy có điều kiện cấp SKU"** | Can thiệp do luật định chứ không bốc thăm ⇒ hoán vị không phải suy diễn ngẫu nhiên hóa hợp lệ. 3 cụm quá ít cho lý thuyết tiệm cận | **Không** — lỗi diễn giải, phát hiện qua phản biện |
| 26/07 | §2 | *(thiếu)* → thêm **schema bắt buộc** và **quy tắc nối** | `ma_hh_ct` qua đường `float→int64→str` có thể hỏng mã vạch. Cả hai sheet đều có cột `daxoa`, phải chỉ rõ dùng `goc.daxoa` | **Không** — bổ sung chi tiết vận hành |
| 26/07 | §5 | *(thiếu)* → thêm **quy tắc mode hòa** | `mode().iloc[0]` chọn ngầm theo thứ tự sắp xếp — một bậc tự do không ai kiểm soát | **Không** — bổ sung chi tiết vận hành |
| 26/07 | §9 | Gộp tầng mỏng "liền kề" → **chỉ rõ hướng** | "Liền kề" là mơ hồ khi tầng có hai hàng xóm | **Không** — bổ sung chi tiết vận hành |
| 26/07 | **§5** | *(thiếu)* → thêm **ba định nghĩa đối chứng ĐC-A/B/C, bắt buộc báo cáo song song** | Đối chiếu định danh sản phẩm cho thấy 15/157 SKU trong C10 là hàng hóa chất — ở 10% do **cửa hàng không cập nhật**, không do luật. Tuyên bố "cả hai nhóm do luật định" chỉ đúng với 132/157 | 🔴 **Có** — phát hiện sau khi đã có kết quả, và ba định nghĩa cho −0,406 / −0,312 / −0,252. Xem §11 |
| 26/07 | **§5** | *(thiếu)* → thêm **khung không tuân thủ `Z` vs `D`**, ITT thành kết quả chính | Nhóm `T` là các SKU cửa hàng **thực sự đã cập nhật** thuế suất ⇒ điều kiện hóa trên quyết định vận hành. `Z` (đủ điều kiện theo luật) nhận dạng được mà không cần giả định đó | **Không** — lỗi khung nhận dạng, phát hiện qua phản biện |
| 26/07 | §5 | Bổ sung từ khóa phân loại: `555`, `mevius`, `điếu`, `nrc`, `nls`, `viên giặt`, `xịt côn trùng`, `khẩu trang`… | Danh sách cũ **bỏ sót** 9 SKU thuốc lá và nhiều hàng tẩy rửa. Đây là sửa thiếu sót theo định danh sản phẩm, không phải tinh chỉnh theo kết quả. ĐC-A: 123→**132** | **Không** — phát hiện khi kiểm tra phần dư chưa phân loại |
| 26/07 | §9 | *(thiếu)* → ghi nhận **phân tầng không đạt cân bằng**, hạ cấp CẢ PP1 và PP2 | Cổng chẩn đoán khóa ở Phase 2 đã chạy và không đạt: 12/15 cặp \|SMD\|>0,25 sau phân tầng. Đã thử 6 phương án chia tầng khác, không cái nào đạt | **Không** — cổng đã khóa trước, kết quả chỉ là thi hành |
| 26/07 | §5 | ĐC-A 123→**132**, ĐC-B 142→**137**, hóa chất trong C10 15→**20** | Hệ quả của việc bổ sung từ khóa phân loại ở dòng trên | **Không** |
| 26/07 | §5 | LATE/Wald từ thân bài → **phụ lục** | Phép chia đúng số học nhưng thiếu giả định IV (monotonicity, exclusion), và KTC phải bootstrap cả tử lẫn mẫu | **Không** — lỗi kỹ thuật, phát hiện qua phản biện |
| 26/07 | **§9** | Tầng = `type` × phân vị giá (9 tầng) → **phân vị 5 của `pre_p`** (5 tầng) | `type` không phải thuộc tính hàng hóa: 85% SKU có >1 nhãn trong tiền kỳ, riêng nhóm T chỉ 39/153 có nhãn duy nhất | **Không** — biến đầu vào không hợp lệ, phát hiện khi chẩn đoán dữ liệu |

---

## 13. Thứ bậc kết quả

Định trước để không ai đổi "kết quả chính" sang thứ trông đẹp hơn:

| Bậc | Kết quả | Vai trò |
|---|---|---|
| **1 — Chính** | **ITT theo `Z`** trên giá gồm thuế | Câu trả lời của đồ án — nhận dạng bằng luật |
| 1b — Chính | Per-protocol theo `D`, **cả ba** đối chứng ĐC-A/B/C song song | Cần thêm giả định, xem §5 |
| 2 — Xác nhận | ATT giá gồm thuế, đối chứng 8% | Kiểm tra tính vững |
| 3 — Bổ trợ | ATT giá chưa thuế, pass-through, TOST | Diễn giải cơ chế |
| 4 — Khám phá | Sản lượng, logistic, mô phỏng làm tròn, Berkson | **Chỉ mô tả, cấm kết luận nhân quả** |

**Nhánh sản lượng có MDE ≈ 87%** — sức mạnh gần như bằng không. Bắt buộc ghi kèm mỗi lần nhắc tới, và **cấm** viết "không có tác động lên sản lượng".

### Khi hai phương pháp cho kết quả khác nhau

Định trước, để không biến việc chọn thành một bậc tự do:

| Chênh lệch | Cách xử lý |
|---|---|
| Khoảng tin cậy chồng lấn nhiều | Báo cáo cả hai, kết luận không đổi |
| Lệch đáng kể | **Không chọn bên nào.** Trình bày cả hai, dùng bảng theo tầng để chỉ ra tầng nào tạo ra chênh lệch, giải thích bằng cơ cấu tầng (Simpson) |
| Trái dấu | Báo cáo như **phát hiện chính**, không giấu. Trái dấu là bằng chứng cơ cấu tầng chi phối kết quả |

🔴 **Cấm tuyệt đối:** dùng lý do "phương pháp kia hợp lý hơn" *sau khi* đã thấy số của cả hai.

---

## 14. Nhận dạng nhân quả — điều bắt buộc nói thẳng

**Hai phương pháp dùng chung MỘT chiến lược nhận dạng: xu hướng song song (DiD).**

| | |
|---|---|
| Giả định nhận dạng | Nếu không có chính sách, giá nhóm T và nhóm C sẽ biến động **song song** |
| Kiểm chứng được | Không. Chỉ có bằng chứng gián tiếp: giả dược tiền kỳ, nghiên cứu sự kiện |
| Sức mạnh kiểm chứng | **Thấp** — chỉ có 2 hệ số dẫn |

🔴 **Câu bắt buộc có trong báo cáo:**

> Hai phương pháp cho kết quả tương tự **không** xác nhận quan hệ nhân quả. Cả hai cùng dựa trên giả định xu hướng song song; nếu giả định này sai, **cả hai cùng sai theo cùng một hướng**.

**Dữ liệu này chỉ hỗ trợ một chiến lược nhận dạng.** Không có ngưỡng hồi quy gián đoạn, chỉ một cửa hàng.

⚠️ **Về `Z` như một biến công cụ:** khung Wald ở §5 dùng `Z` theo kiểu công cụ, nhưng đó **không phải** một chiến lược nhận dạng thứ hai. `Z` chỉ hợp lệ làm công cụ nếu đã có xu hướng song song theo `Z` — tức nó **nằm trong** cùng chiến lược nhận dạng, không độc lập với nó. Vì vậy phần Wald ở phụ lục, không phải "phương pháp thứ hai".

⚠️ **Câu "ITT chỉ cần xu hướng song song" là quá mạnh.** ITT còn cần: phân loại `Z` đúng, SUTVA/consistency, no-anticipation, và mẫu không bị chọn lọc lệch theo biến hậu can thiệp. Đây là giới hạn của dữ liệu, không phải lựa chọn của nhóm — và phải nói thẳng thay vì che bằng cách gọi hai đặc tả là "hai cách nhận dạng".

---

## 15. Nghiệm thu

Đặc tả được coi là **đã khóa** khi:

- [ ] Không còn ô nào ghi TBD
- [ ] Cả 4 thành viên ký xác nhận đã đọc (ghi tên + ngày ở cuối file)
- [ ] `du-lieu-tam/roster-sku.csv` đã sinh ra, có 2.218 dòng
- [ ] Mọi tài liệu cũ đã sửa 156/161 → **153/157**
- [ ] `plan.md` §5b không còn mâu thuẫn với §0
- [ ] Bảng luồng mẫu khớp: 82.109 dòng hàng sau lọc
- [ ] Câu hỏi DiD đã gửi giảng viên

### Xác nhận đã đọc

| Thành viên | Ngày | Ký |
|---|---|---|
| | | |
| | | |
| | | |
| | | |
