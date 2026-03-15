# SignalTrack

SignalTrack is a split frontend/backend workspace for tracking defects, ownership, evidence, audit activity, and follow-up actions. This repository currently serves two purposes:

- the working application code in `frontend/` and `backend/`
- the handoff artifacts at the repo root that describe current status and next-phase work

## Repository layout

- `frontend/`: Next.js 15 application with React Query, live local sign-in/session flow, responsive workflows, and env-controlled mock fallback
- `backend/`: pnpm/turborepo TypeScript workspace with Fastify API, worker process, domain/application/infrastructure packages, migrations, and tests
- `CODEX_HANDOFF.md`: high-signal continuation brief
- `PROJECT_STATE_SUMMARY.md`: current implementation snapshot
- `NEXT_PHASE_BUILD_PLAN.md`: prioritized next work
- `SOURCE_OF_TRUTH_ORDER.md`: expected read order for handoff/restore work

## Current status

As of March 15, 2026:

- `frontend/` dependencies are installed and `pnpm typecheck` passes
- `backend/` workspace dependencies are installed and `pnpm typecheck` passes
- frontend supports a live local sign-in flow with env-controlled mock fallback
- backend includes persisted local sessions, a seeded default admin, signed evidence upload initiation, and a long-running worker process
- several frontend workflows still depend on mock adapters or incomplete live backend routes

This is not a finished production release. It is a coherent in-progress snapshot intended to be continued from the handoff documents above.

## Local development

### Prerequisites

- Node.js 20+
- `pnpm`
- Docker Desktop or compatible Docker runtime for Postgres/MinIO

### Bootstrap from repo root

For a single root-level install path, run:

```bash
./bootstrap.sh
```

What it does:

- creates `backend/.env` from [backend/.env.example](/Users/dkelly/Projects/signaltrack/backend/.env.example) if it does not already exist
- creates `frontend/.env.local` from [frontend/.env.example](/Users/dkelly/Projects/signaltrack/frontend/.env.example) if it does not already exist
- installs backend dependencies
- installs frontend dependencies
- leaves the seeded local admin credentials at the defaults in `backend/.env` unless you change them

After bootstrap:

```bash
cd backend && docker compose up -d
cd frontend && pnpm dev
```

### Backend

If you prefer to install manually instead of using `./bootstrap.sh`:

1. Copy [backend/.env.example](/Users/dkelly/Projects/signaltrack/backend/.env.example) to `backend/.env` and adjust values as needed.
2. Install dependencies:

```bash
cd backend
pnpm install
```

3. Start the backend Docker stack:

```bash
docker compose up -d
```

4. If you prefer running the API outside Docker:

```bash
pnpm dev:api
```

5. If you prefer running the worker outside Docker:

```bash
pnpm dev:worker
```

Useful backend commands:

```bash
pnpm typecheck
pnpm test
pnpm migrate
pnpm build
```

The backend Docker stack exposes:

- API: `http://localhost:3000`
- Postgres: `localhost:5432`
- MinIO API: `http://localhost:9000`
- MinIO console: `http://localhost:9001`

Default local admin created by migration:

- email: `admin@signaltrack.local`
- password: `change-me-admin`

Override those defaults with `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`, and related values in [backend/.env.example](/Users/dkelly/Projects/signaltrack/backend/.env.example).

### Frontend

If you prefer to install manually instead of using `./bootstrap.sh`:

1. Copy [frontend/.env.example](/Users/dkelly/Projects/signaltrack/frontend/.env.example) to `frontend/.env.local`.
2. Install dependencies:

```bash
cd frontend
pnpm install
```

3. Start the app:

```bash
pnpm dev
```

Useful frontend commands:

```bash
pnpm typecheck
pnpm build
pnpm start
```

By default, the frontend env example points to `http://localhost:3000` and enables mocks with `NEXT_PUBLIC_SIGNALTRACK_USE_MOCKS=true`. Set that to `false` when testing against the live backend.

When using the live backend auth flow, sign in from the home page with the seeded local admin account unless you have changed the backend defaults.

## Docker

Both sides include Docker assets:

- [backend/docker-compose.yaml](/Users/dkelly/Projects/signaltrack/backend/docker-compose.yaml) starts Postgres, MinIO, migrations, the backend API, and the worker
- [frontend/docker-compose.yaml](/Users/dkelly/Projects/signaltrack/frontend/docker-compose.yaml) serves the Next.js app on `http://localhost:3001`

### Run backend under Docker

From the backend workspace:

```bash
cd backend
docker compose up --build
```

What this starts:

- Postgres on `localhost:5432`
- MinIO on `http://localhost:9000`
- MinIO console on `http://localhost:9001`
- migration job before API startup
- backend API on `http://localhost:3000`
- backend worker in the same stack

Run detached if preferred:

```bash
cd backend
docker compose up -d --build
```

Stop the backend stack:

```bash
cd backend
docker compose down
```

### Run frontend under Docker

Start the backend Docker stack first. The frontend container is configured to call the backend at `http://host.docker.internal:3000`, so the backend API must already be reachable on port `3000` on your host.

From the frontend workspace:

```bash
cd frontend
docker compose up --build
```

This serves the frontend at `http://localhost:3001`.

Run detached if preferred:

```bash
cd frontend
docker compose up -d --build
```

Stop the frontend container:

```bash
cd frontend
docker compose down
```

### Full Docker startup order

If you want both applications running under Docker:

```bash
cd backend && docker compose up -d --build
cd frontend && docker compose up -d --build
```

Then open:

- frontend: `http://localhost:3001`
- backend API: `http://localhost:3000`
- MinIO console: `http://localhost:9001`

## Suggested read order

If you are picking up development work rather than just running the app, start with:

1. [CODEX_HANDOFF.md](/Users/dkelly/Projects/signaltrack/CODEX_HANDOFF.md)
2. [PROJECT_STATE_SUMMARY.md](/Users/dkelly/Projects/signaltrack/PROJECT_STATE_SUMMARY.md)
3. [NEXT_PHASE_BUILD_PLAN.md](/Users/dkelly/Projects/signaltrack/NEXT_PHASE_BUILD_PLAN.md)
4. [SOURCE_OF_TRUTH_ORDER.md](/Users/dkelly/Projects/signaltrack/SOURCE_OF_TRUTH_ORDER.md)
