export function EvidenceCard({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-line bg-slate-50 p-4">
      <div className="font-semibold">{name}</div>
      <div className="mt-1 text-sm text-muted">{meta}</div>
    </div>
  );
}
