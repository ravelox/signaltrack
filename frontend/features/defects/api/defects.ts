import { signalTrackClient } from "@/lib/api/client";

export const defectsApi = {
  list: () => signalTrackClient.listDefects(),
  detail: (id: string) => signalTrackClient.getDefectDetail(id),
  changeOwner: signalTrackClient.changeOwner,
  createNextAction: signalTrackClient.createNextAction,
  updateStatuses: signalTrackClient.updateStatuses
};
