/**
 * Khung chuẩn cho một khối biểu đồ: tiêu đề, nhãn vai trò, alt text (role="img"),
 * ghi chú diễn giải, và bảng số thay thế đi kèm. Dùng cho cả 4 biểu đồ bắt buộc và
 * mọi biểu đồ phụ khác để đồng nhất cách trình bày trên toàn site.
 */
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NhanVaiTro } from "@/components/site/nhan-vai-tro";
import type { VaiTro } from "@/lib/vai-tro";

interface KhoiBieuDoProps {
  tieuDe: string;
  moTa?: string;
  vaiTro?: VaiTro;
  /** Mô tả bằng lời cho biểu đồ — dùng làm aria-label, đọc được cho trình đọc màn hình. */
  moTaChoBieuDo: string;
  children: ReactNode;
  bangThayThe: ReactNode;
  ghiChu?: ReactNode;
}

export function KhoiBieuDo({
  tieuDe,
  moTa,
  vaiTro,
  moTaChoBieuDo,
  children,
  bangThayThe,
  ghiChu,
}: KhoiBieuDoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base">{tieuDe}</CardTitle>
          {vaiTro && <NhanVaiTro vaiTro={vaiTro} />}
        </div>
        {moTa && <CardDescription>{moTa}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div role="img" aria-label={moTaChoBieuDo}>
          {children}
        </div>
        {ghiChu && <div className="mt-3 text-sm text-muted-foreground">{ghiChu}</div>}
        {bangThayThe}
      </CardContent>
    </Card>
  );
}
