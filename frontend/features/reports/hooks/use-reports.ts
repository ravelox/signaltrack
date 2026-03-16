"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/features/reports/api/reports";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: reportsApi.list
  });
}
