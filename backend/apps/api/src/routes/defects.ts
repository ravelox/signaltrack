import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { CreateDefectService } from "@signaltrack/application";
import { PostgresAuditStore, PostgresDefectStore, PostgresUnitOfWork } from "@signaltrack/infrastructure";
import { requireRole } from "../middlewares/requireRole.js";
import { mapError } from "../errors/mapError.js";

export const registerDefectRoutes = async (app: FastifyInstance) => {
  const createService = new CreateDefectService(
    new PostgresDefectStore(),
    new PostgresAuditStore(),
    new PostgresUnitOfWork()
  );

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

      return reply.code(201).send(result);
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });
};
