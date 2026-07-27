import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Xuất tĩnh để có thể build và nộp bài ngay cả khi backend FastAPI không chạy:
  // mọi trang là client component tự gọi API trong trình duyệt lúc runtime (xem
  // `lib/hooks.ts`), nên bước build không phụ thuộc backend đang sống hay không.
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
