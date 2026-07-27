/**
 * Hàm suy dẫn thuần túy (pure function) từ dữ liệu API — KHÔNG chứa số liệu, chỉ
 * chứa phép biến đổi/tổng hợp dữ liệu đã lấy về từ backend. Tách riêng khỏi hook để
 * dễ kiểm thử độc lập.
 */
import { MOC_CHUYEN_HOAN_TOAN } from "./hang-so-chinh-sach";
import { MAU_SO_SANH_CHINH } from "@/lib/hang-so-chinh-sach";
import type {
  DuongCongSucManhDiem,
  LuongMauRow,
  MdeDacTaRow,
  MdeRawRow,
  ManifestData,
  TheoTangRow,
} from "./types";

const TEN_DUONG_CONG = "đường cong mô phỏng";

/** Tách `/api/mde` (bảng trộn 2 loại dòng) thành các đặc tả MDE và đường cong sức mạnh. */
export function tachDuLieuMde(hang: MdeRawRow[]): {
  dacTa: MdeDacTaRow[];
  duongCong: DuongCongSucManhDiem[];
} {
  const dacTa: MdeDacTaRow[] = [];
  const duongCong: DuongCongSucManhDiem[] = [];

  for (const h of hang) {
    if (h.dac_ta === TEN_DUONG_CONG) {
      if (h.delta !== null && h.suc_manh !== null) {
        duongCong.push({ delta: h.delta, suc_manh: h.suc_manh });
      }
      continue;
    }
    if (
      h.se !== null &&
      h.mde !== null &&
      h.suc_manh_tai_moc_chuyen_hoan_toan !== null &&
      h.bien_tost_du_80 !== null &&
      h.suc_manh_tost_bien_dang_dung !== null
    ) {
      dacTa.push({
        dac_ta: h.dac_ta,
        se: h.se,
        mde: h.mde,
        suc_manh_tai_moc_chuyen_hoan_toan: h.suc_manh_tai_moc_chuyen_hoan_toan,
        bien_tost_du_80: h.bien_tost_du_80,
        suc_manh_tost_bien_dang_dung: h.suc_manh_tost_bien_dang_dung,
      });
    }
  }

  duongCong.sort((a, b) => a.delta - b.delta);
  return { dacTa, duongCong };
}

/**
 * Tìm điểm trên đường cong mô phỏng gần mốc chuyển hoàn toàn nhất (đối chiếu chéo
 * với hằng số pháp lý ở `lib/hang-so-chinh-sach.ts`) — dùng để hiển thị "sức mạnh
 * mô phỏng tại mốc chuyển hoàn toàn" mà không gõ tay giá trị sức mạnh đó.
 */
export function laySucManhTaiMocChuyenHoanToan(
  duongCong: DuongCongSucManhDiem[]
): DuongCongSucManhDiem | undefined {
  if (duongCong.length === 0) return undefined;
  return duongCong.reduce((gan_nhat, hien_tai) =>
    Math.abs(hien_tai.delta - MOC_CHUYEN_HOAN_TOAN) <
    Math.abs(gan_nhat.delta - MOC_CHUYEN_HOAN_TOAN)
      ? hien_tai
      : gan_nhat
  );
}

/**
 * Nội suy tuyến tính δ (giá trị tuyệt đối) tại đó đường cong mô phỏng cắt mức sức
 * mạnh mục tiêu — dùng để tìm MDE mô phỏng và đối chiếu xem nó khớp đặc tả nào
 * trong `/api/mde`, thay vì viết chết tên đặc tả trong mã nguồn.
 */
export function noiSuyMdeTuDuongCong(
  duongCong: DuongCongSucManhDiem[],
  sucManhMucTieu: number
): number | undefined {
  const sapXep = [...duongCong].sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));
  for (let i = 0; i < sapXep.length - 1; i++) {
    const a = sapXep[i];
    const b = sapXep[i + 1];
    if (
      (a.suc_manh - sucManhMucTieu) * (b.suc_manh - sucManhMucTieu) <= 0 &&
      a.suc_manh !== b.suc_manh
    ) {
      const ti_le = (sucManhMucTieu - a.suc_manh) / (b.suc_manh - a.suc_manh);
      return Math.abs(a.delta) + ti_le * (Math.abs(b.delta) - Math.abs(a.delta));
    }
  }
  return undefined;
}

/** Tìm đặc tả MDE có `mde` giải tích gần nhất với một giá trị MDE mô phỏng cho trước. */
export function timDacTaGanNhat(
  dacTa: MdeDacTaRow[],
  mdeMoPhong: number | undefined
): MdeDacTaRow | undefined {
  if (mdeMoPhong === undefined || dacTa.length === 0) return undefined;
  return dacTa.reduce((gan_nhat, hien_tai) =>
    Math.abs(hien_tai.mde - mdeMoPhong) < Math.abs(gan_nhat.mde - mdeMoPhong) ? hien_tai : gan_nhat
  );
}

/** Tổng số SKU theo Z=1/Z=0 trong mẫu so sánh chính, cộng dồn từ bảng theo tầng. */
export function tinhTongTheoZ(
  theoTang: TheoTangRow[]
): { n1: number; n0: number } | undefined {
  const hangItt = theoTang.filter((h) => h.mau === MAU_SO_SANH_CHINH);
  if (hangItt.length === 0) return undefined;
  return hangItt.reduce(
    (tong, h) => ({ n1: tong.n1 + h.n1, n0: tong.n0 + h.n0 }),
    { n1: 0, n0: 0 }
  );
}

export interface BuocLuong {
  nhan: string;
  giaTri: number;
  ghiChu?: string;
}

/**
 * Dựng các bước của sơ đồ luồng mẫu & chọn lọc (biểu đồ bắt buộc #2) từ ba nguồn:
 * bảng luồng mẫu (lọc dòng hàng), manifest (số SKU trong roster) và bảng theo tầng
 * (số SKU sống sót theo Z). Không có con số nào gõ tay — chỉ phép chọn/cộng dồn.
 */
export function dungSoDoLuongMau(
  luongMau: LuongMauRow[],
  manifest: ManifestData,
  tongTheoZ: { n1: number; n0: number } | undefined
): BuocLuong[] {
  const buoc0 = luongMau.find((b) => b.buoc === 0);
  const buocCuoi = [...luongMau].sort((a, b) => b.buoc - a.buoc)[0];
  const soDongHangSach = manifest.dau_ra["dong-hang-sach.csv"]?.so_dong;
  const soRosterSku = manifest.dau_ra["roster-sku.csv"]?.so_dong;

  const buoc: BuocLuong[] = [];
  if (buoc0) {
    buoc.push({
      nhan: "Dòng hóa đơn thô",
      giaTri: buoc0.dong_vao,
      ghiChu: "Toàn bộ dòng hàng trong sheet chi tiết, trước mọi bước lọc",
    });
  }
  if (soDongHangSach !== undefined) {
    buoc.push({
      nhan: "Dòng hàng sạch",
      giaTri: soDongHangSach,
      ghiChu: "Sau loại hóa đơn mua vào, bản ghi xóa, số lượng/thành tiền âm, thiếu mã vạch",
    });
  }
  if (buocCuoi) {
    buoc.push({
      nhan: "Dòng hàng đưa vào phân tích",
      giaTri: buocCuoi.dong_ra,
      ghiChu: buocCuoi.quy_tac,
    });
  }
  if (soRosterSku !== undefined) {
    buoc.push({
      nhan: "SKU trong danh mục phân tích",
      giaTri: soRosterSku,
      ghiChu: "Số SKU duy nhất sau toàn bộ bước lọc dòng hàng",
    });
  }
  if (tongTheoZ) {
    buoc.push({
      nhan: "SKU sống sót ở cả hai kỳ (Z=1)",
      giaTri: tongTheoZ.n1,
      ghiChu: "Đủ điều kiện giảm thuế theo luật, còn giá quan sát được ở cả tiền và hậu kỳ",
    });
    buoc.push({
      nhan: "SKU sống sót ở cả hai kỳ (Z=0)",
      giaTri: tongTheoZ.n0,
      ghiChu: "Luật loại trừ (thuế tiêu thụ đặc biệt), còn giá quan sát được ở cả hai kỳ",
    });
  }
  return buoc;
}
