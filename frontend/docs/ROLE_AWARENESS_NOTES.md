# Role Awareness Notes

## Reporter
- can access Home and Report Issue
- should not see Defects, Manager, or Admin Audit
- should never be shown internal workflow actions

## Engineer
- can access Defects
- can act on ownership, next actions, and statuses
- cannot access Admin Audit

## Engineering Manager
- can access Manager
- can access Defects and operational actions
- cannot access Admin Audit unless also org admin

## Org Admin
- can access Admin Audit and all other areas

## UI rule
Hide inaccessible areas by default rather than teasing them unless there is a strong product reason to explain access boundaries.
