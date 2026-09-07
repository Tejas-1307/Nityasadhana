"use client";

import { api, ApiUser, AuthResponse } from "@/lib/api/client";

const USER_KEY = "nityasadhana_user";

export function getCachedUser(): ApiUser | null {
  if (typeof window === "undefined") return null;
  const value = window.sessionStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) as ApiUser : null;
}

export async function login(email: string, password: string): Promise<ApiUser> {
  const result = await api.post<AuthResponse>("/api/auth/session", { email, password });
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(result.user));
  return result.user;
}

export async function register(input: { name: string; email: string; password: string; role: "guru" | "shishya" }): Promise<ApiUser> {
  const result = await api.post<AuthResponse>("/api/auth/register", input);
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(result.user));
  return result.user;
}

export async function logout(): Promise<void> {
  await api.post<void>("/api/auth/logout").catch(() => undefined);
  window.sessionStorage.removeItem(USER_KEY);
}