"use client";

import { useState } from "react";
import { createNextActionSchema } from "@/lib/forms/schemas";
import { validateForm } from "@/lib/forms/validate";
import { mapServerErrorToFields } from "@/lib/server-errors";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ValidationSummary } from "@/components/forms/validation-summary";
import { FormMessage } from "@/components/forms/form-message";
import { useCreateNextAction } from "@/features/defects/hooks/use-defect-actions";

export function CreateNextActionForm({
  defectId,
  options
}: {
  defectId: string;
  options: Array<{ id: string; label: string }>;
}) {
  const mutation = useCreateNextAction();
  const [ownerUserId, setOwnerUserId] = useState("");
  const [summary, setSummary] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");

  const submit = async () => {
    const result = validateForm(createNextActionSchema, { defectId, ownerUserId, summary, dueAt });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setServerMessage("");

    try {
      await mutation.mutateAsync({
        ...result.data,
        ownerLabel: options.find((item) => item.id === result.data.ownerUserId)?.label
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
      <Field label="Owner" error={errors.ownerUserId}>
        <Select value={ownerUserId} onChange={(e) => setOwnerUserId(e.target.value)}>
          <option value="">Select owner…</option>
          {options.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </Select>
      </Field>
      <Field label="Summary" error={errors.summary}>
        <Input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Verify logs in export worker" />
      </Field>
      <Field label="Due at" error={errors.dueAt}>
        <Input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
      </Field>
      <Button variant="secondary" className="w-full" onClick={submit} disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Create next action"}
      </Button>
      {mutation.isSuccess ? <FormMessage kind="success" message="Next action submitted." /> : null}
      {serverMessage ? <FormMessage kind="error" message={serverMessage} /> : null}
    </div>
  );
}
