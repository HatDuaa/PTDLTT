/**
 * Thanh trực quan cho một tỉ lệ "x trên n".
 *
 * Lý do tồn tại: đồ án có vài tỉ lệ rất lệch — 1/135, 110/135 — mà viết bằng
 * chữ thì người đọc phải tự nhẩm mới thấy nó lệch tới đâu. Một thanh dài
 * ngắn cho thấy ngay lập tức.
 *
 * Không dùng màu để mang nghĩa "tốt/xấu": tỉ lệ ở đây là quan sát, không phải
 * điểm số. Trị số luôn hiện bằng CHỮ cạnh thanh, nên người dùng trình đọc màn
 * hình và người mù màu đều nhận được đủ thông tin mà không cần nhìn thanh.
 */
import { dinhDangPhanTram } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ThanhTiLe({
  nhan,
  tuSo,
  mauSo,
  ghiChu,
  noiBat = false,
  className,
}: {
  nhan: string;
  tuSo: number;
  mauSo: number;
  /** Câu ngắn giải thích con số, hiện dưới thanh. */
  ghiChu?: string;
  /** Làm đậm hàng cần người đọc chú ý trước. */
  noiBat?: boolean;
  className?: string;
}) {
  const hopLe = Number.isFinite(tuSo) && Number.isFinite(mauSo) && mauSo > 0;
  const tiLe = hopLe ? tuSo / mauSo : 0;
  // Tỉ lệ cực nhỏ (1/135 ≈ 0,7%) sẽ biến mất hoàn toàn nếu vẽ đúng bề rộng.
  // Giữ một vạch tối thiểu để người đọc thấy "có, nhưng rất ít" thay vì "không có".
  const beRong = hopLe && tuSo > 0 ? Math.max(tiLe * 100, 1.5) : 0;

  return (
    <div className={cn("grid gap-1", className)}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={cn(noiBat && "font-semibold")}>{nhan}</span>
        <span className="shrink-0 tabular-nums text-muted-foreground">
          {hopLe ? (
            <>
              <span className={cn("text-foreground", noiBat && "font-semibold")}>{tuSo}</span>
              {" / "}
              {mauSo}
              {" · "}
              {/* Dùng formatter chung: `toFixed` cho "0.7%" dấu chấm, lệch với
                  phần còn lại của web vốn hiển thị "0,7%" theo chuẩn Việt. */}
              {dinhDangPhanTram(tiLe)}
            </>
          ) : (
            "—"
          )}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${nhan}: ${hopLe ? `${tuSo} trên ${mauSo}` : "chưa có dữ liệu"}`}
      >
        <div
          className={cn("h-full rounded-full", noiBat ? "bg-foreground" : "bg-muted-foreground")}
          style={{ width: `${beRong}%` }}
        />
      </div>
      {ghiChu && <p className="text-xs text-muted-foreground">{ghiChu}</p>}
    </div>
  );
}
