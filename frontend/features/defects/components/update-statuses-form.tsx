"use client";

import { useState } from "react";
import { updateStatusesSchema } from "@/lib/forms/schemas";
import { validateForm } from "@/lib/forms/validate";
import { mapServerErrorToFields } from "@/lib/server-errors";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ValidationSummary } from "@/components/forms/validation-summary";
import { FormMessage } from "@/components/forms/form-message";
import { useUpdateStatuses } from "@/features/defects/hooks/use-defect-actions";

const reporterStatuses = ["received", "investigating", "need_more_info", "believed_fixed", "resolved"];
const internalStatuses = ["new", "needs_clarification", "under_investigation", "fix_proposed", "validation_pending", "resolved", "archived"];

export function UpdateStatusesForm({
  defectId,
  initialReporterStatus,
  initialInternalStatus
}: {
  defectId: string;
  initialReporterStatus: string;
  initialInternalStatus: string;
}) {
  const mutation = useUpdateStatuses();
  const [reporterStatus, setReporterStatus] = useState(initialReporterStatus);
  const [internalStatus, setInternalStatus] = useState(initialInternalStatus);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");

  const submit = async () => {
    const result = validateForm(updateStatusesSchema, { defectId, reporterStatus, internalStatus });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setServerMessage("");

    try {
      await mutation.mutateAsync(result.data);
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
      <Field label="Reporter-facing status" error={errors.reporterStatus}>
        <Select value={reporterStatus} onChange={(e) => setReporterStatus(e.target.value)}>
          {reporterStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </Select>
      </Field>
      <Field label="Internal status" error={errors.internalStatus}>
        <Select value={internalStatus} onChange={(e) => setInternalStatus(e.target.value)}>
          {internalStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </Select>
      </Field>
      <Button variant="secondary" className="w-full" onClick={submit} disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Update statuses"}
      </Button>
      {mutation.isSuccess ? <FormMessage kind="success" message="Statuses submitted." /> : null}
      {serverMessage ? <FormMessage kind="error" message={serverMessage} /> : null}
    </div>
  );
}
