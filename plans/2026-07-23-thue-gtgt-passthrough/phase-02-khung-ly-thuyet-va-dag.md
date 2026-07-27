# Phase 02 — Khung lý thuyết & DAG

**Người:** B · **Chương phủ:** 4, 7, 8 · **Phụ thuộc:** phase 0 · **Chạy song song** phase 1

> Mục tiêu: dựng khung nhân quả để người đọc hiểu **ước lượng nào được nhận dạng bằng gì**, và **giả định nào** phải đúng.
>
> Phase này **không chạy số**. Nó viết lý thuyết, vẽ đồ thị, và **đặt trước các cổng chẩn đoán** mà Phase 3 phải đi qua.

---

## 1. Estimand dưới không tuân thủ — mục quan trọng nhất

Phải xác định rõ ngay từ đầu đồ án đo cái gì. Có **hai** đại lượng, không phải một ([đặc tả khóa §5](dac-ta-khoa.md)):

| | Nghĩa | Nhận dạng bằng |
|---|---|---|
| `Z` | Đủ điều kiện giảm thuế **theo luật** | ✅ NQ 204/2025 + định danh sản phẩm |
| `D` | Thuế suất cửa hàng **thực áp** | ❌ một phần là quyết định vận hành |

Tỉ lệ tuân thủ **87,1%** — 20/155 SKU đủ điều kiện nhưng cửa hàng không cập nhật.

Phải viết rõ ba ước lượng và giả định của từng cái:

- **ITT theo `Z`** — tác động của việc *luật cho giảm thuế*. Giả định: xu hướng song song theo `Z`, **cộng với** phân loại `Z` đúng, SUTVA/consistency, no-anticipation, và mẫu không bị chọn lọc lệch theo biến hậu can thiệp. *(Câu "ITT chỉ cần xu hướng song song" là quá mạnh — không được viết như vậy.)*
- **Per-protocol theo `D`** — tác động của *thuế thực nhận*. Cần thêm: quyết định cập nhật không liên quan xu hướng giá phản thực.
- **ITT hiệu chỉnh theo Wald** — **chỉ ở phụ lục** ([đặc tả §5](dac-ta-khoa.md)). Cần thêm công cụ hợp lệ và monotonicity; KTC phải bootstrap cả tử lẫn mẫu. **Cấm** gọi là bằng chứng LATE nhân quả trong thân bài.

🔴 **Phân biệt hai thứ dễ lẫn:**

| Vấn đề | Ảnh hưởng cái gì |
|---|---|
| "Năng lực cập nhật giá nói chung → `D` **và** → giá" | **Nhiễu của per-protocol** |
| "`Z` ảnh hưởng giá qua kênh nào khác ngoài `D`?" | **Exclusion restriction** (điều kiện cho Wald) |

Đây là hai câu hỏi khác nhau, phải viết tách. Bản trước gộp chúng làm một — sai.

---

## 2. DAG chính thức

Một DAG duy nhất. Các đỉnh **bắt buộc**:

| Đỉnh | Vai trò | Vì sao bắt buộc |
|---|---|---|
| `NQ 204/2025` | Nguồn ngoại sinh | |
| `Z` — đủ điều kiện theo luật | Can thiệp được chỉ định | |
| `Cửa hàng cập nhật thuế suất` | **Tuân thủ** | Chỗ tính ngoại sinh bị phá |
| `D` — thuế suất thực áp | Can thiệp được nhận | |
| `Giá gồm thuế` | Kết quả | |
| `G` — nhóm quan sát (T/C10/C8) | **Suy ra từ `D` ở hậu kỳ** | Nhóm đang điều kiện hóa trên biến hậu kỳ — phải hiện trên DAG |
| `S` — được quan sát ở cả hai kỳ | **Collider survivorship** | Phụ thuộc cầu, tồn kho, giá; mẫu điều kiện hóa trên nó |
| `Đặc tính SKU / cầu nền` | **Biến ẩn** | Gây ra `pre_q`, `pre_w`, ảnh hưởng cả cập nhật thuế, tồn tại trong mẫu, và xu hướng giá Y(0) |
| `pre_p`, `pre_q`, `pre_w` | **Chỉ báo quan sát được** của biến ẩn trên | |
| `Chi phí đầu vào` | **Không quan sát được** | Hóa đơn mua vào chỉ có 03–04/2025, toàn bộ trước chính sách |
| `Chi phí thực đơn / làm tròn giá` | Cơ chế chặn | |
| `Dời địa điểm 06/2025` | Cú sốc trùng thời gian | |

**Bốn đường phải vẽ được:**

```
Đặc tính SKU (loại hàng) → Z                     ← ĐƯỜNG QUAN TRỌNG NHẤT
Z=1 → cửa hàng không cập nhật → D=10% → xếp vào C10   (ô nhiễm đối chứng)
Đặc tính SKU → pre_q, pre_w        và        → xu hướng giá Y(0)
Đặc tính SKU → S (tồn tại trong mẫu) ← Giá            (collider)
```

🔴 **Đường thứ nhất là chỗ dễ vẽ sai nhất.** Nghị quyết **không tự tạo ra** `Z`. Nghị quyết **kết hợp với loại sản phẩm** mới xác định đủ điều kiện. Nếu DAG vẽ `NQ 204 → Z` mà không có `Đặc tính SKU → Z`, nó làm `Z` trông ngoại sinh hơn thực tế.

Hệ quả trực tiếp: cùng một `Đặc tính SKU` vừa quyết định `Z`, vừa gây ra `pre_q`, `pre_w`, chi phí, và xu hướng giá phản thực. **Mất cân bằng SMD chính là dấu hiệu của đường này** — không phải chỉ là bằng chứng rằng `pre_*` đo biến ẩn.

⚠️ **SMD không phải một đỉnh DAG.** Mất cân bằng là *bằng chứng* cho cạnh `Đặc tính SKU → pre_q, pre_w`. Vẽ `pre_*` như chỉ báo quan sát được của biến ẩn, rồi đánh dấu chúng "mất cân bằng".

**Yêu cầu nghiêm ngặt:** nếu DAG vẽ can thiệp đi thẳng từ nghị quyết tới thuế suất thực áp thì nó **nói dối** về dữ liệu này. Đỉnh `Cửa hàng cập nhật thuế suất` không được bỏ.

### Bảng đường backdoor

Lập bảng: mỗi đường backdoor một dòng, ghi **chặn được bằng biến nào** hay **không quan sát được**. Đây là chỗ để trung thực về những gì không xử lý được.

---

## 3. Khung Kết quả tiềm năng — chương 8

| Khái niệm | Nội dung cần viết |
|---|---|
| **Ký hiệu tách `Z`/`D`** | Bắt buộc: `D_i(z)` = thuế thực nhận nếu trạng thái đủ điều kiện là `z`; `Y_i(z,d)` = kết quả dưới chỉ định `z` và thuế thực nhận `d`. **Chỉ dưới exclusion restriction** mới rút gọn được về `Y_i(d)` |
| Y(1), Y(0) | Viết `Y_i(z=1)`, `Y_i(z=0)` cho ITT. Nếu chỉ viết "nếu được giảm thuế" thì phần lý thuyết nói tách `Z`/`D` nhưng ký hiệu lại gộp — mâu thuẫn |
| Vấn đề dữ liệu khuyết | Y(0) của nhóm can thiệp là thứ **không bao giờ** quan sát được |
| ATT vs ATE | Vì sao chỉ ước lượng được **ATT**, và nó đại diện cho tổng thể nào ([§1](dac-ta-khoa.md)) |
| **SUTVA** | Không lan tỏa giữa SKU. **Đáng ngờ**: hàng thay thế nhau trong cùng cửa hàng — nếu khăn ướt giảm giá, khăn giấy có thể bị điều chỉnh theo |
| **No-anticipation** | Cửa hàng không đổi giá trước 01/07 để đón chính sách. Kiểm được phần nào bằng giả dược tiền kỳ |
| **Ổn định thành phần mẫu** | Bộ SKU không đổi hệ thống quanh ngày cắt |
| **Cú sốc trùng thời gian** | Dời địa điểm 06/2025 — có cửa sổ độ nhạy riêng |
| Xu hướng song song | Chính "điều kiện bổ sung" mà chương 8.6 nói tới |

🔴 Bắt buộc nói thẳng: **hai phương pháp ở Phase 3 dùng chung một chiến lược nhận dạng.** Hai con số khớp nhau **không** xác nhận nhân quả — cả hai cùng sai nếu xu hướng không song song ([§14](dac-ta-khoa.md)).

**Mở phần phương pháp đúng chỗ chương 8.6 dừng lại** — nhưng viết gọn **một đoạn**, không biện hộ dài dòng.

---

## 4. Cổng chẩn đoán đặt trước cho Phase 3

Phase 2 khóa các chẩn đoán này **trước** khi Phase 3 chạy, để không ai chọn tiêu chí sau khi thấy số:

| # | Chẩn đoán | Tiêu chí **định lượng** | Hành động **cơ học** nếu không đạt |
|---|---|---|---|
| 1 | SMD trong từng tầng cho `log(pre_p)`, `log1p(pre_q)`, `pre_w` | **> 1/3 số cặp** có \|SMD\| > 0,25 | Hạ cấp **cả PP1 và PP2** (mục dưới) |
| 2 | Giả dược 05→06 cho **`Z`** *(so sánh chính)* + ĐC-A/B/C/8%, thô **và** có hiệp biến | \|ước lượng\| > **0,918** (= 50% mốc chuyển hoàn toàn) | Hạ cấp; nêu ở kết luận |
| 3 | TOST tiền xu hướng | **DÙNG**, biên **±0,918** | Không đạt ⇒ ghi "không chứng minh được song song", **cấm** viết ngược lại |

🔴 **Cấm dùng `p > 0,05` làm bằng chứng xu hướng song song.** Không bác bỏ ≠ tương đương.

🔴 **Hành động khi cổng không đạt là CỐ ĐỊNH: hạ cấp.** Không được "thêm biến đồng cân bằng" — thêm biến sau khi thấy cổng trượt chính là quyết định hậu kiểm.

🔴 **Vi phạm nền tảng hạ cấp CẢ HAI phương pháp**, không riêng PP2: PP1 và PP2 dùng **chung một** chiến lược nhận dạng.

### Kết quả cổng 1 — đã chạy 26/07, **KHÔNG ĐẠT**

12/15 cặp có \|SMD\| > 0,25 sau phân tầng (trước: 2/3 biến). Đã thử 6 phương án chia tầng khác, **không cái nào đạt**. Chi tiết và hệ quả ở [đặc tả khóa §9](dac-ta-khoa.md).

⇒ **Quy tắc hạ cấp đã kích hoạt.** Phase 3 phải trình bày cả hai phương pháp là **so sánh có điều chỉnh**, và đặt hạn chế này ở phần kết luận.

**Không kiểm định nào "xác nhận" được xu hướng song song** với chỉ một sai phân tiền kỳ. Viết câu này vào báo cáo.

---

## 5. Chương 4 — Câu hỏi và thiết kế

Ngắn, đúng mức giáo trình dạy: câu hỏi nghiên cứu, loại thiết kế (thí nghiệm tự nhiên **có không tuân thủ**), đơn vị phân tích, phạm vi suy rộng.

Phân biệt rõ ba thứ: **giá chưa thuế** · **quyết định định giá của cửa hàng** · **giá gồm thuế người tiêu dùng trả**. Pass-through là quan hệ giữa chúng.

---

## 6. Nghịch lý Simpson — chương 8.4

Neo lý thuyết của phương pháp 2:

- Trình bày nghịch lý ở mức khái niệm
- Nối sang phân tầng: phân tầng là cách xử lý chính hiện tượng này
- Minh họa bằng chính dữ liệu nhóm, dùng `ket-qua/eda-ho-tro-phan-tang.csv`

⚠️ **Phân tầng không tự động "xử lý Simpson" nếu chọn sai biến tầng.** Nhóm đã suýt chọn sai (`type`). Viết rõ điều này thay vì trình bày phân tầng như liều thuốc chung.

🔴 Chỉ dùng biến tiền can thiệp. Kết quả theo tầng thuộc Phase 3.

---

## 7. ~~Nghịch lý Berkson~~ — **CẮT**

Bản kế hoạch trước lập luận: dùng `type` cho Berkson thì được, vì phân tích ở cấp giỏ hàng. **Lập luận đó là ngụy biện tiện lợi.**

Hai lý do độc lập:

1. Phân tích cấp giỏ hàng **không sửa được** việc cùng một SKU bị gán nhãn *Nước uống / Đồ ăn / Sản phẩm khác* tùy dòng. "Tổng chi cho nước uống" khi đó là tổng của các nhãn không ổn định — không còn nghĩa.
2. Tổng tiền giỏ hàng là **tổng tất định** của các thành phần. Điều kiện hóa trên tổng tạo tương quan âm **cơ học**. Tương quan −0,437 trong giỏ nhỏ có thể chỉ là ràng buộc thành phần, không phải hành vi mua sắm.

⇒ **Cắt khỏi phần chính.** Nếu muốn giữ, chỉ được đặt ở phụ lục, gọi đúng tên là *minh họa ràng buộc thành phần / collider*, và **cấm** diễn giải thành hành vi người mua. Việc chạy lại số thuộc Phase 4, không thuộc phase lý thuyết.

---

## 8. Mạng Bayes — cắt đầu tiên

Quan hệ giữa thuế suất và phân loại pháp lý là **tất định**, vi phạm giả định của thuật toán học cấu trúc. Nếu thiếu thời gian, cắt trước tiên.

---

## Tiêu chí nghiệm thu

- [ ] Đã phân biệt rõ `Z` và `D`, và nói ITT là kết quả chính
- [ ] Exclusion restriction được thảo luận, không giả định ngầm
- [ ] DAG có đủ `Z`, `D`, `G`, `S`, `Đặc tính SKU` ẩn, `Cửa hàng cập nhật thuế suất`
- [ ] DAG vẽ được cả ba đường ở mục 2
- [ ] Có bảng đường backdoor ghi rõ cái nào không chặn được
- [ ] SUTVA, no-anticipation, ổn định mẫu, cú sốc trùng thời gian: thảo luận thật
- [ ] Ba cổng chẩn đoán mục 4 đã khóa **trước** khi Phase 3 chạy
- [ ] Quy tắc hạ cấp PP2 đã định trước
- [ ] Berkson đã cắt hoặc xuống phụ lục với nhãn đúng
- [ ] Mọi minh họa **chỉ dùng biến tiền can thiệp**

## Rủi ro

| Rủi ro | Xử lý |
|---|---|
| DAG vẽ đẹp nhưng che mất tuân thủ | Đỉnh `Cửa hàng cập nhật thuế suất` là bắt buộc |
| Trình bày ba đối chứng như thể đã xử lý ô nhiễm | Ba đối chứng chỉ **đổi nhóm so sánh**; ITT theo `Z` mới là cách xử lý |
| Viết lý thuyết dài mà không nối vào dữ liệu | Mỗi khái niệm kèm một câu nói nó áp vào dữ liệu này thế nào |
| Chọn tiêu chí chẩn đoán sau khi thấy số | Mục 4 phải khóa trước, có ngày |
