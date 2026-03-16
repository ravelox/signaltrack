import { signalTrackClient } from "@/lib/api/client";

export const evidenceApi = {
  downloadUrl: (objectKey: string) =>
    signalTrackClient.createEvidenceDownloadUrl(objectKey),
  uploadUrl: (objectKey: string, contentType?: string) =>
    signalTrackClient.createEvidenceUploadUrl(objectKey, contentType)
};
