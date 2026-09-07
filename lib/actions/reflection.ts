import { api } from "@/lib/api/client";
export async function saveWeeklyReflectionAction(input: unknown): Promise<any> { return { success: true, data: await api.post<any>("/api/reflections", input) }; }
export async function getWeeklyReflectionHistoryAction(limit = 20, offset = 0): Promise<any> { return { success: true, data: await api.get<any>(`/api/reflections?limit=${limit}&offset=${offset}`) }; }
export async function getShishyaReflectionForGuruAction(shishyaId: string, weekStartDate: string): Promise<any> { return api.get<any>(`/api/reflections/guru/${shishyaId}?weekStartDate=${weekStartDate}`); }
export async function getShishyaReflectionHistoryForGuruAction(shishyaId: string, limit = 20, offset = 0): Promise<any> { return api.get<any>(`/api/reflections/guru/${shishyaId}?limit=${limit}&offset=${offset}`); }
