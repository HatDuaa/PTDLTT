# 01 — Review phương pháp

## 1. Những sửa đổi đã đúng

Hồ sơ mới đã sửa đúng các điểm quan trọng:

1. Không dùng hồi quy cắt ngang sau 1/7 làm một mô hình nhân quả.
2. Không né tên Difference-in-Differences.
3. Không dùng p-value lớn để kết luận tác động bằng 0.
4. Không suy diễn phần giảm thuế thành lợi nhuận của nhà bán lẻ.
5. Không dùng kết quả sau can thiệp để lựa chọn nhóm đối chứng.
6. Hạ causal discovery/mạng Bayes thành nội dung phụ.
7. Thừa nhận chỉ có ba tháng tiền kỳ có mã SKU và hai lead hữu dụng.

Đây là các thay đổi thực chất, không chỉ đổi cách diễn đạt.

## 2. Ngoại sinh của luật chưa đủ cho DiD

Luật quyết định SKU nào đổi thuế giúp loại trừ việc cửa hàng chủ động chọn treatment. Nhưng ATT của DiD vẫn cần:

> Nếu không có thay đổi thuế, mức thay đổi giá của nhóm hóa chất sẽ giống mức thay đổi giá của nhóm đối chứng.

Việc C10 và treated:

- cùng chịu 10% trước chính sách;
- có mức giá trung vị gần nhau;
- có tần suất đổi giá quan sát gần nhau;

chỉ hỗ trợ một phần. Nó không chứng minh parallel trends, đặc biệt khi chỉ có hai lead và giá rất thưa.

Phát biểu phù hợp:

> Không phát hiện bằng chứng về pre-trend khác biệt trong cửa sổ quan sát ngắn; kiểm định có sức mạnh thấp nên giả định parallel trends vẫn là hạn chế nhận dạng chính.

## 3. Nhóm đối chứng

Quyết định báo cáo song song C10 và C8 là hợp lý hơn việc tuyên bố một nhóm chắc chắn tốt.

Nên xác định trước:

- C10 là đối chứng chính theo logic cùng mức VAT ban đầu.
- C8 là đối chứng độ nhạy.
- Không đổi vai trò hai nhóm sau khi nhìn kết quả.

Cần thêm balance table chỉ dùng dữ liệu trước can thiệp:

- log giá;
- độ biến động giá;
- xác suất có bán trong tuần;
- số tuần có bán;
- tần suất đổi giá;
- xu hướng tuyến tính tiền kỳ;
- tỷ trọng đơn vị tính và `type`.

## 4. Estimand cần viết chính xác

Mẫu phân tích hiện chỉ gồm SKU:

1. có mã SKU;
2. quan sát được thuế trước và sau;
3. có giá bán trước và sau.

Vì vậy estimand thực tế không phải ATT của toàn bộ 156 SKU được giảm thuế, mà gần hơn với:

> ATT trên các SKU được giảm thuế còn bán và quan sát được giá ở cả hai giai đoạn.

Nếu treatment ảnh hưởng xác suất SKU tiếp tục được bán, việc điều kiện hóa vào “có bán sau chính sách” gây post-treatment selection.

Phải:

- so sánh tỷ lệ SKU rớt mẫu giữa T/C10/C8;
- mô hình hóa outcome tồn tại/không tồn tại;
- báo cáo estimand hẹp;
- chạy bounds hoặc sensitivity nếu attrition khác biệt đáng kể.

## 5. Kết luận pass-through

Cách phát biểu hiện tại là gần đúng:

> Ước lượng gần 0, KTC rộng; bác bỏ full pass-through nhưng chưa chứng minh tương đương 0.

Tuy nhiên con số cuối cùng phải được chạy lại sau khi sửa pipeline. Ngoài ra:

- Kiểm định `H0: ATT = -1,835%` là kiểm định điểm, không phải TOST.
- Equivalence test cần biên được định trước theo ý nghĩa thực tế, không chọn sau khi xem KTC.
- Pass-through là tỷ số nên nên bootstrap trực tiếp tỷ số hoặc biến đổi KTC cẩn thận.
- Nếu ATT dương, tỷ số pass-through âm không có nghĩa kinh tế “người bán giữ hơn 100%”; cần giải thích sign convention.

## 6. Hai mô hình

### Nếu giảng viên chấp nhận hai estimator

Khuyến nghị:

1. DiD/TWFE hoặc first-difference DiD không trọng số.
2. Doubly robust DiD hoặc weighted/matched DiD dựa hoàn toàn vào đặc trưng tiền kỳ.

Hai mô hình dùng chung conditional parallel trends nhưng khác cách mô hình hóa/cân bằng. Đây là phương án khả thi nhất với dữ liệu hiện có.

### Nếu giảng viên yêu cầu hai chiến lược nhận dạng

Dữ liệu hiện tại không có một chiến lược thứ hai đủ mạnh:

- ITS có quá ít thời điểm tiền kỳ và bị cú dời cửa hàng đe dọa.
- Monte Carlo làm tròn giá chỉ là kiểm tra cơ chế.
- PSM đứng riêng không xử lý cú sốc thời gian.
- RDD/IV/synthetic control không có điều kiện áp dụng.

Khi đó phải đổi/bổ sung dữ liệu hoặc đổi câu hỏi, không nên “đổi tên” một robustness check thành mô hình nhân quả.

## 7. Nội dung phụ

Mạng Bayes, Berkson/Simpson và mô phỏng làm tròn có thể để:

- phụ lục;
- một mục ngắn về liên đới khác nhân quả;
- kiểm tra cơ chế thay thế.

Không nên để chúng cạnh tranh dung lượng với identification, missingness, pre-trend và robustness của bài VAT.

