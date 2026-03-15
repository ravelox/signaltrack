import type { Sql } from "postgres";

export const seedOrganization = async (db: Sql<Record<string, unknown>>, slug = "acme") => {
  const [row] = await db<{ id: string }[]>`
    INSERT INTO organizations (name, slug)
    VALUES ('Acme', ${slug})
    RETURNING id`;
  return row!;
};

export const seedUser = async (db: Sql<Record<string, unknown>>, orgId: string, email: string, displayName: string) => {
  const [row] = await db<{ id: string }[]>`
    INSERT INTO users (org_id, email, display_name)
    VALUES (${orgId}::uuid, ${email}, ${displayName})
    RETURNING id`;
  return row!;
};

export const seedDefect = async (db: Sql<Record<string, unknown>>, orgId: string, createdByUserId: string, defectKey = "DEF-1") => {
  const [row] = await db<{ id: string }[]>`
    INSERT INTO defects (org_id, defect_key, external_summary, internal_summary, reporter_status, internal_status, severity, urgency, evidence_gap, created_by_user_id)
    VALUES (${orgId}::uuid, ${defectKey}, 'External summary', 'Internal summary', 'received', 'new', 2, 2, 2, ${createdByUserId}::uuid)
    RETURNING id`;
  return row!;
};

export const seedOpenNextAction = async (db: Sql<Record<string, unknown>>, orgId: string, defectId: string, ownerUserId: string) => {
  const [row] = await db<{ id: string }[]>`
    INSERT INTO next_actions (org_id, defect_id, owner_user_id, summary, due_at)
    VALUES (${orgId}::uuid, ${defectId}::uuid, ${ownerUserId}::uuid, 'Do thing', now() + interval '1 day')
    RETURNING id`;
  return row!;
};
