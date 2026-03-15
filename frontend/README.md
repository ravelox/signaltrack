# SignalTrack Frontend Phase Remaining Artifacts Bundle

This bundle packages the remaining major artifacts for the current frontend phase.

Included:
- permissions and role-awareness pass
- role-aware navigation and action gating
- route guard patterns
- server-error mapping patterns for forms
- responsive table/card fallback pattern
- admin audit page scaffold
- app-level auth/session bootstrap path with env-controlled mock fallback
- optimistic defect detail mutation updates and cache invalidation
- UX completion notes for this phase
- final restore prompt for continuing the next frontend phase

This bundle is intended to close out the current frontend phase by rounding out the missing structural pieces rather than focusing on one narrow incremental change.

## Local auth

When `NEXT_PUBLIC_SIGNALTRACK_USE_MOCK_AUTH=false`, the home page uses the live backend session flow and sign-in form.

With the default backend seed values:

- email: `admin@signaltrack.local`
- password: `change-me-admin`

## Run with Docker

The frontend Docker setup expects the backend API to already be reachable at `http://host.docker.internal:3000`, so start the backend stack first.

From [frontend/docker-compose.yaml](/Users/dkelly/Projects/signaltrack/frontend/docker-compose.yaml):

```bash
cd frontend
docker compose up --build
```

This builds the frontend image and serves the app on `http://localhost:3001`.

For detached startup:

```bash
cd frontend
docker compose up -d --build
```

To stop the container:

```bash
cd frontend
docker compose down
```
