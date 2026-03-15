import Fastify from "fastify";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import { registerRoutes } from "./registerRoutes.js";

export const buildApp = async () => {
  const app = Fastify({ logger: true });
  await app.register(cookie);
  await app.register(helmet);
  await registerRoutes(app);
  return app;
};
