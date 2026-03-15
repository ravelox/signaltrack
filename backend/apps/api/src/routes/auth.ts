import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { env, LocalAuthStore, verifyPassword } from "@signaltrack/infrastructure";
import { mapError } from "../errors/mapError.js";

export const registerAuthRoutes = async (app: FastifyInstance) => {
  const authStore = new LocalAuthStore();

  app.get("/v1/auth/session", async (request) => {
    if (!request.currentUser) return { user: null };

    return {
      user: {
        id: request.currentUser.id,
        orgId: request.currentUser.orgId,
        email: request.currentUser.email,
        displayName: request.currentUser.displayName,
        roles: request.currentUser.roles
      }
    };
  });

  app.post("/v1/auth/login", async (request, reply) => {
    try {
      const body = z.object({
        email: z.string().email(),
        password: z.string().min(1)
      }).parse(request.body);

      const user = await authStore.getUserByEmail(body.email);
      if (!user?.passwordHash || !verifyPassword(body.password, user.passwordHash)) {
        return reply.code(401).send({
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password."
          }
        });
      }

      const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000);
      const sessionId = await authStore.createSession(user.id, expiresAt);

      reply.setCookie(env.SESSION_COOKIE_NAME, reply.signCookie(sessionId), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        expires: expiresAt
      });

      return {
        user: {
          id: user.id,
          orgId: user.orgId,
          email: user.email,
          displayName: user.displayName,
          roles: user.roles
        }
      };
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });

  app.post("/v1/auth/logout", async (request, reply) => {
    const rawSessionCookie = request.cookies[env.SESSION_COOKIE_NAME];
    if (rawSessionCookie) {
      const { valid, value } = request.unsignCookie(rawSessionCookie);
      if (valid) {
        await authStore.deleteSession(value);
      }
    }

    reply.clearCookie(env.SESSION_COOKIE_NAME, {
      path: "/"
    });
    return reply.code(204).send();
  });
};
