// app/dashboard/learn/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Award, Check, ChevronRight, Sparkles, X } from "lucide-react";
import { getLesson } from "@/lib/lessons";
import { useProgress } from "@/lib/useProgress";
import { useAIContext } from "@/lib/aiContext";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const lesson = getLesson(slug);

  const { progress, completeLesson } = useProgress();
  const { setPageContext } = useAIContext();

  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (lesson) setPageContext("Lesson", { lesson });
  }, [setPageContext, lesson]);

  if (!lesson) {
    return (
      <div className="p-6 text-center text-canton-muted">
        Lesson not found.{" "}
        <button onClick={() => router.push("/dashboard/learn")} className="text-canton-cyan">
          Back to Learn
        </button>
      </div>
    );
  }

  const alreadyDone = progress.completed.includes(slug);

  const handleAnswer = (qIndex: number, optIndex: number) => {
    const next = [...answers];
    next[qIndex] = optIndex;
    setAnswers(next);
  };

  const handleSubmit = () => {
    const correct = lesson.quiz.reduce(
      (s, q, i) => s + (answers[i] === q.correct ? 1 : 0),
      0
    );
    const score = Math.round((correct / lesson.quiz.length) * 100);
    completeLesson(lesson.slug, lesson.xp, lesson.badge, score);
    setSubmitted(true);
  };

  const score = submitted
    ? Math.round(
        (lesson.quiz.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0) /
          lesson.quiz.length) *
          100
      )
    : 0;

  return (
    <>
      <button
        onClick={() => router.push("/dashboard/learn")}
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-canton-muted transition-colors hover:text-canton-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Learn
      </button>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">{lesson.title}</h1>
          <p className="mt-1 text-xs text-canton-muted">{lesson.description}</p>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-canton-muted">
            <span>{lesson.level}</span>
            <span>·</span>
            <span>{lesson.duration}</span>
            <span>·</span>
            <span className="text-canton-gold">{lesson.xp} XP</span>
            {alreadyDone && (
              <>
                <span>·</span>
                <span className="text-emerald-400">Completed</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {lesson.sections.map((section, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-6"
          >
            <h2 className="text-sm font-medium">{section.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-canton-muted">
              {section.body}
            </p>
          </motion.section>
        ))}
      </div>

      {/* Ask AI tutor */}
      <div className="card mt-4 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-canton-cyan/10 ring-1 ring-canton-cyan/25">
            <Sparkles className="h-4 w-4 text-canton-cyan" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">Ask the Copilot</p>
            <p className="text-[11px] text-canton-muted">
              Use the chat panel on the right to ask questions about this lesson.
            </p>
          </div>
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("copilot-action", {
                  detail: `Explain the key concept of "${lesson.title}" in simple terms and give me one practical example.`,
                })
              )
            }
            className="text-[11px] font-medium text-canton-cyan transition-opacity hover:opacity-80"
          >
            Ask AI tutor →
          </button>
        </div>
      </div>

      {/* Quiz */}
      <div className="card mt-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">Quiz</h2>
            <p className="text-[11px] text-canton-muted">
              {lesson.quiz.length} questions · pass to earn the badge
            </p>
          </div>
          {!quizMode && !submitted && (
            <button
              onClick={() => setQuizMode(true)}
              className="btn-primary text-xs"
            >
              Start quiz
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {quizMode && !submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-5 space-y-5"
            >
              {lesson.quiz.map((q, qi) => (
                <div key={qi}>
                  <p className="text-sm font-medium">
                    {qi + 1}. {q.question}
                  </p>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => handleAnswer(qi, oi)}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs transition-all ${
                          answers[qi] === oi
                            ? "border-canton-cyan/40 bg-canton-cyan/8 text-canton-text"
                            : "border-hairline bg-canton-black/40 text-canton-muted hover:border-canton-cyan/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={answers.length !== lesson.quiz.length}
                className="btn-primary w-full py-2.5 text-sm disabled:opacity-50"
              >
                Submit answers
              </button>
            </motion.div>
          )}

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 rounded-xl border p-4 ${
                score >= 70
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-canton-gold/30 bg-canton-gold/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {score >= 70 ? (
                  <Check className="h-5 w-5 text-emerald-400" />
                ) : (
                  <X className="h-5 w-5 text-canton-gold" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {score >= 70 ? "Badge earned!" : "Try again"}
                  </p>
                  <p className="text-[11px] text-canton-muted">
                    Score: {score}% · {score >= 70 ? `+${lesson.xp} XP` : "70% needed to pass"}
                  </p>
                </div>
                {score >= 70 && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-lg bg-canton-gold/10 px-2 py-1 text-[10px] font-medium text-canton-gold ring-1 ring-canton-gold/25">
                    <Award className="h-3 w-3" />
                    {lesson.badge}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}