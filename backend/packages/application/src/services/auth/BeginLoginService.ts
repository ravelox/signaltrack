import type { OidcStateStore } from "../../ports/index.js";

export interface OidcAuthorizationUrlBuilder {
  buildAuthorizationUrl(input: { orgSlug: string; state: string; nonce: string }): Promise<string>;
}

export class BeginLoginService {
  public constructor(
    private readonly urlBuilder: OidcAuthorizationUrlBuilder,
    private readonly stateStore: OidcStateStore
  ) {}

  public async execute(input: { orgSlug: string; state: string; nonce: string; expiresAt: string }) {
    await this.stateStore.create({
      orgSlug: input.orgSlug,
      state: input.state,
      nonce: input.nonce,
      expiresAt: input.expiresAt
    });

    return this.urlBuilder.buildAuthorizationUrl({
      orgSlug: input.orgSlug,
      state: input.state,
      nonce: input.nonce
    });
  }
}
