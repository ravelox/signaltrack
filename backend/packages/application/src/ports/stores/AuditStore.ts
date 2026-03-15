export interface AuditStore {
  append(input: {
    orgId: string;
    actorUserId: string | null;
    eventType: string;
    entityType: string;
    entityId: string | null;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
}
