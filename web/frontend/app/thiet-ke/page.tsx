"use client";

/**
 * Trang Thiết kế — khung Z (đủ điều kiện theo luật) vs D (thuế cửa hàng thực áp),
 * đồ thị nhân quả, giả định, bảng đường backdoor. Nội dung chủ yếu diễn giải
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
    danhGia: "Không kiểm chứng được đầy đủ — chỉ có 2 hệ số dẫn.",
  },
  {
    ten: "Phân loại Z đúng",
    noiDung: "Định danh sản phẩm phản ánh đúng địa vị pháp lý.",
    danhGia: "23 SKU chưa phân loại được → báo cáo 3 biến thể xử lý.",
  },
  {
    ten: "SUTVA",
    noiDung: "Không lan tỏa giữa các SKU.",
    danhGia: "Đáng ngờ — khăn ướt và khăn giấy có thể thay thế nhau trong cùng cửa hàng.",
  },
  {
    ten: "No-anticipation",
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
    danhGia: "Cửa hàng dời địa điểm khoảng 10/06/2025.",
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
    trangThai: "Không chặn được — lý do dùng ITT theo Z thay vì D",
  },
  {
    duong: "Y ← Chi phí đầu vào",
    chanBang: "—",
    trangThai: "Không quan sát được — hóa đơn mua vào chỉ có 03–04/2025, trước chính sách",
  },
  {
    duong: "Y ← Dời địa điểm",
    chanBang: "Cửa sổ độ nhạy từ 11/06",
    trangThai: "Giảm nhẹ, không loại bỏ",
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
          Đồ án bắt đầu từ đúng chỗ giáo trình dừng lại: chương 8.6 định nghĩa ATE và dừng ở
          &ldquo;cần các điều kiện bổ sung để ước lượng ATE khi không có RCT&rdquo;. Ở đây, các điều
          kiện bổ sung ấy được nêu rõ và áp dụng hai phương pháp ước lượng dưới cùng bộ điều kiện.
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
            <em>Gillette Dao cạo Mach 3 Clean</em> và năm dao cạo Gillette khác chuyển sang 8%.
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
        moTa="Bốn đường phải đọc được từ đồ thị — đường 1 là chỗ dễ vẽ sai nhất."
        vaiTro="chinh"
      >
        <div className="grid gap-4 text-sm">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-2 font-medium">Các nút và quan hệ chính</p>
            <ul className="list-inside list-disc space-y-1">
              <li>NQ 204/2025/QH15 → Z (đủ điều kiện theo luật)</li>
              <li>Đặc tính SKU / cầu nền (không quan sát trực tiếp) → Z, pre_p/pre_q/pre_w, cửa hàng cập nhật thuế, Y, S</li>
              <li>Z → Cửa hàng cập nhật thuế suất? → D (thuế suất thực áp)</li>
              <li>D → G (nhóm quan sát T/C10/C8) và → chi phí thực đơn làm tròn giá → Y (giá gồm thuế)</li>
              <li>Chi phí đầu vào (không quan sát được) → Y</li>
              <li>Dời địa điểm 06/2025 → Y</li>
              <li>Y → S (được quan sát ở cả hai kỳ)</li>
            </ul>
          </div>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              <strong>Đặc tính SKU → Z:</strong> Nghị quyết không tự tạo ra Z — nghị quyết kết hợp
              với loại sản phẩm mới xác định đủ điều kiện.
            </li>
            <li>
              <strong>Z → cửa hàng không cập nhật → D=10% → xếp vào C10:</strong> cơ chế ô nhiễm
              nhóm đối chứng.
            </li>
            <li>
              <strong>Đặc tính SKU → pre_q, pre_w và → Y:</strong> cùng một nguyên nhân ẩn vừa gây
              mất cân bằng, vừa ảnh hưởng xu hướng giá phản thực.
            </li>
            <li>
              <strong>Đặc tính SKU → S ← Y (collider):</strong> mẫu chỉ giữ SKU có mặt ở cả hai kỳ,
              mà điều đó phụ thuộc chính giá.
            </li>
          </ol>
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
        tieuDe="Đường backdoor — cái nào chặn được"
        moTa="Không được điều chỉnh cho D, G, S hay bất kỳ biến nào sau can thiệp."
        vaiTro="chinh"
      >
        <BangDuLieu<(typeof DUONG_BACKDOOR)[number]>
          cot={[
            { khoa: "duong", nhan: "Đường" },
            { khoa: "chanBang", nhan: "Chặn bằng" },
            { khoa: "trangThai", nhan: "Trạng thái" },
          ]}
          hang={DUONG_BACKDOOR}
        />
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Hai phương pháp — cùng một chiến lược nhận dạng"
        vaiTro="chinh"
      >
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <p className="font-medium">Phương pháp 1 — Hồi quy ước lượng ATT</p>
            <p className="text-muted-foreground">Neo giáo trình: chương 9, 10.</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="font-medium">Phương pháp 2 — Phân tầng theo khung Kết quả tiềm năng</p>
            <p className="text-muted-foreground">Neo giáo trình: chương 8.4 (Simpson), 8.6 (ATE).</p>
          </div>
        </div>
        <p className="mt-3 text-sm">
          <strong>Cả hai dùng chung MỘT chiến lược nhận dạng: xu hướng song song.</strong> Hai
          phương pháp cho kết quả tương tự KHÔNG xác nhận quan hệ nhân quả — nếu giả định xu hướng
          song song sai, cả hai cùng sai theo cùng một hướng. Khung Wald dùng Z theo kiểu công cụ,
          nhưng Z chỉ hợp lệ nếu đã có xu hướng song song theo Z — nó nằm trong cùng chiến lược,
          không độc lập với nó.
        </p>
      </KhoiKetQua>
    </div>
  );
}
