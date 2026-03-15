import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { BeginLoginService, CompleteOidcLoginService } from "@signaltrack/application";
import { PostgresOidcStateStore } from "@signaltrack/infrastructure";
import { mapError } from "../errors/mapError.js";

class StubAuthorizationUrlBuilder {
  public async buildAuthorizationUrl(input: { orgSlug: string; state: string; nonce: string }): Promise<string> {
    return `https://example-oidc.local/auth?org=${encodeURIComponent(input.orgSlug)}&state=${encodeURIComponent(input.state)}&nonce=${encodeURIComponent(input.nonce)}`;
  }
}

export const registerAuthRoutes = async (app: FastifyInstance) => {
  const stateStore = new PostgresOidcStateStore();
  const beginService = new BeginLoginService(new StubAuthorizationUrlBuilder(), stateStore);
  const completeService = new CompleteOidcLoginService(stateStore);

  app.get("/v1/auth/session", async (request) => {
    if (!request.currentUser) return { user: null };

    return {
      user: {
        id: request.currentUser.id,
        orgId: request.currentUser.orgId,
        email: "kim@example.com",
        displayName: "Kim Example",
        roles: request.currentUser.roles
      }
    };
  });

  app.post("/v1/auth/login/begin", async (request, reply) => {
    try {
      const body = z.object({
        orgSlug: z.string().min(1),
        state: z.string().min(1),
        nonce: z.string().min(1),
        expiresAt: z.string().datetime()
      }).parse(request.body);

      return {
        authorizationUrl: await beginService.execute(body)
      };
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });

  app.post("/v1/auth/login/validate", async (request, reply) => {
    try {
      const body = z.object({
        state: z.string().min(1),
        expectedOrgSlug: z.string().optional(),
        nonceFromProvider: z.string().optional()
      }).parse(request.body);

      return await completeService.validateState(body);
    } catch (error) {
      const mapped = mapError(error);
      return reply.code(mapped.statusCode).send(mapped.body);
    }
  });
};
