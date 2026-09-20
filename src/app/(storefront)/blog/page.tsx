import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ChevronRight, Newspaper } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";
import { EmptyState } from "@/components/ui/empty-state";
import { getArticles, getDistinctCategories } from "@/lib/queries/articles";

export const metadata: Metadata = {
  title: "Blog DSH NATURE | Tin tức & Hoạt động thương hiệu",
  description:
    "Cập nhật tin tức doanh nghiệp, sự kiện và góc chia sẻ sức khỏe từ thương hiệu DSH Nature.",
};

export const revalidate = 120;

export default async function BlogPage() {
  const articles = await getArticles("blog");
  // Danh mục lấy distinct từ dữ liệu thật thay vì hardcode
  // (CMS_INTEGRATION_PLAN.md mục 2 — Articles.category là text tự do).
  const categories = ["Tất cả", ...getDistinctCategories(articles)];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 space-y-8">
      <SectionTitle
        eyebrow="Tin tức & Sự kiện"
        title="Blog DSH Nature"
        description="Cập nhật tin tức mới nhất về hoạt động doanh nghiệp và chia sẻ cộng đồng."
      />

      {articles.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="Chưa có bài viết blog nào."
          description="Thêm bài viết trong Payload Admin (/admin/collections/articles), chọn Loại nội dung = 'Blog tin tức'."
        />
      ) : (
        <>
          {/* Category Tabs */}
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

          {/* Blog Posts List */}
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((post) => (
              <div
                key={post.slug}
                className="group flex flex-col justify-between rounded-xl border border-border bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-soft-hover"
              >
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-cream px-3 py-1 text-xs font-semibold text-primary">
                    {post.category}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="block font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug"
                  >
                    {post.title}
                  </Link>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {post.dateDisplay}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 font-semibold text-primary group-hover:translate-x-1 transition-transform"
                  >
                    Xem chi tiết <ChevronRight className="size-3.5" />
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
