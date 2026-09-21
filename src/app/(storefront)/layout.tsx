import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

import { FloatingContact } from "@/components/layout/FloatingContact";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/structured-data";

import { CartProvider } from "@/context/cart-context";

// Brief mục 6: fontFamily.sans = Inter. Cần subset "vietnamese" vì toàn bộ site
// chỉ tiếng Việt (mục 3: "Ngôn ngữ: Chỉ tiếng Việt") — subset "latin" thôi không
// đủ dấu tiếng Việt (ư, ơ, ệ, ...).
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_TITLE = "DSH NATURE | Đồng hành cùng sức khỏe gia đình";
const DEFAULT_DESCRIPTION =
  "DSH NATURE — sản phẩm chăm sóc sức khỏe chất lượng, an toàn và phù hợp với nhu cầu của gia đình Việt.";

// metadataBase để Next.js resolve URL tương đối (OG image, canonical...)
// thành tuyệt đối. Đây là default toàn site — không đặt `alternates.canonical`
// ở layout vì canonical thuộc về từng trang cụ thể (trang nào không tự set
// riêng thì không nên "thừa kế" nhầm canonical của layout).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd(siteSettings) }}
        />
        <ToastProvider>
          <CartProvider>
            <Header siteSettings={siteSettings} />
            <main className="flex flex-1 flex-col pb-16 lg:pb-0">{children}</main>
            <Footer siteSettings={siteSettings} />
            <FloatingContact siteSettings={siteSettings} />
            <Toaster />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
