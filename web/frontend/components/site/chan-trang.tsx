"use client";

/**
 * Footer: nguồn pháp lý cố định (không phải kết quả — tên nghị quyết là sự kiện
 * pháp lý công khai) + thông tin tái lập (hash nguồn, phiên bản môi trường) lấy từ
 * `/api/manifest` để chứng minh mọi số liệu trên trang truy vết được về đúng lần
 * chạy `code/chay_tat_ca.py` nào.
 */
import { useManifest } from "@/lib/hooks";
import { dinhDangSoNguyen } from "@/lib/format";

export function ChanTrang() {
  const { duLieu: manifest } = useManifest();

  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted-foreground">
        <p>
          Nguồn pháp lý: Nghị quyết 174/2024/QH15 (thuế suất 10%, hiệu lực tới 30/06/2025) và
          Nghị quyết 204/2025/QH15 (thuế suất 8%, hiệu lực từ 01/07/2025).
        </p>
        <p className="mt-1">
          Đơn vị hiệu ứng: điểm log ×100. Đơn vị phân tích: SKU (mã vạch), một cửa hàng tiện lợi
          TP.HCM — không suy rộng ra ngành bán lẻ Việt Nam.
        </p>
        {manifest && (
          <p className="mt-1">
            Tái lập từ <code>{manifest.nguon.file}</code> (sha256 rút gọn{" "}
            <code>{manifest.nguon.sha256_16}</code>) · Python {manifest.moi_truong.python} · pandas{" "}
            {manifest.moi_truong.pandas} · seed {dinhDangSoNguyen(manifest.tham_so.seed)} ·{" "}
            {dinhDangSoNguyen(manifest.tham_so.so_lan_bootstrap)} lần bootstrap.
          </p>
        )}
        <p className="mt-3">
          Toàn bộ số liệu trên trang này lấy trực tiếp từ backend FastAPI đọc CSV do pipeline sinh
          ra — không có con số nào được gõ tay trong mã nguồn frontend.
        </p>
      </div>
    </footer>
  );
}
