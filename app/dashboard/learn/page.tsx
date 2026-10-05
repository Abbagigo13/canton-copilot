// app/dashboard/learn/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Award, ArrowRight, Check } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/useProgress";
import { useAIContext } from "@/lib/aiContext";

const LEVEL_STYLES = {
  Beginner: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/25",
  Intermediate: "bg-canton-cyan/10 text-canton-cyan ring-canton-cyan/25",
  Advanced: "bg-canton-gold/10 text-canton-gold ring-canton-gold/25",
};

export default function LearnPage() {
  const { progress } = useProgress();
  const { setPageContext } = useAIContext();

  useEffect(() => {
    setPageContext("Learn", { lessons, progress });
  }, [setPageContext, progress]);

  const totalXP = lessons.reduce((s, l) => s + l.xp, 0);
  const completion = Math.round((progress.completed.length / lessons.length) * 100);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-sm font-medium">Learn & Earn</h1>
        <p className="text-[11px] text-canton-muted">
          Complete lessons, pass quizzes, earn XP and badges.
        </p>
      </div>

      {/* Progress bar */}
      <div className="card mb-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-canton-muted">
              Your progress
            </p>
            <p className="mt-1 text-2xl font-semibold text-canton-cyan">
              {progress.xp} <span className="text-sm text-canton-muted">/ {totalXP} XP</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-canton-muted">
              Completion
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {progress.completed.length} <span className="text-sm text-canton-muted">/ {lessons.length}</span>
            </p>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-canton-cyan to-canton-gold"
          />
        </div>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, i) => {
          const done = progress.completed.includes(lesson.slug);
          const score = progress.quizScores[lesson.slug];
          return (
            <motion.div
              key={lesson.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/dashboard/learn/${lesson.slug}`}
                className="card card-hover flex items-center gap-4 p-5"
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${
                    done
                      ? "bg-emerald-500/10 ring-emerald-500/25"
                      : "bg-canton-cyan/10 ring-canton-cyan/25"
                  }`}
                >
                  {done ? (
                    <Check className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-canton-cyan" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium">{lesson.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${LEVEL_STYLES[lesson.level]}`}
                    >
                      {lesson.level}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-canton-muted">
                    {lesson.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-canton-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {lesson.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Award className="h-2.5 w-2.5" />
                      {lesson.xp} XP
                    </span>
                    {score !== undefined && (
                      <span className="text-emerald-400">
                        Quiz: {score}%
                      </span>
                    )}
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-canton-muted" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}