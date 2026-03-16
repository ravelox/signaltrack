"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

export default function SignedOutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Session ended"
        title="You have been signed out"
        description="Your session was closed successfully."
      />

      <Panel className="mx-auto max-w-2xl p-6">
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            You are no longer signed in to SignalTrack.
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/">
              <Button>Return to sign in</Button>
            </Link>
          </div>
        </div>
      </Panel>
    </div>
  );
}
