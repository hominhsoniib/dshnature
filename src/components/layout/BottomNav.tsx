"use client";

import { BookOpen, Home, Package, ShoppingCart, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BOTTOM_NAV_ITEMS } from "@/lib/nav";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  package: Package,
  cart: ShoppingCart,
  book: BookOpen,
  user: User,
};

/** Bottom nav cố định mobile — 5 mục theo brief mục 2. */
export function BottomNav({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] shadow-soft lg:hidden"
    >
      {BOTTOM_NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon];
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const isCart = item.href === "/gio-hang";

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="size-5" aria-hidden />
            {isCart && cartCount > 0 ? (
              <span className="absolute right-[28%] top-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
                {cartCount}
              </span>
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
