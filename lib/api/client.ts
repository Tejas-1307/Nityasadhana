const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    if (isJson) {
      const body = (await response.json().catch(() => null)) as { detail?: string; message?: string } | null;
      if (body?.detail) message = body.detail;
      else if (body?.message) message = body.message;
    } else {
      const text = await response.text().catch(() => "");
      if (text.trim()) message = text.trim();
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  if (!isJson) {
    const text = await response.text().catch(() => "");
    throw new Error(`Expected JSON response from ${path} but received: ${text.slice(0, 100)}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: "guru" | "shishya";
  status: string;
};

export type AuthResponse = { access_token: string; token_type: string; user: ApiUser };