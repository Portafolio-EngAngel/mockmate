"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import type { ScoreReport } from "@/types";

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function barColor(score: number): string {
  if (score >= 8) return "bg-emerald-500";
  if (score >= 6) return "bg-amber-500";
  return "bg-red-500";
}

function barTextColor(score: number): string {
  if (score >= 8) return "text-emerald-400";
  if (score >= 6) return "text-amber-400";
  return "text-red-400";
}

function recommendationStyle(rec: string): { border: string; text: string; bg: string } {
  const lower = rec.toLowerCase();
  if (lower.includes("strong hire")) return { border: "border-emerald-600", text: "text-emerald-400", bg: "bg-emerald-500/10" };
  if (lower.includes("hire")) return { border: "border-blue-600", text: "text-blue-400", bg: "bg-blue-500/10" };
  return { border: "border-red-600", text: "text-red-400", bg: "bg-red-500/10" };
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [report, setReport] = useState<ScoreReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await api.generateReport(sessionId);
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report.");
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <span className="inline-block h-12 w-12 rounded-full border-2 border-slate-800" />
          <span className="absolute inset-0 inline-block h-12 w-12 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
        <div className="text-center">
          <p className="text-slate-300 text-sm font-medium">Generating your performance report…</p>
          <p className="text-slate-600 text-xs mt-1">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-14 h-14 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-red-400 text-sm font-medium" role="alert">{error ?? "Report not available."}</p>
          <p className="text-slate-500 text-xs max-w-xs mt-2">The report could not be loaded. This may happen if the session expired.</p>
        </div>
        <Link href="/" className="rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm px-5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 rounded">
          ← Start a new interview
        </Link>
      </div>
    );
  }

  const { score } = report;
  const recStyle = recommendationStyle(score.recommendation);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* Navbar */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight">
              Mock<span className="text-violet-400">Mate</span>
            </span>
            <span className="text-slate-600 text-sm font-normal ml-2">/ Interview Report</span>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-violet-400 transition-colors duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 rounded px-2 py-1"
          >
            ← New Interview
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">

          {/* Score Hero Card */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-violet-950/20 to-slate-900 p-10 flex flex-col items-center gap-4 text-center shadow-xl shadow-violet-900/10">
            <p className={`text-8xl font-bold tabular-nums tracking-tight ${scoreColor(score.overall_score)}`}>
              {score.overall_score}
            </p>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
              Overall Score
            </p>
            <span
              className={`rounded-full border px-5 py-1.5 text-sm font-semibold ${recStyle.border} ${recStyle.text} ${recStyle.bg}`}
            >
              {score.recommendation}
            </span>
            <p className="text-xs text-slate-500 font-mono mt-1">
              {formatLabel(report.track)} &middot; {formatLabel(report.difficulty)}
            </p>
          </div>

          {/* Strengths & Areas to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                  Strengths
                </h2>
              </div>
              {score.strengths.length === 0 ? (
                <p className="text-slate-500 text-sm">No strengths recorded.</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {score.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                  Areas to Improve
                </h2>
              </div>
              {score.improvements.length === 0 ? (
                <p className="text-slate-500 text-sm">No improvement areas recorded.</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {score.improvements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Topic Breakdown */}
          {score.topic_scores.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-400" />
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Topic Breakdown
                </h2>
              </div>
              <div className="flex flex-col gap-5">
                {score.topic_scores.map((topic, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">{topic.topic}</span>
                      <span className={`text-sm font-semibold tabular-nums font-mono ${barTextColor(topic.score)}`}>
                        {topic.score}<span className="text-slate-600 font-normal">/10</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${barColor(topic.score)}`}
                        style={{ width: `${(topic.score / 10) * 100}%` }}
                      />
                    </div>
                    {topic.feedback && (
                      <p className="text-xs text-slate-500 leading-relaxed">{topic.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div className="flex justify-center pb-6">
            <Link
              href="/"
              className="rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 hover:scale-105 text-white font-semibold text-sm px-8 py-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-950 shadow-lg shadow-violet-900/30"
            >
              ← Practice Again
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
