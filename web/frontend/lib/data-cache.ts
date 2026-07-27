/**
 * Bộ nhớ đệm tối giản dùng chung cho mọi hook gọi API (`lib/hooks.ts`).
 *
 * Mục đích: khi nhiều trang (kể cả `/trinh-bay`) cùng gọi một endpoint, chỉ có một
 * request thực sự được gửi đi và mọi nơi dùng chung một kết quả — đảm bảo slide
 * không thể hiển thị số khác với các trang phân tích chi tiết.
 *
 * Đây KHÔNG phải nơi lưu số liệu — nó chỉ cache kết quả gọi API, dữ liệu thật luôn
 * đến từ backend tại thời điểm chạy trong trình duyệt.
 */

export type TrangThai = "chua_tai" | "dang_tai" | "thanh_cong" | "loi";

export interface MucCache<T> {
  trangThai: TrangThai;
  duLieu?: T;
  loi?: Error;
}

const boNho = new Map<string, MucCache<unknown>>();
const nguoiNghe = new Map<string, Set<() => void>>();
const dangChay = new Map<string, Promise<void>>();

function layHoacTaoMuc<T>(khoa: string): MucCache<T> {
  let muc = boNho.get(khoa) as MucCache<T> | undefined;
  if (!muc) {
    muc = { trangThai: "chua_tai" };
    boNho.set(khoa, muc);
  }
  return muc;
}

function ganMuc<T>(khoa: string, muc: MucCache<T>) {
  boNho.set(khoa, muc);
  nguoiNghe.get(khoa)?.forEach((goi) => goi());
}

/** Đăng ký lắng nghe thay đổi của một khóa cache — dùng trong `useSyncExternalStore`. */
export function dangKyLangNghe(khoa: string, goi: () => void): () => void {
  if (!nguoiNghe.has(khoa)) nguoiNghe.set(khoa, new Set());
  const tap = nguoiNghe.get(khoa)!;
  tap.add(goi);
  return () => tap.delete(goi);
}

/** Lấy snapshot hiện tại của một khóa — reference chỉ đổi khi trạng thái thực sự đổi. */
export function laySnapshot<T>(khoa: string): MucCache<T> {
  return layHoacTaoMuc<T>(khoa);
}

/** Gọi `fetcher` đúng một lần cho mỗi khóa, chia sẻ kết quả cho mọi hook đang lắng nghe. */
export function taiDuLieuMotLan<T>(khoa: string, fetcher: () => Promise<T>): void {
  const hienTai = layHoacTaoMuc<T>(khoa);
  if (hienTai.trangThai === "thanh_cong" || dangChay.has(khoa)) return;

  ganMuc<T>(khoa, { trangThai: "dang_tai" });

  const promise = fetcher()
    .then((duLieu) => {
      ganMuc<T>(khoa, { trangThai: "thanh_cong", duLieu });
    })
    .catch((err: unknown) => {
      const loi = err instanceof Error ? err : new Error(String(err));
      ganMuc<T>(khoa, { trangThai: "loi", loi });
    })
    .finally(() => {
      dangChay.delete(khoa);
    });

  dangChay.set(khoa, promise);
}

/** Buộc tải lại một khóa (bỏ qua cache thành công hiện có) — dùng cho nút "thử lại". */
export function taiLaiDuLieu<T>(khoa: string, fetcher: () => Promise<T>): void {
  boNho.delete(khoa);
  taiDuLieuMotLan<T>(khoa, fetcher);
}
