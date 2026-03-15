import Link from "next/link";
import { DataTable } from "@/components/data/table";
import { DefectCard } from "@/components/cards/defect-card";
import { StatusChip } from "@/components/status/status-chip";
import { RiskBadge } from "@/components/status/risk-badge";
import type { DefectListRow } from "@/lib/types";

export function DefectTable({ defects }: { defects: DefectListRow[] }) {
  return (
    <>
      <DataTable
        header={
          <div className="grid grid-cols-[100px_2fr_1.15fr_1.2fr_100px_1.3fr_110px] gap-3 border-b border-line px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            <div>Key</div>
            <div>External Summary</div>
            <div>Reporter Status</div>
            <div>Internal Status</div>
            <div>Owner</div>
            <div>Next Action</div>
            <div>Risk</div>
          </div>
        }
        rows={
          <>
            {defects.map((defect) => (
              <Link
                key={defect.key}
                href={`/defects/${defect.key}`}
                className="grid grid-cols-[100px_2fr_1.15fr_1.2fr_100px_1.3fr_110px] gap-3 border-b border-line px-4 py-4 text-sm hover:bg-slate-50"
              >
                <div className="font-semibold">{defect.key}</div>
                <div>{defect.externalSummary}</div>
                <div><StatusChip kind="reporter">{defect.reporterStatus}</StatusChip></div>
                <div><StatusChip kind="internal">{defect.internalStatus}</StatusChip></div>
                <div>{defect.owner}</div>
                <div>{defect.nextAction}</div>
                <div><RiskBadge kind={defect.riskKind}>{defect.riskLabel}</RiskBadge></div>
              </Link>
            ))}
          </>
        }
      />
      <div className="space-y-3 p-4 md:hidden">
        {defects.map((defect) => (
          <DefectCard key={defect.key} defect={defect} />
        ))}
      </div>
    </>
  );
}
