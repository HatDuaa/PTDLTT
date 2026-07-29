"use client";

/**
 * Trang Thiết kế — khung Z (đủ điều kiện theo luật) vs D (thuế cửa hàng thực áp),
 * đồ thị nhân quả, giả định và các đường gây nhiễu. Nội dung chủ yếu diễn giải
 * phương pháp luận (chương 4); các con số (n theo Z) vẫn lấy qua API.
 */
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheoTang } from "@/lib/hooks";
import { dinhDangSoNguyen } from "@/lib/format";
import { MAU_SO_SANH_CHINH } from "@/lib/hang-so-chinh-sach";

const GIA_DINH = [
  {
    ten: "Xu hướng song song",
    noiDung: "Nếu không có chính sách, giá hai nhóm biến động song song.",
    danhGia: "Không kiểm chứng được đầy đủ vì dữ liệu tiền kỳ quá ngắn.",
  },
  {
    ten: "Phân loại Z đúng",
    noiDung: "Định danh sản phẩm phản ánh đúng địa vị pháp lý.",
    danhGia: "Các SKU chưa rõ loại được báo cáo theo nhiều cách xử lý.",
  },
  {
    ten: "SUTVA — không ảnh hưởng chéo",
    noiDung: "Không lan tỏa giữa các SKU.",
    danhGia: "Đáng ngờ — khăn ướt và khăn giấy có thể thay thế nhau trong cùng cửa hàng.",
  },
  {
    ten: "No-anticipation — không đón trước",
    noiDung: "Cửa hàng không đổi giá trước 01/07 để đón chính sách.",
    danhGia: "Kiểm được phần nào bằng giả dược tiền kỳ (Cổng 2).",
  },
  {
    ten: "Ổn định thành phần mẫu",
    noiDung: "Bộ SKU không đổi hệ thống quanh ngày cắt.",
    danhGia: "Có chọn lọc sống sót — xem trang Sức mạnh & cơ chế.",
  },
  {
    ten: "Không cú sốc trùng thời gian",
    noiDung: "Không có sự kiện khác trùng thời điểm chính sách.",
    danhGia: "Dữ liệu trống 02–10/06; địa chỉ trên hóa đơn đổi hẳn từ 24/06.",
  },
];

const DUONG_BACKDOOR = [
  {
    duong: "Z ← Đặc tính SKU → Y",
    chanBang: "pre_p, pre_q, pre_w (chỉ báo của đặc tính)",
    trangThai: "Chặn không hoàn toàn — chỉ là chỉ báo, không phải biến ẩn",
  },
  {
    duong: "D ← Cửa hàng cập nhật → Y",
    chanBang: "—",
    trangThai: "Không chặn được — lý do dùng ITT theo Z có điều kiện mẫu thay vì D",
  },
  {
    duong: "Y ← Chi phí đầu vào",
    chanBang: "—",
    trangThai: "Không quan sát được — hóa đơn mua vào chỉ có 03–04/2025, trước chính sách",
  },
  {
    duong: "Y ← Thay đổi liên quan địa điểm",
    chanBang: "Cửa sổ từ 11/06, gồm cả hai địa chỉ",
    trangThai: "Giảm nhẹ, không tách riêng địa chỉ mới",
  },
  {
    duong: "Điều kiện hóa trên S (được quan sát ở cả hai kỳ)",
    chanBang: "—",
    trangThai: "Không sửa được bằng dữ liệu này",
  },
];

export default function TrangThietKe() {
  const theoTang = useTheoTang();

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Thiết kế nhân quả</h1>
        <p className="text-muted-foreground">
          Trang này giải thích vì sao hai nhóm có thể so sánh với nhau, chúng khác nhau sẵn ở đâu,
          và điều gì khiến kết quả chưa thể được đọc như một tác động nhân quả chắc chắn.
        </p>
      </header>

      <KhoiKetQua
        tieuDe="Khung Z (đủ điều kiện theo luật) và D (thuế thực áp)"
        moTa="Phải tách hai đại lượng vì việc thực thi chính sách không hoàn hảo."
        vaiTro="chinh"
      >
        <div className="grid gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Định nghĩa</TableHead>
                <TableHead>Do ai quyết định</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Z</TableCell>
                <TableCell>Đủ điều kiện giảm thuế theo luật</TableCell>
                <TableCell>Quốc hội + loại sản phẩm</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">D</TableCell>
                <TableCell>Thuế suất cửa hàng thực áp ở hậu kỳ</TableCell>
                <TableCell>Cửa hàng</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="text-sm">
            Bằng chứng không tuân thủ rõ nhất: cùng dòng sản phẩm nằm ở hai nhóm khác nhau —{" "}
            <em>Gillette Lưỡi Dao Cạo Mach 3 Clean</em> giữ 10%, trong khi{" "}
            <em>Gillette Dao cạo Mach 3 Clean</em> và các dao cạo Gillette khác chuyển sang 8%.
            Không có cách giải thích nào bằng luật. Nếu chỉ so sánh theo D, phân tích đang điều
            kiện hóa trên một quyết định vận hành của cửa hàng, không phải trên luật — đây là lý do
            ước lượng <strong>chính</strong> dùng Z, còn ước lượng theo D chỉ là kết quả{" "}
            <strong>phụ</strong>.
          </p>
          <TrangThaiDuLieu dangTai={theoTang.dangTai} loi={theoTang.loi} duLieu={theoTang.duLieu} thuLai={theoTang.thuLai} chieuCaoTai="h-8">
            {(hang) => {
              const itt = hang.filter((h) => h.mau === MAU_SO_SANH_CHINH);
              const n1 = itt.reduce((s, h) => s + h.n1, 0);
              const n0 = itt.reduce((s, h) => s + h.n0, 0);
              return (
                <p className="text-sm text-muted-foreground">
                  Mẫu so sánh chính: Z=1 (luật cho giảm) <strong>{dinhDangSoNguyen(n1)}</strong> SKU
                  · Z=0 (luật loại trừ — thuế tiêu thụ đặc biệt) <strong>{dinhDangSoNguyen(n0)}</strong>{" "}
                  SKU.
                </p>
              );
            }}
          </TrangThaiDuLieu>
        </div>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Đồ thị nhân quả (DAG)"
        moTa="DAG là bản đồ cho biết yếu tố nào có thể ảnh hưởng đến yếu tố nào."
        vaiTro="chinh"
      >
        <div className="grid gap-5 text-sm">
          <p className="text-base leading-relaxed">
            Đây là bản đồ &ldquo;cái gì ảnh hưởng cái gì&rdquo;. Vẽ ra để trả lời một câu: phép so
            sánh của mình có công bằng không, hay đang bị thứ khác làm nhiễu?
          </p>

          <div>
            <p className="mb-2 font-medium">Các ký hiệu cần biết</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Ký hiệu</TableHead>
                  <TableHead>Nghĩa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Z</TableCell>
                  <TableCell>Luật có cho mặt hàng này giảm thuế không</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">D</TableCell>
                  <TableCell>Cửa hàng có thực sự áp thuế suất 8% không</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Y</TableCell>
                  <TableCell>Giá thay đổi bao nhiêu</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">S</TableCell>
                  <TableCell>Mặt hàng còn được bán ở kỳ sau không</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">pre_q, pre_w</TableCell>
                  <TableCell>
                    Trước chính sách mặt hàng bán chạy cỡ nào và có được bán thường xuyên không
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <ol className="grid gap-3 md:grid-cols-2">
            <li className="rounded-lg border p-4">
              <p className="font-medium">1. Loại sản phẩm quyết định nhóm</p>
              <p className="mt-1 text-muted-foreground">
                Luật không chọn ngẫu nhiên. Nhóm được giảm thuế là dầu gội, nước rửa chén, mỹ phẩm.
                Nhóm không được giảm là bia, rượu, thuốc lá. Hai nhóm khác nhau ở nhiều thứ chứ
                không chỉ ở thuế — giá bia lên xuống vì lý do của bia. Đây là đường nguy hiểm nhất,
                và là lý do đồ án không kết luận nhân quả mạnh.
              </p>
            </li>
            <li className="rounded-lg border p-4">
              <p className="font-medium">2. Cửa hàng quên cập nhật làm nhóm đối chứng bị ô nhiễm</p>
              <p className="mt-1 text-muted-foreground">
                Có những mặt hàng luật cho giảm nhưng cửa hàng để nguyên thuế suất 10%. Nếu chia
                nhóm theo thuế cửa hàng thực áp, các món này bị xếp nhầm vào nhóm
                &ldquo;không được giảm&rdquo;. Đó là lý do đồ án chia nhóm theo luật (Z), không theo
                việc cửa hàng làm gì (D).
              </p>
            </li>
            <li className="rounded-lg border p-4">
              <p className="font-medium">3. Cùng một nguyên nhân gây ra hai chuyện</p>
              <p className="mt-1 text-muted-foreground">
                Hàng được giảm thuế bán ế và thưa hơn hàng bia rượu. Món bán ế thì cửa hàng đổi giá
                theo kiểu khác món bán chạy. Vậy chênh lệch đo được có thể do độ bán chạy, không
                phải do thuế.
              </p>
            </li>
            <li className="rounded-lg border p-4">
              <p className="font-medium">4. Chỉ đo được món còn trên kệ</p>
              <p className="mt-1 text-muted-foreground">
                Giá kỳ sau chỉ tồn tại nếu món đó còn được bán, mà việc còn được bán lại phụ thuộc
                một phần vào chính giá của nó. Giống như muốn biết chiều cao trung bình cả trường
                nhưng chỉ đo được các em còn ở lại lớp bóng rổ — số đo lệch không phải vì đo sai,
                mà vì chọn nhầm người để đo.
              </p>
            </li>
          </ol>

          <details className="group rounded-lg border bg-muted/20">
            <summary className="cursor-pointer px-4 py-3 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Xem dạng ký hiệu kỹ thuật
            </summary>
            <div className="grid gap-4 border-t px-4 py-4">
              <p className="text-muted-foreground">
                Trong ngôn ngữ kỹ thuật, <strong>collider</strong> là một biến cùng bị hai yếu tố
                khác tác động; chỉ giữ mẫu theo biến này có thể tạo ra lệch chọn mẫu.{" "}
                <strong>Đường backdoor</strong> là đường gây nhiễu nối việc được giảm thuế với giá,
                không đi qua tác động chính sách cần đo. ATE là chênh lệch trung bình nếu xét toàn
                bộ mặt hàng; ATT là chênh lệch cần ước lượng cho nhóm được luật cho giảm.
              </p>
              <div>
                <p className="mb-2 font-medium">Các nút và quan hệ chính</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>NQ 204/2025/QH15 → Z (đủ điều kiện theo luật)</li>
                  <li>
                    Đặc tính SKU / cầu nền (không quan sát trực tiếp) → Z, pre_p/pre_q/pre_w, cửa
                    hàng cập nhật thuế, Y, S
                  </li>
                  <li>Z → Cửa hàng cập nhật thuế suất? → D (thuế suất thực áp)</li>
                  <li>
                    D → G (nhóm quan sát T/C10/C8) và → chi phí thực đơn làm tròn giá → Y (giá gồm
                    thuế)
                  </li>
                  <li>Chi phí đầu vào (không quan sát được) → Y</li>
                  <li>Thay đổi liên quan địa điểm 06/2025 → Y</li>
                  <li>Đặc tính SKU → S ← Y (collider do chỉ giữ SKU có ở cả hai kỳ)</li>
                  <li>Y → S (được quan sát ở cả hai kỳ)</li>
                </ul>
              </div>
              <div>
                <p className="mb-2 font-medium">Các đường backdoor và cách xử lý</p>
                <BangDuLieu<(typeof DUONG_BACKDOOR)[number]>
                  cot={[
                    { khoa: "duong", nhan: "Đường" },
                    { khoa: "chanBang", nhan: "Chặn bằng" },
                    { khoa: "trangThai", nhan: "Trạng thái" },
                  ]}
                  hang={DUONG_BACKDOOR}
                />
              </div>
            </div>
          </details>
        </div>
      </KhoiKetQua>

      <KhoiKetQua tieuDe="Giả định — và chúng đáng tin đến đâu" vaiTro="chinh">
        <BangDuLieu<(typeof GIA_DINH)[number]>
          cot={[
            { khoa: "ten", nhan: "Giả định" },
            { khoa: "noiDung", nhan: "Nội dung" },
            { khoa: "danhGia", nhan: "Đánh giá" },
          ]}
          hang={GIA_DINH}
        />
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Hai phương pháp — cùng một chiến lược nhận dạng (cách tách ảnh hưởng của thuế)"
        vaiTro="chinh"
      >
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <p className="font-medium">Phương pháp 1 — Hồi quy ước lượng ATT</p>
            <p className="text-muted-foreground">
              ATT là chênh lệch trung bình cần ước lượng cho nhóm được luật cho giảm thuế.
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="font-medium">Phương pháp 2 — Phân tầng theo khung Kết quả tiềm năng</p>
            <p className="text-muted-foreground">
              &ldquo;Kết quả tiềm năng&rdquo; là mức giá có thể thấy dưới mỗi trạng thái chính sách;
              thực tế mỗi SKU chỉ cho thấy một trạng thái.
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm">
          <strong>Cả hai dùng chung MỘT chiến lược nhận dạng: xu hướng song song.</strong> Hai
          phương pháp cho kết quả tương tự KHÔNG xác nhận quan hệ nhân quả — nếu giả định xu hướng
          song song sai, cả hai cùng sai theo cùng một hướng. Phép Wald dùng nhóm do luật xác định
          (Z) để suy ra tác động của việc cửa hàng thực sự cập nhật thuế, nhưng vẫn cần xu hướng
          song song theo Z. Vì vậy nó không phải một cách kiểm tra độc lập.
        </p>
      </KhoiKetQua>
    </div>
  );
}
