import type { Sql } from "postgres";
import { createSql } from "./client.js";

export async function runMigrations(db: Sql<Record<string, unknown>>): Promise<void> {
  await db.unsafe(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS organizations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      email text NOT NULL,
      display_name text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS role_assignments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS defects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      defect_key text NOT NULL,
      external_summary text NOT NULL,
      internal_summary text NOT NULL,
      reporter_status text NOT NULL,
      internal_status text NOT NULL,
      severity int NOT NULL,
      urgency int NOT NULL,
      evidence_gap int NOT NULL,
      created_by_user_id uuid NOT NULL REFERENCES users(id),
      current_accountable_owner_id uuid NULL REFERENCES users(id),
      current_next_action_id uuid NULL,
      last_meaningful_activity_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS ownership_records (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      defect_id uuid NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES users(id),
      ownership_type text NOT NULL,
      active_from timestamptz NOT NULL DEFAULT now(),
      active_to timestamptz NULL
    );

    CREATE TABLE IF NOT EXISTS next_actions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      defect_id uuid NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
      owner_user_id uuid NOT NULL REFERENCES users(id),
      summary text NOT NULL,
      status text NOT NULL DEFAULT 'open',
      due_at timestamptz NOT NULL,
      completion_note text NULL,
      completed_at timestamptz NULL,
      created_by_user_id uuid NULL REFERENCES users(id),
      created_at timestamptz NOT NULL DEFAULT now()
    );

    ALTER TABLE defects
    ADD CONSTRAINT IF NOT EXISTS defects_current_next_action_id_fkey
    FOREIGN KEY (current_next_action_id) REFERENCES next_actions(id);

    CREATE TABLE IF NOT EXISTS reports (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      defect_id uuid NULL REFERENCES defects(id) ON DELETE SET NULL,
      reporter_user_id uuid NULL REFERENCES users(id),
      reporter_type text NOT NULL,
      raw_description text NOT NULL,
      expected_behavior text NULL,
      observed_behavior text NULL,
      impact_level text NOT NULL,
      workaround_available boolean NULL,
      contact_allowed boolean NOT NULL,
      environment_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS evidence_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      defect_id uuid NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
      created_by_user_id uuid NOT NULL REFERENCES users(id),
      object_storage_key text NOT NULL,
      summary text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS oidc_state_tokens (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_slug text NOT NULL,
      state text NOT NULL UNIQUE,
      nonce text NOT NULL,
      expires_at timestamptz NOT NULL,
      consumed_at timestamptz NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      actor_user_id uuid NULL REFERENCES users(id),
      event_type text NOT NULL,
      entity_type text NOT NULL,
      entity_id uuid NULL,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

const main = async () => {
  const db = createSql();
  try {
    await runMigrations(db);
  } finally {
    await db.end();
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
