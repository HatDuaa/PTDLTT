"use client";

/**
 * Trang Sức mạnh & cơ chế — MDE, sức mạnh TOST, mô phỏng làm tròn, sản lượng.
 * Toàn bộ nhánh sản lượng và cơ chế là KHÁM PHÁ, không phải nhân quả (chương 6).
 */
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DuongCongSucManh } from "@/components/charts/duong-cong-suc-manh";
import { KhoiBieuDo } from "@/components/site/khoi-bieu-do";
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { BangSoThayThe } from "@/components/site/bang-so-thay-the";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useLamTron, useMde, useSanLuong } from "@/lib/hooks";
import { dinhDangDiemLog, dinhDangP, dinhDangPhanTram, dinhDangSo, dinhDangSoNguyen } from "@/lib/format";
import { tachDuLieuMde } from "@/lib/derive";
import { BIEN_TOST_RONG } from "@/lib/hang-so-chinh-sach";
import type { LamTronRow, MdeDacTaRow, MdeRawRow, SanLuongRow } from "@/lib/types";

/**
 * `/api/san-luong` trộn hai đơn vị khác nhau trong cùng bảng: "biên độ tăng cường"
 * (sản lượng) đo bằng điểm log ×100, còn "biên độ mở rộng" (còn bán hay không) đo
 * bằng điểm phần trăm xác suất sống sót. Không được dùng chung một formatter.
 */
function donViNhanh(nhanh: string): string {
  return nhanh === "biên độ mở rộng" ? "điểm phần trăm" : "điểm log ×100";
}

const CAU_HINH_LAM_TRON: ChartConfig = {
  ti_le_doi_muc: { label: "Tỉ lệ SKU đổi mức giá", color: "var(--chart-3)" },
};

export default function TrangSucManh() {
  const mde = useMde();
  const lamTron = useLamTron();
  const sanLuong = useSanLuong();

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Sức mạnh thống kê &amp; cơ chế</h1>
        <p className="text-muted-foreground">
          Chương 5 cho ước lượng điểm. Trang này trả lời: dữ liệu có đủ sức phát hiện tác động
          không, và cơ chế nào giải thích kết quả. Toàn bộ nhánh sản lượng và cơ chế là{" "}
          <strong>khám phá</strong>, không phải nhân quả.
        </p>
      </header>

      <KhoiKetQua
        tieuDe="Độ lớn tối thiểu phát hiện được (MDE)"
        moTa="MDE = (1,96 + 0,842) × SE tại α = 0,05, sức mạnh 80%. Không có một MDE chung cho cả bốn đặc tả."
        vaiTro="chan-doan"
      >
        <TrangThaiDuLieu dangTai={mde.dangTai} loi={mde.loi} duLieu={mde.duLieu} thuLai={mde.thuLai} chieuCaoTai="h-48">
          {(hang: MdeRawRow[]) => {
            const { dacTa } = tachDuLieuMde(hang);
            return (
              <BangDuLieu<MdeDacTaRow>
                cot={[
                  { khoa: "dac_ta", nhan: "Đặc tả" },
                  { khoa: "se", nhan: "SE", dinhDang: (h) => dinhDangSo(h.se, 3) },
                  { khoa: "mde", nhan: "MDE", dinhDang: (h) => dinhDangDiemLog(h.mde) },
                  {
                    khoa: "suc_manh_tai_moc_chuyen_hoan_toan",
                    nhan: "Sức mạnh tại mốc chuyển hoàn toàn",
                    dinhDang: (h) => dinhDangPhanTram(h.suc_manh_tai_moc_chuyen_hoan_toan, 0),
                  },
                ]}
                hang={dacTa}
              />
            );
          }}
        </TrangThaiDuLieu>
        <p className="mt-2 text-xs text-muted-foreground">
          Không tính &ldquo;sức mạnh hậu kiểm&rdquo; (observed power) — nó chỉ là một phép biến đổi
          đơn điệu của p-value, không thêm thông tin.
        </p>
      </KhoiKetQua>

      <DuongCongSucManh />

      <KhoiKetQua
        tieuDe="Sức mạnh của TOST — biên đã chọn có khả thi không"
        moTa={`Biên ±${dinhDangSo(BIEN_TOST_RONG, 3)} đang dùng nhỏ hơn mức cần cho 80% sức mạnh ở cả bốn đặc tả. TOST thất bại KHÔNG phải bằng chứng chống lại sự tương đương — nó chủ yếu phản ánh thiết kế không đủ chính xác cho biên đã chọn trước.`}
        vaiTro="chan-doan"
      >
        <TrangThaiDuLieu dangTai={mde.dangTai} loi={mde.loi} duLieu={mde.duLieu} thuLai={mde.thuLai} chieuCaoTai="h-48">
          {(hang: MdeRawRow[]) => {
            const { dacTa } = tachDuLieuMde(hang);
            return (
              <BangDuLieu<MdeDacTaRow>
                cot={[
                  { khoa: "dac_ta", nhan: "Đặc tả" },
                  {
                    khoa: "bien_tost_du_80",
                    nhan: "Biên cần cho 80% sức mạnh",
                    dinhDang: (h) => `±${dinhDangSo(h.bien_tost_du_80, 3)}`,
                  },
                  {
                    khoa: "suc_manh_tost_bien_dang_dung",
                    nhan: "Sức mạnh tại biên đang dùng",
                    dinhDang: (h) => dinhDangPhanTram(h.suc_manh_tost_bien_dang_dung, 0),
                  },
                ]}
                hang={dacTa}
              />
            );
          }}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <KhoiBieuDo
        tieuDe="Mô phỏng làm tròn giá — chuẩn cơ học"
        moTa="Câu hỏi duy nhất: NẾU cửa hàng chuyển hoàn toàn phần giảm thuế VÀ làm tròn theo quy tắc R, giá niêm yết có phải đổi mức không? Đây là phép tính cơ học, không suy luận về hành vi định giá thật."
        vaiTro="co-hoc"
        moTaChoBieuDo="Biểu đồ cột thể hiện tỉ lệ SKU sẽ đổi mức giá niêm yết dưới giả định chuyển hoàn toàn, tại ba lưới làm tròn 1.000đ, 500đ và 100đ. Tỉ lệ tăng dần khi lưới làm tròn mịn hơn."
        ghiChu={
          <div className="space-y-1">
            <p>
              pre_p là giá giao dịch trung vị, không chắc trùng giá niêm yết — mô phỏng giả định hai
              thứ trùng nhau.
            </p>
            <p>
              ⚠️ Không được suy ra: SKU thực tế phải giảm giá · cửa hàng cố tình không chuyển thuế ·
              quy tắc làm tròn &ldquo;bị bác bỏ&rdquo; · chi phí thực đơn không tồn tại.
            </p>
          </div>
        }
        bangThayThe={
          <TrangThaiDuLieu dangTai={lamTron.dangTai} loi={lamTron.loi} duLieu={lamTron.duLieu} thuLai={lamTron.thuLai}>
            {(hang: LamTronRow[]) => (
              <BangSoThayThe<LamTronRow>
                id="bang-lam-tron"
                tieuDe="Mô phỏng làm tròn giá"
                cot={[
                  { khoa: "buoc_lam_tron", nhan: "Lưới làm tròn", dinhDang: (h) => `${dinhDangSoNguyen(h.buoc_lam_tron)}đ` },
                  { khoa: "so_sku", nhan: "Số SKU", dinhDang: (h) => dinhDangSoNguyen(h.so_sku) },
                  { khoa: "so_doi_muc", nhan: "Số đổi mức", dinhDang: (h) => dinhDangSoNguyen(h.so_doi_muc) },
                  { khoa: "ti_le_doi_muc", nhan: "Tỉ lệ", dinhDang: (h) => dinhDangPhanTram(h.ti_le_doi_muc, 1) },
                ]}
                hang={hang}
              />
            )}
          </TrangThaiDuLieu>
        }
      >
        <TrangThaiDuLieu dangTai={lamTron.dangTai} loi={lamTron.loi} duLieu={lamTron.duLieu} thuLai={lamTron.thuLai} chieuCaoTai="h-56">
          {(hang: LamTronRow[]) => (
            <ChartContainer config={CAU_HINH_LAM_TRON} className="aspect-auto h-56 w-full">
              <BarChart data={hang} margin={{ left: 8, right: 8, top: 16 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="buoc_lam_tron" tickFormatter={(v: number) => `${dinhDangSoNguyen(v)}đ`} />
                <YAxis domain={[0, 1]} tickFormatter={(v: number) => dinhDangPhanTram(v, 0)} width={56} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => `Lưới ${dinhDangSoNguyen(Number(v))}đ`}
                      formatter={(value) => [dinhDangPhanTram(Number(value), 1), "tỉ lệ đổi mức"]}
                    />
                  }
                />
                <Bar dataKey="ti_le_doi_muc" fill="var(--color-ti_le_doi_muc)" radius={4}>
                  <LabelList dataKey="ti_le_doi_muc" position="top" formatter={(v) => dinhDangPhanTram(Number(v), 1)} fontSize={12} />
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </TrangThaiDuLieu>
      </KhoiBieuDo>

      <KhoiKetQua
        tieuDe="Biên độ mở rộng và tăng cường — sản lượng và việc còn bán"
        moTa="Khám phá, không phải nhân quả — cả hai chịu chọn lọc mẫu và thiếu lực thống kê."
        vaiTro="kham-pha"
      >
        <TrangThaiDuLieu dangTai={sanLuong.dangTai} loi={sanLuong.loi} duLieu={sanLuong.duLieu} thuLai={sanLuong.thuLai} chieuCaoTai="h-40">
          {(hang: SanLuongRow[]) => (
            <BangDuLieu<SanLuongRow>
              cot={[
                { khoa: "nhanh", nhan: "Nhánh" },
                { khoa: "donVi", nhan: "Đơn vị", dinhDang: (h) => donViNhanh(h.nhanh) },
                { khoa: "n", nhan: "n", dinhDang: (h) => dinhDangSoNguyen(h.n) },
                { khoa: "uoc_luong", nhan: "Ước lượng", dinhDang: (h) => `${dinhDangSo(h.uoc_luong, 2)} ${donViNhanh(h.nhanh)}` },
                { khoa: "p", nhan: "p", dinhDang: (h) => dinhDangP(h.p) },
                {
                  khoa: "ktc",
                  nhan: "KTC 95%",
                  dinhDang: (h) => `[${dinhDangSo(h.ktc_duoi, 2)}; ${dinhDangSo(h.ktc_tren, 2)}] ${donViNhanh(h.nhanh)}`,
                },
                { khoa: "mde", nhan: "MDE 80%", dinhDang: (h) => `${dinhDangSo(h.mde, 2)} ${donViNhanh(h.nhanh)}` },
              ]}
              hang={hang}
            />
          )}
        </TrangThaiDuLieu>
        <p className="mt-2 text-xs text-muted-foreground">
          Không cộng hai nhánh thành &ldquo;tổng tác động&rdquo; — một bên là log sản lượng có điều
          kiện sống sót, bên kia là xác suất sống sót, hai đại lượng khác nhau. Cấm đọc &ldquo;gần có
          ý nghĩa&rdquo; hay &ldquo;có xu hướng giảm&rdquo; khi MDE lớn hơn nhiều so với ước lượng
          điểm.
        </p>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Phạm vi của bất định"
        vaiTro="chan-doan"
      >
        <p className="text-sm">
          Mọi HC3 và bootstrap trong đồ án chỉ đo bất định có điều kiện ở cấp SKU. Bất định ở cấp
          chính sách — một cửa hàng, một ngày, một người ra quyết định giá — không ước lượng được
          bằng dữ liệu này. Hai chẩn đoán bổ sung (gộp cụm theo nhóm hàng, hoán vị nhãn trong tầng)
          không có địa vị suy diễn: số cụm quá nhỏ cho lý thuyết tiệm cận, và can thiệp do luật định
          chứ không bốc thăm nên không tồn tại phân phối ngẫu nhiên hóa để hoán vị mô phỏng.
        </p>
      </KhoiKetQua>
    </div>
  );
}
