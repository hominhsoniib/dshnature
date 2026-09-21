import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Quản lý nội bộ | DSH NATURE",
  robots: { index: false, follow: false },
};

const NAV_ITEMS = [
  { href: "/quan-ly", label: "Tổng quan" },
  { href: "/quan-ly/lien-he", label: "Liên hệ" },
  { href: "/quan-ly/dai-ly", label: "Đăng ký đại lý" },
  { href: "/quan-ly/tu-van", label: "Yêu cầu tư vấn" },
  { href: "/quan-ly/don-hang", label: "Đơn hàng" },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireDashboardUser();

  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f4f5f7" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside
            style={{
              width: 220,
              flexShrink: 0,
              background: "#111827",
              color: "#e5e7eb",
              padding: "20px 16px",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>DSH NATURE</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>Quản lý nội bộ</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    color: "#e5e7eb",
                    textDecoration: "none",
                    fontSize: 13,
                    padding: "8px 10px",
                    borderRadius: 6,
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div style={{ marginTop: 24, fontSize: 11, color: "#6b7280", borderTop: "1px solid #1f2937", paddingTop: 12 }}>
              Đăng nhập: {(user as { email?: string } | null)?.email ?? "—"}
              <br />
              <Link href="/admin" style={{ color: "#93c5fd" }}>
                Về Payload Admin
              </Link>
            </div>
          </aside>
          <main style={{ flex: 1, padding: "24px 32px" }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
