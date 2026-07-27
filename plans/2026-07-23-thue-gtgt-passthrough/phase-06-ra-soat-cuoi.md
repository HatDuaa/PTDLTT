# Phase 06 — Rà soát cuối

**Người:** cả nhóm · **Phụ thuộc:** phase 1–5 · **Chặn:** nộp bài

> Năm vòng phản biện trước đều soi **thiết kế đang thay đổi**. Chưa vòng nào soi **sản phẩm sẽ nộp**.
>
> Phase này là vòng duy nhất chạy trên bản hoàn chỉnh. Nó phải bắt được thứ mà 5 phase trước bỏ sót.

---

## 1. Tính đúng của số liệu

- [ ] Chạy sạch từ `60.xlsx` **hai lần** — 16 hash đầu ra phải **giống hệt nhau**
- [ ] `manifest-tai-lap.json` chứa đủ 16 bảng và hash nguồn
- [ ] Đối chiếu bốn ước lượng, KTC, p, MDE, kiểm định chuyển hoàn toàn, sản lượng, tỉ lệ sống sót giữa **báo cáo ↔ web ↔ slide**
- [ ] Có đầu ra chuẩn cho **15 SMD sau phân tầng** (hiện chỉ in ra màn hình, chưa xuất file)
- [ ] Quét toàn repo: **không còn nhãn `ITT` vô điều kiện** trong CSV, API, web, slide hay báo cáo — phải luôn kèm điều kiện mẫu
- [ ] Đối chiếu **tự động** số sau làm tròn giữa ba sản phẩm, không so bằng mắt

## 2. Build và khả năng chấm bài

- [ ] `npm ci` và `pip install -r requirements.txt` với phiên bản khóa cứng
- [ ] **Build tĩnh thành công khi FastAPI KHÔNG chạy**
- [ ] Mọi route mở trực tiếp và **refresh** được (không chỉ điều hướng nội bộ)
- [ ] Thử ở URL gốc **và** dưới thư mục con
- [ ] Thử **offline** — không phụ thuộc font/CDN/API ngoài
- [ ] Gói nộp gồm: `out/`, mã nguồn, README, báo cáo, slide PDF
- [ ] **Giải nén gói nộp vào thư mục sạch rồi chạy lại từ đầu** — đây là phép thử thật

## 3. Hợp đồng dữ liệu

- [ ] Thiếu file, thiếu cột, sai enum, NaN/Infinity, sai số dòng ⇒ **fail build**, không im lặng
- [ ] JSON dùng `null`, không phát `NaN`
- [ ] Đúng **4** kết quả chính, **3** cổng, **5** tầng — đếm tự động
- [ ] Web và slide dùng **chung** selector, formatter, nhãn vai trò
- [ ] 🔴 **Không có dữ liệu hóa đơn cấp dòng** trong `out/`, bundle, hay network log

## 4. Trình bày và khả năng tiếp cận

- [ ] Điện thoại, máy tính, Chrome/Firefox — không tràn chữ
- [ ] Slide đúng **16:9**, điều khiển bằng bàn phím, xuất PDF không lệch
- [ ] Mỗi biểu đồ có **bảng số thay thế**, alt text, và đơn vị
- [ ] Trục và KTC **không bị cắt**; đường tham chiếu 0 và −1,835 đúng vị trí
- [ ] Tương phản, focus, `prefers-reduced-motion`, phóng to 200%
- [ ] 🔴 **Không dùng màu như phán quyết thắng–thua**

## 5. Rà ngôn ngữ và tính trung thực

Quét **toàn bộ** repo, web, slide, PDF cho các câu cấm:

| Câu cấm | Thay bằng |
|---|---|
| "không có tác động" / "tác động bằng 0" | "không tìm thấy bằng chứng…" |
| "suýt có ý nghĩa" / "có xu hướng giảm" | nêu KTC và MDE |
| "hai phương pháp xác nhận lẫn nhau" | "chung một chiến lược nhận dạng" |
| "xu hướng song song đã đạt/đã chứng minh" | "không được xác nhận" |
| "cửa hàng giữ lại phần giảm thuế" | "chưa xác định được lợi ích thuộc về ai" |
| "pass-through bằng 0" | TOST không kết luận được |
| "bác bỏ chuyển hoàn toàn" *(như kết luận chính)* | "phụ thuộc phương pháp" |
| "đã xử lý ngụy lặp" | "bất định cấp chính sách không ước lượng được" |

Ngoài ra:

- [ ] Quét **các con số của đặc tả cũ**: `156`, `161`, `123`, `142`, `0,682`, `87%` *(MDE cũ)*, `−1,491`/`−1,928` *(biên TOST sai)*
- [ ] Mọi kết quả giá ghi rõ **mẫu SKU sống sót**
- [ ] Sản lượng, sống sót, làm tròn mang đúng nhãn **khám phá / cơ học**
- [ ] Không ngoại suy ngoài **một cửa hàng**
- [ ] Không trình bày bất định cấp SKU như bất định cấp chính sách
- [ ] Dẫn đủ nguồn: NQ 174/2024/QH15, NQ 204/2025/QH15, thư viện, dữ liệu
- [ ] 🔴 Kiểm tra **hai con số 87,1%** không đứng gần nhau ở bất kỳ đâu

## 6. Vòng phản biện cuối

Sau khi checklist trên xong, gửi **sản phẩm hoàn chỉnh** (không phải kế hoạch) cho phản biện độc lập với đúng một câu hỏi:

> *Đọc bản nộp này như một người chấm hoài nghi. Có chỗ nào kết luận vượt quá dữ liệu không?*

---

## Tiêu chí nghiệm thu

- [ ] Toàn bộ §1–§5 đã tick
- [ ] Vòng phản biện cuối không còn phát hiện nào ở mức P0
- [ ] Gói nộp chạy được từ thư mục sạch

## Rủi ro

| Rủi ro | Xử lý |
|---|---|
| Rà bằng mắt, bỏ sót | Viết script quét câu cấm và số cũ |
| Sửa web quên sửa slide | Dùng chung hook; script đối chiếu |
| Bản tĩnh hỏng vì thiếu backend | Nhúng JSON lúc build, test offline |
| Coi vòng phản biện cuối là hình thức | Nó là vòng duy nhất soi sản phẩm thật |
