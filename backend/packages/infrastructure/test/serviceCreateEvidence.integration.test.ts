import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "postgres";
import { CreateEvidenceService } from "@signaltrack/application";
import { createIsolatedTestDb, destroyTestDb, seedDefect, seedOrganization, seedUser } from "../src/index.js";
import { PostgresAuditStore } from "../src/db/repositories/PostgresAuditStore.js";
import { PostgresDefectStore } from "../src/db/repositories/PostgresDefectStore.js";
import { PostgresEvidenceStore } from "../src/db/repositories/PostgresEvidenceStore.js";
import { PostgresExecutor } from "../src/db/PostgresExecutor.js";
import { PostgresUnitOfWork } from "../src/db/PostgresUnitOfWork.js";

describe("CreateEvidenceService integration", () => {
  let db: Sql<Record<string, unknown>>;
  beforeAll(async () => { db = await createIsolatedTestDb(); });
  afterAll(async () => { await destroyTestDb(db); });

  it("creates evidence and touches defect activity", async () => {
    const org = await seedOrganization(db, "evidence-org");
    const user = await seedUser(db, org.id, "eng@example.com", "Engineer");
    const defect = await seedDefect(db, org.id, user.id, "DEF-EVD-1");
    const before = await db<{ ts: string }[]>`SELECT last_meaningful_activity_at AS ts FROM defects WHERE id = ${defect.id}::uuid`;

    const executor = new PostgresExecutor(db as any);
    const service = new CreateEvidenceService(
      new PostgresDefectStore(executor),
      new PostgresEvidenceStore(executor),
      new PostgresAuditStore(executor),
      new PostgresUnitOfWork()
    );

    const result = await service.execute({
      orgId: org.id,
      actorUserId: user.id,
      defectId: defect.id,
      objectStorageKey: "evidence/1.log",
      summary: "log attached"
    });

    expect(result.id).toBeDefined();

    const evidenceRows = await db<{ count: number }[]>`SELECT count(*)::int AS count FROM evidence_items WHERE id = ${result.id}::uuid`;
    expect(evidenceRows[0].count).toBe(1);

    const after = await db<{ ts: string }[]>`SELECT last_meaningful_activity_at AS ts FROM defects WHERE id = ${defect.id}::uuid`;
    expect(new Date(after[0].ts).getTime()).toBeGreaterThanOrEqual(new Date(before[0].ts).getTime());
  });
});
