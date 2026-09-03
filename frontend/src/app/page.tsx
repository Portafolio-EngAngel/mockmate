"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Track, Difficulty } from "@/types";

const TRACKS: { id: Track; label: string; icon: string; description: string }[] = [
  {
    id: "backend",
    label: "Backend Engineering",
    icon: "⚙",
    description: "REST APIs, databases, caching, auth, and system reliability",
  },
  {
    id: "system_design",
    label: "System Design",
    icon: "◈",
    description: "Design scalable, distributed systems from scratch",
  },
  {
    id: "security",
    label: "Security Engineering",
    icon: "◉",
    description: "OWASP, vulnerabilities, cryptography, and secure architecture",
  },
];

const DIFFICULTIES: { id: Difficulty; label: string; subtitle: string }[] = [
  { id: "junior", label: "Junior", subtitle: "0–2 years" },
  { id: "mid", label: "Mid", subtitle: "2–5 years" },
  { id: "senior", label: "Senior", subtitle: "5+ years" },
];

export default function LandingPage() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canStart = selectedTrack !== null && selectedDifficulty !== null && !loading;

  async function handleStart() {
    if (!selectedTrack || !selectedDifficulty) return;
    setLoading(true);
    setError(null);
    try {
      const session = await api.createSession(selectedTrack, selectedDifficulty);
      router.push(`/interview/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start interview. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* Navbar */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">
              Mock<span className="text-violet-400">Mate</span>
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono tracking-widest uppercase hidden sm:block">
            AI Interview Simulator
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-950 via-violet-950/30 to-slate-950 pt-20 pb-10 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-violet-900/40 text-violet-400 border border-violet-700/50 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6">
            AI-Powered Practice
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
            Mock<span className="text-violet-400">Mate</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Simulate real technical interviews with an AI interviewer. Select your track, set your level, and perform under authentic conditions.
          </p>
        </div>
      </section>

      {/* Main form */}
      <main className="flex-1 px-4 pb-20 pt-10">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">

          {/* Track Selection */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Select a Track
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TRACKS.map((track) => {
                const isSelected = selectedTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track.id)}
                    className={`
                      rounded-xl border p-5 text-left transition-all duration-200
                      hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/20
                      focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-950
                      ${isSelected
                        ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-900/20"
                        : "border-slate-800 bg-slate-900 hover:border-violet-700/50 hover:bg-slate-900/80"
                      }
                    `}
                  >
                    <span className={`text-2xl mb-3 block font-mono ${isSelected ? "text-violet-400" : "text-slate-500"}`}>
                      {track.icon}
                    </span>
                    <p className={`font-semibold text-sm mb-1.5 ${isSelected ? "text-violet-300" : "text-white"}`}>
                      {track.label}
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed">{track.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Experience Level
            </h2>
            <div className="flex flex-row gap-3 flex-wrap">
              {DIFFICULTIES.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`
                      flex flex-col items-center rounded-xl border px-8 py-4 transition-all duration-200
                      hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/20
                      focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-950
                      ${isSelected
                        ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-900/20"
                        : "border-slate-800 bg-slate-900 hover:border-violet-700/50"
                      }
                    `}
                  >
                    <span className={`font-semibold text-sm ${isSelected ? "text-violet-300" : "text-white"}`}>
                      {diff.label}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 font-mono">{diff.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-800/60 bg-red-900/20 px-5 py-4 text-sm text-red-400 flex items-start gap-3" role="alert">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`
              w-full rounded-xl py-4 font-semibold text-base transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-950
              ${canStart
                ? "bg-violet-600 hover:bg-violet-500 active:scale-95 hover:scale-[1.01] text-white cursor-pointer shadow-lg shadow-violet-900/30"
                : "bg-violet-600/20 text-violet-400/40 cursor-not-allowed"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-violet-300 border-t-transparent animate-spin" />
                Initializing session…
              </span>
            ) : (
              "Begin Interview Session →"
            )}
          </button>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-600">
            MockMate simulates real technical interview conditions using AI. Sessions are not stored permanently.
          </p>
        </div>
      </main>
    </div>
  );
}
