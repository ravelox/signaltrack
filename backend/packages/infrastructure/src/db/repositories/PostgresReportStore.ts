import type { CreateReportInput, ReportRecord, ReportStore } from "@signaltrack/application";
import { PostgresExecutor } from "../PostgresExecutor.js";

export class PostgresReportStore implements ReportStore {
  public constructor(private readonly executor: PostgresExecutor = new PostgresExecutor()) {}
  private get db() { return this.executor.db; }

  public async create(input: CreateReportInput): Promise<ReportRecord> {
    const [row] = await this.db<ReportRecord[]>`
      INSERT INTO reports (org_id, reporter_user_id, reporter_type, raw_description, expected_behavior, observed_behavior, impact_level, workaround_available, contact_allowed, environment_snapshot)
      VALUES (${input.orgId}::uuid, ${input.reporterUserId}::uuid, ${input.reporterType}, ${input.rawDescription}, ${input.expectedBehavior ?? null}, ${input.observedBehavior ?? null}, ${input.impactLevel}, ${input.workaroundAvailable ?? null}, ${input.contactAllowed}, ${input.environmentSnapshot}::jsonb)
      RETURNING id, defect_id AS "defectId", reporter_type AS "reporterType", raw_description AS "rawDescription", impact_level AS "impactLevel", created_at AS "createdAt"`;
    return row!;
  }
}
