import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DieuHuong } from "@/components/site/dieu-huong";
import { ChanTrang } from "@/components/site/chan-trang";

// Cố ý KHÔNG dùng next/font/google: trang phải build được ở môi trường không có
// mạng (yêu cầu `output: 'export'` chạy độc lập khi chấm bài). Dùng font hệ thống
// khai báo trong app/globals.css (--font-sans).

export const metadata: Metadata = {
  title: "Thuế GTGT 10%→8% và giá bán lẻ | Đồ án phân tích dữ liệu",
  description:
    "Đồ án đánh giá tác động của việc giảm thuế GTGT từ 10% xuống 8% (01/07/2025) lên giá bán lẻ — trình bày trung thực kèm hạn chế, không phải kết luận đóng gói gọn gàng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={150}>
          <DieuHuong />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
          <ChanTrang />
        </TooltipProvider>
      </body>
    </html>
  );
}
