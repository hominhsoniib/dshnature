import type { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dsh-nature.vercel.app";

// Sitemap không cần tươi real-time như trang sản phẩm/blog — 1h là đủ, tránh
// query DB trên mỗi lần crawler ghé.
export const revalidate = 3600;

type SlugDoc = { slug: string; updatedAt: string };

async function getProductSlugs(): Promise<SlugDoc[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "products",
      limit: 1000,
      depth: 0,
    });
    return (result.docs as unknown as SlugDoc[]).filter((doc) => Boolean(doc.slug));
  } catch (err) {
    console.error("[sitemap] Lỗi lấy danh sách sản phẩm:", err);
    return [];
  }
}

async function getArticleSlugs(type: "blog" | "healthKnowledge"): Promise<SlugDoc[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "articles",
      where: { type: { equals: type } },
      limit: 1000,
      depth: 0,
    });
    return (result.docs as unknown as SlugDoc[]).filter((doc) => Boolean(doc.slug));
  } catch (err) {
    console.error(`[sitemap] Lỗi lấy danh sách bài viết (type=${type}):`, err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/san-pham`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/gioi-thieu`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/lien-he`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/kien-thuc`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/dai-ly`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tu-van`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Cart/account/checkout (gio-hang, tai-khoan, thanh-toan) và trang test nội
  // bộ (test-upload-bo) cố ý KHÔNG đưa vào sitemap — không phải nội dung cần
  // index, và checkout đứng riêng còn chứa dữ liệu theo phiên người dùng.
  const [products, blogArticles, healthArticles] = await Promise.all([
    getProductSlugs(),
    getArticleSlugs("blog"),
    getArticleSlugs("healthKnowledge"),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((doc) => ({
    url: `${BASE_URL}/san-pham/${doc.slug}`,
    lastModified: doc.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogArticles.map((doc) => ({
    url: `${BASE_URL}/blog/${doc.slug}`,
    lastModified: doc.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const knowledgeRoutes: MetadataRoute.Sitemap = healthArticles.map((doc) => ({
    url: `${BASE_URL}/kien-thuc/${doc.slug}`,
    lastModified: doc.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...knowledgeRoutes];
}
