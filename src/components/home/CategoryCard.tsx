import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CategoryCard({ name, href }: { name: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-lg bg-cream p-5 shadow-soft transition-shadow hover:shadow-soft-hover"
    >
      <span className="font-heading font-semibold text-foreground">{name}</span>
      <ArrowRight
        className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1"
        aria-hidden
      />
    </Link>
  );
}
