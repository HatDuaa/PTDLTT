# 04 — Addendum sau khi đọc bản hoàn chỉnh

## Kết luận

Bản tài liệu hoàn chỉnh trung thực hơn đáng kể và đã tự ghi nhận survivorship, pre-trend yếu,
giới hạn khái quát hóa và cặp mô hình chưa chốt. Có thể dùng nó làm hồ sơ brainstorm.

Tuy nhiên, **chưa được dùng các bảng trong `04-ket-qua-uoc-luong.md` làm kết quả cuối** cho
tới khi sửa các lỗi code P0 trong `02-review-code.md`.

## Những điểm bản hoàn chỉnh đã xử lý tốt

- Đã bổ sung đủ tài liệu `04`–`08`.
- Đã ghi rõ các con số chỉ là chạy thử.
- Đã rút lại việc chọn control bằng outcome.
- Đã mô tả survivorship và nhóm SKU bị loại.
- Đã ghi đúng giới hạn của p-value pre-trend.
- Đã tách Monte Carlo làm tròn khỏi mô hình nhân quả.
- Đã để ngỏ cặp mô hình chờ giảng viên.

## Những điểm vẫn phải sửa

### 1. Event study trong tài liệu vẫn dựa trên code không có SKU FE

Bảng event study ở `04 §3.2` chưa thể dùng làm bằng chứng pre-trend. Việc tài liệu diễn giải
thận trọng không sửa được đặc tả sai trong code.

### 2. ATT “+ hiệp biến” đang dùng biến hậu can thiệp

Bảng `04 §2` báo cáo đặc tả `log giá nền, log sản lượng nền`, nhưng code lấy median giá và
tổng lượng trên toàn bộ `d`, gồm cả hậu kỳ. Phải bỏ dòng kết quả này cho đến khi chạy lại bằng
covariates chỉ từ trước 01/07.

### 3. TOST đang bị gọi tên không chính xác

Code thực hiện:

- kiểm định điểm `H0: ATT = -1,835%`;
- kiểm tra KTC có nằm trong biên ±0,5%.

Đây chưa phải một implementation TOST đầy đủ được báo cáo bằng hai kiểm định một phía.
Nên đổi nhãn hoặc cài TOST đúng, với biên tương đương định trước.

### 4. MDE 87% và bootstrap chưa có code tái lập

Không tìm thấy phép tính MDE/đường cong power hoặc bootstrap trong 14 script hiện có. Tài liệu
ghi “đã có”, nhưng package chưa tái lập được con số đó. Phải thêm script hoặc hạ trạng thái
thành “con số tạm thời/chưa tái lập”.

### 5. `daxoa=2` chưa được “giải mã” dứt điểm

Dữ liệu đủ để nói batch BOT đã bị hệ thống đánh dấu xóa và có dấu hiệu trùng. Chỉ 1.589/3.917
trùng `hoadon_so`, nên chưa đủ để kết luận toàn bộ 3.917 hóa đơn được nạp hai lần nếu chưa có
xác nhận nghiệp vụ.

Loại `daxoa=2` vẫn hợp lý vì semantics của cờ xóa; lý do nên được viết thận trọng.

### 6. Placebo tại mốc dời cửa hàng không “loại bỏ” đe dọa

`p=0,580` chỉ là không phát hiện phân kỳ trong một kiểm định có power chưa rõ. Trong `04 §3.1`
vẫn có câu “mối đe dọa ... bị loại bằng thực nghiệm”. Đổi thành:

> Không phát hiện phân kỳ giá tại mốc dời cửa hàng; kết quả làm giảm bớt, nhưng không loại bỏ,
> lo ngại về cú sốc địa điểm.

### 7. Câu “phần giảm VAT không được phản ánh vào giá” vẫn hơi tuyệt đối

Vì KTC ATT là khoảng `[-1,081%; +1,103%]`, dữ liệu vẫn tương thích với một phần pass-through
đáng kể. Câu an toàn hơn:

> Điểm ước lượng cho thấy rất ít phản ánh vào giá, nhưng KTC còn tương thích với mức chuyển
> một phần; nghiên cứu bác bỏ full pass-through trong đặc tả hiện tại.

### 8. Mô phỏng làm tròn chưa bác bỏ toàn bộ “menu cost”

Mô phỏng chỉ bác bỏ các quy tắc làm tròn 500/1.000 đồng đã giả định. Menu cost còn có thể gồm
chi phí cập nhật hệ thống, bảng giá, phối hợp nhà cung cấp hoặc chính sách giá thống nhất.
Không nên đồng nhất “làm tròn” với toàn bộ menu cost.

## Trả lời năm câu hỏi mở của agent nguồn

1. **Có bỏ sót mô hình thứ hai không?** Không thấy chiến lược nhận dạng thứ hai đủ mạnh trong
   bộ dữ liệu hiện tại. Chờ giảng viên; nếu hai estimator được chấp nhận, dùng DiD và doubly
   robust/weighted DiD.
2. **Placebo 1/5 p=0,061?** Không xử lý như một ngưỡng đặc biệt. Báo cáo hệ số/KTC, kiểm tra
   multiple placebo và dữ liệu tháng 5; xem nó là tín hiệu về độ bất ổn của pre-trend.
3. **Survivorship?** Không chọn một ngưỡng tối ưu sau khi xem kết quả. Đặc tả chính nên dùng
   điều kiện tối thiểu được định trước; báo cáo toàn bộ sensitivity grid và estimand của từng mẫu.
4. **Simpson?** Không cần cố tìm. Nếu không có phân tầng có ý nghĩa miền và đủ mẫu, bỏ phần này
   thay vì data dredging.
5. **Ba tháng tiền kỳ có đủ không?** Đủ cho đồ án khám phá nếu giảng viên chấp nhận và nhóm
   trình bày hạn chế; không đủ để gọi thiết kế là bằng chứng nhân quả mạnh.

