import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, ChevronRight, UserCheck } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";
import { EmptyState } from "@/components/ui/empty-state";
import { getArticles, getDistinctCategories } from "@/lib/queries/articles";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Kiến thức sức khỏe | DSH NATURE",
  description:
    "Cẩm nang y khoa & thông tin tư vấn chăm sóc sức khỏe gia đình từ đội ngũ chuyên gia DSH Nature.",
  path: "/kien-thuc",
});

export const revalidate = 120;

export default async function HealthKnowledgePage() {
  const articles = await getArticles("healthKnowledge");
  // Danh mục lấy distinct từ dữ liệu thật thay vì hardcode
  // (CMS_INTEGRATION_PLAN.md mục 2 — Articles.category là text tự do).
  const categories = ["Tất cả", ...getDistinctCategories(articles)];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 space-y-8">
      <SectionTitle
        eyebrow="Cẩm nang y khoa"
        title="Kiến thức sức khỏe gia đình"
        description="Thông tin y học thường thức được tổng hợp và tham vấn bởi chuyên môn DSH Nature."
      />

      {articles.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Chưa có bài viết kiến thức sức khỏe nào."
          description="Thêm bài viết trong Payload Admin (/admin/collections/articles), chọn Loại nội dung = 'Kiến thức sức khỏe'."
        />
      ) : (
        <>
          {/* Category List */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-4">
            {categories.map((cat, idx) => (
              <span
                key={cat}
                className={`rounded-full px-4 py-2 text-xs md:text-sm font-medium cursor-pointer transition-colors ${
                  idx === 0
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="group flex flex-col justify-between rounded-xl border border-border bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-soft-hover"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                      {article.category}
                    </span>
                  </div>

                  <Link
                    href={`/kien-thuc/${article.slug}`}
                    className="block font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug"
                  >
                    {article.title}
                  </Link>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <UserCheck className="size-3.5 text-primary" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {article.dateDisplay}
                    </span>
                  </div>

                  <Link
                    href={`/kien-thuc/${article.slug}`}
                    className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform"
                  >
                    Đọc bài viết <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
