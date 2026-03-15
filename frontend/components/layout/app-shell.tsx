import { SidebarNav } from "@/components/layout/sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <SidebarNav />
      <main className="min-w-0 p-5 md:p-7">{children}</main>
    </div>
  );
}
