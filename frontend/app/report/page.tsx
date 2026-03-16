"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChoicePill } from "@/components/ui/choice-pill";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { FormMessage } from "@/components/forms/form-message";
import { ValidationSummary } from "@/components/forms/validation-summary";
import { reportFormSchema } from "@/lib/forms/schemas";
import { validateForm } from "@/lib/forms/validate";
import { mapServerErrorToFields } from "@/lib/server-errors";
import { useCreateReport } from "@/features/reports/hooks/use-create-report";
import { useEvidenceUploadUrl } from "@/features/evidence/hooks/use-evidence-upload-url";
import { Guard } from "@/components/auth/guard";

export default function ReportPage() {
  const router = useRouter();
  const createReport = useCreateReport();
  const uploadUrl = useEvidenceUploadUrl();

  const [rawDescription, setRawDescription] = useState("I was trying to export a CSV report for last quarter...");
  const [expectedBehavior, setExpectedBehavior] = useState("The report should download as a CSV file.");
  const [observedBehavior, setObservedBehavior] = useState("The page spins for a while and then shows a timeout.");
  const [impactLevel, setImpactLevel] = useState<"annoying" | "slows_me_down" | "blocking">("blocking");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; objectKey: string }>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");

  const submit = async () => {
    const payload = {
      rawDescription,
      expectedBehavior,
      observedBehavior,
      impactLevel,
      workaroundAvailable: false,
      contactAllowed: true,
      environmentSnapshot: {
        source: "phase-bundle",
        attachments: uploadedFiles
      }
    };
    const validated = validateForm(reportFormSchema, payload);
    if (!validated.success) {
      setErrors(validated.errors);
      return;
    }
    setErrors({});
    setServerMessage("");

    try {
      const createdReport = await createReport.mutateAsync(validated.data);
      router.push(`/report/submitted?id=${encodeURIComponent(createdReport.id)}`);
    } catch (error) {
      const mapped = mapServerErrorToFields(error);
      setErrors(mapped.fieldErrors);
      setServerMessage(mapped.message);
    }
  };

  const requestUpload = async () => {
    if (!selectedFile) {
      setServerMessage("Choose a file before requesting an upload.");
      return;
    }

    setServerMessage("");
    const objectKey = `reports/${Date.now()}-${selectedFile.name}`;
    const signed = await uploadUrl.mutateAsync({ objectKey, contentType: selectedFile.type || "application/octet-stream" });

    const response = await fetch(signed.url, {
      method: "PUT",
      headers: {
        "Content-Type": selectedFile.type || "application/octet-stream"
      },
      body: selectedFile
    });

    if (!response.ok) {
      setServerMessage("Uploading evidence failed.");
      return;
    }

    setUploadedFiles((current) => [...current, { name: selectedFile.name, objectKey }]);
    setSelectedFile(null);
  };

  return (
    <Guard allow={["reporter", "engineer", "engineering_manager", "org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Reporter flow"
          title="Report Issue"
          description="Reporters can access this screen without seeing engineering internals."
        />

        <Panel className="mx-auto max-w-4xl p-6">
          <div className="space-y-5">
            <ValidationSummary errors={errors} />

            <Field label="What were you trying to do?" error={errors.rawDescription}>
              <Textarea rows={5} value={rawDescription} onChange={(e) => setRawDescription(e.target.value)} />
            </Field>

            <Field label="What did you expect to happen?" error={errors.expectedBehavior}>
              <Textarea rows={4} value={expectedBehavior} onChange={(e) => setExpectedBehavior(e.target.value)} />
            </Field>

            <Field label="What happened instead?" error={errors.observedBehavior}>
              <Textarea rows={4} value={observedBehavior} onChange={(e) => setObservedBehavior(e.target.value)} />
            </Field>

            <Field label="How much is this affecting you?" error={errors.impactLevel}>
              <div className="flex flex-wrap gap-2">
                <ChoicePill selected={impactLevel === "blocking"} onClick={() => setImpactLevel("blocking")}>Blocking</ChoicePill>
                <ChoicePill selected={impactLevel === "slows_me_down"} onClick={() => setImpactLevel("slows_me_down")}>Slows me down</ChoicePill>
                <ChoicePill selected={impactLevel === "annoying"} onClick={() => setImpactLevel("annoying")}>Annoying</ChoicePill>
              </div>
            </Field>

            <Panel className="border-dashed bg-slate-50 p-4">
              <div className="font-semibold">Attach evidence</div>
              <div className="mt-1 text-sm text-muted">Upload a file to object storage before submitting the issue.</div>
              <Input className="mt-3" type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
              <Button variant="secondary" className="mt-3" onClick={requestUpload}>
                {uploadUrl.isPending ? "Uploading..." : "Upload file"}
              </Button>
              {uploadedFiles.length > 0 ? (
                <div className="mt-3 space-y-2 text-sm text-muted">
                  {uploadedFiles.map((file) => (
                    <div key={file.objectKey}>{file.name}</div>
                  ))}
                </div>
              ) : null}
            </Panel>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="secondary" onClick={() => router.push("/")}>Cancel</Button>
              <Button onClick={submit} disabled={createReport.isPending}>
                {createReport.isPending ? "Submitting..." : "Submit report"}
              </Button>
            </div>

            {serverMessage ? <FormMessage kind="error" message={serverMessage} /> : null}
          </div>
        </Panel>
      </div>
    </Guard>
  );
}
