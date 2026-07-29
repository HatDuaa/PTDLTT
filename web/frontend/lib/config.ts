/**
 * Cấu hình gọi API backend (FastAPI) — nguồn số liệu DUY NHẤT của toàn bộ frontend.
 *
 * Không có con số kết quả nào được gõ tay trong mã nguồn frontend. Mọi giá trị hiển thị
 * (ước lượng, sai số chuẩn, p-value, số SKU, v.v.) phải đi qua các hàm trong `lib/api-client.ts`.
 *
 * Vì trang được xuất tĩnh (`output: 'export'`), URL backend được đọc từ biến môi trường
 * `NEXT_PUBLIC_API_BASE_URL` tại thời điểm build; nếu không có, mặc định trỏ tới backend
 * FastAPI chạy cục bộ. Việc gọi API diễn ra ở phía trình duyệt (client component), nên
 * `next build` không cần backend đang chạy — trang tĩnh chỉ cần backend khi người dùng
 * thực sự mở trang trong trình duyệt.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

export const API_ROUTES = {
  uocLuongChinh: "/api/uoc-luong-chinh",
  theoTang: "/api/theo-tang",
  congChanDoan: "/api/cong-chan-doan",
  doNhay: "/api/do-nhay",
  mde: "/api/mde",
  lamTron: "/api/lam-tron",
  bamChuan: "/api/bam-chuan",
  sanLuong: "/api/san-luong",
  luongMau: "/api/luong-mau",
  eda: (ten: EdaTen) => `/api/eda/${ten}`,
  smdSauPhanTang: "/api/smd-sau-phan-tang",
  manifest: "/api/manifest",
} as const;

/** Tên tập dữ liệu EDA hợp lệ — khớp với các file `eda-*.csv` trong `ket-qua/`. */
export type EdaTen =
  | "do-phu-theo-thang"
  | "ma-tran-chuyen-thue"
  | "can-bang-tien-ky"
  | "co-cau-loai-san-pham"
  | "ho-tro-phan-tang"
  | "luoi-survivorship";
