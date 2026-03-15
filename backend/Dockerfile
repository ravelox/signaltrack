FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/worker/package.json ./apps/worker/package.json
COPY packages/application/package.json ./packages/application/package.json
COPY packages/domain/package.json ./packages/domain/package.json
COPY packages/infrastructure/package.json ./packages/infrastructure/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner-base
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps ./apps
COPY --from=build /app/packages ./packages

FROM runner-base AS api-runner
ENV PORT=3000
EXPOSE 3000
CMD ["node", "apps/api/dist/apps/api/src/server.js"]

FROM runner-base AS worker-runner
CMD ["node", "apps/worker/dist/worker.js"]
