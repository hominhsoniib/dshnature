import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, UserCheck } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Kiến thức sức khỏe | DSH NATURE",
    description: `Đọc bài viết kiến thức sức khỏe chi tiết - ${slug}`,
  };
}

export default async function ArticleDetailPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 space-y-6">
      <Link href="/kien-thuc" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
        <ArrowLeft className="size-3.5" /> Trở lại Kiến thức sức khỏe
      </Link>

      <div className="space-y-3">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Cẩm nang y khoa
        </span>
        <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          Bí quyết bảo vệ và chăm sóc sức khỏe gia đình trọn vẹn từ thảo dược thiên nhiên
        </h1>

        <div className="flex items-center gap-4 text-xs text-muted-foreground border-b border-border pb-4">
          <span className="flex items-center gap-1 font-medium text-foreground">
            <UserCheck className="size-4 text-primary" /> Ban Cố vấn Y khoa DSH Nature
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-4" /> 18/09/2026
          </span>
        </div>
      </div>

      <div className="prose prose-emerald max-w-none text-muted-foreground leading-relaxed space-y-4 text-sm md:text-base">
        <p className="font-medium text-foreground leading-relaxed">
          Sức khỏe của các thành viên trong gia đình là tài sản quý giá nhất. Việc chủ động chăm sóc và bảo vệ sức khỏe hằng ngày bằng các giải pháp thảo dược tự nhiên chọn lọc đang trở thành xu hướng hàng đầu.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground pt-2">
          1. Lựa chọn nguồn thảo dược tinh khiết và an toàn
        </h2>
        <p>
          Thảo dược thiên nhiên mang lại giá trị hỗ trợ sức khỏe bền vững. Tuy nhiên, việc lựa chọn sản phẩm có nguồn nguyên liệu rõ ràng, sản xuất đạt chuẩn y tế GMP là yếu tố quan trọng nhất để đảm bảo an toàn tuyệt đối cho cả gia đình.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground pt-2">
          2. Xây dựng lối sống lành mạnh kết hợp vận động
        </h2>
        <p>
          Bên cạnh việc sử dụng các sản phẩm hỗ trợ, thói quen ăn uống khoa học, ngủ đúng giờ và duy trì vận động thể chất mỗi ngày 30 phút sẽ giúp hệ miễn dịch luôn ở trạng thái tốt nhất.
        </p>

        <div className="rounded-xl border border-primary/20 bg-primary-light/40 p-6 my-6 text-xs md:text-sm">
          <p className="font-semibold text-primary mb-1">Lời khuyên từ DSH Nature:</p>
          <p className="text-muted-foreground">
            Sản phẩm bảo vệ sức khỏe là giải pháp hỗ trợ đồng hành hằng ngày. Hãy đọc kỹ hướng dẫn sử dụng và lắng nghe tư vấn từ chuyên gia y tế trước khi dùng.
          </p>
        </div>
      </div>
    </div>
  );
}
