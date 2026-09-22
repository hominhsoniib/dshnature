"use client";

import { ChevronDown, ExternalLink, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { NAV_ITEMS } from "@/lib/nav";

/** Hamburger drawer mobile với nút bấm Menu xanh lá nổi bật dễ thấy. */
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
      {/* Nút bấm MENU xanh lá cực kỳ nổi bật trên đầu trang */}
      <button
        type="button"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-soft transition-all active:scale-95 hover:bg-primary-dark"
      >
        {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
        <span>{open ? "Đóng" : "MENU"}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col gap-1 overflow-y-auto bg-background p-4 shadow-2xl border-l border-border animate-in slide-in-from-right duration-200">
            <div className="mb-3 flex items-center justify-between border-b border-border/80 pb-3">
              <span className="font-heading text-lg font-bold text-primary">DSH NATURE</span>
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg bg-muted/60 text-foreground hover:bg-muted"
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
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {isOpen ? (
                      <div className="ml-3 flex flex-col gap-1 border-l-2 border-primary/40 pl-2">
                        {item.children?.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            target={child.external ? "_blank" : undefined}
                            rel={child.external ? "noopener noreferrer" : undefined}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary-light hover:text-primary transition-colors"
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
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {item.href === "/gio-hang" ? (
                    <ShoppingCart className="size-4" aria-hidden />
                  ) : null}
                  {item.href === "/gio-hang" ? `Giỏ hàng (${cartCount})` : item.label}
                </Link>
              );
            })}

            <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenSearch?.();
                }}
                className="flex w-full items-center gap-2 rounded-lg bg-muted/60 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Search className="size-4 text-muted-foreground" aria-hidden />
                Tìm kiếm sản phẩm...
              </button>
              <Link
                href="/tai-khoan"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg bg-primary-light px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-light/80 transition-colors"
              >
                <User className="size-4 text-primary" aria-hidden />
                Tài khoản của bạn
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
