import type { ZodTypeAny } from "zod";

export type FieldErrors = Record<string, string>;

export function validateForm<T>(schema: ZodTypeAny, values: T): { success: true; data: T } | { success: false; errors: FieldErrors } {
  const result = schema.safeParse(values);
  if (result.success) return { success: true, data: values };

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }

  return { success: false, errors };
}
