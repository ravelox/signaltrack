import { signalTrackClient } from "@/lib/api/client";

export const managerApi = {
  overview: () => signalTrackClient.getManagerOverview()
};
