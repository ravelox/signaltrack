import type { ReportRecord } from "../../types/index.js";

export interface CreateReportInput {
  orgId: string;
  reporterUserId: string | null;
  reporterType: "external_user" | "internal_user" | "engineer";
  rawDescription: string;
  expectedBehavior?: string;
  observedBehavior?: string;
  impactLevel: "annoying" | "slows_me_down" | "blocking";
  workaroundAvailable?: boolean;
  contactAllowed: boolean;
  environmentSnapshot: Record<string, unknown>;
}

export interface ReportStore {
  create(input: CreateReportInput): Promise<ReportRecord>;
}
