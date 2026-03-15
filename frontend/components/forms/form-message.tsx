export function FormMessage({
  kind,
  message
}: {
  kind: "success" | "error" | "info";
  message: string;
}) {
  const classes = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700"
  } as const;

  return <div className={`rounded-2xl border p-4 text-sm ${classes[kind]}`}>{message}</div>;
}
