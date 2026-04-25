import type { AuthResponse } from "./types";

const AUTH_STORAGE_KEY = "agendamento-saas.session";

export function loadStoredSession(): AuthResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthResponse;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function storeSession(session: AuthResponse) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
