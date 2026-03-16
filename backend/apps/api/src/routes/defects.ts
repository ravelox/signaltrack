import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { internalStatuses, reporterStatuses } from "@signaltrack/domain";
import {
  CreateDefectService,
  CreateNextActionService,
  SetAccountableOwnerService
} from "@signaltrack/application";
import {
  PostgresAuditStore,
  PostgresDefectStore,
  PostgresNextActionStore,
  PostgresOwnershipStore,
  PostgresUnitOfWork,
  createSql
} from "@signaltrack/infrastructure";
import { requireRole } from "../middlewares/requireRole.js";
import { mapError } from "../errors/mapError.js";

const db = createSql();

const riskKind = (score: number): "high" | "medium" | "low" => {
  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
};

const riskLabel = (score: number): string => {
  if (score >= 8) return "High risk";
  if (score >= 5) return "Needs attention";
  return "Stable";
};

export const registerDefectRoutes = async (app: FastifyInstance) => {
  const createService = new CreateDefectService(
    new PostgresDefectStore(),
    new PostgresAuditStore(),
    new PostgresUnitOfWork()
  );
  const changeOwnerService = new SetAccountableOwnerService(
    new PostgresDefectStore(),
    new PostgresOwnershipStore(),
    new PostgresAuditStore(),
    new PostgresUnitOfWork()
  );
  const createNextActionService = new CreateNextActionService(
    new PostgresDefectStore(),
    new PostgresNextActionStore(),
    new PostgresAuditStore(),
    new PostgresUnitOfWork()
  );

  app.get("/v1/defects", { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] }, async (request, reply) => {
    try {
      const query = z.object({
        search: z.string().optional(),
        reporterStatus: z.string().optional(),
        internalStatus: z.string().optional(),
        owner: z.string().optional(),
        risk: z.enum(["high", "medium", "low"]).optional()
      }).parse(request.query);

      const rows = await db<{
        id: string;
        key: string;
        externalSummary: string;
        reporterStatus: string;
        internalStatus: string;
        owner: string | null;
        nextAction: string | null;
        score: number;
      }[]>`
        SELECT
          defects.id,
          defects.defect_key AS key,
          defects.external_summary AS "externalSummary",
          defects.reporter_status AS "reporterStatus",
          defects.internal_status AS "internalStatus",
          COALESCE(owner.display_name, owner.email, '—') AS owner,
          next_actions.summary AS "nextAction",
          (defects.severity + defects.urgency + defects.evidence_gap)::int AS score
        FROM defects
        LEFT JOIN users AS owner ON owner.id = defects.current_accountable_owner_id
        LEFT JOIN next_actions ON next_actions.id = defects.current_next_action_id
        WHERE defects.org_id = ${request.currentUser!.orgId}::uuid
          AND (${query.reporterStatus ?? null}::text IS NULL OR defects.reporter_status = ${query.reporterStatus ?? null})
          AND (${query.internalStatus ?? null}::text IS NULL OR defects.internal_status = ${query.internalStatus ?? null})
          AND (${query.owner ?? null}::text IS NULL OR COALESCE(owner.display_name, owner.email, '—') = ${query.owner ?? null})
          AND (
            ${query.search ?? null}::text IS NULL
            OR defects.defect_key ILIKE ${`%${query.search ?? ""}%`}
            OR defects.external_summary ILIKE ${`%${query.search ?? ""}%`}
            OR defects.internal_summary ILIKE ${`%${query.search ?? ""}%`}
          )
        ORDER BY defects.updated_at DESC, defects.created_at DESC
      `;

      const items = rows
        .map((row) => ({
          id: row.id,
          key: row.key,
          externalSummary: row.externalSummary,
          reporterStatus: row.reporterStatus,
          internalStatus: row.internalStatus,
          owner: row.owner ?? "—",
          nextAction: row.nextAction ?? "—",
          riskKind: riskKind(row.score),
          riskLabel: riskLabel(row.score)
        }))
        .filter((row) => !query.risk || row.riskKind === query.risk);

      return { items };
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });

  app.get("/v1/defects/:defectId", { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] }, async (request, reply) => {
    try {
      const params = z.object({ defectId: z.string().uuid() }).parse(request.params);
      const [defect] = await db<{
        id: string;
        key: string;
        externalSummary: string;
        reporterStatus: string;
        internalStatus: string;
        externalSummaryText: string;
        internalSummaryText: string;
        owner: string | null;
        nextAction: string | null;
        severity: number;
        urgency: number;
        evidenceGap: number;
        stalled: boolean;
      }[]>`
        SELECT
          defects.id,
          defects.defect_key AS key,
          defects.external_summary AS "externalSummary",
          defects.reporter_status AS "reporterStatus",
          defects.internal_status AS "internalStatus",
          defects.external_summary AS "externalSummaryText",
          defects.internal_summary AS "internalSummaryText",
          COALESCE(owner.display_name, owner.email, '—') AS owner,
          next_actions.summary AS "nextAction",
          defects.severity,
          defects.urgency,
          defects.evidence_gap AS "evidenceGap",
          (defects.last_meaningful_activity_at < now() - interval '72 hours') AS stalled
        FROM defects
        LEFT JOIN users AS owner ON owner.id = defects.current_accountable_owner_id
        LEFT JOIN next_actions ON next_actions.id = defects.current_next_action_id
        WHERE defects.org_id = ${request.currentUser!.orgId}::uuid
          AND defects.id = ${params.defectId}::uuid
        LIMIT 1
      `;

      if (!defect) {
        return reply.code(404).send({ error: { code: "DEFECT_NOT_FOUND", message: "Defect not found." } });
      }

      const [evidence, timeline, linkedReportRows, ownerOptions] = await Promise.all([
        db<{ name: string; meta: string; objectKey: string }[]>`
          SELECT
            COALESCE(summary, object_storage_key) AS name,
            object_storage_key AS "objectKey",
            to_char(evidence_items.created_at, 'YYYY-MM-DD HH24:MI') AS meta
          FROM evidence_items
          WHERE evidence_items.defect_id = ${params.defectId}::uuid
          ORDER BY evidence_items.created_at DESC
        `,
        db<{ title: string; subtitle: string }[]>`
          SELECT
            replace(audit_events.event_type, '.', ' ') AS title,
            to_char(audit_events.created_at, 'YYYY-MM-DD HH24:MI') || COALESCE(' · ' || users.display_name, '') AS subtitle
          FROM audit_events
          LEFT JOIN users ON users.id = audit_events.actor_user_id
          WHERE audit_events.org_id = ${request.currentUser!.orgId}::uuid
            AND audit_events.entity_id = ${params.defectId}::uuid
          ORDER BY audit_events.created_at DESC
          LIMIT 20
        `,
        db<{ title: string; meta: string }[]>`
          SELECT
            raw_description AS title,
            impact_level AS meta
          FROM reports
          WHERE reports.defect_id = ${params.defectId}::uuid
          ORDER BY reports.created_at DESC
          LIMIT 1
        `,
        db<{ id: string; label: string }[]>`
          SELECT id, COALESCE(display_name, email) AS label
          FROM users
          WHERE users.org_id = ${request.currentUser!.orgId}::uuid
          ORDER BY display_name ASC, email ASC
        `
      ]);

      return {
        ...defect,
        owner: defect.owner ?? "—",
        nextAction: defect.nextAction ?? "—",
        evidence,
        timeline,
        linkedReport: linkedReportRows[0] ?? { title: "No linked report yet", meta: "No report attached" },
        ownerOptions
      };
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });

  app.post("/v1/defects", { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] }, async (request, reply) => {
    try {
      const body = z.object({
        externalSummary: z.string().min(1),
        internalSummary: z.string().min(1),
        severity: z.number().int().min(1).max(3),
        urgency: z.number().int().min(1).max(3),
        evidenceGap: z.number().int().min(1).max(3)
      }).parse(request.body);

      const result = await createService.execute({
        orgId: request.currentUser!.orgId,
        actorUserId: request.currentUser!.id,
        ...body
      });

      return reply.code(201).send({
        id: result.id,
        key: result.defectKey
      });
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });

  app.patch("/v1/defects/:defectId", { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] }, async (request, reply) => {
    try {
      const params = z.object({ defectId: z.string().uuid() }).parse(request.params);
      const body = z.object({
        reporterStatus: z.enum(reporterStatuses).optional(),
        internalStatus: z.enum(internalStatuses).optional()
      }).parse(request.body);

      const defectStore = new PostgresDefectStore();
      const updated = await defectStore.update(request.currentUser!.orgId, params.defectId, body);
      await defectStore.touchMeaningfulMovement(request.currentUser!.orgId, params.defectId);
      await new PostgresAuditStore().append({
        orgId: request.currentUser!.orgId,
        actorUserId: request.currentUser!.id,
        eventType: "defect.statuses_updated",
        entityType: "defect",
        entityId: params.defectId,
        metadata: {
          summary: `Reporter status: ${updated.reporterStatus}; Internal status: ${updated.internalStatus}`
        }
      });

      return { ok: true };
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });

  app.post("/v1/defects/:defectId/accountable-owner", { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] }, async (request, reply) => {
    try {
      const params = z.object({ defectId: z.string().uuid() }).parse(request.params);
      const body = z.object({ userId: z.string().uuid() }).parse(request.body);

      await changeOwnerService.execute({
        orgId: request.currentUser!.orgId,
        actorUserId: request.currentUser!.id,
        defectId: params.defectId,
        userId: body.userId
      });

      return { ok: true };
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });

  app.post("/v1/defects/:defectId/next-actions", { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] }, async (request, reply) => {
    try {
      const params = z.object({ defectId: z.string().uuid() }).parse(request.params);
      const body = z.object({
        ownerUserId: z.string().uuid(),
        summary: z.string().min(1),
        dueAt: z.string().min(1)
      }).parse(request.body);

      await createNextActionService.execute({
        orgId: request.currentUser!.orgId,
        actorUserId: request.currentUser!.id,
        defectId: params.defectId,
        ownerUserId: body.ownerUserId,
        summary: body.summary,
        dueAt: body.dueAt
      });

      return { ok: true };
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });
};
