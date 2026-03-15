# Codex Handoff Brief

You are continuing work on **SignalTrack**, a Git-aware, evidence-first defect operations platform.

## Product philosophy
- simple for reporters
- structured for engineers
- operationally clear for managers

Core rule:
**simple outside, structured inside**

This means:
- reporters should never need to understand internal engineering workflow
- engineers need evidence, ownership, statuses, one current next action, and timeline
- managers need workload, stalled-risk, overdue actions, and ownership clarity
- admins need governance and audit visibility

## Current project shape
### Backend
The backend has already gone through a v1 hardening pass and is production-shaped rather than finished.
Primary backend assumptions:
- Node.js + TypeScript
- Postgres
- OIDC-first auth direction
- S3-compatible evidence storage
- one accountable owner per active defect
- one open next action per defect
- dual-status model: reporter-facing status and internal status

### Frontend
The frontend has completed its current structural phase. It already has:
- approved UX/UI direction reflected in the checked-in app and docs
- Next.js starter scaffold
- integration pass
- design-system pass
- forms and validation pass
- permissions, role-awareness, admin audit scaffold, and responsive queue patterns
- session/bootstrap auth path with env-controlled mock fallback
- query invalidation and optimistic detail updates for core defect mutations

## Source of truth preference
Use the checked-in repository state as the source of truth for this phase.

For frontend implementation context, prefer:
- `frontend/README.md`
- `frontend/CHANGELOG.md`
- `frontend/docs/`

For backend implementation context, prefer:
- `backend/README.md`
- `backend/CHANGELOG.md`
- `backend/docs/`

## What Codex should do next
Build the next phase.

### Frontend next phase priorities
1. Replace remaining mock adapters with live backend endpoints incrementally
2. Complete live defects list/detail and mutation endpoint alignment
3. Deepen admin audit filtering and detail interactions
4. Improve accessibility and responsive behavior
5. Complete a smoke path across:
   - login
   - defects list
   - defect detail
   - owner change
   - next action creation
   - status updates
   - report submission
   - manager view
   - admin audit

### Recently completed implementation updates
- frontend dependencies installed and frontend typecheck passing
- backend workspace dependencies installed and backend typecheck passing
- real session/bootstrap path added with backend `/v1/auth/session` stub support
- defect detail owner/next-action/status mutations now use backend defect IDs
- defect detail mutations now invalidate cached defects queries and apply optimistic updates where safe

### Backend coordination assumptions
If frontend endpoints do not fully match backend reality:
- prefer adapting at the frontend API client layer first
- preserve the approved UX and domain rules
- do not expose internal workflow complexity to reporters just because an endpoint shape is awkward

## Non-goals for the next phase
- do not restart discovery
- do not redesign the product model
- do not add speculative large features outside the frozen v1 direction unless required by implementation reality
- do not collapse reporter-facing and internal statuses into one status

## Deliverable preference
When building, keep outputs:
- structured
- reproducible
- easy to hand back as zips or repos
- accompanied by concise checkpoint docs and restore prompts
