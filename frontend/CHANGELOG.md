# Changelog

All notable changes to the frontend workspace will be documented in this file.

## 0.5.0 - 2026-03-15

### Added

- Next.js 15 application structure for SignalTrack workflows
- Role-aware navigation, permission gating, and route guard patterns
- App-level auth/session bootstrap path with env-controlled mock fallback
- Admin audit page scaffold
- Responsive table-to-card fallback patterns for smaller screens
- Form error mapping patterns and supporting UX completion notes
- Docker assets for local frontend container startup

### Changed

- Defect detail mutations now invalidate cached queries and apply optimistic updates where safe
- Frontend integration flow now supports a real backend session/bootstrap path in addition to mocks
- The current phase shifted from isolated screen work toward integration-ready application structure

### Known gaps

- Several workflows still rely on mock adapters instead of live backend endpoints
- Broader optimistic updates, deeper admin audit filtering, and accessibility refinement remain pending
- End-to-end smoke paths are not fully complete against the live backend
