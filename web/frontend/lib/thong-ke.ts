/**
 * Hằng số và hàm thống kê thuần túy — không chứa số liệu kết quả, chỉ chứa công
 * thức toán học áp dụng lên số liệu lấy từ API.
 */

/** Phân vị 95% của phân phối chuẩn tắc — dùng để dựng KTC 90% (TOST = hai kiểm định một phía ở mức 0,05). */
export const Z_90 = 1.6448536269514722;

/** Phân vị 97,5% của phân phối chuẩn tắc — dùng để dựng KTC 95%. */
export const Z_95 = 1.959963984540054;

export interface KhoangTinCay {
  duoi: number;
  tren: number;
}

/** Dựng khoảng tin cậy đối xứng từ ước lượng điểm và sai số chuẩn theo phân phối chuẩn. */
export function tinhKtc(uocLuong: number, se: number, z: number): KhoangTinCay {
  return { duoi: uocLuong - z * se, tren: uocLuong + z * se };
}
