"use client";

import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppRole, CurrentUser } from "@/lib/auth/types";
import type { LoginInput } from "@/lib/types";
import { signalTrackClient } from "@/lib/api/client";

type AuthContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  isSigningOut: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isSigningOut: false,
  login: async () => undefined,
  logout: async () => undefined
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: signalTrackClient.getAuthSession,
    staleTime: 60_000,
    retry: 1
  });

  const user = sessionQuery.data?.user ?? null;

  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => signalTrackClient.login(input),
    onSuccess: async (session) => {
      queryClient.setQueryData(["auth", "session"], session);
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => signalTrackClient.logout(),
    onSuccess: async () => {
      queryClient.setQueryData(["auth", "session"], { user: null });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: sessionQuery.isLoading || loginMutation.isPending || logoutMutation.isPending,
        isSigningOut: logoutMutation.isPending,
        login: async (input) => {
          await loginMutation.mutateAsync(input);
        },
        logout: async () => {
          await logoutMutation.mutateAsync();
        }
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
