"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { Guard } from "@/components/auth/guard";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorPanel } from "@/components/states/error-panel";
import { TableSkeleton } from "@/components/states/skeletons";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useReports } from "@/features/reports/hooks/use-reports";

const impactTone: Record<string, string> = {
  blocking: "bg-red-100 text-red-800",
  slows_me_down: "bg-amber-100 text-amber-800",
  annoying: "bg-slate-200 text-slate-700"
};

export default function ReportsPage() {
  const query = useReports();
  const [search, setSearch] = useState("");
  const [impactLevel, setImpactLevel] = useState("");
  const [linked, setLinked] = useState("");
  const deferredSearch = useDeferredValue(search);

  const reports = (query.data ?? []).filter((report) => {
    const matchesSearch = deferredSearch
      ? [report.rawDescription, report.reporter, report.linkedDefectKey ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(deferredSearch.toLowerCase())
      : true;
    const matchesImpact = impactLevel ? report.impactLevel === impactLevel : true;
    const matchesLinked = linked
      ? linked === "linked"
        ? Boolean(report.linkedDefectId)
        : !report.linkedDefectId
      : true;
    return matchesSearch && matchesImpact && matchesLinked;
  });

  return (
    <Guard allow={["engineer", "engineering_manager", "org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Planning queue"
          title="Reported Issues"
          description="Review newly submitted issues before or alongside defect triage."
        />

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by description, reporter, or linked defect"
            className="min-w-56 flex-1"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={impactLevel} onChange={(event) => setImpactLevel(event.target.value)} className="w-auto min-w-40">
            <option value="">All impact levels</option>
            <option value="blocking">Blocking</option>
            <option value="slows_me_down">Slows me down</option>
            <option value="annoying">Annoying</option>
          </Select>
          <Select value={linked} onChange={(event) => setLinked(event.target.value)} className="w-auto min-w-36">
            <option value="">All linkage</option>
            <option value="unlinked">Unlinked</option>
            <option value="linked">Linked</option>
          </Select>
        </div>

        <Panel className="overflow-hidden p-0">
          {query.isLoading ? (
            <TableSkeleton />
          ) : query.isError ? (
            <div className="p-4">
              <ErrorPanel title="Reported issues unavailable" onRetry={() => query.refetch()} />
            </div>
          ) : reports.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="No reported issues match the current filters"
                description="Submitted issues will appear here even before they are linked to a defect."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[980px]">
                <div className="grid grid-cols-[160px_150px_130px_1.8fr_150px_120px] gap-3 border-b border-line px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                  <div>Opened</div>
                  <div>Reporter</div>
                  <div>Impact</div>
                  <div>Description</div>
                  <div>Linked defect</div>
                  <div>Attachments</div>
                </div>
                {reports.map((report) => (
                  <Link
                    key={report.id}
                    href={report.href}
                    className="grid grid-cols-[160px_150px_130px_1.8fr_150px_120px] gap-3 border-b border-line px-4 py-4 text-sm transition hover:bg-slate-50"
                  >
                    <div>{report.submittedAt}</div>
                    <div>{report.reporter}</div>
                    <div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${impactTone[report.impactLevel]}`}>
                        {report.impactLevel.replaceAll("_", " ")}
                      </span>
                    </div>
                    <div className="truncate">{report.rawDescription}</div>
                    <div>{report.linkedDefectKey ?? "Not linked"}</div>
                    <div>{report.attachmentCount}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Panel>
      </div>
    </Guard>
  );
}
