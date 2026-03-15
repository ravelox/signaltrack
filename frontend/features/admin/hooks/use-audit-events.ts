"use client";

import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/features/admin/api/audit";

export function useAuditEvents() {
  return useQuery({
    queryKey: ["audit-events"],
    queryFn: auditApi.list
  });
}
