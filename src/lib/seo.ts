import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dsh-nature.vercel.app";
export const SITE_NAME = "DSH NATURE";

// Chưa có ảnh OG chính thức (khuyến nghị 1200x630) — tạm dùng banner trang
// chủ hiện có làm social-share image mặc định cho tới khi có asset riêng.
const DEFAULT_OG_IMAGE = `${SITE_URL}/gioi-thieu/so-do-chien-luoc.png`;

/**
 * Build Metadata đầy đủ (title/description/canonical/OG/Twitter) cho một
 * trang. Next.js merge metadata theo route segment nhưng KHÔNG deep-merge
 * field lồng nhau (con set `openGraph` là ghi đè toàn bộ object của cha) —
 * nên mỗi trang tự build đầy đủ qua hàm này thay vì trông chờ kế thừa một
 * phần từ layout.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage }],
      locale: "vi_VN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
