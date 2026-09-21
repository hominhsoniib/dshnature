import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getArticleBySlug, getArticles } from "@/lib/queries/articles";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 120;

export async function generateStaticParams() {
  const articles = await getArticles("blog");
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("blog", slug);

  if (!article) {
    return { title: "Bài viết không tồn tại | DSH NATURE" };
  }

  return buildMetadata({
    title: `${article.title} | DSH NATURE`,
    description: article.excerpt || "Tin tức từ DSH Nature.",
    path: `/blog/${slug}`,
    image: article.image,
    type: "article",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug("blog", slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 space-y-6">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
        <ArrowLeft className="size-3.5" /> Trở lại danh sách Blog
      </Link>

      <div className="space-y-3">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {article.category}
        </span>
        <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-muted-foreground border-b border-border pb-4">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" /> {article.dateDisplay}
          </span>
        </div>
      </div>

      {article.content ? (
        <div className="prose prose-emerald max-w-none text-muted-foreground leading-relaxed text-sm md:text-base">
          <RichText data={article.content} />
        </div>
      ) : article.excerpt ? (
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{article.excerpt}</p>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Bài viết chưa có nội dung chi tiết — vui lòng bổ sung trong Payload Admin.
        </p>
      )}
    </div>
  );
}
