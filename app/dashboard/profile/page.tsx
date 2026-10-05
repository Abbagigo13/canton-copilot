// app/dashboard/profile/page.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, RotateCcw, Trophy, Wallet, Zap } from "lucide-react";
import { useProgress } from "@/lib/useProgress";
import { useWallet } from "@/lib/wallet";
import { lessons } from "@/lib/lessons";
import { useAIContext } from "@/lib/aiContext";

export default function ProfilePage() {
  const { progress, resetProgress } = useProgress();
  const { connected, address, balance } = useWallet();
  const { setPageContext } = useAIContext();

  useEffect(() => {
    setPageContext("Profile", { progress, wallet: { connected, address, balance } });
  }, [setPageContext, progress, connected, address, balance]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-sm font-medium">Profile</h1>
        <p className="text-[11px] text-canton-muted">
          Your activity on Canton Copilot
        </p>
      </div>

      {/* Wallet card */}
      <div className="card mb-4 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#044AB3] to-canton-cyan ring-1 ring-canton-cyan/30">
            <Wallet className="h-5 w-5 text-white" />
          </span>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-canton-muted">
              Wallet
            </p>
            {connected && address ? (
              <p className="mt-0.5 font-mono text-xs">{address}</p>
            ) : (
              <p className="mt-0.5 text-xs text-canton-muted">Not connected</p>
            )}
          </div>
          {connected && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-canton-muted">
                Balance
              </p>
              <p className="tabular mt-0.5 text-sm font-semibold text-canton-gold">
                {balance.toFixed(4)} CC
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-4">
        <div className="card p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-canton-cyan" />
            <p className="text-[10px] uppercase tracking-wider text-canton-muted">
              Total XP
            </p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-canton-cyan">
            {progress.xp}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-canton-cyan" />
            <p className="text-[10px] uppercase tracking-wider text-canton-muted">
              Lessons
            </p>
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {progress.completed.length}
            <span className="text-sm text-canton-muted"> / {lessons.length}</span>
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2">
            <Award className="h-3.5 w-3.5 text-canton-gold" />
            <p className="text-[10px] uppercase tracking-wider text-canton-muted">
              Badges
            </p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-canton-gold">
            {progress.badges.length}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="card mb-4 p-5">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-canton-gold" />
          <h2 className="text-sm font-medium">Earned badges</h2>
        </div>
        {progress.badges.length === 0 ? (
          <p className="mt-3 text-xs text-canton-muted">
            Complete a lesson quiz to earn your first badge.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {progress.badges.map((badge, i) => (
              <motion.span
                key={badge}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-canton-gold/10 px-2.5 py-1.5 text-[11px] font-medium text-canton-gold ring-1 ring-canton-gold/25"
              >
                <Award className="h-3 w-3" />
                {badge}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={resetProgress}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] text-canton-muted transition-colors hover:bg-white/5 hover:text-canton-text"
      >
        <RotateCcw className="h-3 w-3" />
        Reset learning progress
      </button>
    </>
  );
}