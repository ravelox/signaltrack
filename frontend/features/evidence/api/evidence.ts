import { signalTrackClient } from "@/lib/api/client";

export const evidenceApi = {
  uploadUrl: (objectKey: string, contentType?: string) =>
    signalTrackClient.createEvidenceUploadUrl(objectKey, contentType)
};
