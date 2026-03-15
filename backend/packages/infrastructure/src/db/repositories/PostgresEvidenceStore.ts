import type { CreateEvidenceInput, EvidenceRecord, EvidenceStore } from "@signaltrack/application";
import { PostgresExecutor } from "../PostgresExecutor.js";

export class PostgresEvidenceStore implements EvidenceStore {
  public constructor(private readonly executor: PostgresExecutor = new PostgresExecutor()) {}
  private get db() { return this.executor.db; }

  public async create(input: CreateEvidenceInput): Promise<EvidenceRecord> {
    const [row] = await this.db<EvidenceRecord[]>`
      INSERT INTO evidence_items (org_id, defect_id, created_by_user_id, object_storage_key, summary)
      VALUES (${input.orgId}::uuid, ${input.defectId}::uuid, ${input.createdByUserId}::uuid, ${input.objectStorageKey}, ${input.summary ?? ""})
      RETURNING id, defect_id AS "defectId", object_storage_key AS "objectStorageKey", summary, created_at AS "createdAt"`;
    return row!;
  }
}
