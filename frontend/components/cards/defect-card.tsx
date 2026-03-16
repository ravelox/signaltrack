import Link from "next/link";
import { StatusChip } from "@/components/status/status-chip";
import { RiskBadge } from "@/components/status/risk-badge";
import type { DefectListRow } from "@/lib/types";

export function DefectCard({ defect }: { defect: DefectListRow }) {
  return (
    <Link href={`/defects/${defect.id}`} className="block rounded-2xl border border-line bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{defect.key}</div>
          <div className="mt-1 text-sm">{defect.externalSummary}</div>
        </div>
        <RiskBadge kind={defect.riskKind}>{defect.riskLabel}</RiskBadge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusChip kind="reporter">{defect.reporterStatus}</StatusChip>
        <StatusChip kind="internal">{defect.internalStatus}</StatusChip>
      </div>
      <div className="mt-3 text-sm text-muted">Owner: {defect.owner}</div>
      <div className="mt-1 text-sm text-muted">Next action: {defect.nextAction}</div>
    </Link>
  );
}
