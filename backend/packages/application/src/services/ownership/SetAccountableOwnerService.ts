import type { AuditStore, DefectStore, OwnershipStore, UnitOfWork } from "../../ports/index.js";
import { DomainError } from "@signaltrack/shared";

export class SetAccountableOwnerService {
  public constructor(
    private readonly defectStore: DefectStore,
    private readonly ownershipStore: OwnershipStore,
    private readonly auditStore: AuditStore,
    private readonly unitOfWork: UnitOfWork
  ) {}

  public async execute(input: { orgId: string; actorUserId: string; defectId: string; userId: string }) {
    return this.unitOfWork.run(async () => {
      const defect = await this.defectStore.getById(input.orgId, input.defectId);
      if (!defect) throw new DomainError("DEFECT_NOT_FOUND", "Defect not found.");

      await this.ownershipStore.endActiveAccountableOwner(input.orgId, input.defectId);
      const ownership = await this.ownershipStore.createAccountableOwner(input.orgId, input.defectId, input.userId);
      await this.defectStore.setCurrentAccountableOwner(input.orgId, input.defectId, input.userId);
      await this.defectStore.touchMeaningfulMovement(input.orgId, input.defectId);

      await this.auditStore.append({
        orgId: input.orgId,
        actorUserId: input.actorUserId,
        eventType: "accountable_owner.changed",
        entityType: "defect",
        entityId: input.defectId
      });

      return ownership;
    });
  }
}
