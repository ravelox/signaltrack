import type { Sql } from "postgres";
import { createTestSql } from "../client.js";
import { runMigrations } from "../migrate.js";

export const createIsolatedTestDb = async (): Promise<Sql<Record<string, unknown>>> => {
  const db = createTestSql();
  await runMigrations(db);
  await db.unsafe(
    "TRUNCATE TABLE audit_events, oidc_state_tokens, evidence_items, reports, next_actions, ownership_records, defects, role_assignments, users, organizations RESTART IDENTITY CASCADE"
  );
  return db;
};

export const destroyTestDb = async (db: Sql<Record<string, unknown>>): Promise<void> => {
  await db.end();
};
