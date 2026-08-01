# Ôn tập — Phân tích dữ liệu thông minh

Soạn từ book của thầy: <https://lenbui.github.io/bookda/>

Thư mục này là **tài liệu ôn thi cá nhân**, không thuộc đồ án. Xoá hoặc bỏ khỏi
gói nộp cũng được, không có gì trong `code/`, `web/`, `bao-cao/` phụ thuộc vào nó.

Công thức viết bằng `$...$` nên xem đẹp nhất trên GitHub hoặc VS Code preview
(`Ctrl+Shift+V`).

## Đối chiếu danh sách ôn với book

| Chủ đề cần ôn | Chương | File |
|---|---|---|
| Mô tả dữ liệu, phương sai, độ lệch chuẩn, Pearson vs Spearman | 3 | [01](01-mo-ta-du-lieu.md) |
| Cơ sở suy diễn, khoảng tin cậy | 5 | [02](02-khoang-tin-cay.md) |
| Kiểm định giả thuyết, miền bác bỏ | 6 | [03](03-kiem-dinh-gia-thuyet.md) |
| Mô hình đồ thị, confounder / mediator / collider | 7 | [04](04-mo-hinh-do-thi.md) |
| Phân tích nhân quả | 8 | [05](05-phan-tich-nhan-qua.md) |
| Hồi quy tuyến tính | 9 | [06](06-hoi-quy-tuyen-tinh.md) |
| Hồi quy đa biến (+ logistic) | 10 | [07](07-hoi-quy-da-bien.md) |
| Monte Carlo | 11 | [08](08-monte-carlo.md) |
| — | — | [Bảng tra công thức 1 trang](09-bang-tra.md) |

Chương 1, 2, 4 (giới thiệu, thu thập dữ liệu, phương pháp nghiên cứu) không nằm
trong danh sách — thường ra dạng lý thuyết ngắn, không tính toán.

## Ba chỗ book KHÔNG có mà vẫn nên biết

**1. Khoảng tin cậy cho trung bình.** Chương 5 chỉ dựng CI cho tỉ lệ $\hat p$,
không hề nhắc phân phối $t$. Nhưng chương 6 dùng $t$ cho trung bình liên tục, và
CI với kiểm định là hai mặt của một đồng xu. Công thức bổ sung nằm trong
[file 02](02-khoang-tin-cay.md), có đánh dấu rõ là phần thêm.

**2. Backdoor / do-operator / propensity score.** Chương 8 dừng ở ATE và RCT.
Không có `do(·)`, không có công thức điều chỉnh, không có điểm xu hướng. Phần này
để trong [file 05](05-phan-tich-nhan-qua.md) ở mục riêng đánh dấu "ngoài book" —
dùng để trả lời vấn đáp đồ án, đừng mất thời gian nếu chỉ ôn thi.

**3. Định nghĩa vai trò biến.** Chương 7 dạy 3 cấu trúc chain / fork / collider
rồi để người đọc tự suy ra confounder là gì, mediator là gì. Đề thi thì hỏi thẳng
tên gọi. [File 04](04-mo-hinh-do-thi.md) gắn tên vào từng cấu trúc.

## Thứ tự ôn đề nghị

Xếp theo *tỉ lệ điểm trên thời gian bỏ ra*, không theo số chương.

1. **[03] Kiểm định** — nặng nhất. Chương 6.2 là một bảng gồm khoảng 8 loại kiểm
   định; đề gần như chắc chắn rút từ đó. Học thuộc bảng chọn công thức trước, hiểu
   sau.
2. **[06] Hồi quy tuyến tính** — bài tập tính tay rất mẫu mực, gần như chỉ có một
   dạng. Được điểm nhanh.
3. **[02] Khoảng tin cậy** — ngắn, và dùng lại đúng bộ $z^*$ của bài kiểm định.
   Ôn chung với [03] cho tiết kiệm.
4. **[04] Mô hình đồ thị** — không cần tính toán, chỉ cần đọc đúng đồ thị. Rẻ điểm
   nhất nếu nắm được quy tắc chặn đường.
5. **[01] Mô tả dữ liệu** — công thức dễ, bẫy nằm ở $n-1$ và ở chỗ chọn Pearson
   hay Spearman.
6. **[07] Hồi quy đa biến** — phần logistic nhiều công thức nhưng chỉ cần thay số.
7. **[08] Monte Carlo** — thiên về mô tả thuật toán hơn là tính tay.
8. **[05] Nhân quả** — chương ngắn nhất, chủ yếu khái niệm và nghịch lý.

## Ba con số phải thuộc lòng

| Ký hiệu | Giá trị | Dùng khi |
|---|---|---|
| $z_{0{,}025}$ | **1,96** | CI 95%, kiểm định hai phía $\alpha = 0{,}05$ |
| $z_{0{,}05}$ | **1,645** | CI 90%, kiểm định một phía $\alpha = 0{,}05$ |
| $z_{0{,}005}$ | **2,576** | CI 99%, kiểm định hai phía $\alpha = 0{,}01$ |

Thiếu bảng tra thì ba số này gỡ được phần lớn bài.
