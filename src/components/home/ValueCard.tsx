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
    <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-6 text-center shadow-soft transition-shadow hover:shadow-soft-hover">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary-light text-primary">
        <Icon className="size-6" aria-hidden />
      </div>
      <p className="font-heading font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
