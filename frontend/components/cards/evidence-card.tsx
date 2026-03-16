export function EvidenceCard({
  name,
  meta,
  onClick
}: {
  name: string;
  meta: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-line bg-slate-50 p-4 text-left transition hover:border-primary/40 hover:bg-white"
    >
      <div className="font-semibold">{name}</div>
      <div className="mt-1 text-sm text-muted">{meta}</div>
    </button>
  );
}
