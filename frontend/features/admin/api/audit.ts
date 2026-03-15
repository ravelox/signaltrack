import { signalTrackClient } from "@/lib/api/client";

export const auditApi = {
  list: () => signalTrackClient.listAuditEvents()
};
