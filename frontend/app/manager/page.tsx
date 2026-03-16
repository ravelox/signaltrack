"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/cards/metric-card";
import { Panel } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section-header";
import { RiskBadge } from "@/components/status/risk-badge";
import { StatusChip } from "@/components/status/status-chip";
import { DetailSkeleton } from "@/components/states/skeletons";
import { ErrorPanel } from "@/components/states/error-panel";
import { useManagerOverview } from "@/features/manager/hooks/use-manager-overview";
import { Guard } from "@/components/auth/guard";

export default function ManagerPage() {
  const query = useManagerOverview();
  const [expandedOwner, setExpandedOwner] = useState<string | null>(null);

  if (query.isLoading) return <DetailSkeleton />;
  if (query.isError || !query.data) return <ErrorPanel title="Manager overview unavailable" />;

  const managerData = query.data;

  return (
    <Guard allow={["engineering_manager", "org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Manager workflow"
          title="Manager Overview"
          description="Visible only to management/admin roles."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Active defects" value={String(managerData.metrics.activeDefects)} />
          <MetricCard label="Overdue next actions" value={String(managerData.metrics.overdueNextActions)} />
          <MetricCard label="Stalled defects" value={String(managerData.metrics.stalledDefects)} />
          <MetricCard label="Unowned" value={String(managerData.metrics.unowned)} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel className="p-6">
            <SectionHeader title="Workload by Accountable Owner" />
            <div className="mt-4 space-y-3">
              {managerData.workload.map((item) => (
                <div key={item.owner} className="rounded-2xl border border-line bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setExpandedOwner((current) => current === item.owner ? null : item.owner)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-white"
                  >
                    <span className="font-semibold">{item.owner}</span>
                    <span className="text-sm text-muted">{item.defects} defects · weight {item.weight}</span>
                  </button>
                  {expandedOwner === item.owner ? (
                    <div className="border-t border-line bg-white/80 p-3">
                      <div className="space-y-2">
                        {item.items.map((owned) => (
                          <Link
                            key={owned.id}
                            href={owned.href}
                            className="flex items-center justify-between gap-4 rounded-xl border border-line px-3 py-3 transition hover:border-primary/40 hover:bg-slate-50"
                          >
                            <div className="min-w-0">
                              <div className="font-semibold">{owned.key} · {owned.title}</div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <StatusChip kind="reporter">{owned.reporterStatus}</StatusChip>
                                <StatusChip kind="internal">{owned.internalStatus}</StatusChip>
                              </div>
                            </div>
                            <RiskBadge kind={owned.riskKind}>{owned.riskLabel}</RiskBadge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <SectionHeader title="Stalled Defects" />
            <div className="mt-4 space-y-3">
              {managerData.stalled.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-slate-50 p-4 transition hover:border-primary/40 hover:bg-white"
                >
                  <div>
                    <div className="font-semibold">{item.key} · {item.title}</div>
                    <div className="mt-1 text-sm text-muted">Owner: {item.owner} · Last movement {item.lastMove}</div>
                  </div>
                  <RiskBadge kind={item.badgeKind}>{item.badgeLabel}</RiskBadge>
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Guard>
  );
}
