"use client";

import { useMutation } from "@tanstack/react-query";
import { evidenceApi } from "@/features/evidence/api/evidence";

export function useEvidenceUploadUrl() {
  return useMutation({
    mutationFn: ({ objectKey, contentType }: { objectKey: string; contentType?: string }) =>
      evidenceApi.uploadUrl(objectKey, contentType)
  });
}
