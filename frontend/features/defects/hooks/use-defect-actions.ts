"use client";

import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { defectsApi } from "@/features/defects/api/defects";
import type { ChangeOwnerInput, CreateNextActionInput, DefectDetail, UpdateStatusesInput } from "@/lib/types";

type DetailSnapshot = Array<[readonly unknown[], DefectDetail | undefined]>;

function snapshotDetailQueries(queryClient: QueryClient): DetailSnapshot {
  return queryClient.getQueriesData<DefectDetail>({ queryKey: ["defects", "detail"] });
}

function restoreDetailQueries(queryClient: QueryClient, snapshot: DetailSnapshot) {
  for (const [queryKey, data] of snapshot) {
    queryClient.setQueryData(queryKey, data);
  }
}

function updateMatchingDefectDetail(
  queryClient: QueryClient,
  defectId: string,
  updater: (detail: DefectDetail) => DefectDetail
) {
  for (const [queryKey, data] of queryClient.getQueriesData<DefectDetail>({ queryKey: ["defects", "detail"] })) {
    if (!data || data.id !== defectId) continue;
    queryClient.setQueryData(queryKey, updater(data));
  }
}

export function useChangeOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: defectsApi.changeOwner,
    onMutate: async (input: ChangeOwnerInput) => {
      await queryClient.cancelQueries({ queryKey: ["defects"] });
      const previous = snapshotDetailQueries(queryClient);

      updateMatchingDefectDetail(queryClient, input.defectId, (detail) => ({
        ...detail,
        owner: input.userLabel ?? detail.owner
      }));

      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) restoreDetailQueries(queryClient, context.previous);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["defects"] });
    }
  });
}

export function useCreateNextAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: defectsApi.createNextAction,
    onMutate: async (input: CreateNextActionInput) => {
      await queryClient.cancelQueries({ queryKey: ["defects"] });
      const previous = snapshotDetailQueries(queryClient);

      updateMatchingDefectDetail(queryClient, input.defectId, (detail) => ({
        ...detail,
        owner: input.ownerLabel ?? detail.owner,
        nextAction: input.summary
      }));

      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) restoreDetailQueries(queryClient, context.previous);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["defects"] });
    }
  });
}

export function useUpdateStatuses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: defectsApi.updateStatuses,
    onMutate: async (input: UpdateStatusesInput) => {
      await queryClient.cancelQueries({ queryKey: ["defects"] });
      const previous = snapshotDetailQueries(queryClient);

      updateMatchingDefectDetail(queryClient, input.defectId, (detail) => ({
        ...detail,
        reporterStatus: input.reporterStatus,
        internalStatus: input.internalStatus
      }));

      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) restoreDetailQueries(queryClient, context.previous);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["defects"] });
    }
  });
}
