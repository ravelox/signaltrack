import type { AuditStore } from "@signaltrack/application";
import { PostgresExecutor } from "../PostgresExecutor.js";

export class PostgresAuditStore implements AuditStore {
  public constructor(private readonly executor: PostgresExecutor = new PostgresExecutor()) {}
  private get db() { return this.executor.db; }

  public async append(input: { orgId: string; actorUserId: string | null; eventType: string; entityType: string; entityId: string | null; metadata?: Record<string, unknown>; }): Promise<void> {
    await this.db`
      INSERT INTO audit_events (org_id, actor_user_id, event_type, entity_type, entity_id, metadata)
      VALUES (${input.orgId}::uuid, ${input.actorUserId}::uuid, ${input.eventType}, ${input.entityType}, ${input.entityId}::uuid, ${JSON.stringify(input.metadata ?? {})}::jsonb)`;
  }
}
