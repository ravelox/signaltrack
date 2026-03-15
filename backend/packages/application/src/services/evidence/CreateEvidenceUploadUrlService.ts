import type { SignedUrlProvider } from "../../ports/index.js";

export class CreateEvidenceUploadUrlService {
  public constructor(private readonly signedUrlProvider: SignedUrlProvider) {}

  public async execute(input: { objectKey: string; ttlSeconds: number; contentType?: string }) {
    return {
      url: await this.signedUrlProvider.createUploadUrl(input.objectKey, input.ttlSeconds, input.contentType)
    };
  }
}
