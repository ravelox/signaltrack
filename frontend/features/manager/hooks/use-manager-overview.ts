"use client";

import { useQuery } from "@tanstack/react-query";
import { managerApi } from "@/features/manager/api/manager";

export function useManagerOverview() {
  return useQuery({
    queryKey: ["manager-overview"],
    queryFn: managerApi.overview
  });
}
