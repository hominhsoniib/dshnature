import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { FloatingContact } from "@/components/layout/FloatingContact";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import { getSiteSettings } from "@/lib/queries/site-settings";

import { CartProvider } from "@/context/cart-context";

// Brief mục 6: fontFamily.sans = Inter. Cần subset "vietnamese" vì toàn bộ site
// chỉ tiếng Việt (mục 3: "Ngôn ngữ: Chỉ tiếng Việt") — subset "latin" thôi không
// đủ dấu tiếng Việt (ư, ơ, ệ, ...).
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "DSH NATURE | Đồng hành cùng sức khỏe gia đình",
  description:
    "DSH NATURE — sản phẩm chăm sóc sức khỏe chất lượng, an toàn và phù hợp với nhu cầu của gia đình Việt.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
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
