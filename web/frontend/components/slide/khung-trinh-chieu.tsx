"use client";

/**
 * Khung trình chiếu — biến một chuỗi `<Slide>` thành bản trình chiếu thật.
 *
 * Vì sao cần: bản trước là trang cuộn dọc gồm các thẻ xếp chồng, đánh số
 * "Slide 1/11" nhưng không trình chiếu được — một màn hình thấy hai ba thẻ,
 * chữ cỡ bài đọc, không bấm mũi tên chuyển được.
 *
 * Ba thứ khung này lo:
 *   · mỗi slide chiếm TRỌN khung nhìn, `scroll-snap` giữ đúng một slide/màn
 *   · điều hướng bằng phím (mũi tên, Space, PageUp/Down, Home/End)
 *   · nút bật toàn màn hình, và CSS in để xuất PDF mỗi slide một trang
 *
 * Nội dung slide KHÔNG nằm ở đây — xem `app/trinh-bay/page.tsx`.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon, MaximizeIcon, MinimizeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NgevCanh = createContext<{ tong: number }>({ tong: 0 });

export function KhungTrinhChieu({ children, tong }: { children: ReactNode; tong: number }) {
  const boc = useRef<HTMLDivElement>(null);
  const [hienTai, datHienTai] = useState(0);
  const [toanManHinh, datToanManHinh] = useState(false);

  const den = useCallback((chiSo: number) => {
    const el = boc.current;
    if (!el) return;
    const gioiHan = Math.max(0, Math.min(chiSo, el.children.length - 1));
    (el.children[gioiHan] as HTMLElement | undefined)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Theo dõi slide nào đang chiếm khung nhìn. Dùng IntersectionObserver thay vì
  // tính từ scrollTop: khi ở chế độ in hoặc người dùng phóng to, phép tính tay
  // sai ngay, còn observer thì luôn báo đúng phần tử đang hiển thị.
  useEffect(() => {
    const el = boc.current;
    if (!el) return;
    const con = Array.from(el.children);
    const theoDoi = new IntersectionObserver(
      (muc) => {
        const thay = muc
          .filter((m) => m.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (thay) datHienTai(con.indexOf(thay.target));
      },
      { root: el, threshold: [0.5, 0.75] }
    );
    con.forEach((c) => theoDoi.observe(c));
    return () => theoDoi.disconnect();
  }, [children]);

  useEffect(() => {
    function phim(e: KeyboardEvent) {
      // Đừng cướp phím khi người dùng đang gõ trong ô nhập hoặc mở <details>.
      const dich = e.target as HTMLElement | null;
      if (dich?.closest("input, textarea, select, [contenteditable]")) return;
      const tien = ["ArrowRight", "ArrowDown", "PageDown", " "];
      const lui = ["ArrowLeft", "ArrowUp", "PageUp"];
      if (tien.includes(e.key)) {
        e.preventDefault();
        den(hienTai + 1);
      } else if (lui.includes(e.key)) {
        e.preventDefault();
        den(hienTai - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        den(0);
      } else if (e.key === "End") {
        e.preventDefault();
        den(tong - 1);
      }
    }
    window.addEventListener("keydown", phim);
    return () => window.removeEventListener("keydown", phim);
  }, [den, hienTai, tong]);

  useEffect(() => {
    function doi() {
      datToanManHinh(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", doi);
    return () => document.removeEventListener("fullscreenchange", doi);
  }, []);

  async function batTat() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await boc.current?.requestFullscreen?.();
  }

  return (
    <NgevCanh.Provider value={{ tong }}>
      <div className="relative">
        <div
          ref={boc}
          tabIndex={-1}
          aria-roledescription="bản trình chiếu"
          aria-label={`Bản trình chiếu ${tong} slide. Dùng phím mũi tên để chuyển.`}
          className={cn(
            "snap-y snap-mandatory overflow-y-auto scroll-smooth bg-background",
            // Tailwind v4 không có sẵn variant `fullscreen:`, nên lái bằng state
            // đã theo dõi cho nút bấm thay vì thêm một variant tuỳ biến.
            toanManHinh ? "h-screen" : "h-[80vh] rounded-lg border",
            // Khi IN: bỏ cuộn, cho nội dung trải dài để mỗi slide thành một trang.
            "print:h-auto print:overflow-visible print:rounded-none print:border-0"
          )}
        >
          {children}
        </div>

        {/* Thanh điều khiển — ẩn khi in vì PDF không bấm được. */}
        <div className="mt-3 flex items-center justify-between gap-3 print:hidden">
          <p className="text-sm text-muted-foreground tabular-nums">
            Slide <strong className="text-foreground">{hienTai + 1}</strong> / {tong}
            <span className="ml-3 hidden sm:inline">
              Dùng phím ← → để chuyển · Ctrl+P để xuất PDF
            </span>
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" onClick={() => den(hienTai - 1)}
                    disabled={hienTai === 0} aria-label="Slide trước">
              <ChevronLeftIcon />
            </Button>
            <Button variant="outline" size="icon" onClick={() => den(hienTai + 1)}
                    disabled={hienTai >= tong - 1} aria-label="Slide sau">
              <ChevronRightIcon />
            </Button>
            <Button variant="outline" size="sm" onClick={batTat} className="ml-1.5">
              {toanManHinh ? <MinimizeIcon /> : <MaximizeIcon />}
              <span className="hidden sm:inline">
                {toanManHinh ? "Thoát" : "Trình chiếu"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </NgevCanh.Provider>
  );
}

/**
 * Một slide. `chot` là câu duy nhất người xem phải nhớ — luôn hiện to nhất.
 *
 * Cỡ chữ dùng `clamp()` để đọc được cả khi nhúng trong trang lẫn khi phóng
 * toàn màn hình máy chiếu, không cần hai bộ style.
 */
export function Slide({
  so,
  tieuDe,
  chot,
  children,
  ghiChu,
}: {
  so: number;
  tieuDe: string;
  /** Câu chốt, in to. Bỏ trống ở slide bìa. */
  chot?: string;
  children?: ReactNode;
  /** Nhãn vai trò, nguồn số liệu… hiện nhỏ ở chân slide. */
  ghiChu?: ReactNode;
}) {
  const { tong } = useContext(NgevCanh);
  return (
    <section
      aria-label={`Slide ${so}: ${tieuDe}`}
      className={cn(
        // py lớn hơn px theo tỉ lệ: chữ dán sát mép trên là lỗi dễ thấy nhất khi
        // phóng lên máy chiếu, nên chừa khoảng thở rộng hơn ở trên dưới.
        "flex h-full snap-start snap-always flex-col gap-[2.5vh] px-[6vw] py-[7vh]",
        "print:h-screen print:break-after-page print:px-12 print:py-10"
      )}
    >
      <header className="flex shrink-0 items-baseline justify-between gap-4 border-b pb-[1.5vh]">
        <h2 className="font-semibold" style={{ fontSize: "clamp(1.25rem, 2.6vw, 2.5rem)" }}>
          {tieuDe}
        </h2>
        <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {so}/{tong}
        </span>
      </header>

      {chot && (
        <p
          className="border-l-4 border-l-foreground/70 pl-4 font-medium text-balance"
          style={{ fontSize: "clamp(1.05rem, 2vw, 1.85rem)", lineHeight: 1.35 }}
        >
          {chot}
        </p>
      )}

      {children && (
        // `my-auto` ở lớp trong, không phải `justify-center` ở lớp ngoài: khi
        // nội dung cao hơn khung, `justify-center` cắt mất phần trên và cuộn
        // không tới được; `my-auto` thì căn giữa lúc còn chỗ trống và tự nhả ra
        // khi hết chỗ.
        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          style={{ fontSize: "clamp(0.9rem, 1.15vw, 1.25rem)" }}
        >
          <div className="my-auto w-full">{children}</div>
        </div>
      )}

      {ghiChu && <footer className="shrink-0 pt-[1vh] text-xs text-muted-foreground">{ghiChu}</footer>}
    </section>
  );
}
