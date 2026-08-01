"use client";

/**
 * Hook dữ liệu dùng chung cho toàn bộ ứng dụng — kể cả `/trinh-bay`.
 *
 * Mỗi hook gọi đúng một endpoint backend, chia sẻ cache qua `lib/data-cache.ts`.
 * Không trang nào được phép tự viết logic fetch riêng: dùng lại các hook ở đây để
 * đảm bảo slide và các trang phân tích luôn hiển thị cùng một con số.
 */
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { apiClient } from "./api-client";
import type { EdaTen } from "./config";
import { dangKyLangNghe, laySnapshot, taiDuLieuMotLan, taiLaiDuLieu } from "./data-cache";
import type { EdaTenRowMap } from "./types";

export interface KetQuaHook<T> {
  duLieu: T | undefined;
  dangTai: boolean;
  loi: Error | undefined;
  thuLai: () => void;
}

function useApi<T>(khoa: string, fetcher: () => Promise<T>): KetQuaHook<T> {
  useEffect(() => {
    taiDuLieuMotLan(khoa, fetcher);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [khoa]);

  const layMuc = useCallback(() => laySnapshot<T>(khoa), [khoa]);
  const muc = useSyncExternalStore(
    useCallback((goi) => dangKyLangNghe(khoa, goi), [khoa]),
    layMuc,
    layMuc
  );

  const thuLai = useCallback(() => taiLaiDuLieu(khoa, fetcher), [khoa, fetcher]);

  return {
    duLieu: muc.duLieu,
    dangTai: muc.trangThai === "chua_tai" || muc.trangThai === "dang_tai",
    loi: muc.loi,
    thuLai,
  };
}

export function useUocLuongChinh() {
  return useApi("uoc-luong-chinh", apiClient.layUocLuongChinh);
}

export function useTheoTang() {
  return useApi("theo-tang", apiClient.layTheoTang);
}

export function useCongChanDoan() {
  return useApi("cong-chan-doan", apiClient.layCongChanDoan);
}

export function useDoNhay() {
  return useApi("do-nhay", apiClient.layDoNhay);
}

export function useMde() {
  return useApi("mde", apiClient.layMde);
}

export function useLamTron() {
  return useApi("lam-tron", apiClient.layLamTron);
}

export function useBamChuan() {
  return useApi("bam-chuan", apiClient.layBamChuan);
}

export function useSanLuong() {
  return useApi("san-luong", apiClient.laySanLuong);
}

export function useLuongMau() {
  return useApi("luong-mau", apiClient.layLuongMau);
}

export function useSmdSauPhanTang() {
  return useApi("smd-sau-phan-tang", apiClient.laySmdSauPhanTang);
}

export function useMoTaYTheoNhom() {
  return useApi("mo-ta-y-theo-nhom", apiClient.layMoTaYTheoNhom);
}

export function useHeSoMoHinh() {
  return useApi("he-so-mo-hinh", apiClient.layHeSoMoHinh);
}

export function useChanDoanHiepBien() {
  return useApi("chan-doan-hiep-bien", apiClient.layChanDoanHiepBien);
}

export function useBamChuanChiTiet() {
  return useApi("bam-chuan-chi-tiet", apiClient.layBamChuanChiTiet);
}

export function useManifest() {
  return useApi("manifest", apiClient.layManifest);
}

export function useEda<T extends EdaTen>(ten: T): KetQuaHook<EdaTenRowMap[T][]> {
  const fetcher = useCallback(() => apiClient.layEda(ten), [ten]);
  return useApi(`eda-${ten}`, fetcher);
}
