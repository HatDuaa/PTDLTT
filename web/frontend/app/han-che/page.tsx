"use client";

/**
 * Trang Hạn chế — tổng hợp mọi hạn chế của đồ án và danh sách câu cấm viết. Nội
 * dung bảng "câu cấm" là hướng dẫn phương pháp luận (lý do không được viết), không
 * phải số liệu kết quả — không cần nguồn API.
 */
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { DienGiai } from "@/components/site/dien-giai";
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
  { cau: "“Nghị quyết không làm giảm giá” / “tác động bằng 0”", lyDo: "Không bác bỏ ≠ bằng 0. TOST — kiểm tra chênh lệch có đủ nhỏ để xem là tương đương — không đạt." },
  { cau: "“Cửa hàng giữ lại phần giảm thuế”", lyDo: "Không có dữ liệu chi phí đầu vào." },
  { cau: "“Pass-through bằng 0”", lyDo: "TOST không cho thấy phần giảm thuế đi vào giá đủ gần 0." },
  { cau: "“Bác bỏ chuyển hoàn toàn” (như kết luận chính)", lyDo: "Phụ thuộc phương pháp — g-computation, tức dự đoán mỗi SKU dưới cả hai trạng thái rồi lấy chênh lệch, không bác bỏ." },
  { cau: "“Hai phương pháp xác nhận lẫn nhau”", lyDo: "Chung một chiến lược nhận dạng." },
  { cau: "“Xu hướng song song đã đạt / đã được chứng minh”", lyDo: "Cổng 3 không đạt; cổng 1 trượt." },
  { cau: "“Đã xử lý ngụy lặp”", lyDo: "Ngụy lặp là có nhiều dòng dữ liệu nhưng thực chất chỉ một lần chính sách độc lập: một cửa hàng, một ngày chính sách." },
  { cau: "Ngoại suy ra cửa hàng khác / ngành bán lẻ Việt Nam", lyDo: "Một cửa hàng." },
  { cau: "Gọi kết quả là “ITT” mà không kèm điều kiện mẫu", lyDo: "ITT là so sánh theo nhóm được luật chỉ định từ đầu, nhưng mẫu này còn bị lọc theo việc SKU có giá ở cả hai kỳ." },
  { cau: "“TOST thất bại ⇒ pass-through khác 0”", lyDo: "Biên quá hẹp so với độ chính xác dữ liệu." },
  { cau: "Dùng p-value của nhánh sản lượng như “suýt có ý nghĩa”", lyDo: "MDE — thay đổi nhỏ nhất thiết kế có thể phát hiện đủ tin cậy — lớn hơn nhiều so với ước lượng điểm." },
  { cau: "Đặt tỉ lệ đổi mức trong mô phỏng làm tròn cạnh tỉ lệ tuân thủ thuế", lyDo: "Hai con số có thể trùng ngẫu nhiên nhưng đến từ hai tập SKU hoàn toàn khác nhau." },
];

const BAY_TRINH_BAY = [
  { bay: "Dùng p-value của nhánh sản lượng như “suýt có ý nghĩa”", vi_sao: "MDE, tức thay đổi nhỏ nhất có thể phát hiện đủ tin cậy, lớn hơn nhiều so với ước lượng điểm" },
  { bay: "Gọi kết quả là “ITT” mà không kèm điều kiện mẫu", vi_sao: "ITT so sánh theo nhóm luật chỉ định, nhưng mẫu còn bị lọc theo việc SKU có giá ở cả hai kỳ" },
  { bay: "Dùng cổng 2 đạt để tuyên bố xu hướng song song", vi_sao: "Ba cổng không phải ba lá phiếu" },
  { bay: "Gọi chênh lệch tỉ lệ sống sót là “tác động gây ngừng bán”", vi_sao: "KTC chứa 0; nhóm Z=1 vốn bán thưa hơn từ đầu" },
  { bay: "Đặt tỉ lệ đổi mức (mô phỏng làm tròn) cạnh tỉ lệ tuân thủ thuế", vi_sao: "Trùng ngẫu nhiên có thể xảy ra — một là làm tròn, một là tuân thủ; hai tập SKU khác nhau" },
  { bay: "Nói làm tròn “bị bác bỏ”", vi_sao: "Chỉ bác bỏ đúng bộ quy tắc đã liệt kê" },
  { bay: "Đẩy kết quả giá chưa thuế thành “cửa hàng giữ lại thuế”", vi_sao: "Không có dữ liệu chi phí đầu vào" },
  { bay: "Màu xanh/đỏ hoặc tỉ lệ “bao nhiêu trên bốn phương pháp” như bảng điểm", vi_sao: "Không phải trận đấu" },
  { bay: "Ngoại suy sang bán lẻ Việt Nam", vi_sao: "Một cửa hàng" },
  { bay: "Nói HC3/bootstrap đã xử lý bất định cấp chính sách", vi_sao: "HC3 điều chỉnh sai số chuẩn; bootstrap lấy mẫu lặp lại. Cả hai chỉ đo biến thiên cấp SKU có điều kiện" },
];

export default function TrangHanChe() {
  return (
    <div className="grid gap-8">
      <header className="grid gap-3">
        <h1 className="text-2xl font-semibold">Hạn chế</h1>
        <p className="text-muted-foreground">
          Một đồ án trung thực phải nói rõ nó <strong>không biết gì</strong>, chứ không chỉ nói nó
          biết gì. Trang này gom mọi chỗ dữ liệu hụt hơi, để người đọc biết tin phần nào tới đâu —
          và để chính nhóm không viết quá tay khi làm slide.
        </p>
        <p className="text-muted-foreground">
          Câu kết luận đúng của đồ án: <em>Không tìm thấy bằng chứng giá giảm trong các so sánh có
          điều chỉnh này; dữ liệu không đủ để quy chênh lệch quan sát cho chính sách một cách đáng
          tin cậy.</em>
        </p>
        <DienGiai tieuDe="Đọc trang này thế nào">
          <p>
            Gần như mọi hạn chế bên dưới đều nói về cùng một chuyện: khó biết{" "}
            <strong>bao nhiêu phần</strong> chênh lệch quan sát được là do chính sách gây ra.
          </p>
          <p>
            Chúng làm yếu đi phần <em>độ lớn của tác động nhân quả</em>. Chúng{" "}
            <strong>không</strong> lật ngược điều đã quan sát được: giá thực tế đã không giảm theo
            phần thuế được giảm.
          </p>
        </DienGiai>
      </header>

      <KhoiKetQua tieuDe="Những gì đứng vững" vaiTro="chinh">
        <ul className="list-inside list-disc space-y-2 text-sm">
          {DUNG_VUNG.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <DienGiai className="mt-4">
          <p>
            Đây là phần dữ liệu nói được mà không phải mượn thêm giả định nào. Chỗ chắc nhất không
            phải một con số tác động, mà là việc kết luận không đổi khi nhóm thử lại bằng nhiều
            cách chia mẫu và nhiều cửa sổ thời gian khác nhau.
          </p>
          <p>
            Hệ quả: điều bị lung lay là câu hỏi <em>chính sách gây ra bao nhiêu</em>. Việc cửa
            hàng không cập nhật hết và hai nhóm hàng vốn khác nhau từ trước vẫn là quan sát trực
            tiếp từ dữ liệu, không phụ thuộc phương pháp ước lượng.
          </p>
        </DienGiai>
      </KhoiKetQua>

      <Alert variant="destructive">
        <AlertTitle>Những gì KHÔNG đứng vững / không được viết</AlertTitle>
        <AlertDescription>
          Bảng dưới liệt kê các câu kết luận đã cân nhắc và loại bỏ trong quá trình viết báo cáo,
          cùng lý do cụ thể — không phải danh sách trang trí.
        </AlertDescription>
      </Alert>

      <KhoiKetQua tieuDe="Danh sách câu cấm viết" vaiTro="chan-doan">
        <DienGiai className="mb-4">
          <p>
            Bảng này không phải bản tự kiểm điểm. Nó là hàng rào: lúc làm slide, một kết quả rất
            dễ bị rút gọn thành câu nghe kêu hơn sự thật.
          </p>
          <p>
            Trước khi viết câu nào lên slide, dò cột trái xem câu mình định viết có nằm trong đó
            không. Cột phải nói rõ câu ấy hỏng ở đâu, để nhóm biết cách viết lại chứ không chỉ
            biết là bị cấm.
          </p>
        </DienGiai>
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
        <DienGiai className="mb-4">
          <p>
            Bảng trên cấm <em>câu chữ</em>; bảng này cấm <em>cách bày</em>. Một con số hoàn toàn
            đúng vẫn gây hiểu sai nếu đặt cạnh con số khác họ, hoặc tô màu như bảng điểm thắng
            thua.
          </p>
          <p>
            Hệ quả thực tế: các bẫy này chủ yếu làm người nghe tưởng nhóm đo được độ lớn tác động
            chắc chắn hơn thực tế. Tránh được chúng thì phần quan sát về giá vẫn nguyên vẹn, chỉ
            là không bị thổi lên.
          </p>
        </DienGiai>
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
          Nam — một cửa hàng, một ngày chính sách, một người ra quyết định giá. HC3 là cách tính sai
          số chuẩn chịu được mức biến động khác nhau giữa SKU; bootstrap là lấy mẫu lặp lại nhiều
          lần. Cả hai chỉ đo bất định có điều kiện ở cấp SKU, không đo được bất định ở cấp chính
          sách.
        </p>
        <DienGiai className="mt-4">
          <p>
            Chỉ có một cửa hàng và một ngày đổi thuế, nên không có cách nào biết kết quả này lặp
            lại ở nơi khác hay không. Mọi câu suy rộng ra ngành bán lẻ đều vượt quá dữ liệu.
          </p>
          <p>
            Điều vẫn đứng vững trong đúng phạm vi ấy: tại chính cửa hàng này, giá thực tế đã không
            bám mức lẽ ra phải có nếu phần thuế được giảm đi hết vào giá.
          </p>
        </DienGiai>
      </KhoiKetQua>
    </div>
  );
}
