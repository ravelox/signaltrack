import { frontendEnv } from "@/lib/env";
import { apiFetch } from "@/lib/api/http";
import type {
  AuditEvent,
  AuthSession,
  LoginInput,
  ChangeOwnerInput,
  CreateDefectInput,
  CreatedDefect,
  CreateNextActionInput,
  CreateReportInput,
  CreatedReport,
  DefectDetail,
  DefectListRow,
  EvidenceDownloadUrlResponse,
  EvidenceUploadUrlResponse,
  ManagerOverview,
  ReportDetail,
  ReportListItem,
  UpdateStatusesInput
} from "@/lib/types";

export const signalTrackClient = {
  async getAuthSession(): Promise<AuthSession> {
    return apiFetch<AuthSession>("/v1/auth/session");
  },
  async login(input: LoginInput): Promise<AuthSession> {
    return apiFetch<AuthSession>("/v1/auth/login", { method: "POST", body: JSON.stringify(input) });
  },
  async logout(): Promise<void> {
    await apiFetch<void>("/v1/auth/logout", { method: "POST" });
  },
  async listDefects(): Promise<DefectListRow[]> {
    const data = await apiFetch<{ items: DefectListRow[] }>("/v1/defects");
    return data.items;
  },
  async getDefectDetail(id: string): Promise<DefectDetail> {
    return apiFetch<DefectDetail>(`/v1/defects/${encodeURIComponent(id)}`);
  },
  async createDefect(input: CreateDefectInput): Promise<CreatedDefect> {
    return apiFetch<CreatedDefect>("/v1/defects", { method: "POST", body: JSON.stringify(input) });
  },
  async createReport(input: CreateReportInput): Promise<CreatedReport> {
    return apiFetch<CreatedReport>("/v1/reports", { method: "POST", body: JSON.stringify(input) });
  },
  async listReports(): Promise<ReportListItem[]> {
    const data = await apiFetch<{ items: ReportListItem[] }>("/v1/reports");
    return data.items;
  },
  async getReportDetail(id: string): Promise<ReportDetail> {
    return apiFetch<ReportDetail>(`/v1/reports/${encodeURIComponent(id)}`);
  },
  async createEvidenceUploadUrl(objectKey: string, contentType?: string): Promise<EvidenceUploadUrlResponse> {
    return apiFetch<EvidenceUploadUrlResponse>("/v1/evidence/upload-url", {
      method: "POST",
      body: JSON.stringify({ objectKey, contentType })
    });
  },
  async createEvidenceDownloadUrl(objectKey: string): Promise<EvidenceDownloadUrlResponse> {
    return apiFetch<EvidenceDownloadUrlResponse>(`/v1/evidence/download-url?objectKey=${encodeURIComponent(objectKey)}`);
  },
  async getManagerOverview(): Promise<ManagerOverview> {
    return apiFetch<ManagerOverview>("/v1/manager/dashboard");
  },
  async listAuditEvents(): Promise<AuditEvent[]> {
    const data = await apiFetch<{ items: AuditEvent[] }>("/v1/admin/audit");
    return data.items;
  },
  async changeOwner(input: ChangeOwnerInput): Promise<{ ok: true }> {
    return apiFetch<{ ok: true }>(`/v1/defects/${encodeURIComponent(input.defectId)}/accountable-owner`, {
      method: "POST",
      body: JSON.stringify({ userId: input.userId })
    });
  },
  async createNextAction(input: CreateNextActionInput): Promise<{ ok: true }> {
    return apiFetch<{ ok: true }>(`/v1/defects/${encodeURIComponent(input.defectId)}/next-actions`, {
      method: "POST",
      body: JSON.stringify({
        ownerUserId: input.ownerUserId,
        summary: input.summary,
        dueAt: input.dueAt
      })
    });
  },
  async updateStatuses(input: UpdateStatusesInput): Promise<{ ok: true }> {
    return apiFetch<{ ok: true }>(`/v1/defects/${encodeURIComponent(input.defectId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        reporterStatus: input.reporterStatus,
        internalStatus: input.internalStatus
      })
    });
  }
};
