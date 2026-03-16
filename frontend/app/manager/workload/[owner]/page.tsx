"use client";

import Link from "next/link";
import { use } from "react";
import { Guard } from "@/components/auth/guard";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusChip } from "@/components/status/status-chip";
import { RiskBadge } from "@/components/status/risk-badge";
import { DetailSkeleton } from "@/components/states/skeletons";
import { ErrorPanel } from "@/components/states/error-panel";
import { EmptyState } from "@/components/states/empty-state";
import { useManagerOverview } from "@/features/manager/hooks/use-manager-overview";

export default function ManagerOwnerWorkloadPage({
  params
}: {
  params: Promise<{ owner: string }>;
}) {
  const { owner } = use(params);
  const query = useManagerOverview();

  if (query.isLoading) return <DetailSkeleton />;
  if (query.isError || !query.data) return <ErrorPanel title="Manager workload unavailable" />;

  const ownerName = decodeURIComponent(owner);
  const workload = query.data.workload.find((item) => item.owner === ownerName);

  return (
    <Guard allow={["engineering_manager", "org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Manager workflow"
          title={ownerName}
          description="Defects currently owned by this accountable owner."
          actions={
            <Link href="/manager" className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold shadow-soft">
              Back to manager overview
            </Link>
          }
        />

        {!workload ? (
          <EmptyState
            title="Owner not found"
            description="This owner is not present in the current workload snapshot."
          />
        ) : (
          <>
            <Panel className="p-6">
              <SectionHeader title="Summary" />
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-muted">Open defects</div>
                  <div className="mt-2 text-2xl font-semibold">{workload.defects}</div>
                </div>
                <div className="rounded-2xl border border-line bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-muted">Weighted load</div>
                  <div className="mt-2 text-2xl font-semibold">{workload.weight}</div>
                </div>
              </div>
            </Panel>

            <Panel className="p-6">
              <SectionHeader title="Owned issues" />
              <div className="mt-4 space-y-3">
                {workload.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-slate-50 p-4 transition hover:border-primary/40 hover:bg-white"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold">{item.key} · {item.title}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusChip kind="reporter">{item.reporterStatus}</StatusChip>
                        <StatusChip kind="internal">{item.internalStatus}</StatusChip>
                      </div>
                    </div>
                    <RiskBadge kind={item.riskKind}>{item.riskLabel}</RiskBadge>
                  </Link>
                ))}
              </div>
            </Panel>
          </>
        )}
      </div>
    </Guard>
  );
}
