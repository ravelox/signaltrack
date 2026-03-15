"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AppRole, CurrentUser } from "@/lib/auth/types";
import { signalTrackClient } from "@/lib/api/client";
import { mockCurrentUser } from "@/lib/auth/mock-user";
import { frontendEnv } from "@/lib/env";

type AuthContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: frontendEnv.useMockAuth ? mockCurrentUser : null,
  isLoading: !frontendEnv.useMockAuth
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: signalTrackClient.getAuthSession,
    enabled: !frontendEnv.useMockAuth,
    staleTime: 60_000,
    retry: 1
  });

  const user = frontendEnv.useMockAuth ? mockCurrentUser : (sessionQuery.data?.user ?? null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: frontendEnv.useMockAuth ? false : sessionQuery.isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useCurrentUser(): CurrentUser {
  const { user } = useContext(AuthContext);
  if (!user) {
    throw new Error("Current user unavailable.");
  }
  return user;
}

export function useAuthState(): AuthContextValue {
  return useContext(AuthContext);
}

export function useHasRole(role: AppRole): boolean {
  const user = useCurrentUser();
  return user.roles.includes(role);
}
