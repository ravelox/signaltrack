import clsx from "clsx";

export function RiskBadge({
  kind,
  children
}: {
  kind: "high" | "medium" | "low";
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1.5 text-xs font-bold",
        kind === "high" && "bg-risk-high-soft text-red-700",
        kind === "medium" && "bg-risk-med-soft text-amber-700",
        kind === "low" && "bg-risk-low-soft text-green-700"
      )}
    >
      {children}
    </span>
  );
}
