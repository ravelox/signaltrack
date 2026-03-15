import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { CreateEvidenceService, CreateEvidenceUploadUrlService } from "@signaltrack/application";
import { PostgresAuditStore, PostgresDefectStore, PostgresEvidenceStore, PostgresUnitOfWork, S3SignedUrlProvider, env } from "@signaltrack/infrastructure";
import { requireRole } from "../middlewares/requireRole.js";
import { mapError } from "../errors/mapError.js";

export const registerEvidenceRoutes = async (app: FastifyInstance) => {
  const createService = new CreateEvidenceService(
    new PostgresDefectStore(),
    new PostgresEvidenceStore(),
    new PostgresAuditStore(),
    new PostgresUnitOfWork()
  );
  const uploadUrlService = new CreateEvidenceUploadUrlService(new S3SignedUrlProvider());

  app.post("/v1/evidence/upload-url", { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] }, async (request, reply) => {
    try {
      const body = z.object({
        objectKey: z.string().min(1),
        contentType: z.string().optional()
      }).parse(request.body);

      return await uploadUrlService.execute({
        objectKey: body.objectKey,
        ttlSeconds: env.SIGNED_URL_TTL_SECONDS,
        contentType: body.contentType
      });
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });

  app.post("/v1/defects/:defectId/evidence", { preHandler: [requireRole(["engineer", "engineering_manager", "org_admin"])] }, async (request, reply) => {
    try {
      const params = z.object({ defectId: z.string().uuid() }).parse(request.params);
      const body = z.object({
        objectStorageKey: z.string().min(1),
        summary: z.string().optional()
      }).parse(request.body);

      const result = await createService.execute({
        orgId: request.currentUser!.orgId,
        actorUserId: request.currentUser!.id,
        defectId: params.defectId,
        objectStorageKey: body.objectStorageKey,
        summary: body.summary
      });

      return reply.code(201).send(result);
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });
};
