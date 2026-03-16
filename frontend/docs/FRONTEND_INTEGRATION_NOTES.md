# Frontend Integration Notes

## What this artifact adds
- typed API boundary
- feature-specific API modules
- React Query setup
- page-level hooks
- live backend data integration across defects, reports, manager, and admin flows
- real login/session/logout auth path
- defect detail mutation invalidation and optimistic updates

## Current integration state
1. defects list and detail use live backend endpoints
2. report submission and evidence upload use live backend/object-storage flows
3. manager overview and admin audit use live backend endpoints
4. auth uses the backend local login/session/logout flow
5. loading, success, and error states are wired through the feature hooks

## Recommended order
1. defects list
2. defect detail
3. report submission
4. evidence upload handshake
5. manager overview

## Important caution
Do not let page components become the API translation layer.
Keep request/response shaping close to the API client and feature modules.
