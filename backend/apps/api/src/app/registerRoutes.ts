import type { FastifyInstance } from "fastify";
import { env, LocalAuthStore } from "@signaltrack/infrastructure";
import { registerAuthRoutes } from "../routes/auth.js";
import { registerDefectRoutes } from "../routes/defects.js";
import { registerEvidenceRoutes } from "../routes/evidence.js";

export const registerRoutes = async (app: FastifyInstance) => {
  const authStore = new LocalAuthStore();

  app.addHook("onRequest", async (request) => {
    request.currentUser = null;

    const rawSessionCookie = request.cookies[env.SESSION_COOKIE_NAME];
    if (!rawSessionCookie) return;

    const { valid, value } = request.unsignCookie(rawSessionCookie);
    if (!valid) return;

    request.currentUser = await authStore.getSessionUser(value);
  });

  app.get("/health", async () => ({ ok: true }));

  await registerAuthRoutes(app);
  await registerDefectRoutes(app);
  await registerEvidenceRoutes(app);
};
