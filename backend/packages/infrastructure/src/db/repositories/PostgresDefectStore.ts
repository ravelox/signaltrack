import type { CreateDefectInput, DefectRecord, DefectStore, UpdateDefectInput } from "@signaltrack/application";
import { PostgresExecutor } from "../PostgresExecutor.js";

export class PostgresDefectStore implements DefectStore {
  public constructor(private readonly executor: PostgresExecutor = new PostgresExecutor()) {}
  private get db() { return this.executor.db; }

  public async getById(orgId: string, defectId: string): Promise<DefectRecord | null> {
    const [row] = await this.db<DefectRecord[]>`
      SELECT id, org_id AS "orgId", defect_key AS "defectKey", external_summary AS "externalSummary", internal_summary AS "internalSummary",
             reporter_status AS "reporterStatus", internal_status AS "internalStatus", severity, urgency, evidence_gap AS "evidenceGap",
             current_accountable_owner_id AS "currentAccountableOwnerId", current_next_action_id AS "currentNextActionId"
      FROM defects
      WHERE org_id = ${orgId}::uuid AND id = ${defectId}::uuid
      LIMIT 1`;
    return row ?? null;
  }

  public async create(input: CreateDefectInput): Promise<DefectRecord> {
    const [seq] = await this.db<{ n: number }[]>`SELECT count(*)::int + 1 AS n FROM defects WHERE org_id = ${input.orgId}::uuid`;
    const defectKey = `DEF-${seq?.n ?? 1}`;
    const [row] = await this.db<DefectRecord[]>`
      INSERT INTO defects (org_id, defect_key, external_summary, internal_summary, reporter_status, internal_status, severity, urgency, evidence_gap, created_by_user_id)
      VALUES (${input.orgId}::uuid, ${defectKey}, ${input.externalSummary}, ${input.internalSummary}, ${input.reporterStatus}, ${input.internalStatus}, ${input.severity}, ${input.urgency}, ${input.evidenceGap}, ${input.createdByUserId}::uuid)
      RETURNING id, org_id AS "orgId", defect_key AS "defectKey", external_summary AS "externalSummary", internal_summary AS "internalSummary",
                reporter_status AS "reporterStatus", internal_status AS "internalStatus", severity, urgency, evidence_gap AS "evidenceGap",
                current_accountable_owner_id AS "currentAccountableOwnerId", current_next_action_id AS "currentNextActionId"`;
    return row!;
  }

  public async update(orgId: string, defectId: string, patch: UpdateDefectInput): Promise<DefectRecord> {
    const [row] = await this.db<DefectRecord[]>`
      UPDATE defects
      SET external_summary = COALESCE(${patch.externalSummary ?? null}, external_summary),
          internal_summary = COALESCE(${patch.internalSummary ?? null}, internal_summary),
          reporter_status = COALESCE(${patch.reporterStatus ?? null}, reporter_status),
          internal_status = COALESCE(${patch.internalStatus ?? null}, internal_status),
          severity = COALESCE(${patch.severity ?? null}, severity),
          urgency = COALESCE(${patch.urgency ?? null}, urgency),
          evidence_gap = COALESCE(${patch.evidenceGap ?? null}, evidence_gap),
          updated_at = now()
      WHERE org_id = ${orgId}::uuid AND id = ${defectId}::uuid
      RETURNING id, org_id AS "orgId", defect_key AS "defectKey", external_summary AS "externalSummary", internal_summary AS "internalSummary",
                reporter_status AS "reporterStatus", internal_status AS "internalStatus", severity, urgency, evidence_gap AS "evidenceGap",
                current_accountable_owner_id AS "currentAccountableOwnerId", current_next_action_id AS "currentNextActionId"`;
    return row!;
  }

  public async setCurrentAccountableOwner(orgId: string, defectId: string, userId: string): Promise<void> {
    await this.db`UPDATE defects SET current_accountable_owner_id = ${userId}::uuid WHERE org_id = ${orgId}::uuid AND id = ${defectId}::uuid`;
  }

  public async setCurrentNextAction(orgId: string, defectId: string, nextActionId: string | null): Promise<void> {
    await this.db`UPDATE defects SET current_next_action_id = ${nextActionId}::uuid WHERE org_id = ${orgId}::uuid AND id = ${defectId}::uuid`;
  }

  public async touchMeaningfulMovement(orgId: string, defectId: string): Promise<void> {
    await this.db`UPDATE defects SET last_meaningful_activity_at = now() WHERE org_id = ${orgId}::uuid AND id = ${defectId}::uuid`;
  }
}
