import type { Message, ScoreReport, Session } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export const api = {
  createSession: (track: string, difficulty: string) =>
    request<Session>("/sessions", {
      method: "POST",
      body: JSON.stringify({ track, difficulty }),
    }),

  getMessages: (sessionId: string) =>
    request<Message[]>(`/sessions/${sessionId}/messages`),

  sendMessage: (sessionId: string, content: string) =>
    request<{ message: Message; interview_complete: boolean }>(
      `/sessions/${sessionId}/messages`,
      { method: "POST", body: JSON.stringify({ content }) }
    ),

  generateReport: (sessionId: string) =>
    request<ScoreReport>(`/sessions/${sessionId}/score`, { method: "POST" }),
};
