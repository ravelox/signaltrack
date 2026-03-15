import type { OidcStateStore } from "../../ports/index.js";
import { DomainError } from "@signaltrack/shared";

export class CompleteOidcLoginService {
  public constructor(private readonly stateStore: OidcStateStore) {}

  public async validateState(input: { state: string; expectedOrgSlug?: string; nonceFromProvider?: string }) {
    const record = await this.stateStore.consume(input.state);
    if (!record) throw new DomainError("OIDC_STATE_INVALID", "OIDC state is invalid or expired.");
    if (input.expectedOrgSlug && record.orgSlug !== input.expectedOrgSlug) {
      throw new DomainError("OIDC_ORG_MISMATCH", "OIDC org mismatch.");
    }
    if (input.nonceFromProvider && record.nonce !== input.nonceFromProvider) {
      throw new DomainError("OIDC_NONCE_MISMATCH", "OIDC nonce mismatch.");
    }
    return record;
  }
}
