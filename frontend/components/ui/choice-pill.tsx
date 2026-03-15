import clsx from "clsx";

export function ChoicePill({
  selected,
  children,
  onClick
}: {
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-xl border px-4 py-2 text-sm font-semibold",
        selected ? "border-blue-200 bg-primary-soft text-primary" : "border-line bg-white text-ink"
      )}
    >
      {children}
    </button>
  );
}
