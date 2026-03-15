import type { OwnershipRecord, OwnershipStore } from "@signaltrack/application";
import { PostgresExecutor } from "../PostgresExecutor.js";

export class PostgresOwnershipStore implements OwnershipStore {
  public constructor(private readonly executor: PostgresExecutor = new PostgresExecutor()) {}
  private get db() { return this.executor.db; }

  public async endActiveAccountableOwner(orgId: string, defectId: string): Promise<void> {
    await this.db`
      UPDATE ownership_records
      SET active_to = now()
      WHERE org_id = ${orgId}::uuid
        AND defect_id = ${defectId}::uuid
        AND ownership_type = 'accountable_owner'
        AND active_to IS NULL`;
  }

  public async createAccountableOwner(orgId: string, defectId: string, userId: string): Promise<OwnershipRecord> {
    const [row] = await this.db<OwnershipRecord[]>`
      INSERT INTO ownership_records (org_id, defect_id, ownership_type, user_id)
      VALUES (${orgId}::uuid, ${defectId}::uuid, 'accountable_owner', ${userId}::uuid)
      RETURNING id, defect_id AS "defectId", user_id AS "userId", ownership_type AS "ownershipType", active_from AS "activeFrom", active_to AS "activeTo"`;
    return row!;
  }
}
