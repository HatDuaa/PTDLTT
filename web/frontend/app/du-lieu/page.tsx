"use client";

/**
 * Trang Dữ liệu — luồng mẫu, độ phủ theo tháng, ma trận chuyển thuế, cân bằng tiền
 * kỳ. Toàn bộ nguồn: `/api/luong-mau`, `/api/manifest`, `/api/theo-tang`,
 * `/api/eda/do-phu-theo-thang`, `/api/eda/ma-tran-chuyen-thue`.
 */
import { SoDoLuongMau } from "@/components/charts/so-do-luong-mau";
import { LovePlot } from "@/components/charts/love-plot";
import { KhoiKetQua } from "@/components/site/khoi-ket-qua";
import { BangDuLieu } from "@/components/site/bang-du-lieu";
import { TrangThaiDuLieu } from "@/components/site/trang-thai-du-lieu";
import { useEda, useLuongMau } from "@/lib/hooks";
import { dinhDangPhanTram, dinhDangSoNguyen } from "@/lib/format";
import type { EdaDoPhuThangRow, EdaMaTranChuyenTheRow, LuongMauRow } from "@/lib/types";

export default function TrangDuLieu() {
  const luongMau = useLuongMau();
  const doPhu = useEda("do-phu-theo-thang");
  const chuyenThue = useEda("ma-tran-chuyen-thue");

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold">Dữ liệu</h1>
        <p className="text-muted-foreground">
          Nguồn: file bán hàng <code>60.xlsx</code> của một cửa hàng tiện lợi TP.HCM, sheet chi
          tiết hóa đơn nối với sheet danh mục SKU theo <code>soid</code>. Toàn bộ số liệu dưới đây
          lấy trực tiếp qua API, không có con số nào gõ tay.
        </p>
      </header>

      <SoDoLuongMau />

      <KhoiKetQua
        tieuDe="Bảng luồng lọc dòng hàng — đầy đủ các bước"
        moTa="Mỗi dòng là một quy tắc lọc áp dụng tuần tự trên toàn bộ dòng hàng, từ dữ liệu thô tới dữ liệu đưa vào phân tích."
        vaiTro="chinh"
      >
        <TrangThaiDuLieu dangTai={luongMau.dangTai} loi={luongMau.loi} duLieu={luongMau.duLieu} thuLai={luongMau.thuLai} chieuCaoTai="h-64">
          {(hang: LuongMauRow[]) => (
            <BangDuLieu<LuongMauRow>
              cot={[
                { khoa: "buoc", nhan: "Bước" },
                { khoa: "quy_tac", nhan: "Quy tắc" },
                { khoa: "dong_vao", nhan: "Dòng vào", dinhDang: (h) => dinhDangSoNguyen(h.dong_vao) },
                { khoa: "dong_ra", nhan: "Dòng ra", dinhDang: (h) => dinhDangSoNguyen(h.dong_ra) },
                { khoa: "mat", nhan: "Mất", dinhDang: (h) => dinhDangSoNguyen(h.mat) },
                { khoa: "ghi_chu", nhan: "Ghi chú", dinhDang: (h) => h.ghi_chu ?? "—" },
              ]}
              hang={hang}
            />
          )}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Độ phủ dữ liệu theo tháng"
        moTa="Số ngày có dữ liệu, số hóa đơn, số dòng hàng và tỉ lệ có mã vạch mỗi tháng. Mã vạch chỉ được điền đầy đủ từ 21/04/2025 — đây là lý do cửa sổ chính bắt đầu từ 01/05/2025."
        vaiTro="chan-doan"
      >
        <TrangThaiDuLieu dangTai={doPhu.dangTai} loi={doPhu.loi} duLieu={doPhu.duLieu} thuLai={doPhu.thuLai} chieuCaoTai="h-64">
          {(hang: EdaDoPhuThangRow[]) => (
            <BangDuLieu<EdaDoPhuThangRow>
              cot={[
                { khoa: "thang", nhan: "Tháng" },
                { khoa: "so_ngay_co_du_lieu", nhan: "Số ngày có dữ liệu" },
                { khoa: "so_hoa_don", nhan: "Số hóa đơn", dinhDang: (h) => dinhDangSoNguyen(h.so_hoa_don) },
                { khoa: "so_dong_hang", nhan: "Số dòng hàng", dinhDang: (h) => dinhDangSoNguyen(h.so_dong_hang) },
                { khoa: "ti_le_co_ma_vach", nhan: "Tỉ lệ có mã vạch", dinhDang: (h) => dinhDangPhanTram(h.ti_le_co_ma_vach / 100, 0) },
                { khoa: "so_sku", nhan: "Số SKU", dinhDang: (h) => (h.so_sku === null ? "—" : dinhDangSoNguyen(h.so_sku)) },
              ]}
              hang={hang}
            />
          )}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <KhoiKetQua
        tieuDe="Ma trận chuyển thuế suất (tiền kỳ → hậu kỳ)"
        moTa="Số SKU theo từng cặp thuế suất quan sát được ở tiền kỳ và hậu kỳ. Đây là cách trực quan nhất để thấy nhóm 8%→8% (thuế tiêu thụ đặc biệt) áp đảo về số lượng."
        vaiTro="chinh"
      >
        <TrangThaiDuLieu dangTai={chuyenThue.dangTai} loi={chuyenThue.loi} duLieu={chuyenThue.duLieu} thuLai={chuyenThue.thuLai} chieuCaoTai="h-48">
          {(hang: EdaMaTranChuyenTheRow[]) => (
            <BangDuLieu<EdaMaTranChuyenTheRow>
              cot={[
                { khoa: "tien", nhan: "Thuế suất tiền kỳ" },
                { khoa: "hau", nhan: "Thuế suất hậu kỳ" },
                { khoa: "so_sku", nhan: "Số SKU", dinhDang: (h) => dinhDangSoNguyen(h.so_sku) },
              ]}
              hang={hang}
            />
          )}
        </TrangThaiDuLieu>
      </KhoiKetQua>

      <LovePlot />
    </div>
  );
}
