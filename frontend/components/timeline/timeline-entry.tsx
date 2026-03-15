export function TimelineEntry({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="grid grid-cols-[16px_1fr] gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="mt-1 text-sm text-muted">{subtitle}</div>
      </div>
    </div>
  );
}
