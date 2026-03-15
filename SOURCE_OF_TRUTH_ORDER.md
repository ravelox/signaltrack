# Source of Truth Order

## Current source of truth
Use the checked-in repository state as the active source of truth.

Start with:

1. `README.md`
2. `CODEX_HANDOFF.md`
3. `PROJECT_STATE_SUMMARY.md`
4. `NEXT_PHASE_BUILD_PLAN.md`

## Workspace-level references

For backend details, prefer:

- `backend/README.md`
- `backend/CHANGELOG.md`
- `backend/docs/`

For frontend details, prefer:

- `frontend/README.md`
- `frontend/CHANGELOG.md`
- `frontend/docs/`
- `frontend/SCREEN_NOTES.md`

## Active implementation rule
If there is a conflict between high-level handoff docs and the checked-in code, prefer the checked-in code and the nearest workspace documentation.
