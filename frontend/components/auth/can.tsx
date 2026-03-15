"use client";

import { useAuthState } from "@/providers/auth-provider";
import { actionPermissions, hasAnyRole } from "@/lib/permissions";

export function Can({
  action,
  children,
  fallback = null
}: {
  action: keyof typeof actionPermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user, isLoading } = useAuthState();
  if (isLoading || !user) return <>{fallback}</>;
  return hasAnyRole(user.roles, actionPermissions[action]) ? <>{children}</> : <>{fallback}</>;
}
