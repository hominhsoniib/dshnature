import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ChevronRight, UserCheck } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";

export const metadata: Metadata = {
  title: "Kiến thức sức khỏe | DSH NATURE",
  description:
    "Cẩm nang y khoa & thông tin tư vấn chăm sóc sức khỏe gia đình từ đội ngũ chuyên gia DSH Nature.",
};

const HEALTH_CATEGORIES = [
  "Tất cả",
  "Hô hấp & Phế quản",
  "Xương khớp & Vận động",
  "Tuần hoàn & Não bộ",
  "Giấc ngủ & Thần kinh",
  "Dinh dưỡng gia đình",
  "Chăm sóc sức khỏe cao tuổi",
];

const HEALTH_ARTICLES = [
  {
    slug: "bi-quyet-bao-ve-he-ho-hap-khi-thay-doi-thoi-tiet",
    title: "Bí quyết bảo vệ hệ hô hấp cho cả gia đình khi thời tiết giao mùa",
    category: "Hô hấp & Phế quản",
    excerpt: "Những cách đơn giản từ thảo dược thiên nhiên giúp tăng cường sức đề kháng đường hô hấp khi thời tiết chuyển lạnh.",
    date: "18/09/2026",
    author: "Dược sĩ DSH Nature",
  },
  {
    slug: "huong-dan-cham-soc-suc-khoe-xuong-khop-cho-nguoi-cao-tuoi",
    title: "Hướng dẫn chăm sóc sức khỏe xương khớp vận động linh hoạt cho người cao tuổi",
    category: "Xương khớp & Vận động",
    excerpt: "Duy trì chế độ dinh dưỡng và thói quen vận động hợp lý giúp giữ gìn độ dẻo dai của khớp xương.",
    date: "15/09/2026",
    author: "Ban Cố vấn Y khoa",
  },
  {
    slug: "giai-phap-ho-tro-tuan-hoan-mau-nao-giam-cang-thang",
    title: "Giải pháp hỗ trợ tuần hoàn máu não và giảm căng thẳng cho người làm việc trí óc",
    category: "Tuần hoàn & Não bộ",
    excerpt: "Tìm hiểu vai trò của Bạch quả (Ginkgo Biloba) và các bài tập giúp tăng khả năng tập trung tinh thần.",
    date: "12/09/2026",
    author: "Dược sĩ DSH Nature",
  },
  {
    slug: "meo-cai-thien-giac-ngu-tu-nhien-khong-lo-tran-troc",
    title: "Mẹo cải thiện giấc ngủ tự nhiên giúp bạn ngủ ngon và sâu giấc mỗi đêm",
    category: "Giấc ngủ & Thần kinh",
    excerpt: "Sử dụng thảo mộc an thần tự nhiên như Lạc tiên, Tâm sen kết hợp thói quen sinh hoạt khoa học.",
    date: "08/09/2026",
    author: "Chuyên gia DSH Nature",
  },
];

export default function HealthKnowledgePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 space-y-8">
      <SectionTitle
        eyebrow="Cẩm nang y khoa"
        title="Kiến thức sức khỏe gia đình"
        description="Thông tin y học thường thức được tổng hợp và tham vấn bởi chuyên môn DSH Nature."
      />

      {/* Category List */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {HEALTH_CATEGORIES.map((cat, idx) => (
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
        {HEALTH_ARTICLES.map((article) => (
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
                  {article.date}
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
    </div>
  );
}
