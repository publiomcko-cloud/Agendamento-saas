"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiRequest } from "@/lib/api";
import {
  clearStoredSession,
  loadStoredSession,
  storeSession,
} from "@/lib/auth-storage";
import type { AuthResponse, AuthUser } from "@/lib/types";

type AuthContextValue = {
  initialized: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(() =>
    loadStoredSession(),
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized: true,
      token: session?.accessToken ?? null,
      user: session?.user ?? null,
      async login(email: string, password: string) {
        const authResponse = await apiRequest<AuthResponse>("/auth/login", {
          method: "POST",
          body: { email, password },
        });

        setSession(authResponse);
        storeSession(authResponse);

        return authResponse;
      },
      logout() {
        setSession(null);
        clearStoredSession();
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  }

  return context;
}
