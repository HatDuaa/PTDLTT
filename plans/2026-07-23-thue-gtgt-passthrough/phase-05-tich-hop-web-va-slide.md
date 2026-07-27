# Phase 05 — Tích hợp sản phẩm: web & slide

**Người:** cả nhóm · **Phụ thuộc:** phase 1–4 · **Chặn:** nộp bài

> Đề bài bắt buộc **trình bày dạng web**. Đây không phải lớp trang trí — nó là hình thức nộp.
>
> 🔴 Rủi ro lớn nhất của phase này **không phải kỹ thuật**. Nó là làm hỏng tính trung thực đã dựng qua 4 phase trước: web đẹp rất dễ biến kết quả null thành câu chuyện gọn gàng.

---

## 1. Nguyên tắc nền — một nguồn số duy nhất

Yêu cầu số một: **không con số nào được gõ tay.**

```
60.xlsx → code/chay_tat_ca.py → ket-qua/*.csv → FastAPI → Next.js
```

Web đọc từ chính CSV mà pipeline sinh ra. Hệ quả: **web không thể lệch khỏi pipeline**, vì nó không có nguồn nào khác.

Đây là lý do kỹ thuật để có backend, không phải sở thích: nó biến "kiểm tra chéo con số giữa ba sản phẩm" từ việc thủ công thành việc **không thể sai**.

---

## 2. Kiến trúc và stack

```
web/
  backend/          FastAPI — đọc ket-qua/*.csv, phục vụ JSON
    main.py
    doc_ket_qua.py  nạp & kiểm chứng CSV
    requirements.txt
  frontend/         Next.js 15 + TypeScript
    app/            App Router
    components/     shadcn/ui
    lib/            client gọi API, kiểu dữ liệu
```

| Lớp | Chọn | Lý do |
|---|---|---|
| Backend | **FastAPI** | Cùng hệ Python với pipeline; đọc thẳng CSV không qua bước chuyển đổi |
| Frontend | **Next.js 15 + TypeScript** | App Router, dễ xuất tĩnh khi nộp |
| Design system | **shadcn/ui + Tailwind** | Hệ thành phần có sẵn, khả năng tiếp cận tốt. **Không viết CSS chay** |
| Biểu đồ | **Recharts** | Tích hợp sẵn với shadcn/ui chart |
| Slide | Route `/trinh-bay` **trong cùng ứng dụng** | Dùng chung hook dữ liệu ⇒ slide không thể lệch số |

**Nộp bài:** `next build` với `output: 'export'` cho bản tĩnh. Backend chỉ cần khi chạy bản động; bản tĩnh nhúng sẵn JSON sinh lúc build.

---

## 3. API — phẳng, chỉ đọc

| Endpoint | Nguồn |
|---|---|
| `GET /api/uoc-luong-chinh` | `kq-uoc-luong-chinh.csv` |
| `GET /api/theo-tang` | `kq-theo-tang.csv` |
| `GET /api/cong-chan-doan` | `kq-cong-chan-doan.csv` |
| `GET /api/do-nhay` | `kq-do-nhay.csv` |
| `GET /api/mde` | `kq-mde-va-suc-manh.csv` |
| `GET /api/lam-tron` | `kq-mo-phong-lam-tron.csv` |
| `GET /api/san-luong` | `kq-san-luong.csv` |
| `GET /api/luong-mau` | `bang-luong-mau.csv` |
| `GET /api/eda/{ten}` | `eda-*.csv` |
| `GET /api/manifest` | `manifest-tai-lap.json` |

**Backend phải kiểm chứng khi khởi động:** thiếu file hoặc thiếu cột ⇒ **báo lỗi ngay**, không phục vụ dữ liệu rỗng.

---

## 4. Cấu trúc nội dung web

| Trang | Nội dung |
|---|---|
| `/` | Tóm tắt — **mở đầu bằng hạn chế**, không phải bằng con số |
| `/du-lieu` | Chương 1–3: bối cảnh, pháp lý, bảng luồng mẫu, EDA |
| `/thiet-ke` | Chương 4: khung `Z`/`D`, DAG, giả định, bảng backdoor |
| `/ket-qua` | Chương 5: bốn ước lượng, theo tầng, cổng chẩn đoán, độ nhạy |
| `/suc-manh` | Chương 6: MDE, sức mạnh TOST, làm tròn, sản lượng |
| `/han-che` | Tổng hợp mọi hạn chế + danh sách câu cấm viết |
| `/trinh-bay` | Slide |

---

## 5. 🔴 Mười thông điệp bắt buộc truyền tải

Không được để thiết kế làm mờ bất kỳ điểm nào:

1. Đây là thí nghiệm tự nhiên **không hoàn hảo**: có không tuân thủ, đối chứng từng bị ô nhiễm, 23 SKU chưa phân loại
2. Hai phương pháp dùng **chung một** chiến lược nhận dạng — **không** phải hai xác nhận độc lập
3. Cân bằng thất bại **12/15 cặp**; TOST tiền xu hướng không đạt; giả dược không lớn nhưng **không đủ** xác nhận xu hướng song song
4. So sánh giá trên **287 SKU sống sót** cho khoảng **−0,26 đến −0,66** điểm log ×100; **mọi KTC chứa 0**
5. **Không** kết luận được giá không giảm hay pass-through bằng 0. TOST thất bại **chủ yếu vì biên quá hẹp** so với độ chính xác dữ liệu
6. Bác bỏ chuyển hoàn toàn **phụ thuộc phương pháp** — 3 bác bỏ, g-computation không. **Không biểu quyết 3/4**
7. Chọn lọc sống sót chênh **7,2 điểm %** làm suy yếu thêm diễn giải giá; kết quả **không phải** ITT cho toàn bộ cohort
8. Sản lượng và việc còn bán chỉ là **khám phá**, thiếu lực và có chọn lọc mẫu
9. Mô phỏng làm tròn cho thấy quy tắc giả định **khó che** mức giảm cơ học cho phần lớn SKU, nhưng **không** xác định hành vi định giá thật
10. Đóng góp đáng tin nhất của đồ án là **minh họa minh bạch giới hạn** của nhận dạng, không tuân thủ và chọn lọc mẫu trong dữ liệu bán lẻ thực tế

---

## 6. 🔴 Mười bẫy trình bày phải tránh

| Bẫy | Vì sao |
|---|---|
| Dùng `p=0,067` như "suýt có ý nghĩa" | MDE sản lượng = 31,5 |
| Gọi kết quả là "ITT" mà không kèm điều kiện mẫu | Đã điều kiện hóa sống sót |
| Dùng cổng 2 đạt để tuyên bố xu hướng song song | Ba cổng không phải ba lá phiếu |
| Gọi −7,2 điểm % là "tác động gây ngừng bán" | KTC chứa 0; nhóm `Z=1` vốn bán thưa hơn từ đầu |
| Đặt hai con số **87,1%** cạnh nhau | Trùng **ngẫu nhiên** — một là làm tròn, một là tuân thủ; hai tập SKU khác nhau |
| Nói làm tròn "bị bác bỏ" | Chỉ bác bỏ đúng bộ quy tắc đã liệt kê |
| Đẩy giá chưa thuế p=0,036 thành "cửa hàng giữ lại thuế" | Không có dữ liệu chi phí đầu vào |
| Màu xanh/đỏ hoặc "3/4 phương pháp" như bảng điểm | Không phải trận đấu |
| Ngoại suy sang bán lẻ Việt Nam | Một cửa hàng |
| Nói HC3/bootstrap đã xử lý bất định cấp chính sách | Chúng chỉ đo biến thiên cấp SKU có điều kiện |

---

## 7. Yêu cầu trình bày cụ thể

**Biểu đồ hệ số bắt buộc:** một hình chứa **cả bốn** ước lượng, KTC 95%, đường tham chiếu **0** và **−1,835**. Không tô màu thắng–thua.

**Bảng độ nhạy phải hiện đủ**, kể cả kết quả bất lợi: survivorship ≥5 tuần **đổi dấu**, ba biến thể 23 SKU, bốn cửa sổ, hai cách xử lý SKU hòa.

**Nhãn vai trò** hiển thị ngay cạnh mỗi khối: *chính* · *phụ* · *khám phá* · *cơ học* · *chẩn đoán, không có địa vị suy diễn*.

**Cổng chẩn đoán** hiện cả ba với trạng thái riêng, **không** gộp thành điểm tổng hợp.

**Thuật ngữ và đơn vị** nhất quán: luôn ghi "điểm log ×100"; tên nhóm `Z=1`/`Z=0` thống nhất giữa web, báo cáo và slide.

**Khả năng đọc:** thử trên điện thoại; mỗi biểu đồ có **bảng số thay thế**; nguồn pháp lý ghi rõ NQ 174/2024 và NQ 204/2025.

---

## 8. Đóng gói nộp bài

- `python code/chay_tat_ca.py` chạy một lệnh từ `60.xlsx`
- `requirements.txt` + `web/backend/requirements.txt` + `web/frontend/package.json`
- `manifest-tai-lap.json` có hash nguồn và hash từng đầu ra
- ⚠️ **Không công khai hóa đơn cấp dòng** nếu có nguy cơ nhận dạng — web chỉ phục vụ dữ liệu **đã tổng hợp**

---

## Tiêu chí nghiệm thu

- [ ] Không con số nào gõ tay — mọi giá trị đến từ API
- [ ] Backend báo lỗi khi thiếu file/cột, không phục vụ dữ liệu rỗng
- [ ] Trang chủ **mở đầu bằng hạn chế**
- [ ] Đủ 10 thông điệp §5
- [ ] Không mắc bẫy nào ở §6 — rà từng dòng
- [ ] Biểu đồ hệ số có đủ 4 ước lượng + hai đường tham chiếu
- [ ] Bảng độ nhạy hiện đủ, gồm cả kết quả bất lợi
- [ ] Mỗi khối có nhãn vai trò
- [ ] Ba cổng hiện riêng, không gộp điểm
- [ ] Slide dùng **chung hook dữ liệu** với web
- [ ] Đọc được trên điện thoại; mỗi biểu đồ có bảng số thay thế
- [ ] Không dùng CSS chay — dùng shadcn/ui

## Rủi ro

| Rủi ro | Xử lý |
|---|---|
| Web đẹp làm mờ kết quả null | §5 và §6 là danh sách rà bắt buộc |
| Slide lệch số với web | Dùng chung hook, cùng API |
| Gõ tay một con số "cho nhanh" | Nghiệm thu: tìm số cứng trong mã FE |
| Backend không chạy lúc chấm | Xuất tĩnh `output: 'export'`, nhúng JSON lúc build |
