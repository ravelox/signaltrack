import clsx from "clsx";

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-xl px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-primary text-white",
        variant === "secondary" && "border border-line bg-white text-ink",
        variant === "ghost" && "bg-transparent text-ink",
        variant === "danger" && "bg-red-600 text-white",
        className
      )}
    >
      {children}
    </button>
  );
}
