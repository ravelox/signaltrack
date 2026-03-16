"use client";

import Link from "next/link";
import { use } from "react";
import { Guard } from "@/components/auth/guard";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { DetailSkeleton } from "@/components/states/skeletons";
import { ErrorPanel } from "@/components/states/error-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section-header";
import { useReportDetail } from "@/features/reports/hooks/use-report-detail";

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const query = useReportDetail(id);

  if (query.isLoading) return <DetailSkeleton />;
  if (query.isError || !query.data) return <ErrorPanel title="Reported issue unavailable" />;

  const report = query.data;
  const attachments = Array.isArray(report.environmentSnapshot.attachments)
    ? (report.environmentSnapshot.attachments as Array<{ name?: string; objectKey?: string }>)
    : [];

  return (
    <Guard allow={["engineer", "engineering_manager", "org_admin"]}>
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Reported Issues", href: "/reports" }, { label: report.id.slice(0, 8) }]} />
        <PageHeader
          eyebrow={`Reported issue ${report.id.slice(0, 8)}`}
          title={report.rawDescription}
          description="Full reporter submission for planning and triage."
          actions={
            report.defectHref ? (
              <Link href={report.defectHref} className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold shadow-soft">
                Open linked defect {report.linkedDefectKey}
              </Link>
            ) : null
          }
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
          <div className="space-y-6">
            <Panel className="p-6">
              <SectionHeader title="What were you trying to do?" />
              <p className="mt-3 text-sm leading-6 text-ink/90">{report.rawDescription}</p>
            </Panel>

            <Panel className="p-6">
              <SectionHeader title="What did you expect to happen?" />
              <p className="mt-3 text-sm leading-6 text-ink/90">{report.expectedBehavior ?? "No expectation was provided."}</p>
            </Panel>

            <Panel className="p-6">
              <SectionHeader title="What happened instead?" />
              <p className="mt-3 text-sm leading-6 text-ink/90">{report.observedBehavior ?? "No observed behavior was provided."}</p>
            </Panel>

            <Panel className="p-6">
              <SectionHeader title="Attachments and environment snapshot" />
              <div className="mt-4 space-y-3">
                {attachments.length > 0 ? (
                  attachments.map((item, index) => (
                    <div key={`${item.objectKey ?? "attachment"}-${index}`} className="rounded-xl border border-line bg-slate-50 p-4 text-sm">
                      <div className="font-semibold">{item.name ?? "Attachment"}</div>
                      <div className="mt-1 text-muted">{item.objectKey ?? "No storage key recorded"}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted">No attachments were submitted.</div>
                )}
                <pre className="overflow-x-auto rounded-xl border border-line bg-slate-950 p-4 text-xs text-slate-200">
                  {JSON.stringify(report.environmentSnapshot, null, 2)}
                </pre>
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel className="sticky top-6 p-6">
              <SectionHeader title="Submission metadata" />
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ["Opened", report.submittedAt],
                  ["Reporter", report.reporter],
                  ["Reporter type", report.reporterType],
                  ["Impact", report.impactLevel.replaceAll("_", " ")],
                  ["Workaround available", report.workaroundAvailable == null ? "Unknown" : report.workaroundAvailable ? "Yes" : "No"],
                  ["Contact allowed", report.contactAllowed ? "Yes" : "No"],
                  ["Linked defect", report.linkedDefectKey ?? "Not linked"]
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-muted">{label}</span>
                    <strong className="text-right">{value}</strong>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </Guard>
  );
}
