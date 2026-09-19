"use client";

import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/lib/nav";

/**
 * Nav chính desktop — thứ tự CHỐT CỨNG (brief mục 2), client component vì cần
 * `usePathname` để highlight mục đang active.
 */
export function Navigation({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu chính">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const isCart = item.href === "/gio-hang";

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary-light text-primary"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {isCart ? <ShoppingCart className="size-4" aria-hidden /> : null}
            {isCart ? `Giỏ hàng (${cartCount})` : item.label}
          </Link>
        );
      })}

      <div className="ml-2 flex items-center gap-1 border-l border-border pl-2">
        {/* TODO(phase sau): mở SearchModal — chưa có ở Phase 1. */}
        <button
          type="button"
          aria-label="Tìm kiếm"
          className="flex size-8 items-center justify-center rounded-md text-foreground hover:bg-muted"
        >
          <Search className="size-4" aria-hidden />
        </button>
        <Link
          href="/tai-khoan"
          aria-label="Tài khoản"
          className="flex size-8 items-center justify-center rounded-md text-foreground hover:bg-muted"
        >
          <User className="size-4" aria-hidden />
        </Link>
      </div>
    </nav>
  );
}
