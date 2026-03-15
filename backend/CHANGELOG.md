# Changelog

All notable changes to the backend workspace will be documented in this file.

## 2026-03-15

### Added

- Fastify API workspace structure with `@signaltrack/api` and `@signaltrack/worker` applications
- Domain, application, infrastructure, and shared packages wired into the backend workspace
- AsyncLocalStorage-based transaction propagation across backend flows
- Dual-status defect persistence carried through schema, repositories, services, and API routes
- OIDC begin/callback skeleton with persisted state and nonce handling
- Session bootstrap stub to support frontend auth wiring
- Signed evidence upload initiation route and service
- Worker skeletons for stalled defect and overdue next action sweeps
- Docker assets for Postgres, MinIO, migrations, and local API startup
- Helm and Kubernetes deployment assets

### Changed

- Route registration and dependency wiring were tightened across the backend app surface
- Workspace typecheck was restored with the infrastructure package surface present in-repo
- Integration coverage was expanded for defects, next actions, ownership, reports, evidence, OIDC state, and transaction propagation

### Known gaps

- OIDC token exchange and durable authenticated session handling are still incomplete
- Some live read/update routes required by the frontend are still stubbed or not fully implemented
- Notification delivery is not complete enough for production use
- This workspace has been hardened, but it is not a verified production release
