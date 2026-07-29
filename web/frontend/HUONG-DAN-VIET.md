# Hướng dẫn viết nội dung web

Tài liệu này ràng buộc cách viết cho toàn bộ trang. Đọc trước khi sửa bất kỳ trang nào.

## Người đọc

Giảng viên môn Phân tích dữ liệu và **ba sinh viên cùng nhóm**. Không phải người đọc tạp chí khoa học.

Chủ đồ án đã nói thẳng: *"toàn thông tin về toán và thống kê mà t không hiểu được"*. Đó là lỗi của trang web, không phải của người đọc.

## Nguyên tắc số một

> Mỗi khối số liệu phải kèm **một câu trả lời được câu hỏi "vậy nghĩa là sao"**.

Nếu một bảng hay biểu đồ đứng một mình mà không có câu dẫn, phần đó coi như **chưa viết xong**.

## Không được làm

- ❌ **Xóa thuật ngữ hay con số kỹ thuật.** Giảng viên cần thấy nhóm dùng đúng từ. Chỉ **thêm nghĩa**, không thay thế.
- ❌ **Gõ tay con số kết quả** vào mã nguồn. Mọi số phải đến từ API. Đây là nguyên tắc cứng của repo.
- ❌ Viết bất kỳ câu nào trong bảng "Không được viết" ở `bao-cao/chuong-05-ket-qua.md` mục 5.8.
- ❌ Bỏ nhãn `NhanVaiTro` hay các cảnh báo hậu kiểm đang có.
- ❌ Làm nhẹ đi kết luận. Mục tiêu là **dễ hiểu hơn**, không phải **dễ chịu hơn**.

## Cách viết — theo đúng thứ tự này

**1. Câu hỏi đời thường trước, số sau.**

> Nếu cửa hàng thật sự giảm giá theo thuế, giá mới của từng mặt hàng phải là bao nhiêu?

rồi mới tới bảng.

**2. Dịch thuật ngữ ngay tại chỗ**, trong ngoặc hoặc mệnh đề phụ:

> MDE — thay đổi nhỏ nhất mà dữ liệu đủ sức phát hiện

**3. Con số ở dạng dễ hình dung.**

| Đừng viết | Viết |
|---|---|
| 81,3% | cứ 100 mặt hàng thì khoảng 81 |
| 14%–36% mức chuyển hoàn toàn | chỉ khoảng một phần bảy đến hơn một phần ba |
| −20,6 điểm log ×100 | giảm khoảng 19% |

**4. Ví von khi khái niệm trừu tượng.** Ví von đã dùng và hiệu quả, dùng lại được:

- **Collider / chọn lọc sống sót** — muốn biết chiều cao trung bình cả trường nhưng chỉ đo được các em còn ở lại lớp bóng rổ. Số đo lệch không phải vì đo sai, mà vì chọn nhầm người để đo.
- **MDE** — cái cân vạch chia 1 kg. Cân được người tăng 3 kg, nhưng tăng 400 g thì cân báo "không đổi". Không phải họ không tăng, mà cân không đủ mịn.
- **Tín hiệu nhỏ, nhiễu lớn** — đo tiếng thì thầm: trong thư viện nghe rõ, giữa chợ thì không. Micro không hỏng, chợ ồn.

## Thành phần dùng sẵn — dùng, đừng tự chế

### `<DienGiai>` — `components/site/dien-giai.tsx`

Khối diễn giải đặt cạnh khối số. Ba kiểu:

```tsx
<DienGiai>Phần lớn mặt hàng giữ nguyên giá, nên người mua trả đúng số tiền cũ.</DienGiai>
<DienGiai kieu="vi-du">Giống như cái cân vạch chia 1 kg…</DienGiai>
<DienGiai kieu="canh-bao">Không kết luận được ngược lại rằng tác động bằng 0.</DienGiai>
```

Dùng `kieu="canh-bao"` **dè**. Nếu mọi khối đều cảnh báo thì không khối nào còn được chú ý.

### `<ThanhTiLe>` — `components/site/thanh-ti-le.tsx`

Thanh trực quan cho tỉ lệ "x trên n". Hợp với các tỉ lệ rất lệch (1/135, 110/135).

```tsx
<ThanhTiLe nhan="Đạt đúng mức giá dự kiến" tuSo={1} mauSo={135} noiBat
           ghiChu="Chỉ một mặt hàng trên 135 mặt hàng lẽ ra phải đổi giá." />
```

Truyền số **từ API**, không gõ tay.

## Minh họa

Ưu tiên thứ **giải thích được cơ chế**, không phải thứ trang trí:

- Thanh tỉ lệ cho các con số lệch
- Sơ đồ nhỏ khi có luồng hoặc hai nhánh (ví dụ: luật cho giảm → cửa hàng có cập nhật không → giá)
- Ví dụ một mặt hàng cụ thể chạy qua phép tính, thay vì công thức trần

Mọi minh họa phải có `aria-label` hoặc phần chữ tương đương. Biểu đồ đã có bảng số liệu thay thế — giữ nguyên.

## Độ dài

Ngắn hơn hiện tại. Một khối diễn giải **2–4 câu**. Nếu cần dài hơn thì tách ý hoặc đẩy chi tiết vào `<details>`.
