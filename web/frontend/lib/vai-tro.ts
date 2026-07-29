/**
 * Nhãn vai trò bắt buộc hiển thị cạnh mỗi khối kết quả (yêu cầu §7 phase-05).
 *
 * Cố ý KHÔNG gắn màu sắc phân biệt giữa các vai trò — màu không được dùng như một
 * phán quyết "tốt/xấu" trong toàn bộ ứng dụng này. Mọi nhãn dùng chung một kiểu
 * badge viền trung tính, chỉ khác nhau ở chữ.
 */
export type VaiTro = "chinh" | "phu" | "kham-pha" | "co-hoc" | "chan-doan";

export const NHAN_VAI_TRO: Record<VaiTro, string> = {
  chinh: "chính",
  phu: "phụ",
  "kham-pha": "khám phá",
  "co-hoc": "cơ học",
  "chan-doan": "chẩn đoán, không có địa vị suy diễn",
};

export const MO_TA_VAI_TRO: Record<VaiTro, string> = {
  chinh:
    "Ước lượng đích của đồ án — so sánh theo Z trong nhóm SKU có giá quan sát được ở cả hai kỳ.",
  phu:
    "Cần thêm giả định (quyết định cập nhật thuế không liên quan xu hướng giá phản thực) so với ước lượng chính.",
  "kham-pha":
    "Không có địa vị nhân quả — chỉ mô tả cơ chế/biên độ khả dĩ, chưa kiểm định như estimand chính.",
  "co-hoc":
    "Phép tính hoặc đối chiếu theo một chuẩn cơ học (kể cả quy tắc làm tròn), không có địa vị suy diễn nhân quả.",
  "chan-doan":
    "Dùng để đọc mức độ tin cậy của giả định xu hướng song song — không dùng để tính hiệu ứng.",
};

/** Ánh xạ `vai_tro` thô trong CSV (tiếng Việt có dấu, có thể lệch chính tả) về khóa chuẩn. */
export function chuanHoaVaiTro(vaiTroTho: string): VaiTro {
  const s = vaiTroTho.trim().toLowerCase();
  if (s.startsWith("chính")) return "chinh";
  if (s.startsWith("phụ")) return "phu";
  if (s.startsWith("khám")) return "kham-pha";
  if (s.startsWith("cơ học")) return "co-hoc";
  return "chan-doan";
}
