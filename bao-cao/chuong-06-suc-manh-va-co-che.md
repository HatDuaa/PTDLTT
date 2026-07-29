# Chương 6 — Độ chắc chắn và phạm vi áp dụng

> Chương 5 cho kết quả quan sát. Chương này tóm tắt: **kết quả chắc đến đâu** và **chỉ áp dụng trong phạm vi nào**.
>
> Công thức, mô phỏng và toàn bộ bảng kỹ thuật nằm trong [phụ lục](phu-luc-ky-thuat.md). Nhánh sản lượng và cơ chế vẫn là **khám phá**, không phải nhân quả.

## 6.1 Độ lớn tối thiểu phát hiện được (MDE)

MDE nằm trong khoảng **1,66 – 2,17** điểm log ×100. Thiết kế đủ sức phát hiện mức chuyển hoàn toàn ở PP1-thô và PP2, nhưng chưa đủ ở hai đặc tả còn lại. Vì vậy kết luận về chuyển hoàn toàn phụ thuộc phương pháp.

Công thức, bảng theo từng đặc tả và cảnh báo không dùng sức mạnh hậu kiểm nằm tại [Phụ lục B.3](phu-luc-ky-thuat.md#b3).

## 6.2 Đường cong sức mạnh — mô phỏng

Mô phỏng tái định tâm cho MDE khoảng **2,10**, gần với kết quả giải tích **2,05**. Đây là kiểm tra cho thấy cách tính sức mạnh hoạt động đúng, không phải một kết quả tác động mới.

Cách mô phỏng và đường cong đầy đủ nằm tại [Phụ lục B.4](phu-luc-ky-thuat.md#b4).

## 6.3 🔴 Sức mạnh của TOST — biên đã chọn không khả thi

Sức mạnh TOST ở biên đang dùng là **0,0%** trong cả bốn đặc tả. Vì vậy TOST thất bại **không phải bằng chứng chống lại sự tương đương**; thiết kế đơn giản là chưa đủ chính xác cho biên này.

Công thức, bảng sức mạnh và nhật ký sửa lỗi công thức nằm tại [Phụ lục B.5](phu-luc-ky-thuat.md#b5).

## 6.4 Mô phỏng làm tròn giá — chuẩn cơ học

Mô phỏng cho thấy riêng cơ chế làm tròn không thể che hoàn toàn mức giảm thuế đối với phần lớn SKU. Đây chỉ là chuẩn cơ học; đối chiếu với giá thật nằm ở [chương 5.7](chuong-05-ket-qua.md#57-giá-thực-tế-có-giảm-đúng-theo-phần-thuế-được-giảm-không).

Ba lưới làm tròn, giả định và cảnh báo về hai tỉ lệ trùng nhau nằm tại [Phụ lục D.3](phu-luc-ky-thuat.md#d3).

## 6.5 Biên độ mở rộng — SKU có còn được bán không?

Tỉ lệ còn bán ở hậu kỳ chênh **−7,2 điểm phần trăm** giữa hai nhóm. Vì giá chỉ quan sát được ở SKU còn bán, kết quả chính là so sánh theo `Z` **trong mẫu SKU có giá ở cả hai kỳ**, không đại diện cho toàn bộ cohort tiền kỳ.

Cách dựng cohort, bảng sống sót và cảnh báo collider nằm tại [Phụ lục D.4](phu-luc-ky-thuat.md#d4).

## 6.6 Biên độ tăng cường — sản lượng

Chênh lệch sản lượng ước lượng là **−20,6 điểm log ×100**, nhưng MDE là **31,5 điểm** và mẫu vẫn chịu chọn lọc sống sót. Vì vậy kết quả này chỉ dùng để khám phá, không được gọi là tác động chính sách.

Công thức chuẩn hóa, khoảng tin cậy và các câu cấm nằm tại [Phụ lục D.5](phu-luc-ky-thuat.md#d5).

## 6.7 Phạm vi của bất định

HC3 và bootstrap chỉ đo bất định giữa các SKU trong mẫu. Đồ án không đo được bất định ở cấp chính sách vì chỉ có **một cửa hàng, một ngày chính sách và một người ra quyết định giá**.

Kết luận chỉ áp dụng cho SKU còn bán ở cả hai kỳ tại cửa hàng này. Hai chẩn đoán bổ sung và giới hạn của chúng nằm tại [Phụ lục B.6](phu-luc-ky-thuat.md#b6).
