/**
 * Bộ định dạng số dùng chung — kiểu Việt Nam (dấu phẩy thập phân), luôn kèm đơn vị
 * "điểm log ×100" cho mọi ước lượng hiệu ứng, để không nơi nào trong ứng dụng tự
 * viết `toFixed` rời rạc và lệch quy ước.
 */

const BO_DINH_DANG_SO_NGUYEN = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

/** Định dạng số thực kiểu Việt Nam, ví dụ 12345.678 → "12.345,68". */
export function dinhDangSo(gia_tri: number | null | undefined, chuSo = 2): string {
  if (gia_tri === null || gia_tri === undefined || Number.isNaN(gia_tri)) return "—";
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: chuSo,
    maximumFractionDigits: chuSo,
  }).format(gia_tri);
}

/** Định dạng số nguyên có dấu phân cách nghìn kiểu Việt Nam, ví dụ 233996 → "233.996". */
export function dinhDangSoNguyen(gia_tri: number | null | undefined): string {
  if (gia_tri === null || gia_tri === undefined || Number.isNaN(gia_tri)) return "—";
  return BO_DINH_DANG_SO_NGUYEN.format(gia_tri);
}

/** Định dạng ước lượng hiệu ứng, luôn kèm đơn vị "điểm log ×100" và dấu +/-. */
export function dinhDangDiemLog(gia_tri: number | null | undefined, chuSo = 3): string {
  if (gia_tri === null || gia_tri === undefined || Number.isNaN(gia_tri)) return "—";
  const dau = gia_tri > 0 ? "+" : "";
  return `${dau}${dinhDangSo(gia_tri, chuSo)} điểm log ×100`;
}

/** Định dạng khoảng tin cậy dạng "[−a,bb; +c,dd] điểm log ×100". */
export function dinhDangKtc(
  duoi: number | null | undefined,
  tren: number | null | undefined,
  doTinCay = 95
): string {
  if (duoi === null || duoi === undefined || tren === null || tren === undefined) return "—";
  return `KTC ${doTinCay}% [${dinhDangSo(duoi, 2)}; ${dinhDangSo(tren, 2)}] điểm log ×100`;
}

/** Định dạng p-value theo quy ước báo cáo khoa học (p < 0,001 khi quá nhỏ). */
export function dinhDangP(gia_tri: number | null | undefined): string {
  if (gia_tri === null || gia_tri === undefined || Number.isNaN(gia_tri)) return "p = —";
  if (gia_tri < 0.001) return "p < 0,001";
  return `p = ${dinhDangSo(gia_tri, 3)}`;
}

/** Định dạng tỉ lệ (0..1) thành phần trăm kiểu Việt Nam, ví dụ 0.871 → "87,1%". */
export function dinhDangPhanTram(ti_le: number | null | undefined, chuSo = 1): string {
  if (ti_le === null || ti_le === undefined || Number.isNaN(ti_le)) return "—";
  const phanTram = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: chuSo,
    maximumFractionDigits: chuSo,
  }).format(ti_le * 100);
  return `${phanTram}%`;
}

/** Định dạng tiền đồng Việt Nam, ví dụ 27000 → "27.000đ". */
export function dinhDangTien(gia_tri: number | null | undefined): string {
  if (gia_tri === null || gia_tri === undefined || Number.isNaN(gia_tri)) return "—";
  return `${BO_DINH_DANG_SO_NGUYEN.format(gia_tri)}đ`;
}

/** Định dạng SMD (độ lệch chuẩn hóa trung bình), 3 chữ số thập phân, có dấu. */
export function dinhDangSmd(gia_tri: number | null | undefined): string {
  if (gia_tri === null || gia_tri === undefined || Number.isNaN(gia_tri)) return "—";
  const dau = gia_tri > 0 ? "+" : "";
  return `${dau}${dinhDangSo(gia_tri, 3)}`;
}
