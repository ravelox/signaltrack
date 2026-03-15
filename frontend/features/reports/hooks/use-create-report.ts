"use client";

import { useMutation } from "@tanstack/react-query";
import { reportsApi } from "@/features/reports/api/reports";

export function useCreateReport() {
  return useMutation({
    mutationFn: reportsApi.create
  });
}
