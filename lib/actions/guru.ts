import { api } from "@/lib/api/client";
export async function getGuruDashboardOverviewAction(): Promise<any> { return { success: true, data: await api.get<any>("/api/guru-dashboard") }; }
export async function getGuruShishyaDetailAction(shishyaId: string): Promise<any> { return { success: true, data: await api.get<any>(`/api/guru/shishyas/${shishyaId}`) }; }
export async function getGuruShishyaReportHistoryAction(shishyaId: string, limit = 20, offset = 0): Promise<any> { return { success: true, data: await api.get<any>(`/api/guru/shishyas/${shishyaId}/reports?limit=${limit}&offset=${offset}`) }; }
export async function getGuruShishyaReportDetailAction(shishyaId: string, reportId: string): Promise<any> { return { success: true, data: await api.get<any>(`/api/guru/shishyas/${shishyaId}/reports/${reportId}`) }; }
export async function addGuruFollowUpAction(input: any): Promise<any> { return { success: true, data: await api.post<any>("/api/guru/follow-ups", input) }; }
export async function toggleFollowUpCompletedAction(input: any): Promise<any> { return { success: true, data: await api.patch<any>(`/api/guru/follow-ups/${input.followUpId}?completed=${input.completed}`) }; }
export async function addGuruPrivateNoteAction(input: any): Promise<any> { return { success: true, data: await api.post<any>("/api/guru/notes", input) }; }
export async function deleteGuruPrivateNoteAction(input: any): Promise<any> { return { success: true, data: await api.delete<any>(`/api/guru/notes/${input.noteId}`) }; }
