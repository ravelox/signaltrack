import type { FastifyInstance } from "fastify";
import { createSql, env } from "@signaltrack/infrastructure";
import { requireRole } from "../middlewares/requireRole.js";

const db = createSql();

export const registerManagerRoutes = async (app: FastifyInstance) => {
  app.get("/v1/manager/dashboard", { preHandler: [requireRole(["engineering_manager", "org_admin"])] }, async (request) => {
    const orgId = request.currentUser!.orgId;
    const stallInterval = `${env.STALL_THRESHOLD_HOURS} hours`;

    const [metrics] = await db<{
      activeDefects: number;
      overdueNextActions: number;
      stalledDefects: number;
      unowned: number;
    }[]>`
      SELECT
        count(*) FILTER (WHERE internal_status NOT IN ('resolved', 'archived'))::int AS "activeDefects",
        count(*) FILTER (
          WHERE current_next_action_id IS NOT NULL
            AND defects.current_next_action_id IN (
              SELECT id FROM next_actions WHERE status = 'open' AND due_at < now()
            )
        )::int AS "overdueNextActions",
        count(*) FILTER (WHERE last_meaningful_activity_at < now() - ${stallInterval}::interval)::int AS "stalledDefects",
        count(*) FILTER (WHERE current_accountable_owner_id IS NULL)::int AS unowned
      FROM defects
      WHERE org_id = ${orgId}::uuid
    `;

    const workload = await db<{ owner: string; defects: number; weight: number }[]>`
      SELECT
        COALESCE(users.display_name, users.email, 'Unowned') AS owner,
        count(defects.id)::int AS defects,
        COALESCE(sum(defects.severity + defects.urgency + defects.evidence_gap), 0)::int AS weight
      FROM defects
      LEFT JOIN users ON users.id = defects.current_accountable_owner_id
      WHERE defects.org_id = ${orgId}::uuid
      GROUP BY COALESCE(users.display_name, users.email, 'Unowned')
      ORDER BY defects DESC, weight DESC, owner ASC
      LIMIT 20
    `;

    const stalled = await db<{
      key: string;
      title: string;
      owner: string;
      lastMove: string;
      badgeKind: "high" | "medium" | "low";
      badgeLabel: string;
    }[]>`
      SELECT
        defects.defect_key AS key,
        defects.external_summary AS title,
        COALESCE(users.display_name, users.email, 'Unowned') AS owner,
        to_char(defects.last_meaningful_activity_at, 'YYYY-MM-DD HH24:MI') AS "lastMove",
        CASE
          WHEN defects.severity + defects.urgency + defects.evidence_gap >= 8 THEN 'high'
          WHEN defects.severity + defects.urgency + defects.evidence_gap >= 5 THEN 'medium'
          ELSE 'low'
        END AS "badgeKind",
        'Stalled' AS "badgeLabel"
      FROM defects
      LEFT JOIN users ON users.id = defects.current_accountable_owner_id
      WHERE defects.org_id = ${orgId}::uuid
        AND defects.last_meaningful_activity_at < now() - ${stallInterval}::interval
      ORDER BY defects.last_meaningful_activity_at ASC
      LIMIT 10
    `;

    const overdue = await db<{
      key: string;
      title: string;
      owner: string;
      due: string;
    }[]>`
      SELECT
        defects.defect_key AS key,
        next_actions.summary AS title,
        COALESCE(users.display_name, users.email, 'Unassigned') AS owner,
        to_char(next_actions.due_at, 'YYYY-MM-DD HH24:MI') AS due
      FROM next_actions
      JOIN defects ON defects.id = next_actions.defect_id
      LEFT JOIN users ON users.id = next_actions.owner_user_id
      WHERE next_actions.org_id = ${orgId}::uuid
        AND next_actions.status = 'open'
        AND next_actions.due_at < now()
      ORDER BY next_actions.due_at ASC
      LIMIT 10
    `;

    return {
      metrics: metrics ?? { activeDefects: 0, overdueNextActions: 0, stalledDefects: 0, unowned: 0 },
      workload,
      stalled,
      overdue
    };
  });
};
