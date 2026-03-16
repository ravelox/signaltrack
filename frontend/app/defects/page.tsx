"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Select } from "@/components/ui/select";
import { TableSkeleton } from "@/components/states/skeletons";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorPanel } from "@/components/states/error-panel";
import { useDefects } from "@/features/defects/hooks/use-defects";
import { DefectTable } from "@/features/defects/components/defect-table";
import { Guard } from "@/components/auth/guard";
import { Can } from "@/components/auth/can";

export default function DefectsPage() {
  const defectsQuery = useDefects();
  const [search, setSearch] = useState("");
  const [owner, setOwner] = useState("");
  const [risk, setRisk] = useState("");
  const [internalStatus, setInternalStatus] = useState("");
  const deferredSearch = useDeferredValue(search);

  const defects = (defectsQuery.data ?? []).filter((defect) => {
    const matchesSearch = deferredSearch
      ? defect.key.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        defect.externalSummary.toLowerCase().includes(deferredSearch.toLowerCase())
      : true;
    const matchesOwner = owner ? defect.owner === owner : true;
    const matchesRisk = risk ? defect.riskKind === risk : true;
    const matchesInternalStatus = internalStatus ? defect.internalStatus === internalStatus : true;
    return matchesSearch && matchesOwner && matchesRisk && matchesInternalStatus;
  });

  const ownerOptions = Array.from(new Set((defectsQuery.data ?? []).map((defect) => defect.owner))).filter((value) => value && value !== "—");
  const internalStatusOptions = Array.from(new Set((defectsQuery.data ?? []).map((defect) => defect.internalStatus)));

  return (
    <Guard allow={["engineer", "engineering_manager", "org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Engineer workflow"
          title="Defects"
          description="Role-aware queue with responsive desktop/mobile presentation."
          actions={
            <Can action="createDefect">
              <Link href="/defects/new">
                <Button>New defect</Button>
              </Link>
            </Can>
          }
        />

        <div className="flex flex-wrap gap-3">
          <Input placeholder="Search defects" className="min-w-56 flex-1" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={internalStatus} onChange={(event) => setInternalStatus(event.target.value)} className="w-auto min-w-44">
            <option value="">All internal statuses</option>
            {internalStatusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
          <Select value={owner} onChange={(event) => setOwner(event.target.value)} className="w-auto min-w-40">
            <option value="">All owners</option>
            {ownerOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
          <Select value={risk} onChange={(event) => setRisk(event.target.value)} className="w-auto min-w-36">
            <option value="">All risk levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>

        <Panel className="overflow-hidden p-0">
          {defectsQuery.isLoading ? (
            <TableSkeleton />
          ) : defectsQuery.isError ? (
            <div className="p-4"><ErrorPanel onRetry={() => defectsQuery.refetch()} /></div>
          ) : defects.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="No matching defects"
                description="Adjust the active filters or create a new defect."
              />
            </div>
          ) : (
            <DefectTable defects={defects} />
          )}
        </Panel>
      </div>
    </Guard>
  );
}
