import { Globe, Lock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { NAV_ITEMS } from "@/lib/nav";
import type { SiteSettings } from "@/types/payload-content";

const POLICY_LINKS = [
  // TODO(phase sau): trang chính sách thật chưa nằm trong sitemap chính thức
  // (PROJECT_BRIEF.md mục 5) — tạm giữ chỗ, không tự thêm route mới vào menu
  // chính (mục 1 khoá thứ tự menu, đây chỉ là link phụ ở footer).
  { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
  { label: "Chính sách đổi trả", href: "/chinh-sach-doi-tra" },
  { label: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
];

export function Footer({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const socials = siteSettings?.socials;
  const socialLinks = [
    { label: "Facebook", href: socials?.facebook },
    { label: "YouTube", href: socials?.youtube },
    { label: "TikTok", href: socials?.tiktok },
    { label: "Zalo", href: socials?.zalo },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="mt-16 border-t border-border bg-primary-light">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-heading text-xl font-bold text-primary">
            {siteSettings?.companyName ?? "DSH NATURE"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteSettings?.tagline ?? "ĐỒNG HÀNH CÙNG SỨC KHỎE GIA ĐÌNH"}
          </p>

          {socialLinks.length > 0 ? (
            <div className="mt-4 flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex size-8 items-center justify-center rounded-full bg-white text-primary shadow-soft hover:shadow-soft-hover"
                >
                  <Globe className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Thông tin công ty</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{siteSettings?.address || "23 Nguyễn Văn Thủ, Q12, TP.Hồ Chí Minh"}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a href={`tel:${(siteSettings?.hotline || "0886554242").replace(/\s+/g, "")}`} className="hover:underline">
                {siteSettings?.hotline || "0886554242"}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a href={`mailto:${siteSettings?.email || "dshnature@gmail.com"}`} className="hover:underline">
                {siteSettings?.email || "dshnature@gmail.com"}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Liên kết</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Chính sách</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {POLICY_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/admin/login" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                <Lock className="size-3.5" />
                <span>Quản trị Admin</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 px-6 py-4 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {siteSettings?.companyName ?? "CÔNG TY CỔ PHẦN DSH NATURE"}. Đã đăng ký bản quyền.
          </span>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 hover:text-primary transition-colors hover:underline"
          >
            <Lock className="size-3" />
            <span>Quản trị Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
