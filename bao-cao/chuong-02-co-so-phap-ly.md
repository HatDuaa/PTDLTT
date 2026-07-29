# Chương 2 — Cơ sở pháp lý

## 2.1 Chính sách được nghiên cứu

Nghị quyết 204/2025/QH15 tiếp tục giảm thuế GTGT từ **10% xuống 8%**, có hiệu lực từ **01/07/2025**. Trước đó, chính sách giảm thuế được thực hiện theo Nghị quyết 174/2024/QH15.

Hai nghị quyết không chỉ cho biết thời điểm áp dụng. Chúng còn cho biết mặt hàng nào được giảm và mặt hàng nào tiếp tục chịu thuế suất 10%. Đây là phần quan trọng để nhóm chia dữ liệu thành hai nhóm so sánh.

## 2.2 Mặt hàng được giảm và mặt hàng bị loại trừ

Trong phạm vi dữ liệu của cửa hàng, nhóm tập trung vào hai nhóm:

- Nhóm đủ điều kiện được giảm thuế theo Nghị quyết 204/2025/QH15.

- Nhóm hàng chịu thuế tiêu thụ đặc biệt, gồm rượu, bia và thuốc lá. Nhóm này bị loại trừ nên tiếp tục chịu thuế suất 10%.

Việc phân nhóm dựa trên quy định và loại sản phẩm, không dựa trên việc giá của mặt hàng đã tăng hay giảm. Cách này giúp nhóm không dùng chính kết quả giá để chọn nhóm so sánh.

## 2.3 Vì sao có thể dùng để so sánh?

Quyết định mặt hàng nào được giảm thuế do Quốc hội ban hành, không do cửa hàng lựa chọn. Vì vậy, trong cùng một cửa hàng và cùng khoảng thời gian, dữ liệu có sẵn một nhóm được chính sách cho giảm thuế và một nhóm không được giảm.

Đây là điểm giống một thí nghiệm tự nhiên. Nhóm có thể xem giá của hai nhóm thay đổi khác nhau thế nào sau ngày chính sách có hiệu lực. Tuy nhiên, cửa hàng có thể cập nhật thuế và giá không hoàn toàn giống quy định. Vì thế báo cáo tách **đủ điều kiện theo luật** khỏi **thuế suất cửa hàng thực áp**. Cách tách này được trình bày bằng lời và bảng ở [Chương 4.3](chuong-04-thiet-ke-nhan-qua.md#43-thiết-kế-thí-nghiệm-tự-nhiên-có-không-tuân-thủ).

## 2.4 Mốc chuyển hoàn toàn

Nếu giá chưa thuế của một mặt hàng không đổi, giá khách trả chỉ thay đổi do thuế suất. Khi đó:

`giá sau / giá trước = 1,08 / 1,10`

Do đó, mức thay đổi của giá khách trả là:

`1,08 / 1,10 - 1 = -1,82%`

**−1,82%** là mốc “chuyển hoàn toàn” được dùng suốt báo cáo. Nói đơn giản, nếu toàn bộ phần giảm thuế đi vào giá bán, người mua sẽ trả ít hơn khoảng mức này khi giá chưa thuế giữ nguyên.

Trong các mô hình ở [Chương 5](chuong-05-ket-qua.md), giá được tính theo log nên cùng mốc này được viết trên thang điểm log ×100. Hai cách viết khác thang đo nhưng cùng mô tả một thay đổi thuế.
