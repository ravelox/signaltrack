# Changelog

All notable changes to the frontend workspace will be documented in this file.

## 0.5.0 - 2026-03-15

### Added

- Live sign-in form on the home page for local backend auth
- Logout action in the authenticated sidebar
- Next.js 15 application structure, role-aware navigation, admin audit scaffold, responsive table/card fallback, and form-error mapping are in place from the earlier frontend phase work

### Changed

- Frontend auth now works with the backend local login/session/logout flow instead of only a session bootstrap stub
- The default live-auth path now uses the seeded backend admin account when mocks are disabled
- Defect detail mutations already invalidate cached queries and apply optimistic updates where safe

### Known gaps

- Several workflows still rely on mock adapters instead of live backend endpoints
- Broader optimistic updates, deeper admin audit filtering, and accessibility refinement remain pending
- End-to-end smoke paths are not fully complete against the live backend
