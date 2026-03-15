# Forms and Validation Notes

## What this pass adds
- client-side schemas for key workflows
- reusable validation summary
- field-level error presentation
- positive mutation feedback
- operational forms on defect detail

## Included workflow forms
- Report Issue
- Change owner
- Create next action
- Update statuses

## Recommended next move
Connect these forms to real backend responses and add:
1. server-returned field error mapping
2. broader optimistic updates where safe beyond the current defect detail actions
3. disabled states tied to permissions
4. modal or drawer presentation if the action density on defect detail becomes too high
