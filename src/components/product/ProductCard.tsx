import Image from "next/image";
import Link from "next/link";

/**
 * ProductCard component cho trang chủ và các trang danh mục
 */
export function ProductCard({
  name,
  slug,
  shortDescription,
  image,
}: {
  name: string;
  slug: string;
  shortDescription: string;
  image?: string;
}) {
  return (
    <Link
      href={`/san-pham/${slug}`}
      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-white p-4 shadow-soft transition-all duration-300 hover:shadow-soft-hover"
    >
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-cream">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="aspect-square w-full rounded-md bg-primary-light" aria-hidden />
          )}
        </div>
        <p className="mt-3 font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{shortDescription}</p>
      </div>
    </Link>
  );
}
