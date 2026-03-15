import type { CreateNextActionInput, NextActionRecord, NextActionStore } from "@signaltrack/application";
import { PostgresExecutor } from "../PostgresExecutor.js";

export class PostgresNextActionStore implements NextActionStore {
  public constructor(private readonly executor: PostgresExecutor = new PostgresExecutor()) {}
  private get db() { return this.executor.db; }

  public async countOpenForDefect(orgId: string, defectId: string): Promise<number> {
    const [row] = await this.db<{ count: number }[]>`
      SELECT count(*)::int AS count
      FROM next_actions
      WHERE org_id = ${orgId}::uuid AND defect_id = ${defectId}::uuid AND status = 'open'`;
    return row?.count ?? 0;
  }

  public async createCurrent(input: CreateNextActionInput): Promise<NextActionRecord> {
    const [row] = await this.db<NextActionRecord[]>`
      INSERT INTO next_actions (org_id, defect_id, owner_user_id, summary, due_at, created_by_user_id)
      VALUES (${input.orgId}::uuid, ${input.defectId}::uuid, ${input.ownerUserId}::uuid, ${input.summary}, ${input.dueAt}::timestamptz, ${input.createdByUserId}::uuid)
      RETURNING id, defect_id AS "defectId", owner_user_id AS "ownerUserId", summary, status, due_at AS "dueAt", completion_note AS "completionNote", completed_at AS "completedAt"`;
    return row!;
  }
}
