import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "postgres";
import { CreateReportService } from "@signaltrack/application";
import { createIsolatedTestDb, destroyTestDb, seedOrganization, seedUser } from "../src/index.js";
import { PostgresAuditStore } from "../src/db/repositories/PostgresAuditStore.js";
import { PostgresExecutor } from "../src/db/PostgresExecutor.js";
import { PostgresReportStore } from "../src/db/repositories/PostgresReportStore.js";
import { PostgresUnitOfWork } from "../src/db/PostgresUnitOfWork.js";

describe("CreateReportService integration", () => {
  let db: Sql<Record<string, unknown>>;
  beforeAll(async () => { db = await createIsolatedTestDb(); });
  afterAll(async () => { await destroyTestDb(db); });

  it("creates a report row and audit event", async () => {
    const org = await seedOrganization(db, "report-org");
    const reporter = await seedUser(db, org.id, "reporter@example.com", "Reporter");
    const executor = new PostgresExecutor(db as any);

    const service = new CreateReportService(
      new PostgresReportStore(executor),
      new PostgresAuditStore(executor),
      new PostgresUnitOfWork()
    );

    const result = await service.execute({
      orgId: org.id,
      reporterUserId: reporter.id,
      reporterType: "internal_user",
      rawDescription: "It fails sometimes",
      impactLevel: "blocking",
      contactAllowed: true,
      environmentSnapshot: { browser: "chrome" }
    });

    expect(result.id).toBeDefined();

    const reports = await db<{ count: number }[]>`SELECT count(*)::int AS count FROM reports WHERE id = ${result.id}::uuid`;
    expect(reports[0].count).toBe(1);

    const audits = await db<{ count: number }[]>`SELECT count(*)::int AS count FROM audit_events WHERE entity_id = ${result.id}::uuid AND event_type = 'report.submitted'`;
    expect(audits[0].count).toBe(1);
  });
});
