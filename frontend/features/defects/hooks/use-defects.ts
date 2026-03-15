"use client";

import { useQuery } from "@tanstack/react-query";
import { defectsApi } from "@/features/defects/api/defects";

export function useDefects() {
  return useQuery({
    queryKey: ["defects", "list"],
    queryFn: defectsApi.list
  });
}
