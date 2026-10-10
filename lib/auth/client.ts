"use client";

import { api, ApiUser, AuthResponse } from "@/lib/api/client";

const USER_KEY = "nityasadhana_user";
const TOKEN_KEY = "nityasadhana_token";
const SESSION_COOKIE = "nityasadhana_session";

function setSessionState(token: string, user: ApiUser) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  window.sessionStorage.setItem(TOKEN_KEY, token);

  const isHttps = window.location.protocol === "https:";
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax; ${isHttps ? "Secure;" : ""}`;
}

function clearSessionState() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax;`;
}

export function getCachedUser(): ApiUser | null {
  if (typeof window === "undefined") return null;
  const value = window.sessionStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) as ApiUser : null;
}

export async function login(email: string, password: string): Promise<ApiUser> {
  const result = await api.post<AuthResponse>("/api/auth/session", { email, password });
  setSessionState(result.access_token, result.user);
  return result.user;
}

export async function register(input: { name: string; email: string; password: string; role: "guru" | "shishya" }): Promise<ApiUser> {
  const result = await api.post<AuthResponse>("/api/auth/register", input);
  setSessionState(result.access_token, result.user);
  return result.user;
}

export async function logout(): Promise<void> {
  await api.post<void>("/api/auth/logout").catch(() => undefined);
  clearSessionState();
}