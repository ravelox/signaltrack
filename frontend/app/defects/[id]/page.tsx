"use client";

import { use } from "react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusChip } from "@/components/status/status-chip";
import { EvidenceCard } from "@/components/cards/evidence-card";
import { TimelineEntry } from "@/components/timeline/timeline-entry";
import { DetailSkeleton } from "@/components/states/skeletons";
import { ErrorPanel } from "@/components/states/error-panel";
import { useDefectDetail } from "@/features/defects/hooks/use-defect-detail";
import { ChangeOwnerForm } from "@/features/defects/components/change-owner-form";
import { CreateNextActionForm } from "@/features/defects/components/create-next-action-form";
import { UpdateStatusesForm } from "@/features/defects/components/update-statuses-form";
import { useEvidenceDownloadUrl } from "@/features/evidence/hooks/use-evidence-download-url";
import { Guard } from "@/components/auth/guard";
import { Can } from "@/components/auth/can";

export default function DefectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const query = useDefectDetail(id);
  const downloadEvidence = useEvidenceDownloadUrl();
  const [evidenceError, setEvidenceError] = useState("");

  if (query.isLoading) return <DetailSkeleton />;
  if (query.isError || !query.data) return <ErrorPanel />;

  const defect = query.data;

  const openEvidence = async (objectKey: string) => {
    setEvidenceError("");

    try {
      const { url } = await downloadEvidence.mutateAsync(objectKey);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setEvidenceError("Opening evidence failed.");
    }
  };

  return (
    <Guard allow={["engineer", "engineering_manager", "org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow={defect.key}
          title={defect.externalSummary}
          description="Role-gated operational actions live alongside the defect record."
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_420px]">
          <div className="space-y-6">
            <Panel className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-muted">Dual-status model</div>
                  <div className="mt-1 text-2xl font-semibold">{defect.externalSummary}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusChip kind="reporter">Reporter: {defect.reporterStatus}</StatusChip>
                  <StatusChip kind="internal">Internal: {defect.internalStatus}</StatusChip>
                </div>
              </div>
            </Panel>

            <Panel className="p-6">
              <SectionHeader title="External Summary" />
              <p className="mt-3 text-sm leading-6 text-ink/90">{defect.externalSummaryText}</p>
            </Panel>

            <Panel className="p-6">
              <SectionHeader title="Internal Summary" />
              <p className="mt-3 text-sm leading-6 text-ink/90">{defect.internalSummaryText}</p>
            </Panel>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel className="p-6">
                <SectionHeader title="Evidence" />
                <div className="mt-4 space-y-3">
                  {defect.evidence.map((item) => (
                    <EvidenceCard key={item.objectKey} name={item.name} meta={item.meta} onClick={() => openEvidence(item.objectKey)} />
                  ))}
                </div>
                {evidenceError ? <div className="mt-3 text-sm text-red-700">{evidenceError}</div> : null}
              </Panel>

              <Panel className="p-6">
                <SectionHeader title="Activity Timeline" />
                <div className="mt-4 space-y-4">
                  {defect.timeline.map((item) => (
                    <TimelineEntry key={item.title} title={item.title} subtitle={item.subtitle} />
                  ))}
                </div>
              </Panel>
            </div>
          </div>

          <div className="space-y-6">
            <Panel className="sticky top-6 p-6">
              <SectionHeader title="Work State" />
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ["Opened", defect.openedAt],
                  ["Accountable owner", defect.owner],
                  ["Current next action", defect.nextAction],
                  ["Severity", String(defect.severity)],
                  ["Urgency", String(defect.urgency)],
                  ["Evidence gap", String(defect.evidenceGap)],
                  ["Stalled", defect.stalled ? "Yes" : "No"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-muted">{label}</span>
                    <strong className="text-right">{value}</strong>
                  </div>
                ))}
              </div>
            </Panel>

            <Can action="changeOwner">
              <Panel className="p-6">
                <SectionHeader title="Change owner" description="Manager and engineer action." />
                <div className="mt-4">
                  <ChangeOwnerForm defectId={defect.id} options={defect.ownerOptions} />
                </div>
              </Panel>
            </Can>

            <Can action="createNextAction">
              <Panel className="p-6">
                <SectionHeader title="Create next action" description="Keep one current next action visible and concrete." />
                <div className="mt-4">
                  <CreateNextActionForm defectId={defect.id} options={defect.ownerOptions} />
                </div>
              </Panel>
            </Can>

            <Can action="updateStatuses">
              <Panel className="p-6">
                <SectionHeader title="Update statuses" description="Reporter-facing and internal statuses stay separate." />
                <div className="mt-4">
                  <UpdateStatusesForm
                    defectId={defect.id}
                    initialReporterStatus={defect.reporterStatus}
                    initialInternalStatus={defect.internalStatus}
                  />
                </div>
              </Panel>
            </Can>
          </div>
        </div>
      </div>
    </Guard>
  );
}
