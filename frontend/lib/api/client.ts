import { frontendEnv } from "@/lib/env";
import { apiFetch } from "@/lib/api/http";
import { mockApi } from "@/lib/api/mock-adapter";
import type {
  AuditEvent,
  AuthSession,
  LoginInput,
  ChangeOwnerInput,
  CreateNextActionInput,
  CreateReportInput,
  CreatedReport,
  DefectDetail,
  DefectListRow,
  EvidenceUploadUrlResponse,
  ManagerOverview,
  UpdateStatusesInput
} from "@/lib/types";

export const signalTrackClient = {
  async getAuthSession(): Promise<AuthSession> {
    if (frontendEnv.useMockAuth) return mockApi.getAuthSession();
    return apiFetch<AuthSession>("/v1/auth/session");
  },
  async login(input: LoginInput): Promise<AuthSession> {
    if (frontendEnv.useMockAuth) return mockApi.getAuthSession();
    return apiFetch<AuthSession>("/v1/auth/login", { method: "POST", body: JSON.stringify(input) });
  },
  async logout(): Promise<void> {
    if (frontendEnv.useMockAuth) return;
    await apiFetch<void>("/v1/auth/logout", { method: "POST" });
  },
  async listDefects(): Promise<DefectListRow[]> {
    if (frontendEnv.useMocks) return mockApi.listDefects();
    const data = await apiFetch<{ items: DefectListRow[] }>("/v1/defects");
    return data.items;
  },
  async getDefectDetail(id: string): Promise<DefectDetail> {
    if (frontendEnv.useMocks) return mockApi.getDefectDetail(id);
    return apiFetch<DefectDetail>(`/v1/defects/${encodeURIComponent(id)}`);
  },
  async createReport(input: CreateReportInput): Promise<CreatedReport> {
    if (frontendEnv.useMocks) return mockApi.createReport(input);
    return apiFetch<CreatedReport>("/v1/reports", { method: "POST", body: JSON.stringify(input) });
  },
  async createEvidenceUploadUrl(objectKey: string, contentType?: string): Promise<EvidenceUploadUrlResponse> {
    if (frontendEnv.useMocks) return mockApi.createEvidenceUploadUrl(objectKey);
    return apiFetch<EvidenceUploadUrlResponse>("/v1/evidence/upload-url", {
      method: "POST",
      body: JSON.stringify({ objectKey, contentType })
    });
  },
  async getManagerOverview(): Promise<ManagerOverview> {
    if (frontendEnv.useMocks) return mockApi.getManagerOverview();
    return apiFetch<ManagerOverview>("/v1/manager/dashboard");
  },
  async listAuditEvents(): Promise<AuditEvent[]> {
    if (frontendEnv.useMocks) return mockApi.listAuditEvents();
    const data = await apiFetch<{ items: AuditEvent[] }>("/v1/admin/audit");
    return data.items;
  },
  async changeOwner(input: ChangeOwnerInput): Promise<{ ok: true }> {
    if (frontendEnv.useMocks) return mockApi.changeOwner(input);
    return apiFetch<{ ok: true }>(`/v1/defects/${encodeURIComponent(input.defectId)}/accountable-owner`, {
      method: "POST",
      body: JSON.stringify({ userId: input.userId })
    });
  },
  async createNextAction(input: CreateNextActionInput): Promise<{ ok: true }> {
    if (frontendEnv.useMocks) return mockApi.createNextAction(input);
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
    if (frontendEnv.useMocks) return mockApi.updateStatuses(input);
    return apiFetch<{ ok: true }>(`/v1/defects/${encodeURIComponent(input.defectId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        reporterStatus: input.reporterStatus,
        internalStatus: input.internalStatus
      })
    });
  }
};
