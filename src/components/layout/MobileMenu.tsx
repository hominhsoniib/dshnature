"use client";

import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { NAV_ITEMS } from "@/lib/nav";

/** Hamburger drawer mobile (brief mục 2: "Mobile: hamburger drawer + bottom nav"). */
export function MobileMenu({ cartCount = 0 }: { cartCount?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-md text-foreground hover:bg-muted"
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col gap-1 overflow-y-auto bg-background p-4 shadow-soft-hover">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-primary">DSH NATURE</span>
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-md hover:bg-muted"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {item.href === "/gio-hang" ? (
                  <ShoppingCart className="size-4" aria-hidden />
                ) : null}
                {item.href === "/gio-hang" ? `Giỏ hàng (${cartCount})` : item.label}
              </Link>
            ))}

            <div className="mt-2 flex items-center gap-1 border-t border-border pt-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Search className="size-4" aria-hidden />
                Tìm kiếm
              </button>
              <Link
                href="/tai-khoan"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <User className="size-4" aria-hidden />
                Tài khoản
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
