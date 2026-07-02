"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError, apiRequest } from "@/lib/api";
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
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initializeSession() {
      const storedSession = loadStoredSession();

      if (!storedSession?.accessToken) {
        if (!cancelled) {
          setSession(null);
          setInitialized(true);
        }
        return;
      }

      try {
        const user = await apiRequest<AuthUser>("/users/me", {
          token: storedSession.accessToken,
        });

        if (cancelled) {
          return;
        }

        const hydratedSession = {
          accessToken: storedSession.accessToken,
          user,
        } satisfies AuthResponse;

        setSession(hydratedSession);
        storeSession(hydratedSession);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSession(null);

        if (error instanceof ApiError && error.status === 401) {
          clearStoredSession();
        }
      } finally {
        if (!cancelled) {
          setInitialized(true);
        }
      }
    }

    void initializeSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
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
    [initialized, session],
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
