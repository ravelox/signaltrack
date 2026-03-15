"use client";

import { useState } from "react";
import { changeOwnerSchema } from "@/lib/forms/schemas";
import { validateForm } from "@/lib/forms/validate";
import { mapServerErrorToFields } from "@/lib/server-errors";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/form-message";
import { ValidationSummary } from "@/components/forms/validation-summary";
import { useChangeOwner } from "@/features/defects/hooks/use-defect-actions";

export function ChangeOwnerForm({
  defectId,
  options
}: {
  defectId: string;
  options: Array<{ id: string; label: string }>;
}) {
  const mutation = useChangeOwner();
  const [userId, setUserId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");

  const submit = async () => {
    const result = validateForm(changeOwnerSchema, { defectId, userId });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setServerMessage("");

    try {
      await mutation.mutateAsync({
        ...result.data,
        userLabel: options.find((item) => item.id === result.data.userId)?.label
      });
    } catch (error) {
      const mapped = mapServerErrorToFields(error);
      setErrors(mapped.fieldErrors);
      setServerMessage(mapped.message);
      return;
    }
  };

  return (
    <div className="space-y-3">
      <ValidationSummary errors={errors} />
      <Field label="Accountable owner" error={errors.userId}>
        <Select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">Select owner…</option>
          {options.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </Select>
      </Field>
      <Button className="w-full" onClick={submit} disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Change owner"}
      </Button>
      {mutation.isSuccess ? <FormMessage kind="success" message="Owner change submitted." /> : null}
      {serverMessage ? <FormMessage kind="error" message={serverMessage} /> : null}
    </div>
  );
}
