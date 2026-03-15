# Changelog

All notable changes to the backend workspace will be documented in this file.

## 0.1.0 - 2026-03-15

### Added

- Local password-based auth with persisted Postgres-backed sessions
- Seeded default admin user and organization created during migration
- Signed-cookie session resolution for API requests
- Dedicated Docker image targets for migrate, API, and worker services

### Changed

- Replaced the session bootstrap stub with working login, logout, and session endpoints
- Updated the worker from a one-shot process to a long-running polling loop
- Fixed backend Docker startup so API, worker, and migrations build the correct runtime targets
- Corrected Docker/runtime package resolution for built workspace packages

### Known gaps

- OIDC token exchange is still incomplete even though local auth is now working
- Some live read/update routes required by the frontend are still stubbed or not fully implemented
- Notification delivery is not complete enough for production use
- This workspace has been hardened, but it is not a verified production release
