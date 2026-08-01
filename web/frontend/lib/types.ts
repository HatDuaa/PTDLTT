/**
 * Kiểu dữ liệu TypeScript khớp với cột trong các CSV do `code/chay_tat_ca.py` sinh ra
 * (xem `ket-qua/*.csv`) và được FastAPI phục vụ nguyên trạng (đọc CSV bằng pandas rồi
 * trả JSON với đúng tên cột). Đây là giả định về hợp đồng API — nếu backend đổi tên
 * trường, chỉ cần sửa file này và `lib/api-client.ts`.
 *
 * Đơn vị mặc định của mọi ước lượng/SE/KTC: điểm log ×100.
 */

/** `vai_tro` gắn với mỗi khối kết quả — dùng để hiển thị nhãn vai trò bắt buộc. */
export type VaiTroKetQua = "chính" | "phụ" | "khám phá" | "cơ học" | "chẩn đoán";

// ---------------------------------------------------------------------------
// /api/uoc-luong-chinh — kq-uoc-luong-chinh.csv
// ---------------------------------------------------------------------------
export interface UocLuongChinhRow {
  vai_tro: string;
  uoc_luong: number;
  pp: string;
  se: number;
  p: number;
  ktc_duoi: number;
  ktc_tren: number;
  pass_through: number | null;
  p_chuyen_hoan_toan: number | null;
  tost_hep: number | null;
  tost_rong: number | null;
  so_lan_hop_le: number | null;
  so_lan_that_bai: number | null;
}

// ---------------------------------------------------------------------------
// /api/theo-tang — kq-theo-tang.csv
// ---------------------------------------------------------------------------
export interface TheoTangRow {
  mau: string;
  tang: number;
  n1: number;
  n0: number;
  gia_min: number;
  gia_max: number;
  tau_s: number;
  w_s: number;
}

// ---------------------------------------------------------------------------
// /api/cong-chan-doan — kq-cong-chan-doan.csv
// ---------------------------------------------------------------------------
export interface CongChanDoanRow {
  mau: string;
  dac_ta: string;
  n: number;
  uoc_luong: number;
  se: number;
  p: number;
  tost_p: number;
  truot_cong2: boolean;
  tuong_duong_cong3: boolean;
}

// ---------------------------------------------------------------------------
// /api/do-nhay — kq-do-nhay.csv
// ---------------------------------------------------------------------------
export interface DoNhayRow {
  truc: string;
  muc: string;
  n: number;
  pp: string;
  uoc_luong: number;
  se: number;
  p: number;
  ktc_duoi: number;
  ktc_tren: number;
  so_lan_hop_le: number | null;
  so_lan_that_bai: number | null;
}

// ---------------------------------------------------------------------------
// /api/mde — kq-mde-va-suc-manh.csv (hai loại dòng trộn trong cùng file)
// ---------------------------------------------------------------------------
export interface MdeRawRow {
  dac_ta: string;
  se: number | null;
  mde: number | null;
  suc_manh_tai_moc_chuyen_hoan_toan: number | null;
  bien_tost_du_80: number | null;
  suc_manh_tost_bien_dang_dung: number | null;
  delta: number | null;
  suc_manh: number | null;
}

/** Dòng đặc tả MDE (mỗi phương pháp một dòng). */
export interface MdeDacTaRow {
  dac_ta: string;
  se: number;
  mde: number;
  suc_manh_tai_moc_chuyen_hoan_toan: number;
  bien_tost_du_80: number;
  suc_manh_tost_bien_dang_dung: number;
}

/** Một điểm trên đường cong sức mạnh mô phỏng (δ, sức mạnh). */
export interface DuongCongSucManhDiem {
  delta: number;
  suc_manh: number;
}

// ---------------------------------------------------------------------------
// /api/lam-tron — kq-mo-phong-lam-tron.csv
// ---------------------------------------------------------------------------
export interface LamTronRow {
  buoc_lam_tron: number;
  so_sku: number;
  so_doi_muc: number;
  ti_le_doi_muc: number;
}

// ---------------------------------------------------------------------------
// /api/bam-chuan — kq-bam-chuan-co-hoc.csv
// ---------------------------------------------------------------------------
export interface BamChuanRow {
  vai_tro: "nhóm được giảm thuế" | "giả dược";
  Z: 0 | 1;
  n_sku_toan_nhom: number;
  n_du_bao_doi_muc: number;
  n_bam_chuan: number;
  ti_le_bam_chuan: number;
  ktc95_wilson_duoi: number;
  ktc95_wilson_tren: number;
  n_giu_nguyen_gia: number;
  buoc_lam_tron: number;
  nguong_bam_chuan_dong: number;
}

// ---------------------------------------------------------------------------
// /api/san-luong — kq-san-luong.csv
// ---------------------------------------------------------------------------
export interface SanLuongRow {
  nhanh: string;
  n: number;
  uoc_luong: number;
  se: number;
  p: number;
  ktc_duoi: number;
  ktc_tren: number;
  mde: number;
}

// ---------------------------------------------------------------------------
// /api/luong-mau — bang-luong-mau.csv
// ---------------------------------------------------------------------------
export interface LuongMauRow {
  buoc: number;
  quy_tac: string;
  dong_vao: number;
  dong_ra: number;
  mat: number;
  ghi_chu: string | null;
}

// ---------------------------------------------------------------------------
// /api/smd-sau-phan-tang — kq-smd-sau-phan-tang.csv
// SMD của từng hiệp biến TRONG từng tầng, SAU khi phân tầng — dữ liệu chính thức
// cho Cổng 1 (chương 4.8/5.5). 5 tầng × 3 hiệp biến = 15 dòng.
// ---------------------------------------------------------------------------
export interface SmdSauPhanTangRow {
  tang: number;
  bien: string;
  n1: number;
  n0: number;
  smd: number;
  vuot_nguong: boolean;
}

// ---------------------------------------------------------------------------
// /api/mo-ta-y-theo-nhom — kq-mo-ta-y-theo-nhom.csv
// Mô tả biến kết quả theo nhóm Z, THÔ, trước mọi phép điều chỉnh. Hai dòng.
//
// `y_tb` DƯƠNG ở cả hai nhóm: giá cả hai đều tăng. Vì vậy chênh lệch âm trong
// mọi bảng ước lượng là chênh lệch giữa hai mức TĂNG, không phải mức giảm — đây
// là chỗ chống hiểu nhầm quan trọng nhất khi đọc kết quả.
// ---------------------------------------------------------------------------
export interface MoTaYTheoNhomRow {
  Z: number;
  n: number;
  y_tb: number;
  y_trung_vi: number;
  y_do_lech_chuan: number;
  n_giu_nguyen_gia: number;
}

// ---------------------------------------------------------------------------
// /api/he-so-mo-hinh — kq-he-so-mo-hinh.csv
// Hệ số đầy đủ của ba mô hình. `chenh_lech_x` là trung bình X nhóm Z=1 trừ nhóm
// Z=0, chỉ có ở các dòng hiệp biến — nhân với `he_so` là ra phần đóng góp của
// từng biến vào dự báo phản thực.
// ---------------------------------------------------------------------------
export type TenMoHinh = "tho" | "hiep_bien" | "g_comp_z0";

export interface HeSoMoHinhRow {
  mo_hinh: TenMoHinh;
  bien: string;
  he_so: number;
  chenh_lech_x: number | null;
}

// ---------------------------------------------------------------------------
// /api/chan-doan-hiep-bien — kq-chan-doan-hiep-bien.csv
// Dạng dài `chi_so` → `gia_tri`. Giải thích vì sao thêm hiệp biến làm sai số của
// Z tăng: phần dư gần như không đổi (không có lợi) trong khi Z đoán được từ X
// (chịu phí cộng tuyến).
// ---------------------------------------------------------------------------
export interface ChanDoanHiepBienRow {
  chi_so: string;
  gia_tri: number;
}

// ---------------------------------------------------------------------------
// /api/manifest — manifest-tai-lap.json
// ---------------------------------------------------------------------------
export interface ManifestData {
  nguon: { file: string; sha256_16: string };
  moi_truong: { python: string; pandas: string; numpy: string };
  tham_so: {
    ngay_chinh_sach: string;
    cua_so_chinh_bat_dau: string;
    seed: number;
    so_lan_bootstrap: number;
    nguong_tuan_chinh: number;
  };
  dau_ra: Record<string, { so_dong: number; sha256_16: string }>;
}

// ---------------------------------------------------------------------------
// /api/eda/{ten} — eda-*.csv, một kiểu riêng cho mỗi `ten`
// ---------------------------------------------------------------------------
export interface EdaDoPhuThangRow {
  thang: string;
  so_ngay_co_du_lieu: number;
  so_hoa_don: number;
  so_dong_hang: number;
  ti_le_co_ma_vach: number;
  so_sku: number | null;
}

export interface EdaMaTranChuyenTheRow {
  tien: string;
  hau: string;
  so_sku: number;
}

/**
 * Ba biến nền theo nhóm Z, ở THANG GỐC (đồng, số lượng, số tuần).
 *
 * Khác `EdaCanBangTienKyRow` ở chỗ đó: bảng cân bằng báo trung vị/IQR ở thang
 * log vì nó phục vụ SMD và biểu đồ chồng lấn. Bảng này để nói thành lời — "72
 * nghìn so với 109 nghìn", "6,2 so với 33,3".
 */
export interface EdaMoTaNenTheoNhomRow {
  Z: number;
  n: number;
  pre_p_tb: number;
  pre_p_trung_vi: number;
  pre_q_tb: number;
  pre_w_tb: number;
}

export interface EdaCanBangTienKyRow {
  doi_chung: string;
  n_C: number;
  bien: string;
  T_trung_vi: number;
  C_trung_vi: number;
  T_IQR: number;
  C_IQR: number;
  SMD: number;
}

export interface EdaCoCauLoaiRow {
  loai_sp: string;
  C10: number;
  C8: number;
  T: number;
}

export interface EdaHoTroPhanTangRow {
  doi_chung: string;
  tang: number;
  gia_nen_min: number;
  gia_nen_max: number;
  n_T: number;
  n_C: number;
  mong: boolean;
}

export interface EdaLuoiSurvivorshipRow {
  nguong_tuan: number;
  nhom: string;
  so_giu: number;
  so_loai: number;
  gia_nen_giu: number;
  gia_nen_loai: number | null;
  sl_giu: number | null;
  sl_loai: number | null;
}

/** Một hàng của `eda-doanh-thu-theo-lich.csv` — hai trục lịch gộp chung một file. */
export interface EdaDoanhThuTheoLichRow {
  /** "thứ trong tuần" hoặc "ngày trong tháng". */
  truc: string;
  ma_nhom: string;
  nhan: string;
  so_hoa_don: number;
  tong_doanh_thu: number;
  trung_binh_moi_hoa_don: number;
}

export interface EdaTenRowMap {
  "do-phu-theo-thang": EdaDoPhuThangRow;
  "doanh-thu-theo-lich": EdaDoanhThuTheoLichRow;
  "ma-tran-chuyen-thue": EdaMaTranChuyenTheRow;
  "can-bang-tien-ky": EdaCanBangTienKyRow;
  "co-cau-loai-san-pham": EdaCoCauLoaiRow;
  "ho-tro-phan-tang": EdaHoTroPhanTangRow;
  "luoi-survivorship": EdaLuoiSurvivorshipRow;
  "mo-ta-nen-theo-nhom": EdaMoTaNenTheoNhomRow;
}
