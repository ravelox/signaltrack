import type { AuditStore, DefectStore, EvidenceStore, UnitOfWork } from "../../ports/index.js";
import { DomainError } from "@signaltrack/shared";

export class CreateEvidenceService {
  public constructor(
    private readonly defectStore: DefectStore,
    private readonly evidenceStore: EvidenceStore,
    private readonly auditStore: AuditStore,
    private readonly unitOfWork: UnitOfWork
  ) {}

  public async execute(input: { orgId: string; actorUserId: string | null; defectId: string; objectStorageKey: string; summary?: string }) {
    return this.unitOfWork.run(async () => {
      const defect = await this.defectStore.getById(input.orgId, input.defectId);
      if (!defect) throw new DomainError("DEFECT_NOT_FOUND", "Defect not found.");

      const evidence = await this.evidenceStore.create({
        orgId: input.orgId,
        defectId: input.defectId,
        createdByUserId: input.actorUserId,
        objectStorageKey: input.objectStorageKey,
        summary: input.summary
      });

      await this.defectStore.touchMeaningfulMovement(input.orgId, input.defectId);
      await this.auditStore.append({
        orgId: input.orgId,
        actorUserId: input.actorUserId,
        eventType: "evidence.added",
        entityType: "evidence",
        entityId: evidence.id
      });

      return evidence;
    });
  }
}
