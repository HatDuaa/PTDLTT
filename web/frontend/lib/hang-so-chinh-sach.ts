/**
 * Hằng số PHÁP LÝ — không phải kết quả thống kê.
 *
 * Hai tỉ lệ dưới đây do Quốc hội quy định (Nghị quyết 174/2024/QH15 và
 * 204/2025/QH15), không phải số do pipeline ước lượng. Từ đó suy ra "mốc chuyển
 * hoàn toàn" bằng công thức đã nêu ở chương 5.3: log(thuế sau / thuế trước) × 100.
 *
 * Giá trị suy ra được ĐỐI CHIẾU (không thay thế) với dòng "đường cong mô phỏng" gần
 * mốc này trong `/api/mde` — xem `lib/derive.ts` (`laySucManhTaiMocChuyenHoanToan`).
 * Việc để công thức pháp lý ở đây, thay vì gõ tay con số rải rác trong UI, giữ đúng
 * nguyên tắc "một nguồn duy nhất": nếu Quốc hội đổi thuế suất, chỉ sửa ở đây.
 */

/** Thuế suất GTGT trước chính sách (Nghị quyết 174/2024/QH15), hiệu lực tới 30/06/2025. */
export const THUE_SUAT_TRUOC_CHINH_SACH = 0.1;

/** Thuế suất GTGT sau chính sách (Nghị quyết 204/2025/QH15), hiệu lực từ 01/07/2025. */
export const THUE_SUAT_SAU_CHINH_SACH = 0.08;

/**
 * Mốc "chuyển hoàn toàn" phần giảm thuế vào giá gồm thuế, tính bằng điểm log ×100:
 * nếu giá chưa thuế giữ nguyên và cửa hàng chuyển 100% phần giảm thuế vào giá gồm
 * thuế, chênh lệch log giá gồm thuế đúng bằng log(1+thuế_sau) − log(1+thuế_trước).
 */
export const MOC_CHUYEN_HOAN_TOAN =
  100 *
  Math.log(
    (1 + THUE_SUAT_SAU_CHINH_SACH) / (1 + THUE_SUAT_TRUOC_CHINH_SACH)
  );

/**
 * Biên tương đương TOST đã khóa trước khi chạy (chương 5.3): biên rộng = 1/2 mốc
 * chuyển hoàn toàn, biên hẹp = 1/4 mốc chuyển hoàn toàn. Suy ra từ MOC_CHUYEN_HOAN_TOAN
 * ở trên chứ không gõ tay ±0,918 / ±0,459.
 */
export const BIEN_TOST_RONG = Math.abs(MOC_CHUYEN_HOAN_TOAN) / 2;
export const BIEN_TOST_HEP = Math.abs(MOC_CHUYEN_HOAN_TOAN) / 4;

/**
 * Nhãn mẫu của so sánh chính trong cột `mau` của `kq-theo-tang.csv`.
 *
 * 🔴 Phải khớp CHÍNH XÁC giá trị pipeline ghi ra (`code/b4_uoc_luong.py`).
 * Lọc bằng chuỗi cứng rải rác trong nhiều file đã từng làm biểu đồ rỗng mà
 * không báo lỗi khi pipeline đổi nhãn — giữ ở một chỗ duy nhất.
 */
export const MAU_SO_SANH_CHINH = "so sánh theo Z";

/**
 * Nhãn trục/mức trong `kq-do-nhay.csv` (cột `truc` và `muc`).
 *
 * 🔴 Cùng loại hợp đồng như trên, và đã từng hỏng theo đúng cách đã cảnh báo:
 * frontend tra cứu "23 SKU chưa phân loại" / "loại (cơ sở)" trong khi pipeline
 * ghi "23 SKU chưa rõ [ITT]" / "cơ sở (loại 23 SKU)". Không khớp ⇒ hiển thị "—"
 * ngay câu mở đầu trang chủ, không lỗi, không cảnh báo.
 *
 * Nguồn sự thật: `code/config_du_an.py::NHAN_DO_NHAY`.
 */
/**
 * Nhãn hiển thị hai biến thể PP1-A trong cột `pp` của `kq-uoc-luong-chinh.csv`.
 * Nguồn sự thật: `code/config_du_an.py::TEN_HIEN_THI_PP1A`.
 */
export const TEN_PP1A_THO = "PP1-A thô";
export const TEN_PP1A_HIEP_BIEN = "PP1-A hiệp biến";

export const DO_NHAY_CHUA_RO_TRUC = "23 SKU chưa rõ [ITT]";
export const DO_NHAY_CHUA_RO_CO_SO = "cơ sở (loại 23 SKU)";
export const DO_NHAY_CHUA_RO_Z1 = "gán tất cả Z=1";
export const DO_NHAY_CHUA_RO_Z0 = "gán tất cả Z=0";
