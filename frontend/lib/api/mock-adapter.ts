import { auditEvents, defects, defectDetailsById, managerData } from "@/lib/mock-data";
import { mockCurrentUser } from "@/lib/auth/mock-user";
import type {
  AuditEvent,
  AuthSession,
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

export const mockApi = {
  async getAuthSession(): Promise<AuthSession> {
    return { user: mockCurrentUser };
  },
  async listDefects(): Promise<DefectListRow[]> {
    return defects;
  },
  async getDefectDetail(id: string): Promise<DefectDetail> {
    const item = defectDetailsById[id];
    if (!item) throw new Error("Defect not found");
    return item;
  },
  async createReport(_input: CreateReportInput): Promise<CreatedReport> {
    return { id: "RPT-001" };
  },
  async createEvidenceUploadUrl(objectKey: string): Promise<EvidenceUploadUrlResponse> {
    return { url: `https://example-upload.local/${encodeURIComponent(objectKey)}` };
  },
  async getManagerOverview(): Promise<ManagerOverview> {
    return managerData;
  },
  async listAuditEvents(): Promise<AuditEvent[]> {
    return auditEvents;
  },
  async changeOwner(_input: ChangeOwnerInput): Promise<{ ok: true }> {
    return { ok: true };
  },
  async createNextAction(_input: CreateNextActionInput): Promise<{ ok: true }> {
    return { ok: true };
  },
  async updateStatuses(_input: UpdateStatusesInput): Promise<{ ok: true }> {
    return { ok: true };
  }
};
