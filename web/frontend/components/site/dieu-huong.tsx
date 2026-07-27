"use client";

/** Thanh điều hướng chính — có menu di động (Sheet) để đọc tốt trên điện thoại. */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DANH_SACH_TUYEN } from "@/lib/tuyen-duong";

export function DieuHuong() {
  const pathname = usePathname();
  const [moMenu, setMoMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="shrink-0 font-heading text-sm font-semibold">
          Thuế GTGT → giá bán lẻ
        </Link>

        <nav className="hidden flex-wrap items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {DANH_SACH_TUYEN.map((muc) => (
            <Link
              key={muc.href}
              href={muc.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === muc.href && "bg-muted font-medium text-foreground"
              )}
              aria-current={pathname === muc.href ? "page" : undefined}
            >
              {muc.nhan}
            </Link>
          ))}
        </nav>

        <Sheet open={moMenu} onOpenChange={setMoMenu}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="Mở menu điều hướng">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Điều hướng</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Điều hướng chính (di động)">
              {DANH_SACH_TUYEN.map((muc) => (
                <Link
                  key={muc.href}
                  href={muc.href}
                  onClick={() => setMoMenu(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    pathname === muc.href
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={pathname === muc.href ? "page" : undefined}
                >
                  <div>{muc.nhan}</div>
                  <div className="text-xs text-muted-foreground">{muc.moTaNgan}</div>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
