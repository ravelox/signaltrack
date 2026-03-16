"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useAuthState } from "@/providers/auth-provider";
import { hasAnyRole, routePermissions } from "@/lib/permissions";
import { appVersion } from "@/lib/app-version";
import { Button } from "@/components/ui/button";

const items = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report Issue" },
  { href: "/reports", label: "Reported Issues" },
  { href: "/defects", label: "Defects" },
  { href: "/manager", label: "Manager" },
  { href: "/admin/audit", label: "Admin Audit" }
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isSigningOut, logout } = useAuthState();

  if (isSigningOut) {
    return (
      <aside className="hidden bg-slate-900 px-5 py-6 text-slate-200 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold text-white">S</div>
          <div>
            <div className="font-semibold">SignalTrack</div>
            <div className="text-xs text-slate-400">Phase Bundle {appVersion}</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 p-4 text-sm text-slate-300">
          <div className="font-semibold text-slate-100">Signing out</div>
          <div className="mt-1">Ending your session.</div>
        </div>
      </aside>
    );
  }

  if (isLoading || !user) {
    return (
      <aside className="hidden bg-slate-900 px-5 py-6 text-slate-200 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold text-white">S</div>
          <div>
            <div className="font-semibold">SignalTrack</div>
            <div className="text-xs text-slate-400">Phase Bundle {appVersion}</div>
          </div>
        </div>
      </aside>
    );
  }

  const visibleItems = items.filter((item) => hasAnyRole(user.roles, routePermissions[item.href as keyof typeof routePermissions] ?? []));

  const handleLogout = async () => {
    await logout();
    window.location.assign("/?signed_out=1");
  };

  return (
    <aside className="hidden bg-slate-900 px-5 py-6 text-slate-200 lg:block">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold text-white">S</div>
        <div>
          <div className="font-semibold">SignalTrack</div>
          <div className="text-xs text-slate-400">Phase Bundle {appVersion}</div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 p-4 text-sm">
        <div className="font-semibold">{user.displayName}</div>
        <div className="mt-1 text-slate-400">{user.email}</div>
        <div className="mt-1 text-slate-400">{user.roles.join(" · ")}</div>
        <Button
          variant="ghost"
          className="mt-4 w-full border border-white/10 text-slate-200"
          onClick={() => void handleLogout()}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Signing out..." : "Sign out"}
        </Button>
      </div>

      <div className="mt-8 text-xs uppercase tracking-[0.18em] text-slate-400">Navigation</div>
      <nav className="mt-3 flex flex-col gap-2">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-xl px-4 py-3 text-sm font-medium transition",
              pathname === item.href ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800/70"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 text-xs text-slate-500">Frontend {appVersion}</div>
    </aside>
  );
}
