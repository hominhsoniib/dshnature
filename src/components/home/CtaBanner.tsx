import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaBanner({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="rounded-lg bg-primary p-8 text-center text-primary-foreground shadow-soft md:p-12">
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-2xl font-bold md:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 md:text-base">{description}</p>
      <Button
        size="lg"
        variant="secondary"
        className="mt-6"
        nativeButton={false}
        render={<Link href={ctaHref}>{ctaLabel}</Link>}
      />
    </div>
  );
}
