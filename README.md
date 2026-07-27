# Tác động của việc giảm thuế GTGT lên giá bán lẻ

Đồ án cuối kỳ môn Phân tích dữ liệu. Đánh giá xem việc giảm thuế GTGT từ 10% xuống 8%
(có hiệu lực 01/07/2025, theo Nghị quyết 204/2025/QH15) có làm giảm giá bán lẻ mà người
tiêu dùng thực trả hay không.

**Dữ liệu:** hóa đơn của một cửa hàng tiện lợi tại TP.HCM, 12/2024 – 08/2025 —
67.562 hóa đơn, 233.996 dòng hàng.

---

## Kết luận

> Không tìm thấy bằng chứng giá giảm trong các so sánh có điều chỉnh; dữ liệu không đủ
> để quy chênh lệch quan sát cho chính sách một cách đáng tin cậy.

Đây là một kết quả **null**. Giá trị của đồ án nằm ở chỗ chỉ ra *chính xác vì sao* không
kết luận mạnh hơn được — chứ không phải ở việc tìm ra một con số đẹp.

| Phương pháp | Ước lượng | p | KTC 95% |
|---|---:|---:|---:|
| Hồi quy thô | −0,398 | 0,507 | [−1,57 ; +0,78] |
| Hồi quy có hiệp biến | −0,270 | 0,713 | [−1,71 ; +1,17] |
| g-computation (ATT) | −0,664 | 0,398 | [−2,20 ; +0,84] |
| Phân tầng 5 phân vị giá | −0,257 | 0,661 | [−1,41 ; +0,91] |

Đơn vị: điểm log ×100. **Cả bốn khoảng tin cậy đều chứa 0.**

⚠️ **Không đọc kết quả này thành "chính sách không có tác động".** Không bác bỏ được giả
thuyết không có nghĩa là giả thuyết đúng — và kiểm định tương đương ở đây có sức mạnh
**0,0%**, tức nó không có cơ hội chứng minh điều đó. Xem [chương 6](bao-cao/chuong-06-suc-manh-va-co-che.md).

---

## Chạy lại

Cần Python 3.12+ và file `60.xlsx` ở thư mục gốc.

```bash
pip install -r requirements.txt
python code/chay_tat_ca.py
```

Pipeline chạy 6 bước từ file gốc, sinh 22 đầu ra vào `ket-qua/`. Mọi kiểm chứng chạy tự
động — thiếu file, sai số dòng, hay hiệp biến rò rỉ dữ liệu hậu kỳ đều làm dừng ngay
thay vì âm thầm cho số sai.

**Tái lập:** chạy hai lần cho ra hash giống hệt trên toàn bộ 22 đầu ra, kể cả các bảng
bootstrap 5.000 lần. `ket-qua/manifest-tai-lap.json` ghi hash nguồn, phiên bản thư viện
và hash từng đầu ra.

### Rà soát trước khi nộp

```bash
python code/b6_ra_soat_ngon_ngu.py
```

Quét toàn bộ báo cáo và web tìm câu phát biểu vượt quá dữ liệu, con số của các đặc tả đã
bị thay thế, và kiểm tra hợp đồng nhãn giữa pipeline với frontend.

### Web

```bash
cd web/backend  && pip install -r requirements.txt && uvicorn main:app   # cổng 8000
cd web/frontend && npm install && npm run dev                            # cổng 3000
```

---

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `code/` | Pipeline phân tích, 6 bước, một lệnh |
| `bao-cao/` | Báo cáo — chương 4 (thiết kế), 5 (kết quả), 6 (sức mạnh & cơ chế) |
| `ket-qua/` | 16 bảng kết quả + 2 hình, sinh từ pipeline |
| `web/backend/` | FastAPI phục vụ `ket-qua/` dưới dạng JSON |
| `web/frontend/` | Next.js + shadcn/ui, 7 trang, 5 biểu đồ |
| `plans/` | Kế hoạch, nhật ký, và **đặc tả khóa** |

**Nguyên tắc xuyên suốt: không con số nào được gõ tay.** Web đọc thẳng từ kết quả pipeline
sinh ra, nên nó không thể lệch khỏi phân tích.

---

## Đọc gì trước

[`plans/2026-07-23-thue-gtgt-passthrough/dac-ta-khoa.md`](plans/2026-07-23-thue-gtgt-passthrough/dac-ta-khoa.md)
là văn bản khóa đặc tả — nó cố định mọi lựa chọn phân tích *trước* khi nhìn kết quả cuối,
kèm nhật ký mọi lần sửa đổi và lý do. Đọc nó trước khi đổi bất kỳ tham số nào.

---

## Điều đồ án này không chứng minh được

Ghi ở đây vì đó là phần trung thực nhất của công việc:

- **Hai phương pháp dùng chung một chiến lược nhận dạng.** Chúng cho kết quả giống nhau
  không phải hai bằng chứng độc lập — nếu giả định nền sai thì cả hai cùng sai.
- **Cân bằng sau phân tầng thất bại** ở 12/15 cặp. Đã thử sáu cách chia tầng, không cách
  nào đạt. Vì vậy cả hai phương pháp được trình bày là *so sánh có điều chỉnh*, không phải
  ước lượng nhân quả sạch.
- **Mẫu đã bị chọn lọc theo khả năng sống sót** — tỉ lệ SKU còn được bán ở hậu kỳ chênh
  nhau 7,2 điểm phần trăm giữa hai nhóm.
- **Nhóm đối chứng không hoàn toàn do luật định** — 20/155 SKU đủ điều kiện giảm thuế vẫn
  bị tính 10% vì cửa hàng không cập nhật. Tỉ lệ tuân thủ 87,1%.
- **Một cửa hàng, một ngày chính sách.** Bất định ở cấp chính sách không ước lượng được
  bằng dữ liệu này, và không được ngoại suy ra ngành bán lẻ.

## Nguồn pháp lý

- Nghị quyết 174/2024/QH15 — loại trừ "sản phẩm hóa chất" khỏi diện giảm thuế
- Nghị quyết 204/2025/QH15 — bỏ loại trừ đó từ 01/07/2025; hàng chịu thuế tiêu thụ đặc
  biệt vẫn bị loại trừ ở cả hai nghị quyết
