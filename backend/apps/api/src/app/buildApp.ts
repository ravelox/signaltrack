import Fastify from "fastify";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import { env } from "@signaltrack/infrastructure";
import { registerRoutes } from "./registerRoutes.js";

export const buildApp = async () => {
  const app = Fastify({ logger: true });
  const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001"
  ]);

  app.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      reply.header("Access-Control-Allow-Origin", origin);
      reply.header("Access-Control-Allow-Credentials", "true");
      reply.header("Access-Control-Allow-Headers", "Content-Type");
      reply.header("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
      reply.header("Vary", "Origin");
    }

    if (request.method === "OPTIONS") {
      return reply.code(204).send();
    }
  });

  await app.register(cookie, {
    secret: env.SESSION_SECRET
  });
  await app.register(helmet);
  await registerRoutes(app);
  return app;
};
