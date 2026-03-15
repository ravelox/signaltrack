import { signalTrackClient } from "@/lib/api/client";
import type { CreateReportInput } from "@/lib/types";

export const reportsApi = {
  create: (input: CreateReportInput) => signalTrackClient.createReport(input)
};
