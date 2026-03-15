import type { FastifyInstance } from "fastify";
import { registerAuthRoutes } from "../routes/auth.js";
import { registerDefectRoutes } from "../routes/defects.js";
import { registerEvidenceRoutes } from "../routes/evidence.js";

export const registerRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", async (request) => {
    request.currentUser = request.currentUser ?? {
      id: "00000000-0000-0000-0000-000000000111",
      orgId: "00000000-0000-0000-0000-000000000111",
      roles: ["org_admin", "engineering_manager", "engineer"]
    };
  });

  app.get("/health", async () => ({ ok: true }));

  await registerAuthRoutes(app);
  await registerDefectRoutes(app);
  await registerEvidenceRoutes(app);
};
