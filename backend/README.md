# SignalTrack v1 Hardening Pass

This bundle is the hardening pass on top of the prior v1 artifact sequence.

What this pass focuses on:
- end-to-end transaction propagation using AsyncLocalStorage
- consistent dual-status defect persistence in schema, repositories, services, and API routes
- persisted OIDC state/nonce flow skeleton wired through begin/callback routes
- persisted local session auth with seeded default admin support
- signed evidence upload initiation route and service
- tighter route registration and dependency wiring
- stronger integration tests for defects, next actions, ownership, reports, evidence, OIDC state, and transaction propagation
- long-running worker loop for stalled defect and overdue next action sweeps
- operational docs and a final restore-context prompt
- workspace typecheck restored with the infrastructure package surface present in-repo

What this still is not:
- a fully verified production release
- a fully implemented OIDC token/session exchange
- fully implemented live read/update routes for every frontend workflow
- a fully implemented notification delivery system

It is a substantially more coherent, better-integrated, production-shaped v1 codebase snapshot.

## Local auth

The backend now seeds a local default admin during migration. Default values:

- email: `admin@signaltrack.local`
- password: `change-me-admin`

You can override these with `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`, `DEFAULT_ADMIN_DISPLAY_NAME`, `DEFAULT_ORG_NAME`, and `DEFAULT_ORG_SLUG` in [backend/.env.example](/Users/dkelly/Projects/signaltrack/backend/.env.example).

## Run with Docker

From [backend/docker-compose.yaml](/Users/dkelly/Projects/signaltrack/backend/docker-compose.yaml):

```bash
cd backend
docker compose up --build
```

This builds the backend images, starts Postgres and MinIO, runs migrations, serves the API on `http://localhost:3000`, and starts the worker.

Useful endpoints:

- API: `http://localhost:3000`
- Postgres: `localhost:5432`
- MinIO API: `http://localhost:9000`
- MinIO console: `http://localhost:9001`

For detached startup:

```bash
cd backend
docker compose up -d --build
```

To stop the stack:

```bash
cd backend
docker compose down
```
