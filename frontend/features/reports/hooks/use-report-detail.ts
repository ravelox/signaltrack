"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/features/reports/api/reports";

export function useReportDetail(id: string) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportsApi.detail(id)
  });
}
