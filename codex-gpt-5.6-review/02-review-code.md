# 02 — Review mã nguồn

## P0 — Phải sửa trước khi tin kết quả

### 1. “Hiệp biến tiền kỳ” đang lấy cả dữ liệu hậu can thiệp

Trong `code/03-hai-mo-hinh-uoc-luong.py`:

```python
cov=d.groupby('sku').agg(
    pre_p=('pg', lambda s: s.median()),
    nq=('soluong_ct', 'sum')
)
```

`d` gồm cả trước và sau 01/07. Do đó `pre_p` không phải giá tiền kỳ và `nq` cũng chứa sản lượng hậu can thiệp. Đặc tả:

```python
dlpg ~ T + C(type) + lpre + lnq
```

đang điều chỉnh theo biến có thể bị treatment tác động.

**Sửa:** tạo covariates chỉ từ `d[~d.post]`; đặt tên rõ `pre_log_price`, `pre_quantity`, `pre_sales_weeks`, `pre_price_change_frequency`.

### 2. Event study hiện không có SKU fixed effects

Trong `code/05-pretrend-phanphoi-tost.py`, mô hình:

```python
y ~ C(thang, Treatment('2025-06')) * T
```

không có `C(sku)`. `p0` lại là median giá của SKU trên toàn bộ mẫu, gồm cả hậu can thiệp:

```python
base=d.groupby(['sku','grp'])['pg'].median()
```

Đây không phải event study DiD chuẩn và có thể bị thay đổi cơ cấu SKU quan sát theo tháng chi phối.

**Sửa một trong hai cách:**

1. Panel:

```python
log_price ~ C(sku) + C(month) + T:C(month)
```

với sai số chuẩn cụm theo SKU; hoặc

2. Tính thay đổi của từng SKU so với tháng 06, sau đó so sánh T/C trên tập SKU có quan sát ở cả tháng đích và tháng 06.

Phải báo cáo số SKU góp vào từng hệ số.

### 3. Conditioning vào việc có bán sau chính sách

Các script xác định nhóm và outcome bằng:

```python
groupby(['sku','post']).unstack().dropna()
pivot_table(...).dropna()
```

Điều này chỉ giữ SKU xuất hiện cả trước và sau. Nếu treatment ảnh hưởng việc còn được bán, đây là selection hậu can thiệp.

**Sửa/kiểm tra:**

- Xác định danh mục eligible độc lập từ thông tin pháp lý/tax code tiền kỳ nếu có thể.
- Lập flowchart attrition theo nhóm.
- So sánh xác suất còn bán sau treatment.
- Ghi rõ estimand conditional-on-survival nếu không khắc phục được.

### 4. Nhóm treatment được suy ra từ chính thay đổi thuế quan sát

Treatment hiện được định nghĩa bằng mode VAT trước/sau:

```python
(tab[False] == 10) & (tab[True] == 8)
```

Điều này mô tả treatment thực nhận, nhưng:

- loại mọi SKU treated không bán sau 1/7;
- có thể phân loại sai khi dữ liệu thuế có lỗi;
- chưa xác minh độc lập SKU thuộc phụ lục pháp lý.

**Sửa:** tạo bảng mapping SKU → nhóm pháp lý/eligibility và đối chiếu với thuế thực nhận. Nếu không có mã ngành/HS, phải nói đây là phân tích treatment-on-the-treated trên SKU quan sát được, không phải toàn bộ nhóm eligible.

## P1 — Có khả năng làm sai suy luận

### 5. Quy tắc lọc không nhất quán giữa các script

`02b-danh-muc-va-sai-phan.py` chưa lọc `daxoa == '0'` và chưa lọc đầy đủ giá dương, trong khi `03`–`06` có lọc. Đây là nguyên nhân tiềm năng của 158 so với 156 SKU.

**Sửa:** một hàm `load_clean_data()` duy nhất được mọi script import.

### 6. Kết luận `daxoa=2` là bản ghi trùng còn quá chắc

Chỉ 1.589/3.917 hóa đơn trùng `hoadon_so`. Dữ liệu cho thấy đây là một batch BOT bị đánh dấu xóa và có dấu hiệu duplicate, nhưng chưa đủ chứng minh toàn bộ 3.917 bản ghi là nạp hai lần.

**Sửa cách viết:**

> Các bản ghi `daxoa=2` là batch BOT đã bị hệ thống đánh dấu xóa; một phần lớn trùng số hóa đơn với bản ghi hợp lệ. Theo semantics của cờ xóa, nghiên cứu loại chúng. Nguyên nhân nghiệp vụ chính xác cần xác nhận với chủ dữ liệu.

### 7. Panel sản lượng tự xác định “vòng đời” từ lần bán đầu/cuối

Trong `04-placebo-hoanvi-sanluong.py`, số 0 chỉ được điền từ tuần bán đầu tới tuần bán cuối quan sát được. Cả hai endpoint có thể bị treatment tác động.

Điều này bỏ các tuần 0 trước lần bán đầu hoặc sau lần bán cuối, làm outcome phụ khó diễn giải.

**Sửa:** định nghĩa risk set/danh mục active bằng quy tắc tiền kỳ độc lập; tạo panel cân bằng cho SKU thuộc danh mục, hoặc trình bày rõ đây chỉ là intensive-margin conditional panel.

### 8. Logistic “biên mở rộng” thiếu SKU fixed effects

Mô hình:

```python
sold ~ TP + C(grp) + C(w)
```

không kiểm soát dị biệt cố hữu theo SKU. `C(grp)` không thay thế `C(sku)`.

**Sửa:** cân nhắc linear probability model với SKU + week FE và cluster SKU; conditional logit có thể làm rớt SKU không đổi trạng thái.

### 9. Hoán vị treatment cần giả định exchangeability

Permutation toàn bộ nhãn T/C hợp lệ khi các đơn vị exchangeable dưới null. Hai nhóm sản phẩm khác loại và có phương sai khác nhau có thể vi phạm điều này.

**Sửa:** permutation theo strata tiền kỳ hoặc dùng wild cluster bootstrap/robust inference; mô tả rõ null và điều kiện exchangeability.

## P2 — Tái lập và vệ sinh dự án

### 10. README liên kết file chưa tồn tại

Các file `04`–`08` trong mục lục chưa có. Cần tạo hoặc xóa link.

### 11. Script chuyển XLSX dùng đường dẫn tuyệt đối

`00-xlsx-to-csv.py` hard-code:

```python
src = r"C:\Users\loocn\Documents\github\PTDLTT\60.xlsx"
```

Trong khi README nói dùng đường dẫn tương đối.

**Sửa:** dùng `pathlib.Path(__file__)` để resolve `../../60.xlsx`.

### 12. Không có environment/requirements và output artifact

Cần:

- `requirements.txt` hoặc `pyproject.toml`;
- thư mục `data/processed`;
- thư mục `outputs/tables`, `outputs/figures`;
- random seed tập trung;
- script pipeline duy nhất;
- bảng sample-flow tự sinh.

### 13. Sai số chuẩn và trọng số

First-difference cấp SKU đang dùng HC3, hợp lý hơn dùng từng dòng giao dịch. Tuy nhiên cần cân nhắc estimand:

- mỗi SKU trọng số bằng nhau; hay
- trọng số theo doanh số/sản lượng tiền kỳ.

Hai estimand trả lời hai câu hỏi khác nhau. Không được chọn trọng số theo kết quả đẹp.

