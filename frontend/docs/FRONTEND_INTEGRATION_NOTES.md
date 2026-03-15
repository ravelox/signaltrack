# Frontend Integration Notes

## What this artifact adds
- typed API boundary
- feature-specific API modules
- React Query setup
- page-level hooks
- fallback mock adapter controlled by env
- real session/bootstrap auth path with env-controlled mock fallback
- defect detail mutation invalidation and optimistic updates

## Intended migration path
1. leave `NEXT_PUBLIC_SIGNALTRACK_USE_MOCKS=true` while backend endpoints stabilize
2. use `NEXT_PUBLIC_SIGNALTRACK_USE_MOCK_AUTH=false` when testing the real session/bootstrap path
3. switch a single feature to live data by changing the client implementation
4. verify states for loading / success / error
5. repeat for the next feature

## Recommended order
1. defects list
2. defect detail
3. report submission
4. evidence upload handshake
5. manager overview

## Important caution
Do not let page components become the API translation layer.
Keep request/response shaping close to the API client and feature modules.
