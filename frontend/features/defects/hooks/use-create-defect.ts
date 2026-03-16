"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signalTrackClient } from "@/lib/api/client";

export function useCreateDefect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signalTrackClient.createDefect,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["defects"] });
    }
  });
}
