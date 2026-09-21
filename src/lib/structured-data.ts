import type { SiteSettings } from "@/types/payload-content";
import type { ProductViewModel } from "@/types/product";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dsh-nature.vercel.app";

/**
 * JSON.stringify không escape "</script>" trong chuỗi — một mô tả sản phẩm
 * hay tagline chứa chuỗi đó có thể đóng sớm thẻ <script> khi nhúng qua
 * dangerouslySetInnerHTML. Escape "<" để tránh injection.
 */
function toScriptSafeJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd(siteSettings: SiteSettings | null): string {
  const sameAs = [
    siteSettings?.socials?.facebook,
    siteSettings?.socials?.youtube,
    siteSettings?.socials?.tiktok,
  ].filter((url): url is string => Boolean(url));

  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: siteSettings?.companyName || "CÔNG TY CỔ PHẦN DSH NATURE",
    url: BASE_URL,
    ...(siteSettings?.hotline ? { telephone: siteSettings.hotline } : {}),
    ...(siteSettings?.email ? { email: siteSettings.email } : {}),
    ...(siteSettings?.address
      ? { address: { "@type": "PostalAddress", streetAddress: siteSettings.address } }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return toScriptSafeJson(data);
}

export function productJsonLd(product: ProductViewModel): string {
  const url = `${BASE_URL}/san-pham/${product.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.slug,
    url,
    ...(product.images.length ? { image: product.images } : {}),
    ...(product.categoryName ? { category: product.categoryName } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "VND",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return toScriptSafeJson(data);
}
