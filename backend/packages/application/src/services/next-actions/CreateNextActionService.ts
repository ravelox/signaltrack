import type { AuditStore, DefectStore, NextActionStore, UnitOfWork } from "../../ports/index.js";
import { DomainError } from "@signaltrack/shared";

export class CreateNextActionService {
  public constructor(
    private readonly defectStore: DefectStore,
    private readonly nextActionStore: NextActionStore,
    private readonly auditStore: AuditStore,
    private readonly unitOfWork: UnitOfWork
  ) {}

  public async execute(input: {
    orgId: string;
    actorUserId: string;
    defectId: string;
    ownerUserId: string;
    summary: string;
    dueAt: string;
  }) {
    return this.unitOfWork.run(async () => {
      const defect = await this.defectStore.getById(input.orgId, input.defectId);
      if (!defect) throw new DomainError("DEFECT_NOT_FOUND", "Defect not found.");

      const openCount = await this.nextActionStore.countOpenForDefect(input.orgId, input.defectId);
      if (openCount > 0) {
        throw new DomainError("ONE_OPEN_NEXT_ACTION_RULE", "Only one open next action is allowed per defect in v1.");
      }

      const nextAction = await this.nextActionStore.createCurrent({
        orgId: input.orgId,
        defectId: input.defectId,
        ownerUserId: input.ownerUserId,
        summary: input.summary,
        dueAt: input.dueAt,
        createdByUserId: input.actorUserId
      });

      await this.defectStore.setCurrentNextAction(input.orgId, input.defectId, nextAction.id);
      await this.auditStore.append({
        orgId: input.orgId,
        actorUserId: input.actorUserId,
        eventType: "next_action.created",
        entityType: "next_action",
        entityId: nextAction.id
      });

      return nextAction;
    });
  }
}
