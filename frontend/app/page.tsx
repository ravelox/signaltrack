import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/cards/metric-card";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/providers/auth-provider";

export default function HomePage() {
  // Note: server component would normally not call client hook; left as static copy for scaffold clarity.
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SignalTrack v1"
        title="Home"
        description="This bundle closes out the current frontend phase with permissions, role awareness, admin audit, and responsive queue patterns."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Role-aware routes" value="Ready" />
        <MetricCard label="Role-gated actions" value="Ready" />
        <MetricCard label="Admin scaffold" value="Added" />
        <MetricCard label="Responsive queue" value="Added" />
      </div>

      <Panel className="p-6">
        <h2 className="text-xl font-semibold">Phase completion bundle</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          The remaining structural pieces for this phase are now bundled together so the next phase can focus on deeper backend connection and polish.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/report"><Button>Open Report Issue</Button></Link>
          <Link href="/defects"><Button variant="secondary">Open Defects</Button></Link>
          <Link href="/manager"><Button variant="secondary">Open Manager</Button></Link>
          <Link href="/admin/audit"><Button variant="secondary">Open Admin Audit</Button></Link>
        </div>
      </Panel>
    </div>
  );
}
