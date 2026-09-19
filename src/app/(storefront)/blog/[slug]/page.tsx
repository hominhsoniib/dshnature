import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Blog bài viết | DSH NATURE",
    description: `Tin tức blog chi tiết - ${slug}`,
  };
}

export default async function BlogDetailPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 space-y-6">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
        <ArrowLeft className="size-3.5" /> Trở lại danh sách Blog
      </Link>

      <div className="space-y-3">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Tin tức DSH Nature
        </span>
        <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          Hành trình xây dựng thương hiệu chăm sóc sức khỏe gia đình uy tín hàng đầu
        </h1>

        <div className="flex items-center gap-4 text-xs text-muted-foreground border-b border-border pb-4">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" /> 14/09/2026
          </span>
        </div>
      </div>

      <div className="prose prose-emerald max-w-none text-muted-foreground leading-relaxed space-y-4 text-sm md:text-base">
        <p className="font-medium text-foreground leading-relaxed">
          Với thông điệp “Đồng hành cùng sức khỏe gia đình”, DSH Nature không ngừng nỗ lực cải tiến chất lượng và nâng cao dịch vụ chăm sóc người tiêu dùng Việt Nam.
        </p>

        <p>
          Trong suốt thời gian qua, các dòng sản phẩm của DSH Nature như Euginca An Phế DSH, Viên khớp DSH, Ginkgo Nature Extra Q10 và Pharton Nature DSH đã nhận được sự tin tưởng đồng hành từ đông đảo gia đình trên cả nước.
        </p>

        <p>
          Chúng tôi tự hào tiếp tục phát triển mạng lưới đại lý và đối tác phân phối rộng khắp nhằm đưa các giải pháp thảo dược an toàn đến gần hơn với mọi ngôi nhà Việt.
        </p>
      </div>
    </div>
  );
}
