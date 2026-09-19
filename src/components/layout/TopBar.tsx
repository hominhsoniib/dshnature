import { Mail, Phone } from "lucide-react";

export function TopBar({
  hotline,
  email,
}: {
  hotline?: string | null;
  email?: string | null;
}) {
  if (!hotline && !email) return null;

  return (
    <div className="hidden border-b border-border bg-primary-dark text-white md:block">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-end gap-5 px-6 text-xs">
        {hotline ? (
          <a
            href={`tel:${hotline.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 hover:underline"
          >
            <Phone className="size-3.5" aria-hidden />
            {hotline}
          </a>
        ) : null}
        {email ? (
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:underline">
            <Mail className="size-3.5" aria-hidden />
            {email}
          </a>
        ) : null}
      </div>
    </div>
  );
}
