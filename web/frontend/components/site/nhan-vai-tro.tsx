/**
 * Nhãn vai trò bắt buộc hiển thị cạnh mỗi khối kết quả: chính · phụ · khám phá ·
 * cơ học · chẩn đoán (không có địa vị suy diễn). Dùng chung một kiểu badge viền
 * trung tính cho mọi vai trò — không mã hóa màu như một phán quyết.
 */
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MO_TA_VAI_TRO, NHAN_VAI_TRO, type VaiTro } from "@/lib/vai-tro";

export function NhanVaiTro({ vaiTro }: { vaiTro: VaiTro }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className="cursor-help font-normal italic">
          vai trò: {NHAN_VAI_TRO[vaiTro]}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">{MO_TA_VAI_TRO[vaiTro]}</TooltipContent>
    </Tooltip>
  );
}
