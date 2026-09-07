import { api } from "@/lib/api/client";
export async function getTodayReportDataAction(): Promise<any> { return { success: true, data: await api.get<any>("/api/reports/today") }; }
export async function saveReportDraftAction(input: unknown): Promise<any> { return { success: true, data: await api.post<any>("/api/reports?submit=false", input) }; }
export async function submitDailyReportAction(input: unknown): Promise<any> { return { success: true, data: await api.post<any>("/api/reports?submit=true", input) }; }
export async function getReportHistoryDataAction(limit = 20, offset = 0): Promise<any> { return { success: true, data: await api.get<any>(`/api/reports/history?limit=${limit}&offset=${offset}`) }; }
export async function getReportDetailDataAction(reportId: string): Promise<any> { return { success: true, data: await api.get<any>(`/api/reports/${reportId}`) }; }
export async function getStudentDashboardDataAction(): Promise<any> { return { success: true, data: await api.get<any>("/api/reports/dashboard") }; }
export async function getStudentJourneyDataAction(rangeDays: 7 | 30 = 7): Promise<any> { return { success: true, data: await api.get<any>(`/api/reports/journey?rangeDays=${rangeDays}`) }; }
