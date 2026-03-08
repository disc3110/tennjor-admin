"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/src/features/auth/services/auth-service";
import {
  clearAuthStorage,
  loadAccessToken,
  loadAuthUser,
  saveAccessToken,
  saveAuthUser,
} from "@/src/features/auth/storage/auth-storage";
import type { AuthUser, LoginPayload } from "@/src/features/auth/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => loadAuthUser());
  const [token, setToken] = useState<string | null>(() => loadAccessToken());
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);

      saveAccessToken(response.accessToken);
      saveAuthUser(response.user);
      setToken(response.accessToken);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      signIn,
      signOut,
    }),
    [isLoading, signIn, signOut, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
