import { api } from "@/lib/api/client";
export async function getNotificationsAction(limit = 20, offset = 0): Promise<any> { return { success: true, data: await api.get<any>(`/api/notifications?limit=${limit}&offset=${offset}`) }; }
export async function markNotificationReadAction(id: string): Promise<any> { return api.patch<any>(`/api/notifications/${id}/read`); }
export async function markAllNotificationsReadAction(): Promise<any> { return api.post<any>("/api/notifications/read-all"); }
export async function getNotificationPreferencesAction(): Promise<any> { const data = await api.get<any>("/api/notifications"); return { success: true, data: data.preferences }; }
export async function updateNotificationPreferencesAction(input: unknown): Promise<any> { return { success: true, data: await api.patch<any>("/api/notifications/preferences", input) }; }
