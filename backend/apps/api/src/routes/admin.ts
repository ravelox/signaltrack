import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createSql } from "@signaltrack/infrastructure";
import { requireRole } from "../middlewares/requireRole.js";
import { mapError } from "../errors/mapError.js";

const db = createSql();

export const registerAdminRoutes = async (app: FastifyInstance) => {
  app.get("/v1/admin/audit", { preHandler: [requireRole(["org_admin"])] }, async (request, reply) => {
    try {
      const query = z.object({
        search: z.string().optional(),
        eventType: z.string().optional(),
        entityType: z.string().optional(),
        actor: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional()
      }).parse(request.query);

      const rows = await db<{
        id: string;
        at: string;
        actor: string | null;
        eventType: string;
        entityType: string;
        entityId: string | null;
        summary: string;
      }[]>`
        SELECT
          audit_events.id,
          audit_events.created_at AS at,
          COALESCE(users.display_name, users.email, 'System') AS actor,
          audit_events.event_type AS "eventType",
          audit_events.entity_type AS "entityType",
          audit_events.entity_id AS "entityId",
          CASE
            WHEN audit_events.metadata ? 'summary' THEN audit_events.metadata->>'summary'
            ELSE replace(audit_events.event_type, '.', ' ')
          END AS summary
        FROM audit_events
        LEFT JOIN users ON users.id = audit_events.actor_user_id
        WHERE audit_events.org_id = ${request.currentUser!.orgId}::uuid
          AND (${query.eventType ?? null}::text IS NULL OR audit_events.event_type = ${query.eventType ?? null})
          AND (${query.entityType ?? null}::text IS NULL OR audit_events.entity_type = ${query.entityType ?? null})
          AND (${query.actor ?? null}::text IS NULL OR COALESCE(users.display_name, users.email, '') ILIKE ${`%${query.actor ?? ""}%`})
          AND (${query.from ?? null}::timestamptz IS NULL OR audit_events.created_at >= ${query.from ?? null}::timestamptz)
          AND (${query.to ?? null}::timestamptz IS NULL OR audit_events.created_at <= ${query.to ?? null}::timestamptz)
          AND (
            ${query.search ?? null}::text IS NULL
            OR audit_events.event_type ILIKE ${`%${query.search ?? ""}%`}
            OR audit_events.entity_type ILIKE ${`%${query.search ?? ""}%`}
            OR COALESCE(users.display_name, users.email, '') ILIKE ${`%${query.search ?? ""}%`}
            OR COALESCE(audit_events.entity_id::text, '') ILIKE ${`%${query.search ?? ""}%`}
          )
        ORDER BY audit_events.created_at DESC
        LIMIT 200
      `;

      return { items: rows };
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });
};
