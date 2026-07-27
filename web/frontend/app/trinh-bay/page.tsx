"use client";

/**
 * Trang Trình bày — slide tóm tắt cho buổi báo cáo. Dùng lại đúng các hook và
 * component biểu đồ của các trang phân tích (`lib/hooks.ts`, `components/charts/*`)
 * nên không thể lệch số với phần còn lại của web.
 */
import type { ReactNode } from "react";
import { BieuDoHeSo } from "@/components/charts/bieu-do-he-so";
import { TostPlot } from "@/components/charts/tost-plot";
import { SoDoLuongMau } from "@/components/charts/so-do-luong-mau";
import { BaCongChanDoan } from "@/components/ket-qua/ba-cong-chan-doan";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { NhanVaiTro } from "@/components/site/nhan-vai-tro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoNhay, useLamTron, useSanLuong } from "@/lib/hooks";
import { dinhDangDiemLog, dinhDangP, dinhDangPhanTram, dinhDangSo, dinhDangSoNguyen } from "@/lib/format";

function Slide({
  so,
  tong,
  tieuDe,
  children,
}: {
  so: number;
  tong: number;
  tieuDe: string;
  children: ReactNode;
}) {
  return (
    <Card className="scroll-mt-20">
      <CardHeader>
        <p className="text-xs text-muted-foreground">
          Slide {so}/{tong}
        </p>
        <CardTitle className="text-xl">{tieuDe}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">{children}</CardContent>
    </Card>
  );
}

export default function TrangTrinhBay() {
  const doNhay = useDoNhay();
  const sanLuong = useSanLuong();
  const lamTron = useLamTron();
  const tongSlide = 10;

  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Trình bày</h1>
        <p className="text-muted-foreground">
          Mười slide dưới đây dùng chung dữ liệu với các trang phân tích ở trên — không có con số
          nào tách rời hay có thể lệch nhau. Cuộn để xem toàn bộ, hoặc trình chiếu từng slide khi
          báo cáo trực tiếp.
        </p>
      </header>

      <Slide so={1} tong={tongSlide} tieuDe="Thí nghiệm tự nhiên không hoàn hảo">
        <p>
          Nghị quyết 204/2025/QH15 giảm thuế GTGT 10%→8% từ 01/07/2025 là nguồn biến thiên ngoại
          sinh, nhưng thực thi không hoàn hảo: có <strong>không tuân thủ</strong> khi cửa hàng cập
          nhật thuế, nhóm đối chứng từng <strong>bị ô nhiễm</strong>, và{" "}
          <TrangThaiDuLieu dangTai={doNhay.dangTai} loi={doNhay.loi} duLieu={doNhay.duLieu} inline>
            {(hang) => {
              const coSo = hang.find((h) => h.truc === "23 SKU chưa phân loại" && h.muc === "loại (cơ sở)");
              const ganZ1 = hang.find((h) => h.truc === "23 SKU chưa phân loại" && h.muc === "gán tất cả Z=1");
              const so = coSo && ganZ1 ? ganZ1.n - coSo.n : undefined;
              return <strong>{so !== undefined ? dinhDangSoNguyen(so) : "—"}</strong>;
            }}
          </TrangThaiDuLieu>{" "}
          SKU chưa phân loại được về địa vị pháp lý.
        </p>
        <NhanVaiTro vaiTro="chinh" />
      </Slide>

      <Slide so={2} tong={tongSlide} tieuDe="Hai phương pháp, chung một chiến lược nhận dạng">
        <p>
          Hồi quy ước lượng ATT và phân tầng theo khung Kết quả tiềm năng <strong>không phải hai
          xác nhận độc lập</strong> — cả hai cùng dựa trên giả định xu hướng song song. Nếu giả định
          này sai, cả hai cùng sai theo cùng một hướng.
        </p>
      </Slide>

      <Slide so={3} tong={tongSlide} tieuDe="Cân bằng thất bại, TOST tiền xu hướng không đạt">
        <p>
          Ba cổng chẩn đoán không phải ba lá phiếu. Cổng đạt không bù được cổng trượt.
        </p>
        <BaCongChanDoan />
      </Slide>

      <Slide so={4} tong={tongSlide} tieuDe="So sánh giá trên SKU sống sót — mọi KTC chứa 0">
        <BieuDoHeSo />
      </Slide>

      <Slide so={5} tong={tongSlide} tieuDe="TOST thất bại chủ yếu vì biên quá hẹp">
        <p>
          Không kết luận được giá không giảm hay pass-through bằng 0. Biên tương đương đã chọn nhỏ
          hơn mức cần cho 80% sức mạnh ở cả bốn đặc tả — xem trang Sức mạnh &amp; cơ chế.
        </p>
        <TostPlot />
      </Slide>

      <Slide so={6} tong={tongSlide} tieuDe="Bác bỏ chuyển hoàn toàn phụ thuộc phương pháp">
        <p>
          Ba trong bốn đặc tả bác bỏ mốc chuyển hoàn toàn phần giảm thuế, g-computation thì không.
          Theo quy tắc khóa trước, <strong>không lấy đa số làm biểu quyết</strong> — xem bảng đầy đủ
          ở trang Kết quả.
        </p>
      </Slide>

      <Slide so={7} tong={tongSlide} tieuDe="Chọn lọc sống sót làm suy yếu thêm diễn giải giá">
        <TrangThaiDuLieu dangTai={sanLuong.dangTai} loi={sanLuong.loi} duLieu={sanLuong.duLieu} chieuCaoTai="h-16">
          {(hang) => {
            const moRong = hang.find((h) => h.nhanh === "biên độ mở rộng");
            if (!moRong) return null;
            return (
              <p>
                Tỉ lệ sống sót của hai nhóm chênh{" "}
                <strong>{dinhDangSo(moRong.uoc_luong, 1)} điểm phần trăm</strong> ({dinhDangP(moRong.p)}
                ). Giá hậu kỳ chỉ quan sát được khi SKU còn bán — kết quả giá vì vậy{" "}
                <strong>không phải</strong> ITT vô điều kiện cho toàn bộ cohort tiền kỳ.
              </p>
            );
          }}
        </TrangThaiDuLieu>
        <SoDoLuongMau />
      </Slide>

      <Slide so={8} tong={tongSlide} tieuDe="Sản lượng và việc còn bán chỉ là khám phá">
        <TrangThaiDuLieu dangTai={sanLuong.dangTai} loi={sanLuong.loi} duLieu={sanLuong.duLieu} chieuCaoTai="h-16">
          {(hang) => {
            const tangCuong = hang.find((h) => h.nhanh === "biên độ tăng cường");
            if (!tangCuong) return null;
            return (
              <p>
                Chênh lệch sản lượng chuẩn hóa theo ngày: <strong>{dinhDangDiemLog(tangCuong.uoc_luong)}</strong>{" "}
                ({dinhDangP(tangCuong.p)}), MDE 80% là <strong>{dinhDangDiemLog(tangCuong.mde)}</strong> —
                thiết kế không đủ lực phát hiện các thay đổi nhỏ hơn mức này. Không đọc thành
                &ldquo;gần có ý nghĩa&rdquo;.
              </p>
            );
          }}
        </TrangThaiDuLieu>
        <NhanVaiTro vaiTro="kham-pha" />
      </Slide>

      <Slide so={9} tong={tongSlide} tieuDe="Mô phỏng làm tròn — chuẩn cơ học, không phải hành vi">
        <TrangThaiDuLieu dangTai={lamTron.dangTai} loi={lamTron.loi} duLieu={lamTron.duLieu} chieuCaoTai="h-16">
          {(hang) => {
            const luoi1000 = hang.find((h) => h.buoc_lam_tron === 1000);
            if (!luoi1000) return null;
            return (
              <p>
                Với giả định chuyển hoàn toàn và làm tròn gần nhất tới 1.000đ,{" "}
                <strong>{dinhDangPhanTram(luoi1000.ti_le_doi_muc, 1)}</strong> SKU sẽ đổi mức giá
                niêm yết. Quy tắc làm tròn khó che mức giảm cơ học cho phần lớn SKU — nhưng đây
                không phải bằng chứng về hành vi định giá thật.
              </p>
            );
          }}
        </TrangThaiDuLieu>
        <NhanVaiTro vaiTro="co-hoc" />
      </Slide>

      <Slide so={10} tong={tongSlide} tieuDe="Đóng góp đáng tin nhất của đồ án">
        <p>
          Không phải một con số pass-through gọn gàng, mà là <strong>minh họa minh bạch giới hạn
          của nhận dạng, không tuân thủ và chọn lọc mẫu</strong> trong dữ liệu bán lẻ thực tế. Câu
          kết luận đúng: không tìm thấy bằng chứng giá giảm trong các so sánh có điều chỉnh này; dữ
          liệu không đủ để quy chênh lệch quan sát cho chính sách một cách đáng tin cậy.
        </p>
      </Slide>
    </div>
  );
}
