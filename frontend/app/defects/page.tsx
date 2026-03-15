"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { TableSkeleton } from "@/components/states/skeletons";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorPanel } from "@/components/states/error-panel";
import { useDefects } from "@/features/defects/hooks/use-defects";
import { DefectTable } from "@/features/defects/components/defect-table";
import { Guard } from "@/components/auth/guard";
import { Can } from "@/components/auth/can";

export default function DefectsPage() {
  const defectsQuery = useDefects();

  return (
    <Guard allow={["engineer", "engineering_manager", "org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Engineer workflow"
          title="Defects"
          description="Role-aware queue with responsive desktop/mobile presentation."
          actions={
            <Can action="createDefect">
              <Button>New defect</Button>
            </Can>
          }
        />

        <div className="flex flex-wrap gap-3">
          <Input placeholder="Search defects" className="min-w-56 flex-1" />
          {["Internal status", "Owner", "Risk", "More filters"].map((item) => (
            <Button key={item} variant="secondary">{item}</Button>
          ))}
        </div>

        <Panel className="overflow-hidden p-0">
          {defectsQuery.isLoading ? (
            <TableSkeleton />
          ) : defectsQuery.isError ? (
            <div className="p-4"><ErrorPanel onRetry={() => defectsQuery.refetch()} /></div>
          ) : (defectsQuery.data ?? []).length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="No defects yet"
                description="Once defects exist, they will appear here with owner, status, next action, and risk visibility."
              />
            </div>
          ) : (
            <DefectTable defects={defectsQuery.data ?? []} />
          )}
        </Panel>
      </div>
    </Guard>
  );
}
