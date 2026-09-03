export type Track = "backend" | "system_design" | "security";
export type Difficulty = "junior" | "mid" | "senior";
export type SessionStatus = "active" | "completed";

export interface Session {
  id: string;
  track: Track;
  difficulty: Difficulty;
  status: SessionStatus;
  created_at: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface TopicScore {
  topic: string;
  score: number;
  feedback: string;
}

export interface ScoreReport {
  session_id: string;
  track: string;
  difficulty: string;
  messages: Message[];
  score: {
    overall_score: number;
    recommendation: string;
    strengths: string[];
    improvements: string[];
    topic_scores: TopicScore[];
  };
}

export interface ChatResponse {
  message: Message;
  interview_complete: boolean;
}
