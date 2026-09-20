import { getPayloadClient } from "@/lib/payload";
import type { ArticleDetail, ArticleSummary, ArticleType } from "@/types/article";

/**
 * Query layer cho collection `articles` — dùng chung cho "Kiến thức sức khỏe"
 * (type=healthKnowledge) và "Blog" (type=blog). Mọi hàm bọc try/catch trả về
 * mảng rỗng/null khi Payload lỗi (brief mục 12: không để trắng trang/crash).
 */

type MediaRef = { url?: string | null; alt?: string | null } | string | null | undefined;

type PayloadArticle = {
  id: string;
  slug: string;
  title: string;
  type: ArticleType;
  category: string;
  author?: string | null;
  excerpt?: string | null;
  featuredImage?: MediaRef;
  content?: unknown;
  createdAt: string;
};

function getMediaUrl(media: MediaRef): string | undefined {
  if (!media || typeof media === "string") return undefined;
  return media.url ?? undefined;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN");
}

function toSummary(doc: PayloadArticle): ArticleSummary {
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    excerpt: doc.excerpt ?? "",
    author: doc.author ?? "Dược sĩ DSH Nature",
    image: getMediaUrl(doc.featuredImage),
    dateDisplay: formatDate(doc.createdAt),
  };
}

export async function getArticles(type: ArticleType, limit = 20): Promise<ArticleSummary[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "articles",
      where: { type: { equals: type } },
      sort: "-createdAt",
      limit,
      depth: 1,
    });
    return (result.docs as unknown as PayloadArticle[]).map(toSummary);
  } catch {
    return [];
  }
}

export async function getArticleBySlug(type: ArticleType, slug: string): Promise<ArticleDetail | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "articles",
      where: {
        and: [{ type: { equals: type } }, { slug: { equals: slug } }],
      },
      limit: 1,
      depth: 1,
    });
    const doc = result.docs[0] as unknown as PayloadArticle | undefined;
    if (!doc) return null;
    return { ...toSummary(doc), content: doc.content };
  } catch {
    return null;
  }
}

/** Danh sách chuyên mục thực tế (distinct) thay vì hardcode — dùng cho filter chip. */
export function getDistinctCategories(articles: ArticleSummary[]): string[] {
  return Array.from(new Set(articles.map((a) => a.category)));
}
