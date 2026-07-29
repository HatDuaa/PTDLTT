/**
 * Khối diễn giải bằng lời thường, đặt NGAY CẠNH mỗi khối số liệu.
 *
 * Lý do tồn tại: người đọc của đồ án này là giảng viên và ba sinh viên cùng
 * nhóm, không phải người đọc tạp chí. Một bảng p-value không tự nói lên điều
 * gì với họ. Mỗi con số phải có một câu trả lời được câu hỏi "vậy nghĩa là
 * sao" — nếu không, phần đó coi như chưa viết xong.
 *
 * Ba biến thể:
 *   `y-nghia`  — mặc định. "Con số này nói lên điều gì."
 *   `vi-du`    — ví von hoặc ví dụ đời thường giúp hình dung.
 *   `canh-bao` — chỗ người đọc dễ hiểu sai. Dùng dè, nếu mọi khối đều cảnh
 *                báo thì không khối nào còn được chú ý.
 */
import type { ReactNode } from "react";
import { InfoIcon, LightbulbIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type KieuDienGiai = "y-nghia" | "vi-du" | "canh-bao";

const CAU_HINH: Record<
  KieuDienGiai,
  { nhan: string; Icon: typeof InfoIcon; vien: string; mauIcon: string }
> = {
  "y-nghia": {
    nhan: "Nghĩa là gì",
    Icon: InfoIcon,
    vien: "border-l-sky-600 dark:border-l-sky-400",
    mauIcon: "text-sky-700 dark:text-sky-400",
  },
  "vi-du": {
    nhan: "Hình dung thế này",
    Icon: LightbulbIcon,
    vien: "border-l-amber-600 dark:border-l-amber-400",
    mauIcon: "text-amber-700 dark:text-amber-400",
  },
  "canh-bao": {
    nhan: "Dễ hiểu nhầm",
    Icon: TriangleAlertIcon,
    vien: "border-l-rose-600 dark:border-l-rose-400",
    mauIcon: "text-rose-700 dark:text-rose-400",
  },
};

export function DienGiai({
  kieu = "y-nghia",
  tieuDe,
  children,
  className,
}: {
  kieu?: KieuDienGiai;
  /** Ghi đè nhãn mặc định khi cần nói cụ thể hơn. */
  tieuDe?: string;
  children: ReactNode;
  className?: string;
}) {
  const { nhan, Icon, vien, mauIcon } = CAU_HINH[kieu];
  return (
    <div className={cn("rounded-md border border-l-4 bg-muted/40 p-3", vien, className)}>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
        <Icon aria-hidden className={cn("size-3.5 shrink-0", mauIcon)} />
        {tieuDe ?? nhan}
      </p>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
