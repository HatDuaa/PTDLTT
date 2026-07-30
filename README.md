# Tác động của việc giảm thuế GTGT lên giá bán lẻ

**Đồ án cuối kỳ — Phân tích dữ liệu thông minh**

Việc giảm thuế GTGT từ 10% xuống 8%, hiệu lực 01/07/2025 theo Nghị quyết 204/2025/QH15,
có làm giảm giá bán lẻ mà người tiêu dùng thực trả không?

Dữ liệu: hóa đơn điện tử của **một cửa hàng tiện lợi tại TP.HCM**, 12/2024 – 08/2025 —
67.562 hóa đơn, 233.996 dòng hàng.

| | |
|---|---|
| 📊 **Báo cáo** | [1 · Bối cảnh](bao-cao/chuong-01-boi-canh.md) · [2 · Cơ sở pháp lý](bao-cao/chuong-02-co-so-phap-ly.md) · [3 · Dữ liệu](bao-cao/chuong-03-du-lieu.md) · [4 · Thiết kế](bao-cao/chuong-04-thiet-ke-nhan-qua.md) · [5 · Kết quả](bao-cao/chuong-05-ket-qua.md) · [6 · Độ chắc chắn](bao-cao/chuong-06-suc-manh-va-co-che.md) |
| 📎 **Phụ lục kỹ thuật** | [`phu-luc-ky-thuat.md`](bao-cao/phu-luc-ky-thuat.md) — công thức, chẩn đoán, độ nhạy, kết quả phụ |
| 🔒 **Đặc tả khóa** | [`dac-ta-khoa.md`](plans/2026-07-23-thue-gtgt-passthrough/dac-ta-khoa.md) — đọc trước khi sửa bất kỳ tham số nào |
| 🌐 **Web + slide** | `web/` — 7 trang phân tích và bộ trình chiếu 19 slide, xem [hướng dẫn](#web-và-slide) |
| 📄 **Bản tin nhóm** | [`ban-tin-nhom.html`](bao-cao/ban-tin-nhom.html) — trang tóm tắt tự chứa, mở bằng trình duyệt là xong |

---

## Kết luận

> **Cửa hàng đã không chuyển hết phần giảm thuế GTGT vào giá bán lẻ.**

Ba bằng chứng, mỗi cái kiểm chứng theo một cách khác nhau:

| Bằng chứng | Con số |
|---|---|
| Phần giảm thuế thực sự đi vào giá, theo bốn phương pháp ước lượng | **14% – 36%** mức lẽ ra |
| Mặt hàng lẽ ra phải đổi giá, nhưng giữ y nguyên giá cũ | **110 / 135** |
| Mặt hàng đạt đúng mức giá mà chuyển thuế hoàn toàn đòi hỏi | **1 / 135** |

Tỉ lệ chuyển thuế tính bằng phép chia trực tiếp — chênh lệch quan sát được chia cho mức lẽ ra
phải giảm:

```
−0,398 ÷ −1,835 = 22%     (hồi quy thô; ba cách còn lại cho 14%, 15%, 36%)
```

### Điều đồ án **chưa** nói được

**Chính xác bao nhiêu phần chênh lệch đó là do chính sách gây ra.** Hai nhóm hàng vốn khác
nhau về sức bán từ trước, và cổng cân bằng đã trượt. Giới hạn này ảnh hưởng tới **độ lớn**
của tác động nhân quả — nó **không** lật ngược phát hiện quan sát được rằng giá thực tế đã
không giảm theo mức thuế.

> ⚠️ **Không đọc kết quả này thành "chính sách không có tác động".**
> Không bác bỏ được giả thuyết không có nghĩa là giả thuyết đúng. Kiểm định tương đương ở đây
> có sức mạnh **0,0%** — biên đã chọn hẹp hơn mức cần, nên nó không có cơ hội chứng minh điều
> đó dù tác động thật có bằng 0 đi nữa. Xem [phụ lục B.5](bao-cao/phu-luc-ky-thuat.md#b5).

### Bốn ước lượng chính

So sánh theo `Z` — nhóm đủ điều kiện giảm thuế **theo luật** (155 mặt hàng) đối chiếu nhóm
chịu thuế tiêu thụ đặc biệt, bị loại trừ ở cả hai nghị quyết (132 mặt hàng).

| Phương pháp | Ước lượng | p | KTC 95% | Tỉ lệ vào giá |
|---|---:|---:|---:|---:|
| PP1-A thô | −0,398 | 0,507 | [−1,57 ; +0,78] | 22% |
| PP1-A hiệp biến | −0,270 | 0,713 | [−1,71 ; +1,17] | 15% |
| PP1-B g-computation | −0,664 | 0,398 | [−2,20 ; +0,84] | 36% |
| PP2 phân tầng 5 phân vị giá | −0,257 | 0,661 | [−1,41 ; +0,91] | 14% |

Đơn vị: **điểm log ×100** — với thay đổi nhỏ thì xấp xỉ phần trăm. Cả bốn khoảng tin cậy đều
chứa 0, nên chênh lệch giữa hai nhóm chưa tách được khỏi nhiễu. Kết quả ổn định qua bốn cửa sổ
thời gian, ba cách xử lý mặt hàng chưa phân loại, và hai cách xử lý mặt hàng có thuế suất mơ hồ.

### Những gì đồ án khẳng định được

- **Thực thi chính sách không hoàn hảo.** 20 trong 155 mặt hàng đủ điều kiện giảm thuế
  **vẫn bị tính 10%** vì cửa hàng không cập nhật thuế suất. Tỉ lệ tuân thủ **87,1%**.
  Bằng chứng rõ nhất: cùng dòng dao cạo Gillette nằm ở hai nhóm thuế khác nhau.
- **Giá thực tế không bám mức lẽ ra phải có.** Trong 135 mặt hàng mà chuyển thuế hoàn toàn
  kết hợp làm tròn 1.000đ dự báo phải đổi mức giá, chỉ **1** mặt hàng đạt đúng mức đó. Nhóm
  đối chiếu — vốn không được giảm thuế — cũng khớp 1/92, tức ngang mức trùng hợp.
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

Đồ án dùng **hai mô hình phân tích nhân quả khác nhau**: hồi quy có điều chỉnh (PP1) và phân
tầng theo mức giá (PP2). Nhóm chạy thêm PP1-A thô và PP1-B g-computation để có hai biến thể
so sánh.

Cả hai mô hình dựa trên **cùng một giả định nhận dạng là xu hướng song song**, nên chúng không
kiểm chứng lẫn nhau. Nếu giả định sai, cả hai có thể cùng sai theo một hướng.

Ngoài bốn cách đó còn một **chuẩn cơ học** không dùng nhóm đối chứng: tính mức giá lẽ ra phải
có nếu chuyển thuế hoàn toàn, rồi đối chiếu với giá thật. Đây là kiểm chứng bổ sung, không
phải phương pháp ước lượng nhân quả.

### Ba cổng chẩn đoán

Khóa **trước** khi chạy kết quả, kèm hành động cố định nếu trượt. Không phải ba lá phiếu —
cổng đạt không bù được cổng trượt.

| Cổng | Kết quả | |
|---|---|---|
| 1 · Cân bằng sau phân tầng | **Trượt** | 12/15 cặp có \|SMD\| > 0,25 |
| 2 · Giả dược tiền kỳ | Đạt | Chênh lệch lớn nhất 0,562 < ngưỡng 0,918 |
| 3 · Tương đương tiền xu hướng | **Không đạt** | Không chứng minh được xu hướng song song |

Vì cổng 1 trượt, mọi kết luận nhân quả được trình bày là **so sánh có điều chỉnh**, không phải
ước lượng nhân quả sạch. Đây là quy tắc khóa từ trước, không phải quyết định đưa ra sau khi thấy số.

---

## Chạy lại

Cần Python 3.12+ và file `60.xlsx` ở thư mục gốc *(đã có sẵn trong repo)*.

```bash
pip install -r requirements.txt
python code/chay_tat_ca.py
```

Pipeline chạy 6 bước từ file gốc, sinh **19 bảng và 2 hình** vào `ket-qua/`. Mọi kiểm chứng
chạy tự động — thiếu file, sai số dòng, hay hiệp biến rò rỉ dữ liệu hậu kỳ đều làm **dừng
ngay** thay vì âm thầm cho số sai.

**Tái lập:** chạy hai lần cho hash **giống hệt** trên toàn bộ đầu ra, kể cả các bảng bootstrap
5.000 lần. `ket-qua/manifest-tai-lap.json` ghi hash nguồn, phiên bản thư viện, tham số và hash
từng đầu ra.

### Rà soát trước khi nộp

```bash
python code/b6_ra_soat_ngon_ngu.py
```

Quét toàn bộ báo cáo và web tìm ba loại lỗi: câu phát biểu vượt quá dữ liệu, con số của các
đặc tả đã bị thay thế, và **lệch hợp đồng nhãn** giữa pipeline với frontend. Script phân biệt
được *dùng* một câu cấm với *cấm* câu đó, nên nó không báo động chính các cảnh báo của mình.

Phần kiểm tra hợp đồng nhãn tồn tại vì lỗi đó đã xảy ra ba lần: pipeline đổi một nhãn, frontend
vẫn lọc chuỗi cũ, và giao diện hiện ô trống **mà không báo lỗi nào**. Nay mỗi nhãn được đối
chiếu ba chiều — hằng số Python, hằng số TypeScript, và dữ liệu đã ghi ra.

---

## Web và slide

```bash
cd web/backend  && pip install -r requirements.txt && uvicorn main:app   # cổng 8000
cd web/frontend && npm install && npm run dev                            # cổng 3000
```

**Backend** — FastAPI, 16 endpoint, đọc thẳng `ket-qua/*.csv`. Kiểm chứng schema lúc khởi
động: thiếu file hoặc thiếu cột thì **không khởi động**, thay vì phục vụ dữ liệu rỗng.

**Frontend** — Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui + Recharts.

| Trang | Nội dung |
|---|---|
| `/` | Tóm tắt — mở đầu bằng hạn chế, không phải bằng con số |
| `/du-lieu` | Bảng luồng mẫu, độ phủ dữ liệu, cân bằng tiền kỳ |
| `/thiet-ke` | Khung `Z` / `D`, đồ thị nhân quả, giả định, bảng đường backdoor |
| `/ket-qua` | Bốn ước lượng, bám chuẩn cơ học, ba cổng, lưới độ nhạy |
| `/suc-manh` | MDE, sức mạnh kiểm định tương đương, mô phỏng làm tròn, sản lượng |
| `/han-che` | Tổng hợp hạn chế + danh sách câu cấm viết |
| `/trinh-bay` | **Bộ trình chiếu 19 slide** |

Mỗi khối số liệu trên web đều kèm một khối **diễn giải bằng lời thường** trả lời câu "vậy
nghĩa là sao" — vì người đọc là giảng viên và các bạn cùng nhóm, không phải người đọc tạp chí.

Năm biểu đồ: hệ số bốn ước lượng, sơ đồ luồng mẫu, Love plot cân bằng, biểu đồ tương đương,
đường cong sức mạnh. Mỗi biểu đồ có **bảng số thay thế** cho người dùng trình đọc màn hình.

### Bộ trình chiếu

Trang `/trinh-bay` là bản trình chiếu thật, không phải trang cuộn: mỗi slide chiếm trọn khung
nhìn, chuyển bằng phím **← →**, nút **Trình chiếu** phóng toàn màn hình, và **Ctrl+P** xuất
PDF mỗi slide một trang.

Mạch 19 slide: đặt vấn đề → dữ liệu → quan sát sơ bộ → cơ sở pháp lý → khung phương pháp →
gắn biến → ba phương pháp ước lượng → kiểm tra thiết kế → kết quả → kiểm chứng bổ sung →
hạn chế → kết luận.

Thông tin môn học và nhóm điền ở hằng số `THONG_TIN_NHOM` đầu file `app/trinh-bay/page.tsx`.

> **Nguyên tắc xuyên suốt: không con số kết quả nào được gõ tay.**
> Web đọc thẳng từ kết quả pipeline sinh ra, nên nó **không thể lệch** khỏi phân tích.
> Slide dùng chung hook với web, nên slide cũng không thể lệch.

---

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `code/` | Pipeline phân tích — 6 bước, một lệnh |
| `bao-cao/` | Báo cáo — 6 chương và phụ lục kỹ thuật |
| `ket-qua/` | 19 bảng kết quả + 2 hình, sinh từ pipeline |
| `web/backend/` | FastAPI phục vụ kết quả dưới dạng JSON |
| `web/frontend/` | Next.js — 7 trang, 5 biểu đồ, 19 slide |
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

- **Hai mô hình và hai biến thể không phải bốn bằng chứng độc lập.** Chúng dùng chung giả định
  xu hướng song song; nếu giả định này sai thì cả bốn có thể cùng sai theo một hướng.
- **Cân bằng sau phân tầng thất bại** ở 12/15 cặp. Đã thử sáu cách chia tầng, không cách nào đạt.
- **Mẫu đã bị chọn lọc theo khả năng sống sót** — tỉ lệ mặt hàng còn được bán ở hậu kỳ chênh
  nhau **7,2 điểm phần trăm** giữa hai nhóm (82,0% so với 89,2%). Vì vậy kết quả không phải
  tác động vô điều kiện cho toàn bộ nhóm ban đầu, mà là *so sánh trong nhóm mặt hàng có giá
  quan sát được ở cả hai kỳ*.
- **Việc bác bỏ mức chuyển thuế hoàn toàn phụ thuộc phương pháp** — ba đặc tả bác bỏ,
  g-computation không. Không lấy "3 trên 4" làm biểu quyết.
- **Chi phí đổi giá chưa loại trừ được.** Cửa hàng có thể ngại đổi giá vì mỗi lần đổi đều tốn
  công và ảnh hưởng vận hành. Nhưng dù lý do là gì, người mua vẫn trả đúng số tiền cũ.
- **Lạm phát tích lũy chưa loại trừ được.** Phần giảm thuế có thể đã bị lạm phát tích lũy từ
  lần điều chỉnh giá gần nhất bù vào. Dữ liệu này không quan sát được chi phí đầu vào.
- **Một cửa hàng, một ngày chính sách.** Bất định ở cấp chính sách không ước lượng được bằng
  dữ liệu này. Mọi sai số chuẩn trong đồ án chỉ đo bất định **có điều kiện ở cấp mặt hàng**.
- **Không ngoại suy ra ngành bán lẻ Việt Nam.**

---

## Nguồn pháp lý

- **Nghị quyết 174/2024/QH15** — loại trừ "sản phẩm hóa chất" khỏi diện giảm thuế
- **Nghị quyết 204/2025/QH15** — bỏ loại trừ đó từ 01/07/2025; hàng chịu thuế tiêu thụ đặc
  biệt (rượu, bia, thuốc lá) vẫn bị loại trừ ở **cả hai** nghị quyết

Chính sự khác biệt giữa hai nghị quyết tạo ra nhóm can thiệp và nhóm đối chứng của đồ án.
