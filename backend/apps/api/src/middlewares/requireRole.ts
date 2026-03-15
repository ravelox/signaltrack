import type { FastifyReply, FastifyRequest } from "fastify";
type Role = "reporter" | "engineer" | "engineering_manager" | "org_admin";

declare module "fastify" {
  interface FastifyRequest {
    currentUser: { id: string; orgId: string; roles: Role[] } | null;
  }
}

export const requireRole = (roles: Role[]) => async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.currentUser;
  if (!user) return reply.code(401).send({ error: { code: "UNAUTHORIZED", message: "Authentication required." } });
  if (!roles.some((role) => user.roles.includes(role))) {
    return reply.code(403).send({ error: { code: "FORBIDDEN", message: "Insufficient permissions." } });
  }
};
