export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-muted">{eyebrow}</div>
        <h1 className="mt-1 text-3xl font-bold">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
