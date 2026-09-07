import { api } from "@/lib/api/client";

export async function endMentorshipAction(shishyaId: string): Promise<any> { return api.post(`/api/relationships/${shishyaId}/end`); }
export async function getGuruShishyasDataAction(): Promise<any> { return api.get("/api/relationships/guru"); }
export async function getShishyaGuruDataAction(): Promise<any> { return api.get("/api/relationships/shishya"); }
