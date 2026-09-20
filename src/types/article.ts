/**
 * View model chuẩn hoá từ collection `articles` (Payload) — dùng chung cho cả
 * "Kiến thức sức khỏe" (type=healthKnowledge) và "Blog" (type=blog), đúng
 * thiết kế brief §4 (1 collection, phân biệt bằng field `type`).
 */
export type ArticleType = "healthKnowledge" | "blog";

export type ArticleSummary = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  image?: string;
  dateDisplay: string;
};

export type ArticleDetail = ArticleSummary & {
  /** Lexical `SerializedEditorState` — render bằng <RichText> của @payloadcms/richtext-lexical/react. */
  content: unknown;
};
