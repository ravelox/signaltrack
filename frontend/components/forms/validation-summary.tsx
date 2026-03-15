import type { FieldErrors } from "@/lib/forms/validate";

export function ValidationSummary({ errors }: { errors: FieldErrors }) {
  const values = Object.values(errors);
  if (values.length === 0) return null;

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
      <div className="text-sm font-semibold text-red-700">Please fix the following:</div>
      <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
        {values.map((value, index) => (
          <li key={`${value}-${index}`}>{value}</li>
        ))}
      </ul>
    </div>
  );
}
