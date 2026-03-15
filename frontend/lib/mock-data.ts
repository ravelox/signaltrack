import type { AuditEvent, DefectDetail, DefectListRow, ManagerOverview } from "@/lib/types";

export const defects: DefectListRow[] = [
  {
    id: "00000000-0000-0000-0000-000000000102",
    key: "DEF-102",
    externalSummary: "Export fails for large CSV files",
    reporterStatus: "Investigating",
    internalStatus: "Under investigation",
    owner: "Kim",
    nextAction: "Verify logs by Tue",
    riskKind: "medium",
    riskLabel: "Overdue soon"
  },
  {
    id: "00000000-0000-0000-0000-000000000117",
    key: "DEF-117",
    externalSummary: "Login loop after password reset",
    reporterStatus: "Received",
    internalStatus: "New",
    owner: "—",
    nextAction: "—",
    riskKind: "high",
    riskLabel: "Unowned"
  }
];

export const defectDetailsById: Record<string, DefectDetail> = {
  "DEF-102": {
    id: "00000000-0000-0000-0000-000000000102",
    key: "DEF-102",
    externalSummary: "Export fails for large CSV files",
    reporterStatus: "Investigating",
    internalStatus: "Under investigation",
    externalSummaryText: "Users are unable to export large CSV reports. The issue is user-visible and blocks downstream reporting tasks.",
    internalSummaryText: "Likely timeout path in export worker. Need logs and request size samples.",
    owner: "Kim",
    nextAction: "Verify logs by Tue",
    severity: 2,
    urgency: 3,
    evidenceGap: 1,
    stalled: false,
    evidence: [
      { name: "browser_console.txt", meta: "Uploaded 2h ago" },
      { name: "timeout-screenshot.png", meta: "Uploaded 2h ago" }
    ],
    timeline: [
      { title: "Evidence added", subtitle: "Engineer attached logs and screenshot" },
      { title: "Next action created", subtitle: "Verify logs by Tuesday 2:00 PM" },
      { title: "Accountable owner changed", subtitle: "Assigned to Kim" }
    ],
    linkedReport: {
      title: "Reporter described export timeout after choosing quarter-end data",
      meta: "Impact: Blocking"
    },
    ownerOptions: [
      { id: "u_kim", label: "Kim" },
      { id: "u_lee", label: "Lee" },
      { id: "u_sam", label: "Sam" }
    ]
  }
};

export const managerData: ManagerOverview = {
  metrics: {
    activeDefects: 42,
    overdueNextActions: 8,
    stalledDefects: 5,
    unowned: 3
  },
  workload: [
    { owner: "Kim", defects: 12, weight: 26 },
    { owner: "Lee", defects: 10, weight: 21 }
  ],
  stalled: [
    { key: "DEF-201", title: "Sync issue", owner: "Kim", lastMove: "5d ago", badgeKind: "high", badgeLabel: "Stalled" }
  ],
  overdue: [
    { key: "DEF-111", title: "Capture logs", owner: "Lee", due: "Yesterday" }
  ]
};

export const auditEvents: AuditEvent[] = [
  {
    id: "evt_001",
    at: "2026-03-14T10:00:00Z",
    actor: "Kim Example",
    eventType: "next_action.created",
    entityType: "next_action",
    entityId: "na_001",
    summary: "Created next action for DEF-102"
  },
  {
    id: "evt_002",
    at: "2026-03-14T09:00:00Z",
    actor: "Lee Example",
    eventType: "accountable_owner.changed",
    entityType: "defect",
    entityId: "DEF-102",
    summary: "Reassigned accountable owner"
  }
];
