import Link from "next/link";

export function ArticleCard({
  title,
  category,
  href,
}: {
  title: string;
  category: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded-lg bg-white p-5 shadow-soft transition-shadow hover:shadow-soft-hover"
    >
      <div className="aspect-video w-full rounded-md bg-primary-light" aria-hidden />
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{category}</p>
      <p className="font-heading font-semibold text-foreground">{title}</p>
    </Link>
  );
}
