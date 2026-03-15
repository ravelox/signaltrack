import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { SignedUrlProvider } from "@signaltrack/application";
import { env } from "../env.js";

export class S3SignedUrlProvider implements SignedUrlProvider {
  private readonly client = new S3Client({
    region: env.AWS_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_FORCE_PATH_STYLE
  });

  public async createDownloadUrl(objectKey: string, ttlSeconds: number): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: objectKey
      }),
      { expiresIn: ttlSeconds }
    );
  }

  public async createUploadUrl(objectKey: string, ttlSeconds: number, contentType?: string): Promise<string> {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: objectKey,
        ContentType: contentType
      }),
      { expiresIn: ttlSeconds }
    );
  }
}
