import { randomUUID } from "node:crypto";
import { createSql, type Db } from "../db/client.js";

type SessionUserRow = {
  user_id: string;
  org_id: string;
  email: string;
  display_name: string;
  role: string | null;
};

type UserRow = {
  id: string;
  org_id: string;
  email: string;
  display_name: string;
  password_hash: string | null;
  role: string | null;
};

type UserWithRoleRow = {
  id: string;
  org_id: string;
  email: string;
  display_name: string;
  password_hash: string | null;
  role: string | null;
};

export type AuthenticatedUser = {
  id: string;
  orgId: string;
  email: string;
  displayName: string;
  roles: Array<"reporter" | "engineer" | "engineering_manager" | "org_admin">;
};

const toSessionUser = (rows: SessionUserRow[]): AuthenticatedUser | null => {
  const [first] = rows;
  if (!first) return null;

  const roles = Array.from(new Set(rows.flatMap((row) => (row.role ? [row.role] : [])))) as AuthenticatedUser["roles"];

  return {
    id: first.user_id,
    orgId: first.org_id,
    email: first.email,
    displayName: first.display_name,
    roles
  };
};

const toUserWithRoles = (rows: UserWithRoleRow[]): AuthenticatedUser | null => {
  const [first] = rows;
  if (!first) return null;

  const roles = Array.from(new Set(rows.flatMap((row) => (row.role ? [row.role] : [])))) as AuthenticatedUser["roles"];

  return {
    id: first.id,
    orgId: first.org_id,
    email: first.email,
    displayName: first.display_name,
    roles
  };
};

export class LocalAuthStore {
  public constructor(private readonly db: Db = createSql()) {}

  public async getUserByEmail(email: string): Promise<(AuthenticatedUser & { passwordHash: string | null }) | null> {
    const rows = await this.db<UserWithRoleRow[]>`
      WITH selected_user AS (
        SELECT
          users.id,
          users.org_id,
          users.email,
          users.display_name,
          users.password_hash
        FROM users
        WHERE lower(users.email) = lower(${email})
        ORDER BY users.created_at ASC
        LIMIT 1
      )
      SELECT
        selected_user.id,
        selected_user.org_id,
        selected_user.email,
        selected_user.display_name,
        selected_user.password_hash,
        role_assignments.role
      FROM selected_user
      LEFT JOIN role_assignments
        ON role_assignments.user_id = selected_user.id
       AND role_assignments.org_id = selected_user.org_id
    `;

    const user = toUserWithRoles(rows);
    if (!user) return null;

    return {
      ...user,
      passwordHash: rows[0]!.password_hash
    };
  }

  public async createSession(userId: string, expiresAt: Date): Promise<string> {
    const sessionId = randomUUID();
    await this.db`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (${sessionId}::uuid, ${userId}::uuid, ${expiresAt.toISOString()})
    `;
    return sessionId;
  }

  public async getSessionUser(sessionId: string): Promise<AuthenticatedUser | null> {
    const rows = await this.db<SessionUserRow[]>`
      SELECT
        users.id AS user_id,
        users.org_id,
        users.email,
        users.display_name,
        role_assignments.role
      FROM sessions
      JOIN users
        ON users.id = sessions.user_id
      LEFT JOIN role_assignments
        ON role_assignments.user_id = users.id
       AND role_assignments.org_id = users.org_id
      WHERE sessions.id = ${sessionId}::uuid
        AND sessions.expires_at > now()
      ORDER BY sessions.created_at DESC
    `;

    return toSessionUser(rows);
  }

  public async deleteSession(sessionId: string): Promise<void> {
    await this.db`
      DELETE FROM sessions
      WHERE id = ${sessionId}::uuid
    `;
  }
}
