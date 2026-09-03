"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Message } from "@/types";

export default function InterviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [sendError, setSendError] = useState<string | null>(null);
  const [scoringError, setScoringError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const msgs = await api.getMessages(sessionId);
        setMessages(msgs);
      } catch {
        // Session may be fresh with no messages yet — that's fine
      } finally {
        setInitLoading(false);
      }
    }
    loadMessages();
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const content = input.trim();
    if (!content || loading || done) return;

    const optimisticMsg: Message = {
      id: `optimistic-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");
    setLoading(true);

    try {
      const { message: aiMessage, interview_complete } = await api.sendMessage(sessionId, content);
      setSendError(null);
      setMessages((prev) => [...prev, aiMessage]);
      if (interview_complete) setDone(true);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setInput(content);
      setSendError("Message failed to send. Your answer has been restored — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleViewReport() {
    setScoring(true);
    setScoringError(null);
    try {
      await api.generateReport(sessionId);
      router.push(`/report/${sessionId}`);
    } catch {
      setScoring(false);
      setScoringError("Could not generate report. Please try again.");
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight">
            Mock<span className="text-violet-400">Mate</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse inline-block" />
            Session active
          </span>
        </div>
        <div className="flex items-center gap-3">
          {scoringError && (
            <p className="text-xs text-red-400" role="alert">{scoringError}</p>
          )}
          {done && (
            <button
              onClick={handleViewReport}
              disabled={scoring}
              className={`
                rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-950
                ${scoring
                  ? "bg-violet-600/40 text-violet-300/60 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-500 active:scale-95 text-white hover:scale-105 shadow-lg shadow-violet-900/30"
                }
              `}
            >
              {scoring ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-300 border-t-transparent" />
                  Generating report…
                </span>
              ) : (
                "View Report →"
              )}
            </button>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">

          {/* Init loading skeleton */}
          {initLoading && (
            <div className="flex flex-col gap-4 py-8">
              {[1, 2].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <div className={`h-12 rounded-2xl animate-pulse bg-slate-800/70 ${i % 2 === 0 ? "w-2/3" : "w-3/4"}`} />
                </div>
              ))}
            </div>
          )}

          {!initLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-violet-900/40 border border-violet-700/40 flex items-center justify-center">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm font-medium">Your interview session is ready.</p>
              <p className="text-slate-600 text-xs">Type your first message to begin.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-3 text-sm whitespace-pre-wrap rounded-2xl leading-relaxed
                  ${msg.role === "user"
                    ? "bg-violet-600 text-white rounded-br-sm shadow-lg shadow-violet-900/20"
                    : "bg-slate-800/80 text-slate-100 rounded-bl-sm border border-slate-700/50"
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="inline-block h-2 w-2 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Send error */}
          {sendError && (
            <div className="flex justify-center" role="alert">
              <span className="rounded-xl border border-red-800/60 bg-red-900/20 px-5 py-2.5 text-xs text-red-400 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {sendError}
              </span>
            </div>
          )}

          {/* Interview complete banner */}
          {done && !loading && (
            <div className="flex justify-center py-4">
              <span className="rounded-full border border-violet-700/50 bg-violet-900/20 px-6 py-2.5 text-xs text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                Interview complete — click <span className="text-violet-400 font-semibold ml-1">View Report</span>&nbsp;to see your results
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      {!done && (
        <div className="flex-shrink-0 border-t border-slate-800/60 bg-slate-950 px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => { setInput(e.target.value); if (sendError) setSendError(null); }}
              onKeyDown={handleKeyDown}
              disabled={loading || initLoading}
              placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
              aria-label="Your interview answer"
              className="
                flex-1 resize-none rounded-xl border border-slate-700/60 bg-slate-900 px-4 py-3
                text-sm text-white placeholder-slate-500 leading-relaxed
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-200
              "
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading || initLoading}
              className={`
                flex-shrink-0 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-950
                ${input.trim() && !loading && !initLoading
                  ? "bg-violet-600 hover:bg-violet-500 active:scale-95 text-white cursor-pointer hover:scale-105 shadow-lg shadow-violet-900/30"
                  : "bg-violet-600/20 text-violet-400/40 cursor-not-allowed"
                }
              `}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
