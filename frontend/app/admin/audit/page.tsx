"use client";

import { useDeferredValue, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Guard } from "@/components/auth/guard";
import { Panel } from "@/components/ui/panel";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ErrorPanel } from "@/components/states/error-panel";
import { TableSkeleton } from "@/components/states/skeletons";
import { useAuditEvents } from "@/features/admin/hooks/use-audit-events";

export default function AdminAuditPage() {
  const query = useAuditEvents();
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [entityType, setEntityType] = useState("");
  const deferredSearch = useDeferredValue(search);

  const events = (query.data ?? []).filter((event) => {
    const matchesSearch = deferredSearch
      ? [event.actor, event.eventType, event.entityType, event.entityId, event.summary]
          .join(" ")
          .toLowerCase()
          .includes(deferredSearch.toLowerCase())
      : true;
    const matchesEventType = eventType ? event.eventType === eventType : true;
    const matchesEntityType = entityType ? event.entityType === entityType : true;
    return matchesSearch && matchesEventType && matchesEntityType;
  });

  const eventTypes = Array.from(new Set((query.data ?? []).map((event) => event.eventType)));
  const entityTypes = Array.from(new Set((query.data ?? []).map((event) => event.entityType)));

  return (
    <Guard allow={["org_admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Governance"
          title="Admin Audit"
          description="Governance-oriented event review for admin users."
        />

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by actor, event, entity"
            className="min-w-56 flex-1"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={eventType} onChange={(event) => setEventType(event.target.value)} className="w-auto min-w-44">
            <option value="">All event types</option>
            {eventTypes.map((value) => <option key={value} value={value}>{value}</option>)}
          </Select>
          <Select value={entityType} onChange={(event) => setEntityType(event.target.value)} className="w-auto min-w-40">
            <option value="">All entity types</option>
            {entityTypes.map((value) => <option key={value} value={value}>{value}</option>)}
          </Select>
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
                {events.map((event) => (
                  <div key={event.id} className="grid grid-cols-[180px_160px_180px_120px_120px_1fr] gap-3 border-b border-line px-4 py-4 text-sm">
                    <div>{event.at}</div>
                    <div>{event.actor}</div>
                    <div>{event.eventType}</div>
                    <div>{event.entityType}</div>
                    <div>{event.entityId}</div>
                    <div>{event.summary}</div>
                  </div>
                ))}
                {events.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-muted">No audit events match the current filters.</div>
                ) : null}
              </div>
            </div>
          )}
        </Panel>
      </div>
    </Guard>
  );
}
