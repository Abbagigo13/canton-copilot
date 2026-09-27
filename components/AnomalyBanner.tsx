// components/AnomalyBanner.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, X, Zap } from "lucide-react";
import type { Anomaly } from "@/lib/mockData";

export default function AnomalyBanner({
  anomalies,
  onInvestigate,
}: {
  anomalies: Anomaly[];
  onInvestigate: (prompt: string) => void;
}) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = anomalies.filter((a) => !dismissed.includes(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      <AnimatePresence>
        {visible.map((anomaly) => (
          <motion.div
            key={anomaly.id}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden rounded-xl border p-4 ${
              anomaly.severity === "high"
                ? "border-red-500/30 bg-red-500/5"
                : "border-canton-gold/30 bg-canton-gold/5"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                  anomaly.severity === "high"
                    ? "bg-red-500/15 ring-1 ring-red-500/30"
                    : "bg-canton-gold/15 ring-1 ring-canton-gold/30"
                }`}
              >
                {anomaly.severity === "high" ? (
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                ) : (
                  <Zap className="h-4 w-4 text-canton-gold" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      anomaly.severity === "high"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-canton-gold/15 text-canton-gold"
                    }`}
                  >
                    {anomaly.severity} · {anomaly.deviation}σ
                  </span>
                  <span className="font-mono text-[10px] text-canton-muted">
                    {anomaly.id}
                  </span>
                </div>

                <p className="mt-2 text-sm text-canton-text">
                  {anomaly.description}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() =>
                      onInvestigate(
                        `Investigate this anomaly: ${anomaly.description} Current: ${anomaly.current}, Baseline: ${anomaly.baseline}. What likely caused it and what should I do?`
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-canton-cyan transition-opacity hover:opacity-80"
                  >
                    Investigate with Copilot
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <span className="text-[11px] text-canton-muted">
                    · {anomaly.suggestedAction}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setDismissed((prev) => [...prev, anomaly.id])
                }
                className="shrink-0 rounded-lg p-1.5 text-canton-muted transition-colors hover:bg-white/5 hover:text-canton-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}