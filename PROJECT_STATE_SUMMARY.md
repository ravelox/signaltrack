# Project State Summary

## Backend summary
The backend is in a hardened v1 scaffold state with:
- transaction propagation pattern
- dual-status persistence
- OIDC state/nonce skeleton
- evidence upload URL service
- service-level integration tests
- worker skeletons
- production-shaped schema and repository/service structure
- installed workspace dependencies and passing backend typecheck
- infrastructure package entrypoint, DB helpers, migration shim, env surface, and signed URL provider restored
- stubbed `/v1/auth/session` route for frontend session/bootstrap wiring

## Frontend summary
The frontend is in a phase-complete scaffold state with:
- approved IA, UX principles, and wireframes
- clickable prototype
- Next.js/Tailwind scaffold
- typed API client boundary
- React Query integration
- design-system primitives
- forms and client-side validation
- role-aware navigation and action gating
- admin audit scaffold
- responsive defect list pattern
- real session/bootstrap auth path with env-controlled mock fallback
- mock adapter fallbacks
- defect detail mutation invalidation and optimistic updates

## Frontend architectural direction
- Next.js App Router
- Tailwind CSS
- React Query
- typed feature-specific API modules
- route-level pages kept thin
- shared UI primitives in components
- mock adapters swappable with real backend endpoints

## Core UX invariants
- reporter flow remains symptom-first
- defect detail remains the strongest screen
- manager view remains action-oriented, not chart-heavy
- dual-status model remains visible and distinct
- one current next action remains prominent
- permissions should hide inaccessible actions and routes by default

## Biggest remaining gaps
- live backend endpoint replacement for mocks
- live defects list/detail alignment with backend payloads
- server-returned field error mapping depth
- broader query invalidation after mutations beyond current defect detail flows
- optimistic updates beyond current low-risk defect detail flows
- accessibility review
- mobile/responsive refinement
- audit filtering depth
- true end-to-end smoke-path verification
