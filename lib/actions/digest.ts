import { api } from "@/lib/api/client";

export async function getGuruWeeklyDigestAction(): Promise<any> {
  return { success: true, data: await api.get("/api/dashboard/summary") };
}
