import clsx from "clsx";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx("w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none", props.className)}
    />
  );
}
