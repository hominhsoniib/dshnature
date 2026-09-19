import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";

export const metadata: Metadata = {
  title: "Blog DSH NATURE | Tin tức & Hoạt động thương hiệu",
  description:
    "Cập nhật tin tức doanh nghiệp, sự kiện và góc chia sẻ sức khỏe từ thương hiệu DSH Nature.",
};

const BLOG_CATEGORIES = [
  "Tất cả",
  "Tin tức DSH Nature",
  "Hoạt động xã hội",
  "Góc sức khỏe gia đình",
  "Thông tin thương hiệu",
];

const BLOG_POSTS = [
  {
    slug: "dsh-nature-trao-tang-qua-suc-khoe-cho-cong-dong",
    title: "DSH Nature đồng hành cùng chương trình trao tặng quà sức khỏe cho cộng đồng",
    category: "Hoạt động xã hội",
    excerpt: "Chuỗi hoạt động ý nghĩa mang các giải pháp thảo dược đến với bà con vùng cao.",
    date: "14/09/2026",
  },
  {
    slug: "hanh-trinh-phat-trien-thuong-hieu-dsh-nature",
    title: "Hành trình phát triển thương hiệu DSH Nature — Đồng hành cùng sức khỏe gia đình",
    category: "Thông tin thương hiệu",
    excerpt: "Nhìn lại chặng đường xây dựng niềm tin của hàng nghìn gia đình Việt.",
    date: "10/09/2026",
  },
  {
    slug: "ra-mat-dong-san-pham-ho-tro-ho-hap-moi",
    title: "Ra mắt dòng sản phẩm hỗ trợ hô hấp Euginca An Phế DSH với công thức cải tiến",
    category: "Tin tức DSH Nature",
    excerpt: "Sự kết hợp tinh túy từ thảo dược tự nhiên mang lại giải pháp làm dịu cổ họng hiệu quả.",
    date: "05/09/2026",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 space-y-8">
      <SectionTitle
        eyebrow="Tin tức & Sự kiện"
        title="Blog DSH Nature"
        description="Cập nhật tin tức mới nhất về hoạt động doanh nghiệp và chia sẻ cộng đồng."
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {BLOG_CATEGORIES.map((cat, idx) => (
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
        {BLOG_POSTS.map((post) => (
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
                {post.date}
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
    </div>
  );
}
