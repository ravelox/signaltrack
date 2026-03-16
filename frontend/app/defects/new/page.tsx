"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Guard } from "@/components/auth/guard";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateDefect } from "@/features/defects/hooks/use-create-defect";

export default function NewDefectPage() {
  const router = useRouter();
  const mutation = useCreateDefect();
  const [externalSummary, setExternalSummary] = useState("");
  const [internalSummary, setInternalSummary] = useState("");
  const [severity, setSeverity] = useState("2");
  const [urgency, setUrgency] = useState("2");
  const [evidenceGap, setEvidenceGap] = useState("2");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const created = await mutation.mutateAsync({
        externalSummary,
        internalSummary,
        severity: Number(severity),
        urgency: Number(urgency),
        evidenceGap: Number(evidenceGap)
      });
      router.push(`/defects/${created.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create defect.");
    }
  };

  return (
    <Guard allow={["engineer", "engineering_manager", "org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Engineer workflow"
          title="New defect"
          description="Create a defect record with separate reporter-facing and internal context."
        />

        <Panel className="mx-auto max-w-4xl p-6">
          <div className="space-y-4">
            <Field label="External summary">
              <Input value={externalSummary} onChange={(event) => setExternalSummary(event.target.value)} />
            </Field>
            <Field label="Internal summary">
              <Textarea rows={6} value={internalSummary} onChange={(event) => setInternalSummary(event.target.value)} />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Severity">
                <Input type="number" min="1" max="3" value={severity} onChange={(event) => setSeverity(event.target.value)} />
              </Field>
              <Field label="Urgency">
                <Input type="number" min="1" max="3" value={urgency} onChange={(event) => setUrgency(event.target.value)} />
              </Field>
              <Field label="Evidence gap">
                <Input type="number" min="1" max="3" value={evidenceGap} onChange={(event) => setEvidenceGap(event.target.value)} />
              </Field>
            </div>

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => router.push("/defects")}>Cancel</Button>
              <Button onClick={submit} disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create defect"}
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </Guard>
  );
}
