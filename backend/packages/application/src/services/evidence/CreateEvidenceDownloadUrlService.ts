import type { SignedUrlProvider } from "../../ports/index.js";

export class CreateEvidenceDownloadUrlService {
  public constructor(private readonly signedUrlProvider: SignedUrlProvider) {}

  public async execute(input: { objectKey: string; ttlSeconds: number }) {
    return {
      url: await this.signedUrlProvider.createDownloadUrl(input.objectKey, input.ttlSeconds)
    };
  }
}
