import Link from "next/link";

import { BottomNav } from "@/components/layout/BottomNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Navigation } from "@/components/layout/Navigation";
import { TopBar } from "@/components/layout/TopBar";
import type { SiteSettings } from "@/types/payload-content";

/**
 * Header sticky (brief mục 2). `cartCount` mặc định 0 — Phase 3 (Cart) sẽ nối
 * state giỏ hàng thật vào đây thay vì hard-code.
 */
export function Header({
  siteSettings,
  cartCount = 0,
}: {
  siteSettings: SiteSettings | null;
  cartCount?: number;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <TopBar hotline={siteSettings?.hotline} email={siteSettings?.email} />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 border-b border-border px-4 md:px-6">
          <Link href="/" className="font-heading text-xl font-bold tracking-tight text-primary">
            DSH NATURE
          </Link>

          <Navigation cartCount={cartCount} />

          <div className="flex items-center gap-1 lg:hidden">
            <MobileMenu cartCount={cartCount} />
          </div>
        </div>
      </header>

      <BottomNav cartCount={cartCount} />
    </>
  );
}
