export interface SignedUrlProvider {
  createDownloadUrl(objectKey: string, ttlSeconds: number): Promise<string>;
  createUploadUrl(objectKey: string, ttlSeconds: number, contentType?: string): Promise<string>;
}
