import {
  Award,
  BadgeCheck,
  FlaskConical,
  Leaf,
  ShieldCheck,
} from "lucide-react";

import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryCard } from "@/components/home/CategoryCard";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Hero } from "@/components/home/Hero";
import { SectionTitle } from "@/components/home/SectionTitle";
import { ValueCard } from "@/components/home/ValueCard";
import { Newsletter } from "@/components/forms/Newsletter";
import { ProductCard } from "@/components/product/ProductCard";
import { ErrorState } from "@/components/ui/error-state";
import { getPayloadClient } from "@/lib/payload";
import {
  mockAboutSection,
  mockBlogArticles,
  mockCoreValues,
  mockFeaturedProducts,
  mockHealthArticles,
  mockMissionVision,
  mockProductCategories,
} from "@/features/home/mock-data";
import type { Banner } from "@/types/payload-content";

// Brief mục 7 (section 02 + 07): tên 5 giá trị đã chốt cứng, icon chọn theo
// nghĩa gần nhất, không phải nội dung suy diễn.
const VALUE_ICONS = {
  "Chất lượng": BadgeCheck,
  "An toàn": ShieldCheck,
  "Khoa học": FlaskConical,
  "Uy tín": Award,
  "Bền vững": Leaf,
} as const;

async function getBanners(): Promise<{ banners: Banner[]; error: boolean }> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "banners",
      where: { isActive: { equals: true } },
      sort: "order",
      limit: 6,
    });
    return { banners: result.docs as unknown as Banner[], error: false };
  } catch {
    return { banners: [], error: true };
  }
}

export default async function Home() {
  const { banners, error: bannersError } = await getBanners();

  return (
    <>
      {/* 01 Hero */}
      {bannersError ? (
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
          <ErrorState title="Không tải được banner." />
        </div>
      ) : (
        <Hero banners={banners} />
      )}

      {/* 02 Giá trị nổi bật */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <SectionTitle
          eyebrow="Vì sao chọn DSH Nature"
          title="Giá trị nổi bật"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Object.entries(VALUE_ICONS).map(([title, icon]) => (
            <ValueCard
              key={title}
              icon={icon}
              title={title}
              description="[TODO: mô tả chi tiết — chờ nội dung thật]"
            />
          ))}
        </div>
      </section>

      {/* 03 Danh mục sản phẩm */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="Danh mục sản phẩm" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockProductCategories.map((cat) => (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                href={`/san-pham?nhom=${cat.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 04 Sản phẩm nổi bật */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <SectionTitle
          title="Sản phẩm nổi bật"
          description="Dữ liệu minh hoạ — sẽ nối vào Payload (collection products) ở Phase 2."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {mockFeaturedProducts.map((p) => (
            <ProductCard
              key={p.slug}
              name={p.name}
              slug={p.slug}
              shortDescription={p.shortDescription}
            />
          ))}
        </div>
      </section>

      {/* 05 Về DSH Nature */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2">
          <div className="aspect-video rounded-lg bg-primary-light" aria-hidden />
          <div>
            <SectionTitle title={mockAboutSection.heading} />
            <p className="text-sm text-muted-foreground md:text-base">{mockAboutSection.body}</p>
          </div>
        </div>
      </section>

      {/* 06 Sứ mệnh & Tầm nhìn */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <SectionTitle title="Sứ mệnh & Tầm nhìn" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-soft">
            <p className="mb-2 font-heading font-semibold text-primary">Sứ mệnh</p>
            <p className="text-sm text-muted-foreground">{mockMissionVision.mission}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-soft">
            <p className="mb-2 font-heading font-semibold text-primary">Tầm nhìn</p>
            <p className="text-sm text-muted-foreground">{mockMissionVision.vision}</p>
          </div>
        </div>
      </section>

      {/* 07 Giá trị cốt lõi */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="Giá trị cốt lõi" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {mockCoreValues.map((v) => (
              <ValueCard
                key={v.title}
                icon={VALUE_ICONS[v.title as keyof typeof VALUE_ICONS] ?? BadgeCheck}
                title={v.title}
                description={v.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 08 Kiến thức sức khỏe */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <SectionTitle
          title="Kiến thức sức khỏe"
          description="Danh mục thật (6 nhóm) và bài viết sẽ nối Payload (collection articles) ở Phase 4."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {mockHealthArticles.map((a) => (
            <ArticleCard
              key={a.slug}
              title={a.title}
              category={a.category}
              href={`/kien-thuc/${a.slug}`}
            />
          ))}
        </div>
      </section>

      {/* 09 Tư vấn sức khỏe */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          {/* TODO(Phase 4): form nhanh + FAQ + chuyên gia thật ở trang /tu-van
              — CTA này chỉ dẫn hướng, chưa lặp lại form ở đây. */}
          <CtaBanner
            eyebrow="Cần tư vấn?"
            title="Tư vấn sức khỏe cùng chuyên gia DSH Nature"
            description="Đặt câu hỏi để được đội ngũ chuyên môn hỗ trợ chọn sản phẩm phù hợp."
            ctaLabel="Tư vấn ngay"
            ctaHref="/tu-van"
          />
        </div>
      </section>

      {/* 10 Đại lý */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <CtaBanner
          eyebrow="Hợp tác kinh doanh"
          title="Trở thành đại lý DSH Nature"
          description="Tìm hiểu chính sách đại lý và đăng ký khu vực kinh doanh của bạn."
          ctaLabel="Tìm hiểu đại lý"
          ctaHref="/dai-ly"
        />
      </section>

      {/* 11 Blog */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            title="Blog"
            description="Danh mục thật (4 nhóm) và bài viết sẽ nối Payload (collection articles) ở Phase 4."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mockBlogArticles.map((a) => (
              <ArticleCard
                key={a.slug}
                title={a.title}
                category={a.category}
                href={`/blog/${a.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 12 Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-12 text-center md:px-6 md:py-16">
        <SectionTitle
          title="Đăng ký nhận bản tin"
          description="Cập nhật kiến thức sức khỏe và sản phẩm mới từ DSH Nature."
        />
        <Newsletter />
      </section>
    </>
  );
}
