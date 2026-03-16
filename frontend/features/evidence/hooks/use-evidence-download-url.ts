"use client";

import { useMutation } from "@tanstack/react-query";
import { evidenceApi } from "@/features/evidence/api/evidence";

export function useEvidenceDownloadUrl() {
  return useMutation({
    mutationFn: (objectKey: string) => evidenceApi.downloadUrl(objectKey)
  });
}
