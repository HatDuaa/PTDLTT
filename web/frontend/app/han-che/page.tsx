"use client";

/**
 * Trang Hạn chế — tổng hợp mọi hạn chế của đồ án và danh sách câu cấm viết. Nội
 * dung bảng "câu cấm" là hướng dẫn phương pháp luận (lý do không được viết), không
 * phải số liệu kết quả — không cần nguồn API.
 */
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Nội dung bên dưới là hướng dẫn phương pháp luận (câu cấm viết và lý do), không
// phải số liệu kết quả — cố ý viết dạng định tính, không lặp lại con số cụ thể đã
// hiển thị (có nguồn API) ở các trang khác, để trang này không tự nó trở thành một
// nguồn số liệu thứ hai.
const DUNG_VUNG = [
  "Trong số SKU đủ điều kiện đã phân loại, cửa hàng cập nhật phần lớn nhưng không phải tất cả — có không tuân thủ quan sát được (xem trang Thiết kế).",
  "Nhóm đủ điều kiện bán ít và thưa hơn rõ rệt so với nhóm thuế tiêu thụ đặc biệt; điều chỉnh theo năm phân vị giá không tạo được cân bằng cục bộ.",
  "Chênh lệch quan sát dao động trong khoảng âm nhỏ tùy phương pháp và biến thể; mọi khoảng tin cậy đều chứa 0 (xem trang Kết quả).",
  "Kết luận ổn định qua bốn cửa sổ thời gian, ba cách xử lý SKU chưa phân loại, và hai cách xử lý SKU hòa VAT (xem lưới độ nhạy ở trang Kết quả).",
  "Dữ liệu là minh họa có giá trị về không tuân thủ, ô nhiễm nhóm đối chứng và giới hạn của thí nghiệm tự nhiên thực địa.",
];

const CAU_CAM = [
  { cau: "“Nghị quyết không làm giảm giá” / “tác động bằng 0”", lyDo: "Không bác bỏ ≠ bằng 0. TOST thất bại ở mọi biên." },
  { cau: "“Cửa hàng giữ lại phần giảm thuế”", lyDo: "Không có dữ liệu chi phí đầu vào." },
  { cau: "“Pass-through bằng 0”", lyDo: "TOST thất bại." },
  { cau: "“Bác bỏ chuyển hoàn toàn” (như kết luận chính)", lyDo: "Phụ thuộc phương pháp — g-computation không bác bỏ." },
  { cau: "“Hai phương pháp xác nhận lẫn nhau”", lyDo: "Chung một chiến lược nhận dạng." },
  { cau: "“Xu hướng song song đã đạt / đã được chứng minh”", lyDo: "Cổng 3 không đạt; cổng 1 trượt." },
  { cau: "“Đã xử lý ngụy lặp”", lyDo: "Một cửa hàng, một ngày chính sách." },
  { cau: "Ngoại suy ra cửa hàng khác / ngành bán lẻ Việt Nam", lyDo: "Một cửa hàng." },
  { cau: "Gọi kết quả là “ITT” mà không kèm điều kiện mẫu", lyDo: "Mẫu đã điều kiện hóa sống sót — chênh lệch tỉ lệ sống sót giữa hai nhóm xem ở trang Sức mạnh & cơ chế." },
  { cau: "“TOST thất bại ⇒ pass-through khác 0”", lyDo: "Biên quá hẹp so với độ chính xác dữ liệu." },
  { cau: "Dùng p-value của nhánh sản lượng như “suýt có ý nghĩa”", lyDo: "MDE của nhánh này lớn hơn nhiều so với ước lượng điểm — thiết kế không đủ lực (xem trang Sức mạnh & cơ chế)." },
  { cau: "Đặt tỉ lệ đổi mức trong mô phỏng làm tròn cạnh tỉ lệ tuân thủ thuế", lyDo: "Hai con số có thể trùng ngẫu nhiên nhưng đến từ hai tập SKU hoàn toàn khác nhau." },
];

const BAY_TRINH_BAY = [
  { bay: "Dùng p-value của nhánh sản lượng như “suýt có ý nghĩa”", vi_sao: "MDE của nhánh sản lượng lớn hơn nhiều so với ước lượng điểm" },
  { bay: "Gọi kết quả là “ITT” mà không kèm điều kiện mẫu", vi_sao: "Đã điều kiện hóa sống sót" },
  { bay: "Dùng cổng 2 đạt để tuyên bố xu hướng song song", vi_sao: "Ba cổng không phải ba lá phiếu" },
  { bay: "Gọi chênh lệch tỉ lệ sống sót là “tác động gây ngừng bán”", vi_sao: "KTC chứa 0; nhóm Z=1 vốn bán thưa hơn từ đầu" },
  { bay: "Đặt tỉ lệ đổi mức (mô phỏng làm tròn) cạnh tỉ lệ tuân thủ thuế", vi_sao: "Trùng ngẫu nhiên có thể xảy ra — một là làm tròn, một là tuân thủ; hai tập SKU khác nhau" },
  { bay: "Nói làm tròn “bị bác bỏ”", vi_sao: "Chỉ bác bỏ đúng bộ quy tắc đã liệt kê" },
  { bay: "Đẩy kết quả giá chưa thuế thành “cửa hàng giữ lại thuế”", vi_sao: "Không có dữ liệu chi phí đầu vào" },
  { bay: "Màu xanh/đỏ hoặc tỉ lệ “bao nhiêu trên bốn phương pháp” như bảng điểm", vi_sao: "Không phải trận đấu" },
  { bay: "Ngoại suy sang bán lẻ Việt Nam", vi_sao: "Một cửa hàng" },
  { bay: "Nói HC3/bootstrap đã xử lý bất định cấp chính sách", vi_sao: "Chúng chỉ đo biến thiên cấp SKU có điều kiện" },
];

export default function TrangHanChe() {
  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Hạn chế</h1>
        <p className="text-muted-foreground">
          Câu kết luận đúng của đồ án: <em>Không tìm thấy bằng chứng giá giảm trong các so sánh có
          điều chỉnh này; dữ liệu không đủ để quy chênh lệch quan sát cho chính sách một cách đáng
          tin cậy.</em>
        </p>
      </header>

      <KhoiKetQua tieuDe="Những gì đứng vững" vaiTro="chinh">
        <ul className="list-inside list-disc space-y-2 text-sm">
          {DUNG_VUNG.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </KhoiKetQua>

      <Alert variant="destructive">
        <AlertTitle>Những gì KHÔNG đứng vững / không được viết</AlertTitle>
        <AlertDescription>
          Bảng dưới liệt kê các câu kết luận đã cân nhắc và loại bỏ trong quá trình viết báo cáo,
          cùng lý do cụ thể — không phải danh sách trang trí.
        </AlertDescription>
      </Alert>

      <KhoiKetQua tieuDe="Danh sách câu cấm viết" vaiTro="chan-doan">
        <BangDuLieu<(typeof CAU_CAM)[number]>
          cot={[
            { khoa: "cau", nhan: "Câu cấm" },
            { khoa: "lyDo", nhan: "Vì sao" },
          ]}
          hang={CAU_CAM}
        />
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Mười bẫy trình bày phải tránh (áp dụng cho cả web và slide)"
        vaiTro="chan-doan"
      >
        <BangDuLieu<(typeof BAY_TRINH_BAY)[number]>
          cot={[
            { khoa: "bay", nhan: "Bẫy" },
            { khoa: "vi_sao", nhan: "Vì sao" },
          ]}
          hang={BAY_TRINH_BAY}
        />
      </KhoiKetQua>

      <KhoiKetQua tieuDe="Phạm vi suy rộng" vaiTro="chinh">
        <p className="text-sm">
          Tổng thể đại diện: SKU đủ điều kiện giảm thuế theo luật, có bán ở cả hai kỳ, tại{" "}
          <strong>một</strong> cửa hàng tiện lợi TP.HCM. Không được ngoại suy ra ngành bán lẻ Việt
          Nam — một cửa hàng, một ngày chính sách, một người ra quyết định giá. Mọi HC3 và bootstrap
          trong đồ án chỉ đo bất định có điều kiện ở cấp SKU; bất định ở cấp chính sách không ước
          lượng được bằng dữ liệu này.
        </p>
      </KhoiKetQua>
    </div>
  );
}
