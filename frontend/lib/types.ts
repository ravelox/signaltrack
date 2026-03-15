import type { CurrentUser } from "@/lib/auth/types";

export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  eventType: string;
  entityType: string;
  entityId: string;
  summary: string;
};

export type DefectListRow = {
  id: string;
  key: string;
  externalSummary: string;
  reporterStatus: string;
  internalStatus: string;
  owner: string;
  nextAction: string;
  riskKind: "high" | "medium" | "low";
  riskLabel: string;
};

export type DefectDetail = {
  id: string;
  key: string;
  externalSummary: string;
  reporterStatus: string;
  internalStatus: string;
  externalSummaryText: string;
  internalSummaryText: string;
  owner: string;
  nextAction: string;
  severity: number;
  urgency: number;
  evidenceGap: number;
  stalled: boolean;
  evidence: Array<{ name: string; meta: string }>;
  timeline: Array<{ title: string; subtitle: string }>;
  linkedReport: { title: string; meta: string };
  ownerOptions: Array<{ id: string; label: string }>;
};

export type ManagerOverview = {
  metrics: {
    activeDefects: number;
    overdueNextActions: number;
    stalledDefects: number;
    unowned: number;
  };
  workload: Array<{ owner: string; defects: number; weight: number }>;
  stalled: Array<{ key: string; title: string; owner: string; lastMove: string; badgeKind: "high" | "medium" | "low"; badgeLabel: string }>;
  overdue: Array<{ key: string; title: string; owner: string; due: string }>;
};

export type CreateReportInput = {
  rawDescription: string;
  expectedBehavior?: string;
  observedBehavior?: string;
  impactLevel: "annoying" | "slows_me_down" | "blocking";
  workaroundAvailable?: boolean;
  contactAllowed: boolean;
  environmentSnapshot: Record<string, unknown>;
};

export type CreatedReport = { id: string };
export type EvidenceUploadUrlResponse = { url: string };
export type ChangeOwnerInput = { defectId: string; userId: string; userLabel?: string };
export type CreateNextActionInput = {
  defectId: string;
  ownerUserId: string;
  ownerLabel?: string;
  summary: string;
  dueAt: string;
};
export type UpdateStatusesInput = { defectId: string; reporterStatus: string; internalStatus: string };
export type AuthSession = { user: CurrentUser | null };
export type LoginInput = { email: string; password: string };
