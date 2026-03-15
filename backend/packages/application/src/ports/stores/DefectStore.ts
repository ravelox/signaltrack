import type { DefectRecord } from "../../types/index.js";
import type { InternalStatus, ReporterStatus } from "@signaltrack/domain";

export interface CreateDefectInput {
  orgId: string;
  externalSummary: string;
  internalSummary: string;
  reporterStatus: ReporterStatus;
  internalStatus: InternalStatus;
  severity: number;
  urgency: number;
  evidenceGap: number;
  createdByUserId: string;
}

export interface UpdateDefectInput {
  externalSummary?: string;
  internalSummary?: string;
  reporterStatus?: ReporterStatus;
  internalStatus?: InternalStatus;
  severity?: number;
  urgency?: number;
  evidenceGap?: number;
}

export interface DefectStore {
  getById(orgId: string, defectId: string): Promise<DefectRecord | null>;
  create(input: CreateDefectInput): Promise<DefectRecord>;
  update(orgId: string, defectId: string, patch: UpdateDefectInput): Promise<DefectRecord>;
  setCurrentAccountableOwner(orgId: string, defectId: string, userId: string): Promise<void>;
  setCurrentNextAction(orgId: string, defectId: string, nextActionId: string | null): Promise<void>;
  touchMeaningfulMovement(orgId: string, defectId: string): Promise<void>;
}
