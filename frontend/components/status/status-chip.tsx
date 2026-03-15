import clsx from "clsx";

export function StatusChip({
  kind,
  children
}: {
  kind: "reporter" | "internal";
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1.5 text-xs font-bold",
        kind === "reporter" ? "bg-reporter-soft text-blue-700" : "bg-internal-soft text-slate-700"
      )}
    >
      {children}
    </span>
  );
}
