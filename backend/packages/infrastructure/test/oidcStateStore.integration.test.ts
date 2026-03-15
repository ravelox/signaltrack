import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "postgres";
import { createIsolatedTestDb, destroyTestDb } from "../src/index.js";
import { PostgresExecutor } from "../src/db/PostgresExecutor.js";
import { PostgresOidcStateStore } from "../src/db/repositories/PostgresOidcStateStore.js";

describe("OIDC state store", () => {
  let db: Sql<Record<string, unknown>>;
  beforeAll(async () => { db = await createIsolatedTestDb(); });
  afterAll(async () => { await destroyTestDb(db); });

  it("persists and consumes state exactly once", async () => {
    const store = new PostgresOidcStateStore(new PostgresExecutor(db as any));
    await store.create({
      orgSlug: "acme",
      state: "state-123",
      nonce: "nonce-123",
      expiresAt: new Date(Date.now() + 60_000).toISOString()
    });

    const first = await store.consume("state-123");
    expect(first?.orgSlug).toBe("acme");
    expect(first?.nonce).toBe("nonce-123");

    const second = await store.consume("state-123");
    expect(second).toBeNull();
  });
});
