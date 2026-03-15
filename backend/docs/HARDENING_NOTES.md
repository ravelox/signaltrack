# Hardening Notes

This pass tightened the v1 bundle in four main ways:

1. Transaction propagation
   - repositories now resolve an executor from AsyncLocalStorage
   - unit-of-work injects the active transaction into the async context

2. Frozen dual-status alignment
   - defects persist both reporter_status and internal_status
   - create-defect defaults are wired consistently

3. OIDC state handling
   - begin-login persists state/nonce
   - callback validation consumes state exactly once

4. Evidence upload handshake
   - signed upload URL service added
   - API route included for upload initiation
