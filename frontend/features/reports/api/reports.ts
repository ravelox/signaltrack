import { signalTrackClient } from "@/lib/api/client";
import type { CreateReportInput } from "@/lib/types";

export const reportsApi = {
  detail: (id: string) => signalTrackClient.getReportDetail(id),
  create: (input: CreateReportInput) => signalTrackClient.createReport(input),
  list: () => signalTrackClient.listReports()
};
