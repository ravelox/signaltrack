import type { AuditStore, ReportStore, UnitOfWork } from "../../ports/index.js";

export class CreateReportService {
  public constructor(
    private readonly reportStore: ReportStore,
    private readonly auditStore: AuditStore,
    private readonly unitOfWork: UnitOfWork
  ) {}

  public async execute(input: {
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
  }) {
    return this.unitOfWork.run(async () => {
      const report = await this.reportStore.create(input);
      await this.auditStore.append({
        orgId: input.orgId,
        actorUserId: input.reporterUserId,
        eventType: "report.submitted",
        entityType: "report",
        entityId: report.id
      });
      return report;
    });
  }
}
