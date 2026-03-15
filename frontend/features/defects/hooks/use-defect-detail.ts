"use client";

import { useQuery } from "@tanstack/react-query";
import { defectsApi } from "@/features/defects/api/defects";

export function useDefectDetail(id: string) {
  return useQuery({
    queryKey: ["defects", "detail", id],
    queryFn: () => defectsApi.detail(id),
    enabled: Boolean(id)
  });
}
