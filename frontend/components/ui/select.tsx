import clsx from "clsx";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx("w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none", props.className)}
    />
  );
}
