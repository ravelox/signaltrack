# Next Phase Build Plan

## Phase goal
Move SignalTrack from a structurally complete frontend scaffold to a genuinely integrated application slice.

## Already done
- real session/bootstrap query and auth-provider replacement with env-controlled mock fallback
- role-aware routing and navigation using session-backed user state
- defect detail mutation invalidation and low-risk optimistic updates
- installed dependencies and passing workspace/frontend typecheck

## Workstreams

### 1. Defects list live integration
- swap mock defect list adapter for real endpoint
- normalize backend response shape in the API client
- add filter-state wiring only if supported by backend
- preserve desktop table + mobile card fallback

### 2. Defect detail live integration
- wire real defect detail endpoint
- map evidence, timeline, owner options, and statuses cleanly
- keep page composition stable even if backend payloads vary

### 3. Mutation completion
- wire owner change, next-action creation, and status updates to real endpoints where backend routes exist
- extend invalidation from defect detail to defects list and adjacent views after mutation success
- keep optimistic updates limited to low-risk flows where rollback is manageable

### 4. Reporter flow completion
- wire real report submission endpoint
- wire evidence upload handshake
- present submission confirmation clearly
- preserve symptom-first plain language

### 5. Manager and admin completion
- wire manager overview to live data
- wire audit page to real events
- add filter controls for audit event type, actor, entity type, and time range
- consider drill-in detail drawer only after baseline list works

### 6. Reliability and polish
- add loading, empty, and error handling for every route
- improve server error mapping from backend payloads to field-level UI messages
- add a basic accessibility pass covering labels, keyboard navigation, focus order, and contrast
- refine responsive layouts

## Suggested execution order
1. defects list live integration
2. defect detail live integration
3. live mutation endpoint alignment
4. report submission + evidence upload
5. manager + admin audit
6. accessibility and responsive polish
7. smoke-path verification

## Exit criteria for next phase
- defects list/detail use live data
- owner change, next action, status update use live mutations
- report submission uses live mutation
- manager and admin pages use live data
- route and action visibility follow real user roles
- basic smoke path works end to end
