"use client";

import { useAuthState } from "@/providers/auth-provider";
import { hasAnyRole } from "@/lib/permissions";
import type { AppRole } from "@/lib/auth/types";
import { EmptyState } from "@/components/states/empty-state";

export function Guard({
  allow,
  children
}: {
  allow: AppRole[];
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuthState();

  if (isLoading) return null;
  if (!user) {
    return (
      <EmptyState
        title="Authentication required"
        description="Sign in to access this area."
      />
    );
  }

  if (!hasAnyRole(user.roles, allow)) {
    return (
      <EmptyState
        title="You do not have access to this area"
        description="This screen is hidden because your current role does not include the required permissions."
      />
    );
  }

  return <>{children}</>;
}
