/**
 * Ngưỡng THIẾT KẾ đã khóa trước khi chạy phân tích (pre-registered), không phải kết
 * quả thống kê. Các ngưỡng này quyết định cách ĐỌC kết quả (cột `truot_cong2`,
 * `tuong_duong_cong3` trong `/api/cong-chan-doan` đã áp sẵn ngưỡng này ở backend),
 * nhưng bản thân con số ngưỡng không xuất hiện trong bất kỳ CSV/endpoint nào —
 * pipeline chỉ xuất kết quả ĐÃ áp ngưỡng, không xuất lại ngưỡng.
 *
 * Nguồn: chương 4.8 và chương 5.5 của báo cáo (`bao-cao/chuong-04-thiet-ke-nhan-qua.md`,
 * `bao-cao/chuong-05-ket-qua.md`).
 */

/** Cổng 1: ngưỡng |SMD| tối đa cho một cặp biến tiền kỳ được coi là cân bằng. */
export const NGUONG_SMD = 0.25;

/** Cổng 1: tỉ lệ tối đa các cặp được phép vượt ngưỡng SMD để coi là "đạt". */
export const TY_LE_TOI_DA_VUOT_NGUONG_SMD = 1 / 3;

/** Mức ý nghĩa thống kê dùng xuyên suốt báo cáo. */
export const ALPHA = 0.05;

/** Sức mạnh mục tiêu dùng để tính MDE (Minimum Detectable Effect). */
export const SUC_MANH_MUC_TIEU = 0.8;
