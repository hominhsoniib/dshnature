import Link from "next/link";

/**
 * Bản tối giản cho section 04 trang chủ (Sản phẩm nổi bật). Phase 2 sẽ mở
 * rộng thêm ảnh/giá/ProductGrid/ProductFilter thật khi nối Payload
 * (PROJECT_BRIEF.md mục 13).
 */
export function ProductCard({
  name,
  slug,
  shortDescription,
}: {
  name: string;
  slug: string;
  shortDescription: string;
}) {
  return (
    <Link
      href={`/san-pham/${slug}`}
      className="flex flex-col gap-2 rounded-lg bg-white p-5 shadow-soft transition-shadow hover:shadow-soft-hover"
    >
      <div className="aspect-square w-full rounded-md bg-primary-light" aria-hidden />
      <p className="font-heading font-semibold text-foreground">{name}</p>
      <p className="text-sm text-muted-foreground">{shortDescription}</p>
    </Link>
  );
}
