/**
 * Khung Card chuẩn cho một khối nội dung không phải biểu đồ (bảng, văn bản diễn
 * giải) — vẫn mang nhãn vai trò bắt buộc như `KhoiBieuDo`.
 */
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NhanVaiTro } from "@/components/site/nhan-vai-tro";
import type { VaiTro } from "@/lib/vai-tro";

interface KhoiKetQuaProps {
  tieuDe: string;
  moTa?: string;
  vaiTro?: VaiTro;
  children: ReactNode;
}

export function KhoiKetQua({ tieuDe, moTa, vaiTro, children }: KhoiKetQuaProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base">{tieuDe}</CardTitle>
          {vaiTro && <NhanVaiTro vaiTro={vaiTro} />}
        </div>
        {moTa && <CardDescription>{moTa}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
