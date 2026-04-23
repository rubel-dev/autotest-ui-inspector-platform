import type { AuthResponse, User } from "@/types/api";

const tokenKey = "autotest.accessToken";
const userKey = "autotest.user";

export function saveSession(auth: AuthResponse) {
  localStorage.setItem(tokenKey, auth.access_token);
  localStorage.setItem(userKey, JSON.stringify(auth.user));
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(tokenKey);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(userKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
}
