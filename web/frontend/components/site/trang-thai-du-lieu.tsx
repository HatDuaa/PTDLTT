"use client";

/**
 * Bọc mọi khối phụ thuộc dữ liệu API: hiện skeleton khi đang tải, thông báo lỗi rõ
 * ràng (kèm nút thử lại) khi backend không phản hồi, và chỉ render nội dung thật khi
 * có dữ liệu. Dùng ở mọi trang để tránh mỗi nơi tự viết lại if/else tải/lỗi.
 *
 * `inline`: dùng khi khối này nằm giữa một câu văn (bên trong thẻ `<p>`) — trạng
 * thái tải/lỗi khi đó phải là phần tử inline (`span`), không phải `div`/`Alert`,
 * nếu không HTML sẽ lồng sai thẻ (`div` trong `p`) và gây lỗi hydration.
 */
import type { ReactNode } from "react";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TrangThaiDuLieuProps<T> {
  dangTai: boolean;
  loi?: Error;
  duLieu?: T;
  thuLai?: () => void;
  children: (duLieu: T) => ReactNode;
  /** Chiều cao skeleton khi đang tải — mặc định phù hợp với một khối card. */
  chieuCaoTai?: string;
  /** Đặt true khi khối này nằm trong một đoạn văn (`<p>`) thay vì đứng riêng. */
  inline?: boolean;
}

export function TrangThaiDuLieu<T>({
  dangTai,
  loi,
  duLieu,
  thuLai,
  children,
  chieuCaoTai = "h-40",
  inline = false,
}: TrangThaiDuLieuProps<T>) {
  if (loi) {
    if (inline) {
      return (
        <span className="text-destructive underline decoration-dotted" title={loi.message}>
          lỗi tải dữ liệu
        </span>
      );
    }
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon />
        <AlertTitle>Không tải được dữ liệu từ backend</AlertTitle>
        <AlertDescription>
          <p>{loi.message}</p>
          <p>
            Kiểm tra backend FastAPI đã chạy tại địa chỉ cấu hình trong{" "}
            <code>NEXT_PUBLIC_API_BASE_URL</code> chưa.
          </p>
          {thuLai && (
            <Button size="sm" variant="outline" onClick={thuLai} className="mt-2">
              Thử lại
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (dangTai || duLieu === undefined) {
    if (inline) {
      return (
        <span
          className="inline-block h-4 w-14 animate-pulse rounded bg-muted align-middle"
          aria-label="Đang tải dữ liệu"
        />
      );
    }
    return <Skeleton className={`w-full ${chieuCaoTai}`} aria-label="Đang tải dữ liệu" />;
  }

  return <>{children(duLieu)}</>;
}
