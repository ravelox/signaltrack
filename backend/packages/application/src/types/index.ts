import type { InternalStatus, ReporterStatus } from "@signaltrack/domain";

export interface SessionUser {
  id: string;
  orgId: string;
  email: string;
  displayName: string;
  roles: Array<"reporter" | "engineer" | "engineering_manager" | "org_admin">;
}

export interface DefectRecord {
  id: string;
  orgId: string;
  defectKey: string;
  externalSummary: string;
  internalSummary: string;
  reporterStatus: ReporterStatus;
  internalStatus: InternalStatus;
  severity: number;
  urgency: number;
  evidenceGap: number;
  currentAccountableOwnerId: string | null;
  currentNextActionId: string | null;
}

export interface OwnershipRecord {
  id: string;
  defectId: string;
  userId: string;
  ownershipType: "accountable_owner" | "active_contributor";
  activeFrom: string;
  activeTo: string | null;
}

export interface NextActionRecord {
  id: string;
  defectId: string;
  ownerUserId: string;
  summary: string;
  status: "open" | "done" | "blocked" | "canceled";
  dueAt: string;
  completionNote: string | null;
  completedAt: string | null;
}

export interface ReportRecord {
  id: string;
  defectId: string | null;
  reporterType: "external_user" | "internal_user" | "engineer";
  rawDescription: string;
  impactLevel: "annoying" | "slows_me_down" | "blocking";
  createdAt: string;
}

export interface EvidenceRecord {
  id: string;
  defectId: string;
  objectStorageKey: string;
  summary: string;
  createdAt: string;
}
