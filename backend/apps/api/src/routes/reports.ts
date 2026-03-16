import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { CreateReportService } from "@signaltrack/application";
import { PostgresAuditStore, PostgresReportStore, PostgresUnitOfWork } from "@signaltrack/infrastructure";
import { requireRole } from "../middlewares/requireRole.js";
import { mapError } from "../errors/mapError.js";

export const registerReportRoutes = async (app: FastifyInstance) => {
  const createService = new CreateReportService(
    new PostgresReportStore(),
    new PostgresAuditStore(),
    new PostgresUnitOfWork()
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
