import type { AuthUser } from "@/src/features/auth/types/auth";

const ACCESS_TOKEN_KEY = "tennjor_admin_access_token";
const AUTH_USER_KEY = "tennjor_admin_user";

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveAccessToken(token: string) {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function loadAccessToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function saveAuthUser(user: AuthUser) {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function loadAuthUser(): AuthUser | null {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    clearAuthUser();
    return null;
  }
}

export function clearAuthUser() {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_USER_KEY);
}

export function clearAuthStorage() {
  clearAccessToken();
  clearAuthUser();
}
