import type { AuditStore, DefectStore, UnitOfWork } from "../../ports/index.js";

export class CreateDefectService {
  public constructor(
    private readonly defectStore: DefectStore,
    private readonly auditStore: AuditStore,
    private readonly unitOfWork: UnitOfWork
  ) {}

  public async execute(input: {
    orgId: string;
    actorUserId: string;
    externalSummary: string;
    internalSummary: string;
    severity: number;
    urgency: number;
    evidenceGap: number;
  }) {
    return this.unitOfWork.run(async () => {
      const defect = await this.defectStore.create({
        orgId: input.orgId,
        createdByUserId: input.actorUserId,
        externalSummary: input.externalSummary,
        internalSummary: input.internalSummary,
        reporterStatus: "received",
        internalStatus: "new",
        severity: input.severity,
        urgency: input.urgency,
        evidenceGap: input.evidenceGap
      });

      await this.auditStore.append({
        orgId: input.orgId,
        actorUserId: input.actorUserId,
        eventType: "defect.created",
        entityType: "defect",
        entityId: defect.id
      });

      return defect;
    });
  }
}
