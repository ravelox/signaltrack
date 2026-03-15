import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "postgres";
import { CreateDefectService } from "@signaltrack/application";
import { createIsolatedTestDb, destroyTestDb, seedOrganization, seedUser } from "../src/index.js";
import { PostgresAuditStore } from "../src/db/repositories/PostgresAuditStore.js";
import { PostgresDefectStore } from "../src/db/repositories/PostgresDefectStore.js";
import { PostgresExecutor } from "../src/db/PostgresExecutor.js";
import { PostgresUnitOfWork } from "../src/db/PostgresUnitOfWork.js";

describe("transaction propagation", () => {
  let db: Sql<Record<string, unknown>>;
  beforeAll(async () => { db = await createIsolatedTestDb(); });
  afterAll(async () => { await destroyTestDb(db); });

  it("repositories operate inside a unit-of-work transaction context", async () => {
    const org = await seedOrganization(db, "tx-org");
    const user = await seedUser(db, org.id, "tx@example.com", "Tx User");

    const executor = new PostgresExecutor(db as any);
    const service = new CreateDefectService(
      new PostgresDefectStore(executor),
      new PostgresAuditStore(executor),
      new PostgresUnitOfWork()
    );

    const defect = await service.execute({
      orgId: org.id,
      actorUserId: user.id,
      externalSummary: "Tx external",
      internalSummary: "Tx internal",
      severity: 1,
      urgency: 1,
      evidenceGap: 1
    });

    const rows = await db<{ count: number }[]>`SELECT count(*)::int AS count FROM defects WHERE id = ${defect.id}::uuid`;
    expect(rows[0].count).toBe(1);

    const statusRows = await db<{ reporter_status: string; internal_status: string }[]>`
      SELECT reporter_status, internal_status FROM defects WHERE id = ${defect.id}::uuid`;
    expect(statusRows[0].reporter_status).toBe("received");
    expect(statusRows[0].internal_status).toBe("new");
  });
});
