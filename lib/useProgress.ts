// lib/useProgress.ts
"use client";

import { useEffect, useState, useCallback } from "react";

type Progress = {
  completed: string[];       // lesson slugs
  xp: number;
  badges: string[];
  quizScores: Record<string, number>;   // slug → score
};

const STORAGE_KEY = "canton-copilot-progress";

const EMPTY: Progress = { completed: [], xp: 0, badges: [], quizScores: {} };

function load(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  // Persist on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const completeLesson = useCallback((slug: string, xp: number, badge: string, quizScore: number) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completed.includes(slug);
      return {
        completed: alreadyCompleted ? prev.completed : [...prev.completed, slug],
        xp: alreadyCompleted ? prev.xp : prev.xp + xp,
        badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge],
        quizScores: { ...prev.quizScores, [slug]: quizScore },
      };
    });
  }, []);

  const resetProgress = useCallback(() => setProgress(EMPTY), []);

  return { progress, completeLesson, resetProgress };
}