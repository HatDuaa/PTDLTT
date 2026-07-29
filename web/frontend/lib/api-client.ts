/**
 * Client gọi API backend FastAPI — hàm duy nhất chịu trách nhiệm fetch + parse JSON
 * cho từng endpoint. Không có logic hiển thị ở đây; xem `lib/hooks.ts` cho phần
 * tích hợp React và `lib/format.ts` cho phần định dạng số.
 */
import { API_BASE_URL, API_ROUTES, type EdaTen } from "./config";
import type {
  BamChuanRow,
  CongChanDoanRow,
  DoNhayRow,
  EdaTenRowMap,
  LamTronRow,
  LuongMauRow,
  ManifestData,
  MdeRawRow,
  SanLuongRow,
  SmdSauPhanTangRow,
  TheoTangRow,
  UocLuongChinhRow,
} from "./types";

/** Lỗi gọi API — bọc thêm mã trạng thái HTTP và đường dẫn để hiển thị lỗi rõ ràng. */
export class LoiGoiApi extends Error {
  constructor(
    message: string,
    public readonly duongDan: string,
    public readonly maTrangThai?: number
  ) {
    super(message);
    this.name = "LoiGoiApi";
  }
}

async function goiApi<T>(duongDan: string): Promise<T> {
  const url = `${API_BASE_URL}${duongDan}`;
  let res: Response;
  try {
    res = await fetch(url, { headers: { Accept: "application/json" } });
  } catch {
    throw new LoiGoiApi(
      `Không kết nối được tới backend tại ${url}. Backend có thể chưa chạy.`,
      duongDan
    );
  }

  if (!res.ok) {
    throw new LoiGoiApi(
      `Backend trả lỗi ${res.status} cho ${duongDan}`,
      duongDan,
      res.status
    );
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new LoiGoiApi(`Không đọc được JSON trả về từ ${duongDan}`, duongDan);
  }
}

export const apiClient = {
  layUocLuongChinh: () => goiApi<UocLuongChinhRow[]>(API_ROUTES.uocLuongChinh),
  layTheoTang: () => goiApi<TheoTangRow[]>(API_ROUTES.theoTang),
  layCongChanDoan: () => goiApi<CongChanDoanRow[]>(API_ROUTES.congChanDoan),
  layDoNhay: () => goiApi<DoNhayRow[]>(API_ROUTES.doNhay),
  layMde: () => goiApi<MdeRawRow[]>(API_ROUTES.mde),
  layLamTron: () => goiApi<LamTronRow[]>(API_ROUTES.lamTron),
  layBamChuan: () => goiApi<BamChuanRow[]>(API_ROUTES.bamChuan),
  laySanLuong: () => goiApi<SanLuongRow[]>(API_ROUTES.sanLuong),
  layLuongMau: () => goiApi<LuongMauRow[]>(API_ROUTES.luongMau),
  laySmdSauPhanTang: () => goiApi<SmdSauPhanTangRow[]>(API_ROUTES.smdSauPhanTang),
  layManifest: () => goiApi<ManifestData>(API_ROUTES.manifest),
  layEda: <T extends EdaTen>(ten: T) =>
    goiApi<EdaTenRowMap[T][]>(API_ROUTES.eda(ten)),
};
