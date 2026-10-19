"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserSchema } from "@insforge/sdk";
import { insforge } from "./insforge";

interface AuthContextValue {
  user: UserSchema | null;
  /** True while the session is being rehydrated on cold load. */
  authLoading: boolean;
  /** Re-read the current session (call after sign-in / sign-up). */
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSchema | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await insforge.auth.getCurrentUser();
    setUser(error ? null : (data?.user ?? null));
    setAuthLoading(false);
  }, []);

  // getCurrentUser() rehydrates the session asynchronously on cold load —
  // keep authLoading true until it resolves.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (cancelled) return;
      setUser(error ? null : (data?.user ?? null));
      setAuthLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await insforge.auth.signOut();
    if (error) console.error("signOut failed:", error.message);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, authLoading, refresh, signOut }),
    [user, authLoading, refresh, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
