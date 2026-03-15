import clsx from "clsx";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={clsx("w-full rounded-2xl border border-line bg-white p-4 text-sm outline-none", props.className)}
    />
  );
}
