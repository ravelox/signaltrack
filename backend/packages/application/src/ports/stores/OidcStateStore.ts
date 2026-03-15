export interface PersistOidcStateInput {
  orgSlug: string;
  state: string;
  nonce: string;
  expiresAt: string;
}

export interface OidcStateStore {
  create(input: PersistOidcStateInput): Promise<void>;
  consume(state: string): Promise<{ orgSlug: string; nonce: string } | null>;
}
