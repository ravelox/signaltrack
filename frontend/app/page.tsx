"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/cards/metric-card";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthState } from "@/providers/auth-provider";

export default function HomePage() {
  const { user, isLoading, login } = useAuthState();
  const [email, setEmail] = useState("admin@signaltrack.local");
  const [password, setPassword] = useState("change-me-admin");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      await login({ email, password });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SignalTrack v1"
        title={user ? "Home" : "Sign in"}
        description={
          user
            ? "This bundle closes out the current frontend phase with permissions, role awareness, admin audit, and responsive queue patterns."
            : "Sign in with the seeded local admin account to use the live backend."
        }
      />

      {!user ? (
        <Panel className="mx-auto max-w-xl p-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold">Default admin</div>
              <div className="mt-1 text-sm text-muted">A local admin user is created during backend migration.</div>
            </div>

            <div className="space-y-3">
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
              />
            </div>

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <Button onClick={submit} disabled={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </Panel>
      ) : null}

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
