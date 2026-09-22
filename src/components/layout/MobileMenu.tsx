"use client";

import { ChevronDown, ExternalLink, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { NAV_ITEMS } from "@/lib/nav";

/** Hamburger drawer mobile (brief mục 2: "Mobile: hamburger drawer + bottom nav"). */
export function MobileMenu({
  cartCount = 0,
  onOpenSearch,
}: {
  cartCount?: number;
  onOpenSearch?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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

            {NAV_ITEMS.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);

              if (hasChildren) {
                const isOpen = openSubmenu === item.label;
                return (
                  <div key={item.label} className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen ? (
                      <div className="ml-3 flex flex-col gap-1 border-l-2 border-primary/30 pl-2">
                        {item.children?.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            target={child.external ? "_blank" : undefined}
                            rel={child.external ? "noopener noreferrer" : undefined}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary-light hover:text-primary"
                          >
                            <span>{child.label}</span>
                            {child.external ? <ExternalLink className="size-3 text-muted-foreground" /> : null}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }

              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="size-4 text-muted-foreground" aria-hidden />
                  </a>
                );
              }

              return (
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
              );
            })}

            <div className="mt-2 flex items-center gap-1 border-t border-border pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenSearch?.();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Search className="size-4" aria-hidden />
                Tìm kiếm
              </button>
              <Link
                href="/tai-khoan"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
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
