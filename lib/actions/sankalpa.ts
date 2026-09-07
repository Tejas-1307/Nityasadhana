import { api } from "@/lib/api/client";
export async function getActiveSankalpaAction(): Promise<any> { return { success: true, data: await api.get<any>("/api/sankalpas/active") }; }
export async function createSankalpaAction(input: unknown): Promise<any> { return { success: true, data: await api.post<any>("/api/sankalpas", input) }; }
export async function getSankalpaHistoryAction(limit = 20, offset = 0): Promise<any> { return { success: true, data: await api.get<any>(`/api/sankalpas/history?limit=${limit}&offset=${offset}`) }; }
export async function saveSankalpaReflectionAction(input: any): Promise<any> { return { success: true, data: await api.post<any>(`/api/sankalpas/${input.sankalpaId}/reflection`, input) }; }
export async function cancelSankalpaAction(input: any): Promise<any> { return api.patch<any>(`/api/sankalpas/${input.sankalpaId}/cancel`); }
export async function getShishyaActiveSankalpaForGuruAction(shishyaId: string): Promise<any> { return api.get<any>(`/api/sankalpas/guru/${shishyaId}/active`); }
export async function getShishyaSankalpaHistoryForGuruAction(shishyaId: string, limit = 20, offset = 0): Promise<any> { return api.get<any>(`/api/sankalpas/guru/${shishyaId}/history?limit=${limit}&offset=${offset}`); }
