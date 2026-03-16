import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

export default async function ReportSubmittedPage({
  searchParams
}: {
  searchParams?: Promise<{ id?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const reportId = resolvedSearchParams?.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reporter flow"
        title="Issue submitted"
        description="Your report has been recorded and handed off into the SignalTrack workflow."
      />

      <Panel className="mx-auto max-w-3xl p-8">
        <div className="space-y-4">
          <div className="text-lg font-semibold">Submission complete</div>
          <p className="text-sm text-muted">
            {reportId
              ? `Report ${reportId} was created successfully.`
              : "Your report was created successfully."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/">
              <Button>Back to home</Button>
            </Link>
            <Link href="/report">
              <Button variant="secondary">Submit another issue</Button>
            </Link>
          </div>
        </div>
      </Panel>
    </div>
  );
}
