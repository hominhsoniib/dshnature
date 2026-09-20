import Link from "next/link";
import Image from "next/image";

export function ArticleCard({
  title,
  category,
  href,
  image,
}: {
  title: string;
  category: string;
  href: string;
  image?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 rounded-xl border border-border bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-soft-hover"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-cream">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-video w-full rounded-md bg-primary-light" aria-hidden />
        )}
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">{category}</p>
      <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{title}</p>
    </Link>
  );
}
