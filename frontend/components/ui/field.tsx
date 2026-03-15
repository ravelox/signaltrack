export function Field({
  label,
  children,
  hint,
  error
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error ? <div className="text-xs text-red-600">{error}</div> : hint ? <div className="text-xs text-muted">{hint}</div> : null}
    </label>
  );
}
