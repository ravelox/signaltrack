import type { OidcStateStore, PersistOidcStateInput } from "@signaltrack/application";
import { PostgresExecutor } from "../PostgresExecutor.js";

export class PostgresOidcStateStore implements OidcStateStore {
  public constructor(private readonly executor: PostgresExecutor = new PostgresExecutor()) {}
  private get db() { return this.executor.db; }

  public async create(input: PersistOidcStateInput): Promise<void> {
    await this.db`
      INSERT INTO oidc_state_tokens (org_slug, state, nonce, expires_at)
      VALUES (${input.orgSlug}, ${input.state}, ${input.nonce}, ${input.expiresAt}::timestamptz)`;
  }

  public async consume(state: string): Promise<{ orgSlug: string; nonce: string } | null> {
    const [row] = await this.db<{ orgSlug: string; nonce: string }[]>`
      UPDATE oidc_state_tokens
      SET consumed_at = now()
      WHERE state = ${state}
        AND consumed_at IS NULL
        AND expires_at > now()
      RETURNING org_slug AS "orgSlug", nonce`;
    return row ?? null;
  }
}
