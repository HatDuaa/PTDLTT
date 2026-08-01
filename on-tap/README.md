# Ôn tập — Phân tích dữ liệu thông minh

Soạn từ book của thầy: <https://lenbui.github.io/bookda/>

Thư mục này là **tài liệu ôn thi cá nhân**, không thuộc đồ án. Xoá hoặc bỏ khỏi
gói nộp cũng được, không có gì trong `code/`, `web/`, `bao-cao/` phụ thuộc vào nó.

Công thức viết bằng `$...$` nên xem đẹp nhất trên GitHub hoặc VS Code preview
(`Ctrl+Shift+V`).

> **Quy tắc khi sửa: không đặt chữ Việt vào trong công thức.**
>
> KaTeX chỉ nhận ký tự thuộc bảng mã Latin-1, nên `\text{trên}` thì render được
> (ê là Latin-1) nhưng `\text{dưới}`, `\text{nghèo}`, `\text{thể tích}` thì hỏng —
> ư, ơ, đ, ă và mọi chữ có dấu thanh đều nằm ngoài Latin-1. Gặp phải, KaTeX trả về
> `undefined`, và vì việc ghép cặp hai dấu đô-la bị lệch nên **công thức ngay sau
> đó cũng hỏng theo** dù bản thân nó không có lỗi gì.
>
> Cách viết đúng: để ký hiệu trong công thức, để chữ Việt ở câu văn quanh nó.
> Ví dụ dùng $\hat y = 64{,}68 - 0{,}62\,x$ rồi chú thích $y$, $x$ là gì bên ngoài,
> thay vì nhét tên biến tiếng Việt vào `\text{}`.

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

## Bản LaTeX gọn — in ra PDF

[`tex/on-tap.tex`](tex/on-tap.tex) là bản **rút gọn của cả 9 file trên**, gộp vào
một tài liệu duy nhất: công thức, bẫy, và bài giải mẫu, bỏ phần tự kiểm tra và
các đoạn dẫn dài.

Máy chưa cài LaTeX nên phải compile trên Overleaf, giống lúc làm báo cáo:

1. Vào Overleaf, tạo project trống.
2. Upload **mỗi một file** `tex/on-tap.tex` — không cần hình, không cần file phụ.
3. Compile hai lần cho mục lục hiện đúng.

Preamble lấy nguyên từ `bao-cao/tex/main.tex` (bộ `T5` + `vietnamese` đã compile
thành công), nên không phải dò lại lỗi font tiếng Việt.

Khác biệt đáng nói giữa hai bản: trong LaTeX thì chữ Việt đặt trong `\text{}`
**chạy được** — báo cáo đang dùng như vậy ở 29 chỗ. Hạn chế nêu ở khung trên chỉ
áp cho KaTeX, tức bản Markdown.

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
