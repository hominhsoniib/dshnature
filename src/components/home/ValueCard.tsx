import type { LucideIcon } from "lucide-react";

export function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 sm:p-6 text-center shadow-soft transition-all hover:shadow-soft-hover border border-border">
      <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-primary-light text-primary">
        <Icon className="size-5 sm:size-6" aria-hidden />
      </div>
      <p className="font-heading text-sm sm:text-base font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
