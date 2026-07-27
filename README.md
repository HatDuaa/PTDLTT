# Tác động của việc giảm thuế GTGT lên giá bán lẻ

**Đồ án cuối kỳ — Phân tích dữ liệu**

Việc giảm thuế GTGT từ 10% xuống 8%, có hiệu lực 01/07/2025 theo Nghị quyết 204/2025/QH15,
có làm giảm giá bán lẻ mà người tiêu dùng thực trả không?

Dữ liệu: hóa đơn của **một cửa hàng tiện lợi tại TP.HCM**, 12/2024 – 08/2025 —
67.562 hóa đơn, 233.996 dòng hàng.

| | |
|---|---|
| 📊 **Báo cáo** | [Chương 4 — Thiết kế](bao-cao/chuong-04-thiet-ke-nhan-qua.md) · [Chương 5 — Kết quả](bao-cao/chuong-05-ket-qua.md) · [Chương 6 — Sức mạnh & cơ chế](bao-cao/chuong-06-suc-manh-va-co-che.md) |
| 🔒 **Đặc tả khóa** | [`dac-ta-khoa.md`](plans/2026-07-23-thue-gtgt-passthrough/dac-ta-khoa.md) — đọc trước khi sửa bất kỳ tham số nào |
| 🌐 **Web** | `web/` — chạy nội bộ, xem [hướng dẫn](#web) |
| 📄 **Bản tin nhóm** | [`bao-cao/ban-tin-nhom.html`](bao-cao/ban-tin-nhom.html) — trang tóm tắt một mặt, tự chứa, mở bằng trình duyệt là xong |

---

## Kết luận

> **Không tìm thấy bằng chứng giá giảm** trong các so sánh có điều chỉnh; dữ liệu không đủ
> để quy chênh lệch quan sát cho chính sách một cách đáng tin cậy.

Đây là một kết quả **null**, và đó là kết luận — không phải sự vắng mặt của kết luận.
Giá trị của đồ án nằm ở chỗ chỉ ra *chính xác vì sao* không kết luận mạnh hơn được.

### Bốn ước lượng chính

So sánh theo `Z` — nhóm đủ điều kiện giảm thuế **theo luật** (155 SKU) đối chiếu nhóm chịu
thuế tiêu thụ đặc biệt, bị loại trừ ở cả hai nghị quyết (132 SKU).

| Phương pháp | Ước lượng | p | KTC 95% |
|---|---:|---:|---:|
| Hồi quy thô | −0,398 | 0,507 | [−1,57 ; +0,78] |
| Hồi quy có hiệp biến | −0,270 | 0,713 | [−1,71 ; +1,17] |
| g-computation (ATT) | −0,664 | 0,398 | [−2,20 ; +0,84] |
| Phân tầng 5 phân vị giá | −0,257 | 0,661 | [−1,41 ; +0,91] |

Đơn vị: **điểm log ×100**. Cả bốn khoảng tin cậy đều chứa 0. Kết quả ổn định qua bốn cửa sổ
thời gian, ba cách xử lý mặt hàng chưa phân loại, và hai cách xử lý mặt hàng có thuế suất mơ hồ.

> ⚠️ **Không đọc kết quả này thành "chính sách không có tác động".**
> Không bác bỏ được giả thuyết không có nghĩa là giả thuyết đúng. Kiểm định tương đương ở đây
> có sức mạnh **0,0%** — biên đã chọn hẹp hơn mức cần, nên nó không có cơ hội chứng minh
> điều đó dù tác động thật có bằng 0 đi nữa. Xem [chương 6](bao-cao/chuong-06-suc-manh-va-co-che.md).

### Những gì đồ án khẳng định được

Kết quả null ở nhánh chính không có nghĩa là không có phát hiện nào:

- **Thực thi chính sách không hoàn hảo.** 20 trong 155 mặt hàng đủ điều kiện giảm thuế
  **vẫn bị tính 10%** vì cửa hàng không cập nhật thuế suất. Tỉ lệ tuân thủ **87,1%**.
  Bằng chứng rõ nhất: cùng dòng dao cạo Gillette nằm ở hai nhóm thuế khác nhau.
- **Giá niêm yết phần lớn không đổi.** Nếu chuyển thuế hoàn toàn và làm tròn đến 1.000đ,
  135/155 mặt hàng lẽ ra phải nhảy mức giá. Chúng không nhảy. *(Quan sát mô tả, không phải nhân quả.)*
- **Hai nhóm so sánh không thể làm cho giống nhau.** Đã thử sáu cách chia tầng, không cách
  nào đạt cân bằng — rượu bia và hàng chăm sóc cá nhân khác nhau về bản chất luân chuyển.

---

## Thiết kế nghiên cứu

Thí nghiệm tự nhiên **có không tuân thủ**. Điểm mấu chốt là tách hai đại lượng thường bị gộp:

| | Định nghĩa | Do ai quyết định |
|---|---|---|
| **`Z`** | Đủ điều kiện giảm thuế **theo luật** | Quốc hội + loại sản phẩm |
| **`D`** | Thuế suất cửa hàng **thực áp** | **Cửa hàng** |

So sánh theo `D` là điều kiện hóa trên một quyết định vận hành của cửa hàng. So sánh theo `Z`
được nhận dạng bằng luật. Đồ án lấy `Z` làm chính.

**Hai phương pháp ước lượng** — hồi quy và phân tầng — nhưng cả hai dùng **chung một chiến
lược nhận dạng**. Chúng cho kết quả giống nhau *không phải* hai bằng chứng độc lập.

### Ba cổng chẩn đoán

Khóa **trước** khi chạy kết quả, kèm hành động cố định nếu trượt. Không phải ba lá phiếu —
cổng đạt không bù được cổng trượt.

| Cổng | Kết quả | |
|---|---|---|
| 1 · Cân bằng sau phân tầng | **Trượt** | 12/15 cặp có \|SMD\| > 0,25 |
| 2 · Giả dược tiền kỳ | Đạt | Chênh lệch lớn nhất 0,562 < ngưỡng 0,918 |
| 3 · Tương đương tiền xu hướng | **Không đạt** | Không chứng minh được xu hướng song song |

Vì cổng 1 trượt, cả hai phương pháp được trình bày là **so sánh có điều chỉnh**, không phải
ước lượng nhân quả sạch. Đây là quy tắc khóa từ trước, không phải quyết định đưa ra sau khi thấy số.

---

## Chạy lại

Cần Python 3.12+ và file `60.xlsx` ở thư mục gốc *(đã có sẵn trong repo)*.

```bash
pip install -r requirements.txt
python code/chay_tat_ca.py
```

Pipeline chạy 6 bước từ file gốc, sinh **22 đầu ra** vào `ket-qua/`. Mọi kiểm chứng chạy tự
động — thiếu file, sai số dòng, hay hiệp biến rò rỉ dữ liệu hậu kỳ đều làm **dừng ngay**
thay vì âm thầm cho số sai.

**Tái lập:** chạy hai lần cho hash **giống hệt** trên toàn bộ 22 đầu ra, kể cả các bảng
bootstrap 5.000 lần. `ket-qua/manifest-tai-lap.json` ghi hash nguồn, phiên bản thư viện,
tham số và hash từng đầu ra.

### Rà soát trước khi nộp

```bash
python code/b6_ra_soat_ngon_ngu.py
```

Quét toàn bộ báo cáo và web tìm ba loại lỗi: câu phát biểu vượt quá dữ liệu, con số của các
đặc tả đã bị thay thế, và lệch hợp đồng nhãn giữa pipeline với frontend. Script phân biệt
được *dùng* một câu cấm với *cấm* câu đó, nên nó không báo động chính các cảnh báo của mình.

---

## Web

```bash
cd web/backend  && pip install -r requirements.txt && uvicorn main:app   # cổng 8000
cd web/frontend && npm install && npm run dev                            # cổng 3000
```

**Backend** — FastAPI, 14 endpoint, đọc thẳng `ket-qua/*.csv`. Kiểm chứng schema lúc khởi
động: thiếu file hoặc thiếu cột thì **không khởi động**, thay vì phục vụ dữ liệu rỗng.

**Frontend** — Next.js 15 + TypeScript + Tailwind + shadcn/ui + Recharts.

| Trang | Nội dung |
|---|---|
| `/` | Tóm tắt — mở đầu bằng hạn chế, không phải bằng con số |
| `/du-lieu` | Bảng luồng mẫu, độ phủ dữ liệu, cân bằng tiền kỳ |
| `/thiet-ke` | Khung `Z` / `D`, đồ thị nhân quả, giả định, bảng đường backdoor |
| `/ket-qua` | Bốn ước lượng, kết quả theo tầng, ba cổng, lưới độ nhạy |
| `/suc-manh` | MDE, sức mạnh kiểm định tương đương, mô phỏng làm tròn, sản lượng |
| `/han-che` | Tổng hợp hạn chế + danh sách câu cấm viết |
| `/trinh-bay` | Slide — dùng **chung hook dữ liệu** với các trang trên |

Năm biểu đồ: hệ số bốn ước lượng, sơ đồ luồng mẫu, Love plot cân bằng, biểu đồ tương đương,
đường cong sức mạnh. Mỗi biểu đồ có **bảng số thay thế** cho người dùng trình đọc màn hình.

> **Nguyên tắc xuyên suốt: không con số nào được gõ tay.**
> Web đọc thẳng từ kết quả pipeline sinh ra, nên nó **không thể lệch** khỏi phân tích.
> Slide dùng chung hook với web, nên slide cũng không thể lệch.

---

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `code/` | Pipeline phân tích — 6 bước, một lệnh |
| `bao-cao/` | Báo cáo — chương 4, 5, 6 |
| `ket-qua/` | 16 bảng kết quả + 2 hình, sinh từ pipeline |
| `web/backend/` | FastAPI phục vụ kết quả dưới dạng JSON |
| `web/frontend/` | Next.js — 7 trang, 5 biểu đồ |
| `plans/` | Kế hoạch, nhật ký phản biện, và **đặc tả khóa** |
| `du-lieu-tam/` | *(không đẩy lên — sinh lại bằng một lệnh)* |

### Đọc gì trước

[**`dac-ta-khoa.md`**](plans/2026-07-23-thue-gtgt-passthrough/dac-ta-khoa.md) là văn bản khóa
đặc tả. Nó cố định mọi lựa chọn phân tích *trước* khi nhìn kết quả cuối — quy tắc lọc, công
thức biến, danh sách hiệp biến, biên kiểm định, thứ bậc kết quả — kèm **nhật ký mọi lần sửa
đổi**, ghi rõ lần nào là sửa lỗi và lần nào là quyết định đưa ra sau khi đã thấy số.

Mục đích của nó là triệt tiêu bậc tự do của người phân tích. Khi mọi lựa chọn đã cố định
trước, không ai — kể cả chính nhóm — có thể vô tình chọn con số đẹp.

---

## Điều đồ án này **không** chứng minh được

Ghi ở đây vì đó là phần trung thực nhất của công việc:

- **Hai phương pháp không phải hai bằng chứng độc lập.** Chúng dùng chung một chiến lược
  nhận dạng; nếu giả định nền sai thì cả hai cùng sai theo cùng một hướng.
- **Cân bằng sau phân tầng thất bại** ở 12/15 cặp. Đã thử sáu cách chia tầng, không cách nào đạt.
- **Mẫu đã bị chọn lọc theo khả năng sống sót** — tỉ lệ mặt hàng còn được bán ở hậu kỳ chênh
  nhau **7,2 điểm phần trăm** giữa hai nhóm (82,0% so với 89,2%). Vì vậy kết quả không phải
  tác động vô điều kiện cho toàn bộ nhóm ban đầu, mà là *so sánh trong nhóm mặt hàng có giá
  quan sát được ở cả hai kỳ*.
- **Việc bác bỏ mức chuyển thuế hoàn toàn phụ thuộc phương pháp** — ba đặc tả bác bỏ,
  g-computation không. Không lấy "3 trên 4" làm biểu quyết.
- **Một cửa hàng, một ngày chính sách.** Bất định ở cấp chính sách không ước lượng được bằng
  dữ liệu này. Mọi sai số chuẩn trong đồ án chỉ đo bất định **có điều kiện ở cấp mặt hàng**.
- **Không ngoại suy ra ngành bán lẻ Việt Nam.**

---

## Nguồn pháp lý

- **Nghị quyết 174/2024/QH15** — loại trừ "sản phẩm hóa chất" khỏi diện giảm thuế
- **Nghị quyết 204/2025/QH15** — bỏ loại trừ đó từ 01/07/2025; hàng chịu thuế tiêu thụ đặc
  biệt (rượu, bia, thuốc lá) vẫn bị loại trừ ở **cả hai** nghị quyết

Chính sự khác biệt giữa hai nghị quyết tạo ra nhóm can thiệp và nhóm đối chứng của đồ án.
