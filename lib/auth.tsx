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
import { insforge, isInsForgeAvailable } from "./insforge";

interface AuthContextValue {
  user: UserSchema | null;
  /** True while the session is being rehydrated on cold load. */
  authLoading: boolean;
  /** Re-read the current session (call after sign-in / sign-up). */
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  signInLocal: (email: string, name?: string) => void;
}

const LOCAL_USER_KEY = "aurelia-user";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSchema | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const readLocalUser = (): UserSchema | null => {
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const refresh = useCallback(async () => {
    if (isInsForgeAvailable) {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (!error && data?.user) {
          setUser(data.user);
          setAuthLoading(false);
          return;
        }
      } catch {
        // Backend unavailable, fallback to local storage
      }
    }
    setUser(readLocalUser());
    setAuthLoading(false);
  }, []);

  // Rehydrates session immediately
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isInsForgeAvailable) {
        try {
          const { data, error } = await insforge.auth.getCurrentUser();
          if (cancelled) return;
          if (!error && data?.user) {
            setUser(data.user);
            setAuthLoading(false);
            return;
          }
        } catch {
          // Fall through
        }
      }
      if (cancelled) return;
      setUser(readLocalUser());
      setAuthLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signInLocal = useCallback((email: string, name?: string) => {
    const localUser: UserSchema = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: email.trim(),
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: { name: name?.trim() || email.split("@")[0] },
      metadata: null,
    };
    try {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    } catch {
      // storage unavailable
    }
    setUser(localUser);
  }, []);

  const signOut = useCallback(async () => {
    if (isInsForgeAvailable) {
      try {
        const { error } = await insforge.auth.signOut();
        if (error) console.error("signOut failed:", error.message);
      } catch {
        // Ignore network error on signOut
      }
    }
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
    } catch {
      // Ignore
    }
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, authLoading, refresh, signOut, signInLocal }),
    [user, authLoading, refresh, signOut, signInLocal]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

