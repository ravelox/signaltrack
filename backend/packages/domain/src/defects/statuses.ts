export const reporterStatuses = [
  "received",
  "investigating",
  "need_more_info",
  "believed_fixed",
  "resolved"
] as const;

export const internalStatuses = [
  "new",
  "needs_clarification",
  "under_investigation",
  "fix_proposed",
  "validation_pending",
  "resolved",
  "archived"
] as const;

export type ReporterStatus = typeof reporterStatuses[number];
export type InternalStatus = typeof internalStatuses[number];
