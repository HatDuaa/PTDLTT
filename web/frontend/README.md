# Frontend — Tác động thuế GTGT lên giá bán lẻ

Next.js 15 (App Router, TypeScript) + Tailwind + shadcn/ui + Recharts. Trình bày trung thực kết
quả đồ án đánh giá tác động của việc giảm thuế GTGT 10%→8% (01/07/2025) lên giá bán lẻ, bao gồm
kết quả null và mọi hạn chế đã ghi nhận.

## Nguyên tắc

Không có con số kết quả nào được gõ tay trong mã nguồn. Mọi giá trị hiển thị (ước lượng, SE,
p-value, số SKU...) đến từ backend FastAPI qua `lib/api-client.ts` + `lib/hooks.ts`. Xem
`lib/nguong-thiet-ke.ts` và `lib/hang-so-chinh-sach.ts` cho các hằng số THIẾT KẾ/PHÁP LÝ đã khóa
trước (ngưỡng SMD, biên TOST, thuế suất) — đây không phải kết quả thống kê.

## Chạy cục bộ

Backend phải chạy trước (đọc `ket-qua/*.csv` do `code/chay_tat_ca.py` sinh ra):

```bash
cd web/backend
uvicorn main:app --reload --port 8000
```

Sau đó chạy frontend:

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Mặc định frontend gọi backend tại
`http://localhost:8000`; đổi qua biến môi trường `NEXT_PUBLIC_API_BASE_URL` nếu cần.

## Build tĩnh (nộp bài)

```bash
npm run build
```

Cấu hình `output: 'export'` (`next.config.ts`) tạo bản tĩnh tại `out/`. Vì mọi trang là client
component tự gọi API trong trình duyệt lúc chạy (xem `lib/hooks.ts`), bước build **không cần**
backend đang chạy — backend chỉ cần chạy khi người dùng thực sự mở trang.

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `app/` | 7 route: `/`, `/du-lieu`, `/thiet-ke`, `/ket-qua`, `/suc-manh`, `/han-che`, `/trinh-bay` |
| `components/charts/` | 4 biểu đồ bắt buộc + đường cong sức mạnh |
| `components/ket-qua/` | Khối ba cổng chẩn đoán (dùng chung giữa `/ket-qua` và `/trinh-bay`) |
| `components/site/` | Khung dùng chung: điều hướng, khối kết quả, bảng số thay thế, nhãn vai trò |
| `components/ui/` | shadcn/ui |
| `lib/` | Client gọi API, kiểu dữ liệu, hook, formatter, hằng số thiết kế/pháp lý |
