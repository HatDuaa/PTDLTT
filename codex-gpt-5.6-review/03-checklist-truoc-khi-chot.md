# 03 — Checklist trước khi chốt báo cáo

## Cổng 1 — Hỏi giảng viên

- [ ] DiD có được phép dù ngoài slide?
- [ ] DiD và weighted/matched DiD có được tính là hai mô hình?
- [ ] Nếu không, xác nhận phải dùng hai chiến lược nhận dạng khác nhau.

Không tiếp tục “sáng tạo” mô hình thứ hai trước khi có câu trả lời.

## Cổng 2 — Một pipeline dữ liệu duy nhất

- [ ] Tạo `load_clean_data()`.
- [ ] Thống nhất filter `THUE_BANRA`, `daxoa=0`, ngày, lượng dương, giá dương, mã SKU.
- [ ] Tự sinh bảng sample flow.
- [ ] Xác nhận nghiệp vụ của `daxoa=2`.
- [ ] Tạo mapping eligibility/tax group độc lập tối đa có thể.

## Cổng 3 — Sửa mô hình

- [ ] Mọi covariate chỉ lấy từ tiền kỳ.
- [ ] Event study có SKU FE và month/week FE.
- [ ] Báo cáo số SKU quan sát ở từng event time.
- [ ] Kiểm tra differential attrition/survival.
- [ ] Chạy C10 và C8 theo protocol định trước.
- [ ] Cluster SE theo SKU cho panel.
- [ ] Bootstrap KTC pass-through.

## Cổng 4 — Kiểm tra độ nhạy

- [ ] Mean, median và modal unit price theo SKU.
- [ ] Cửa sổ hẹp chỉ địa điểm mới.
- [ ] Loại SKU có đơn vị tính/giá bất thường.
- [ ] Equal-weight ATT và trọng số theo quy mô tiền kỳ.
- [ ] Balanced panel subset.
- [ ] Placebo date với diễn giải “không phát hiện”, không viết “đạt”.

## Cổng 5 — Cách viết kết luận

Được viết:

> Điểm ước lượng cho thấy giá thanh toán thay đổi rất ít tương đối với nhóm đối chứng. Trong đặc tả chính, nghiên cứu bác bỏ giả thuyết chuyển hoàn toàn phần giảm VAT vào giá, nhưng KTC còn rộng nên chưa chứng minh pass-through bằng hoặc tương đương 0.

Không được viết:

- “Chính sách không đến tay người tiêu dùng đồng nào.”
- “Nhà bán lẻ giữ trọn lợi ích.”
- “Pre-trend đạt.”
- “Placebo loại bỏ hoàn toàn mối đe dọa.”
- “Hai p-value lớn chứng minh hai nhóm giống nhau.”

## Cổng 6 — Tái lập

- [ ] `requirements.txt`.
- [ ] Không hard-code đường dẫn máy cá nhân.
- [ ] Một lệnh chạy toàn pipeline.
- [ ] Mọi bảng trong báo cáo được sinh từ code.
- [ ] README không có link chết.
- [ ] Lưu log phiên bản dữ liệu và hash của `60.xlsx`.

