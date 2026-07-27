/**
 * Bảng số liệu thay thế cho biểu đồ — yêu cầu khả năng tiếp cận bắt buộc: mỗi biểu
 * đồ phải có một bảng số đi kèm để người dùng đọc màn hình hoặc không xem được biểu
 * đồ vẫn tiếp cận được đầy đủ dữ liệu. Mặc định thu gọn để không choán chỗ.
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface CotBang<T> {
  khoa: string;
  nhan: string;
  dinhDang?: (hang: T) => string;
}

interface BangSoThayTheProps<T> {
  id: string;
  tieuDe: string;
  moTa?: string;
  cot: CotBang<T>[];
  hang: T[];
}

export function BangSoThayThe<T>({ id, tieuDe, moTa, cot, hang }: BangSoThayTheProps<T>) {
  return (
    <Accordion type="single" collapsible className="mt-2">
      <AccordionItem value={id}>
        <AccordionTrigger className="text-xs text-muted-foreground">
          Xem bảng số liệu thay thế cho biểu đồ &ldquo;{tieuDe}&rdquo;
        </AccordionTrigger>
        <AccordionContent>
          {moTa && <p className="mb-2 text-sm text-muted-foreground">{moTa}</p>}
          <Table id={id}>
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
                    <TableCell key={c.khoa}>{c.dinhDang ? c.dinhDang(h) : layGiaTriCot(h, c.khoa)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/** Đọc trường `khoa` từ một dòng dữ liệu bất kỳ khi cột không có `dinhDang` riêng. */
function layGiaTriCot(hang: unknown, khoa: string): string {
  if (typeof hang !== "object" || hang === null) return "—";
  const giaTri = (hang as Record<string, unknown>)[khoa];
  return giaTri === null || giaTri === undefined ? "—" : String(giaTri);
}
