"use client";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuthState } from "@/providers/auth-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isSigningOut } = useAuthState();

  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <SidebarNav />
      <main className="min-w-0 p-5 md:p-7">{children}</main>
      {isSigningOut ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/15 bg-slate-900 px-6 py-5 text-center text-slate-100 shadow-2xl">
            <div className="text-lg font-semibold">Signing out</div>
            <div className="mt-2 text-sm text-slate-300">Ending your session and returning to the sign-in screen.</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
