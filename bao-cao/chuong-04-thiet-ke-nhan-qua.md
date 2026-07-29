# Chương 4 — Thiết kế nhân quả

> Mọi con số trong chương này sinh từ [đặc tả khóa](../plans/2026-07-23-thue-gtgt-passthrough/dac-ta-khoa.md).

## 4.1 Đồ án bắt đầu từ đúng chỗ giáo trình dừng lại

Chương 8.6 của giáo trình định nghĩa ATE, trình bày cách ước lượng nó bằng thử nghiệm ngẫu nhiên có đối chứng, rồi dừng ở câu:

> *"Để ước lượng ATE trong các tình huống không thể thực hiện RCT, chúng ta cần các điều kiện bổ sung."*

Đồ án này bắt đầu từ đúng chỗ đó: chỉ ra **các điều kiện bổ sung ấy là gì**, và áp dụng **hai phương pháp ước lượng khác nhau** dưới cùng bộ điều kiện.

## 4.2 Câu hỏi nghiên cứu

> Việc giảm thuế GTGT từ 10% xuống 8% ngày 01/07/2025 có làm giảm giá bán lẻ mà người tiêu dùng thực trả không?

Cần phân biệt ba đại lượng thường bị gộp:

| | Ý nghĩa |
|---|---|
| **Giá chưa thuế** | Doanh thu về tay cửa hàng |
| **Quyết định định giá** | Cửa hàng chọn niêm yết bao nhiêu |
| **Giá gồm thuế** | Số tiền người tiêu dùng thực trả |

Chính sách tác động trực tiếp lên thuế suất. Việc nó có tới được **giá gồm thuế** hay không phụ thuộc quyết định định giá của cửa hàng. Đó là nội dung của khái niệm **pass-through**.

## 4.3 Thiết kế: thí nghiệm tự nhiên **có không tuân thủ**

Nghị quyết 204/2025/QH15 bỏ "sản phẩm hóa chất" khỏi danh mục loại trừ giảm thuế. Hàng chịu **thuế tiêu thụ đặc biệt** — rượu, bia, thuốc lá — bị loại trừ ở **cả hai** nghị quyết, nên giữ 10% suốt kỳ.

Đây là nguồn biến thiên ngoại sinh: quyết định do Quốc hội ban hành, không do cửa hàng.

**Nhưng dữ liệu cho thấy việc thực thi không hoàn hảo.** Phải tách hai đại lượng:

| | Định nghĩa | Do ai quyết định |
|---|---|---|
| **`Z`** | Đủ điều kiện giảm thuế **theo luật** | Quốc hội + loại sản phẩm |
| **`D`** | Thuế suất cửa hàng **thực áp** ở hậu kỳ | **Cửa hàng** |

| | Số SKU |
|---|---|
| `Z=1` — luật cho giảm | **155** |
| ↳ cửa hàng **đã** cập nhật (`D=1`) | 135 |
| ↳ cửa hàng **không** cập nhật (`D=0`) | **20** |
| **Tỉ lệ tuân thủ** | **87,1%** |
| `Z=0` — luật loại trừ (thuế TTĐB) | **132** |
| ↳ bị áp 8% trái luật | **0** |

20 SKU không tuân thủ là hàng hóa chất thật: COLGATE kem đánh răng, Garnier sữa rửa mặt, Gillette lưỡi dao cạo, mặt nạ Banobagi, BIORE lột mụn. Bằng chứng rõ nhất là **cùng dòng sản phẩm nằm ở hai nhóm khác nhau**: `Gillette Lưỡi Dao Cạo Mach 3 Clean` giữ 10%, trong khi `Gillette Dao cạo Mach 3 Clean` và 5 dao cạo Gillette khác chuyển sang 8%. Không có cách giải thích nào bằng luật.

⇒ Nếu chỉ so sánh theo `D`, ta đang **điều kiện hóa trên một quyết định vận hành của cửa hàng**, không phải trên luật.

## 4.4 Đơn vị phân tích và phạm vi suy rộng

| | |
|---|---|
| Đơn vị | **SKU** (mã vạch), sai phân trước–sau |
| Ước lượng đích | **ATT** — tác động lên chính nhóm được giảm thuế |
| Tổng thể đại diện | 155 SKU đủ điều kiện, có bán ở **cả** hai kỳ, tại **một** cửa hàng tiện lợi TP.HCM |

⚠️ **Không được ngoại suy ra ngành bán lẻ Việt Nam.** Một cửa hàng, một ngày chính sách, một người ra quyết định giá.

## 4.5 Đồ thị nhân quả

Đồ thị cho thấy ba rủi ro chính: đặc tính SKU khác nhau giữa hai nhóm, quyết định cập nhật thuế của cửa hàng, và việc mẫu chỉ giữ SKU còn bán ở cả hai kỳ. Vì vậy nhóm chỉ điều chỉnh bằng các biến tiền kỳ và không điều chỉnh cho `D`, nhóm quan sát hay trạng thái sống sót.

Toàn bộ đồ thị, bốn đường cần đọc và bảng backdoor được giữ tại [Phụ lục A.1](phu-luc-ky-thuat.md#a1).

## 4.6 Khung Kết quả tiềm năng

Mỗi SKU chỉ cho thấy giá dưới trạng thái thực tế, nên giá trong trạng thái còn lại phải được ước lượng. Cả PP1 và PP2 đều cần giả định rằng nếu không có chính sách, xu hướng giá của hai nhóm sẽ song song sau khi đã điều chỉnh.

Ký hiệu Kết quả tiềm năng và bảng đánh giá đầy đủ các giả định nằm tại [Phụ lục B.1](phu-luc-ky-thuat.md#b1).

## 4.7 Hai phương pháp — và điều chúng KHÔNG chứng minh được

| | Phương pháp 1 | Phương pháp 2 |
|---|---|---|
| Tên | Hồi quy ước lượng ATT | Phân tầng theo khung Kết quả tiềm năng |
| Neo giáo trình | Chương 9, 10 | Chương 8.4 (Simpson), 8.6 (ATE) |

🔴 **Cả hai dùng chung MỘT chiến lược nhận dạng: xu hướng song song.**

> Hai phương pháp cho kết quả tương tự **không** xác nhận quan hệ nhân quả. Cả hai cùng dựa trên giả định xu hướng song song; nếu giả định này sai, **cả hai cùng sai theo cùng một hướng**.

Dữ liệu này chỉ hỗ trợ một chiến lược nhận dạng: không có ngưỡng hồi quy gián đoạn, chỉ một cửa hàng. Khung Wald dùng `Z` theo kiểu công cụ, nhưng `Z` chỉ hợp lệ nếu **đã có** xu hướng song song theo `Z` — nó **nằm trong** cùng chiến lược, không độc lập với nó.

## 4.8 Nghịch lý Simpson và lý do phân tầng

PP2 so sánh trong từng tầng giá để tránh việc cơ cấu giá khác nhau che mất xu hướng bên trong. Tuy vậy, phân tầng theo giá không làm hai nhóm cân bằng về sản lượng và tần suất bán.

Vì vậy cả PP1 và PP2 chỉ được trình bày là **so sánh có điều chỉnh**, không phải ước lượng nhân quả sạch. Giải thích Simpson, các phương án phân tầng đã thử và bảng cân bằng đầy đủ nằm tại [Phụ lục A.2](phu-luc-ky-thuat.md#a2).
