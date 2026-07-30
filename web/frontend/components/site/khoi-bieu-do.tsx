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
  /**
   * Bỏ hẳn phần đầu thẻ (tiêu đề · mô tả · nhãn vai trò).
   *
   * Chỉ dùng trong bản trình chiếu: ở đó slide đã có tiêu đề và câu chốt nói
   * đúng nội dung ấy, nên giữ lại thành ra một slide có hai tiêu đề chồng nhau
   * và một dòng chữ nhỏ không ai đọc từ xa. Trên web thì phần đầu này bắt buộc
   * phải có — nhãn vai trò là cam kết trung thực của đồ án.
   */
  anTieuDe?: boolean;
}

export function KhoiBieuDo({
  tieuDe,
  moTa,
  vaiTro,
  moTaChoBieuDo,
  children,
  bangThayThe,
  ghiChu,
  anTieuDe = false,
}: KhoiBieuDoProps) {
  return (
    <Card>
      {!anTieuDe && (
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-base">{tieuDe}</CardTitle>
            {vaiTro && <NhanVaiTro vaiTro={vaiTro} />}
          </div>
          {moTa && <CardDescription>{moTa}</CardDescription>}
        </CardHeader>
      )}
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
