/**
 * Bảng dữ liệu hiển thị đầy đủ, không thu gọn — dùng cho các bảng phải hiện đủ mọi
 * dòng kể cả kết quả bất lợi (bảng độ nhạy, bảng luồng mẫu, bảng cân bằng, v.v.).
 * Khác với `BangSoThayThe` (thu gọn trong accordion, đi kèm biểu đồ).
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CotBang } from "@/components/site/bang-so-thay-the";

interface BangDuLieuProps<T> {
  cot: CotBang<T>[];
  hang: T[];
  chuThich?: string;
}

export function BangDuLieu<T>({ cot, hang, chuThich }: BangDuLieuProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {cot.map((c) => (
              <TableHead key={c.khoa}>{c.nhan}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {hang.map((h, i) => (
            <TableRow key={i}>
              {cot.map((c) => (
                <TableCell key={c.khoa}>
                  {c.dinhDang ? c.dinhDang(h) : layGiaTriCot(h, c.khoa)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {chuThich && <p className="border-t px-3 py-2 text-xs text-muted-foreground">{chuThich}</p>}
    </div>
  );
}

/** Đọc trường `khoa` từ một dòng dữ liệu bất kỳ khi cột không có `dinhDang` riêng. */
function layGiaTriCot(hang: unknown, khoa: string): string {
  if (typeof hang !== "object" || hang === null) return "—";
  const giaTri = (hang as Record<string, unknown>)[khoa];
  return giaTri === null || giaTri === undefined ? "—" : String(giaTri);
}
