import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { CreateReportService } from "@signaltrack/application";
import { PostgresAuditStore, PostgresReportStore, PostgresUnitOfWork, createSql } from "@signaltrack/infrastructure";
import { requireRole } from "../middlewares/requireRole.js";
import { mapError } from "../errors/mapError.js";

const normalizeEnvironmentSnapshot = (value: unknown): Record<string, unknown> => {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
    } catch {
      return {};
    }
  }

  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
};

export const registerReportRoutes = async (app: FastifyInstance) => {
  const db = createSql();
  const createService = new CreateReportService(
    new PostgresReportStore(),
    new PostgresAuditStore(),
    new PostgresUnitOfWork()
  );

  app.get(
    "/v1/reports",
    { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] },
    async (request, reply) => {
      try {
        const query = z.object({
          search: z.string().optional(),
          impactLevel: z.enum(["annoying", "slows_me_down", "blocking"]).optional(),
          linked: z.enum(["linked", "unlinked"]).optional()
        }).parse(request.query);

        const rows = await db<{
          id: string;
          submittedAt: string;
          reporter: string;
          impactLevel: "annoying" | "slows_me_down" | "blocking";
          rawDescription: string;
          linkedDefectId: string | null;
          linkedDefectKey: string | null;
          environmentSnapshot: unknown;
        }[]>`
          SELECT
            reports.id,
            to_char(reports.created_at, 'YYYY-MM-DD HH24:MI') AS "submittedAt",
            COALESCE(users.display_name, users.email, reports.reporter_type) AS reporter,
            reports.impact_level AS "impactLevel",
            reports.raw_description AS "rawDescription",
            reports.defect_id AS "linkedDefectId",
            defects.defect_key AS "linkedDefectKey",
            reports.environment_snapshot AS "environmentSnapshot"
          FROM reports
          LEFT JOIN users ON users.id = reports.reporter_user_id
          LEFT JOIN defects ON defects.id = reports.defect_id
          WHERE reports.org_id = ${request.currentUser!.orgId}::uuid
            AND (${query.impactLevel ?? null}::text IS NULL OR reports.impact_level = ${query.impactLevel ?? null})
            AND (
              ${query.linked ?? null}::text IS NULL
              OR (${query.linked ?? null} = 'linked' AND reports.defect_id IS NOT NULL)
              OR (${query.linked ?? null} = 'unlinked' AND reports.defect_id IS NULL)
            )
            AND (
              ${query.search ?? null}::text IS NULL
              OR reports.raw_description ILIKE ${`%${query.search ?? ""}%`}
              OR COALESCE(users.display_name, users.email, reports.reporter_type) ILIKE ${`%${query.search ?? ""}%`}
              OR COALESCE(defects.defect_key, '') ILIKE ${`%${query.search ?? ""}%`}
            )
          ORDER BY reports.created_at DESC
          LIMIT 200
        `;

        return {
          items: rows.map((row) => ({
            id: row.id,
            submittedAt: row.submittedAt,
            reporter: row.reporter,
            impactLevel: row.impactLevel,
            rawDescription: row.rawDescription,
            linkedDefectId: row.linkedDefectId,
            linkedDefectKey: row.linkedDefectKey,
            attachmentCount: Array.isArray(normalizeEnvironmentSnapshot(row.environmentSnapshot).attachments)
              ? (normalizeEnvironmentSnapshot(row.environmentSnapshot).attachments as unknown[]).length
              : 0,
            href: `/reports/${row.id}`,
            linkedDefectHref: row.linkedDefectId ? `/defects/${row.linkedDefectId}` : null
          }))
        };
      } catch (error) {
        const mapped = mapError(error);
        return reply.code(mapped.statusCode).send(mapped.body);
      }
    }
  );

  app.get(
    "/v1/reports/:reportId",
    { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] },
    async (request, reply) => {
      try {
        const params = z.object({ reportId: z.string().uuid() }).parse(request.params);

        const [report] = await db<{
          id: string;
          submittedAt: string;
          reporter: string;
          reporterType: string;
          impactLevel: "annoying" | "slows_me_down" | "blocking";
          rawDescription: string;
          expectedBehavior: string | null;
          observedBehavior: string | null;
          workaroundAvailable: boolean | null;
          contactAllowed: boolean;
          linkedDefectId: string | null;
          linkedDefectKey: string | null;
          environmentSnapshot: unknown;
        }[]>`
          SELECT
            reports.id,
            to_char(reports.created_at, 'YYYY-MM-DD HH24:MI') AS "submittedAt",
            COALESCE(users.display_name, users.email, reports.reporter_type) AS reporter,
            reports.reporter_type AS "reporterType",
            reports.impact_level AS "impactLevel",
            reports.raw_description AS "rawDescription",
            reports.expected_behavior AS "expectedBehavior",
            reports.observed_behavior AS "observedBehavior",
            reports.workaround_available AS "workaroundAvailable",
            reports.contact_allowed AS "contactAllowed",
            reports.defect_id AS "linkedDefectId",
            defects.defect_key AS "linkedDefectKey",
            reports.environment_snapshot AS "environmentSnapshot"
          FROM reports
          LEFT JOIN users ON users.id = reports.reporter_user_id
          LEFT JOIN defects ON defects.id = reports.defect_id
          WHERE reports.org_id = ${request.currentUser!.orgId}::uuid
            AND reports.id = ${params.reportId}::uuid
          LIMIT 1
        `;

        if (!report) {
          return reply.code(404).send({ error: { code: "REPORT_NOT_FOUND", message: "Reported issue not found." } });
        }

        return {
          ...report,
          environmentSnapshot: normalizeEnvironmentSnapshot(report.environmentSnapshot),
          defectHref: report.linkedDefectId ? `/defects/${report.linkedDefectId}` : null
        };
      } catch (error) {
        const mapped = mapError(error);
        return reply.code(mapped.statusCode).send(mapped.body);
      }
    }
  );

  app.post(
    "/v1/reports",
    { preHandler: [requireRole(["reporter", "engineer", "engineering_manager", "org_admin"])] },
    async (request, reply) => {
      try {
        const body = z.object({
          rawDescription: z.string().min(1),
          expectedBehavior: z.string().optional(),
          observedBehavior: z.string().optional(),
          impactLevel: z.enum(["annoying", "slows_me_down", "blocking"]),
          workaroundAvailable: z.boolean().optional(),
          contactAllowed: z.boolean(),
          environmentSnapshot: z.record(z.unknown())
        }).parse(request.body);

        const reporterType = request.currentUser?.roles.includes("engineer")
          ? "engineer"
          : request.currentUser?.roles.includes("reporter")
            ? "internal_user"
            : "external_user";

        const report = await createService.execute({
          orgId: request.currentUser!.orgId,
          reporterUserId: request.currentUser!.id,
          reporterType,
          ...body
        });

        return reply.code(201).send({ id: report.id });
      } catch (error) {
        const mapped = mapError(error);
        return reply.code(mapped.statusCode).send(mapped.body);
      }
    }
  );
};
