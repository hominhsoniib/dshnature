import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
