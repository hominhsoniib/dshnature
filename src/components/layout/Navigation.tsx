"use client";

import { useState } from "react";
import { Building2, ChevronDown, ExternalLink, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getNavItems } from "@/lib/nav";

/**
 * Nav chính desktop — bao gồm menu dropdown Đối tác.
 */
export function Navigation({
  cartCount = 0,
  partners,
  onOpenSearch,
}: {
  cartCount?: number;
  partners?: { name: string; url: string; logo?: { url?: string | null } | string | null }[] | null;
  onOpenSearch?: () => void;
}) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navItems = getNavItems(partners);

  return (
    <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex" aria-label="Menu chính">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : !item.external && pathname.startsWith(item.href);
        const isCart = item.href === "/gio-hang";
        const hasChildren = Boolean(item.children && item.children.length > 0);

        if (hasChildren) {
          return (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <span>{item.label}</span>
                <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-hover:rotate-180" />
              </a>

              <div
                className={`absolute left-0 top-full z-50 mt-1 min-w-[250px] rounded-xl border border-border bg-white p-2 shadow-soft-hover transition-all duration-150 ${
                  openDropdown === item.label ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
                }`}
              >
                {item.children?.map((child) => (
                  <a
                    key={child.href}
                    href={child.href}
                    target={child.external ? "_blank" : undefined}
                    rel={child.external ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-primary-light hover:text-primary transition-colors group/item"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {child.logo ? (
                        <img
                          src={child.logo}
                          alt={child.label}
                          className="size-5 rounded-md object-contain border border-border/50 bg-white p-0.5 shrink-0"
                        />
                      ) : (
                        <Building2 className="size-4 shrink-0 text-primary/80 group-hover/item:text-primary transition-colors" />
                      )}
                      <span className="truncate">{child.label}</span>
                    </div>
                    {child.external ? <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden /> : null}
                  </a>
                ))}
              </div>
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
              className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <span>{item.label}</span>
              <ExternalLink className="size-3 text-muted-foreground" aria-hidden />
            </a>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
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

      <div className="ml-1 flex items-center gap-1 border-l border-border pl-2">
        <button
          type="button"
          aria-label="Tìm kiếm"
          onClick={onOpenSearch}
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
