"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Guard } from "@/components/auth/guard";
import { Panel } from "@/components/ui/panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorPanel } from "@/components/states/error-panel";
import { TableSkeleton } from "@/components/states/skeletons";
import { useAuditEvents } from "@/features/admin/hooks/use-audit-events";

export default function AdminAuditPage() {
  const query = useAuditEvents();

  return (
    <Guard allow={["org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Governance"
          title="Admin Audit"
          description="Governance-oriented event review for admin users."
        />

        <div className="flex flex-wrap gap-3">
          <Input placeholder="Search by actor, event, entity" className="min-w-56 flex-1" />
          <Button variant="secondary">Event type</Button>
          <Button variant="secondary">Entity type</Button>
          <Button variant="secondary">Time range</Button>
        </div>

        <Panel className="overflow-hidden p-0">
          {query.isLoading ? (
            <TableSkeleton />
          ) : query.isError ? (
            <div className="p-4"><ErrorPanel title="Failed to load audit events" onRetry={() => query.refetch()} /></div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[180px_160px_180px_120px_120px_1fr] gap-3 border-b border-line px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                  <div>At</div>
                  <div>Actor</div>
                  <div>Event</div>
                  <div>Entity</div>
                  <div>ID</div>
                  <div>Summary</div>
                </div>
                {(query.data ?? []).map((event) => (
                  <div key={event.id} className="grid grid-cols-[180px_160px_180px_120px_120px_1fr] gap-3 border-b border-line px-4 py-4 text-sm">
                    <div>{event.at}</div>
                    <div>{event.actor}</div>
                    <div>{event.eventType}</div>
                    <div>{event.entityType}</div>
                    <div>{event.entityId}</div>
                    <div>{event.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>
      </div>
    </Guard>
  );
}
