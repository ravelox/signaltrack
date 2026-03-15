# SignalTrack Codex Handoff Bundle

Use this bundle to continue the next phase of SignalTrack without rebuilding context from scratch.

## What is included
- the latest backend hardening artifact
- the latest frontend phase-complete artifact chain
- the latest restore prompts
- a Codex handoff brief
- a concrete next-phase build plan
- a project map and expected source-of-truth order
- checksums for the included files

## Recommended handoff order for Codex
1. Read `CODEX_HANDOFF.md`
2. Read `PROJECT_STATE_SUMMARY.md`
3. Read `NEXT_PHASE_BUILD_PLAN.md`
4. Read the restore prompts in `backend/` and `frontend/`
5. Use the highest-numbered frontend artifact zip as the current UI source of truth
6. Use the backend hardening artifact as the current backend source of truth unless newer backend work exists outside this bundle

## Current focus
- completing the remaining live backend integrations now that real session/bootstrap wiring exists
- replacing mock adapters with live backend endpoints
- expanding cache invalidation and optimistic updates beyond the current defect detail actions
- admin audit filtering depth
- accessibility and responsive refinement
- end-to-end smoke-path completion

## Current repo status
- frontend dependencies are installed and `pnpm typecheck` passes in `frontend/`
- backend workspace dependencies are installed and `pnpm typecheck` passes in `backend/`
- frontend auth now supports a real session/bootstrap path with mock fallback controlled by env
- defect detail mutations now invalidate cached queries and apply optimistic updates where safe
- backend now includes a session endpoint stub and the infrastructure package surface needed for workspace typecheck
