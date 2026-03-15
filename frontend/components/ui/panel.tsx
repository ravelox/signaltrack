import clsx from "clsx";

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("panel", className)}>{children}</div>;
}
