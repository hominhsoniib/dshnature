export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm text-muted-foreground md:text-base">{description}</p>
      ) : null}
    </div>
  );
}
