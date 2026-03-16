import type { CurrentUser } from "@/lib/auth/types";

export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  eventType: string;
  entityType: string;
  entityId: string;
  summary: string;
  href?: string | null;
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
  evidence: Array<{ name: string; meta: string; objectKey: string }>;
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
  workload: Array<{
    owner: string;
    defects: number;
    weight: number;
    items: Array<{
      id: string;
      key: string;
      title: string;
      reporterStatus: string;
      internalStatus: string;
      riskKind: "high" | "medium" | "low";
      riskLabel: string;
      href: string;
    }>;
  }>;
  stalled: Array<{ id: string; key: string; title: string; owner: string; lastMove: string; href: string; badgeKind: "high" | "medium" | "low"; badgeLabel: string }>;
  overdue: Array<{ key: string; title: string; owner: string; due: string }>;
};

export type ReportListItem = {
  id: string;
  submittedAt: string;
  reporter: string;
  impactLevel: "annoying" | "slows_me_down" | "blocking";
  rawDescription: string;
  linkedDefectId: string | null;
  linkedDefectKey: string | null;
  linkedDefectHref: string | null;
  attachmentCount: number;
  href: string;
};

export type ReportDetail = {
  id: string;
  submittedAt: string;
  reporter: string;
  reporterType: string;
  impactLevel: "annoying" | "slows_me_down" | "blocking";
  rawDescription: string;
  expectedBehavior: string | null;
  observedBehavior: string | null;
  workaroundAvailable: boolean | null;
  contactAllowed: boolean;
  linkedDefectId: string | null;
  linkedDefectKey: string | null;
  defectHref: string | null;
  environmentSnapshot: Record<string, unknown>;
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
export type EvidenceDownloadUrlResponse = { url: string };
export type CreateDefectInput = {
  externalSummary: string;
  internalSummary: string;
  severity: number;
  urgency: number;
  evidenceGap: number;
};
export type CreatedDefect = { id: string; key: string };
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
