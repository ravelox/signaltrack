import type { EvidenceRecord } from "../../types/index.js";

export interface CreateEvidenceInput {
  orgId: string;
  defectId: string;
  createdByUserId: string | null;
  objectStorageKey: string;
  summary?: string;
}

export interface EvidenceStore {
  create(input: CreateEvidenceInput): Promise<EvidenceRecord>;
}
