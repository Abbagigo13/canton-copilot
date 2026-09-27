// components/CantonCoinPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Radio, TrendingUp } from "lucide-react";

type DsoData = {
  live: boolean;
  ccUsdRate?: number;
  amuletPrice?: number;
  currentRound?: string;
  dsoPartyId?: string;
  openMiningRounds?: Array<{ round: string; price: number; opensAt: string; closesAt: string }>;
  issuingMiningRounds?: Array<{ round: string; featuredReward: number; unfeaturedReward: number; opensAt: string }>;
  fetchedAt?: string;
};

export default function CantonCoinPanel() {
  const [data, setData] = useState<DsoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch("/api/ledger/dso");
        const json = await res.json();
        if (!cancelled) {
          if (json.live) {
            setData(json);
            setError(null);
          } else {
            setError(json.error || "Live data unavailable");
          }
        }
      } catch {
        if (!cancelled) setError("Network error");
      }
    };

    poll();
    const id = setInterval(poll, 10000); // refresh every 10s
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-canton-gold/10 ring-1 ring-canton-gold/25">
            <Coins className="h-4 w-4 text-canton-gold" />
          </span>
          <div>
            <h2 className="text-sm font-medium">Canton Coin</h2>
            <p className="text-[11px] text-canton-muted">Live from DevNet</p>
          </div>
        </div>
        <span className="badge">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              data?.live ? "bg-emerald-400 animate-pulse-glow" : "bg-red-400"
            }`}
          />
          {data?.live ? "Live" : error ? "Offline" : "Connecting…"}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        {error && !data && (
          <p className="text-xs text-canton-muted">{error}. Retrying…</p>
        )}

        {data?.live && (
          <>
            {/* Main rate */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-canton-muted">
                  CC / USD
                </p>
                <motion.p
                  key={data.ccUsdRate}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="tabular mt-1 text-3xl font-semibold text-canton-gold"
                >
                  ${data.ccUsdRate?.toFixed(5)}
                </motion.p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-canton-muted">
                  Round
                </p>
                <p className="tabular mt-1 text-lg font-semibold">
                  #{data.currentRound}
                </p>
              </div>
            </div>

            {/* Issuing rounds */}
            {data.issuingMiningRounds && data.issuingMiningRounds.length > 0 && (
              <div className="mt-5 border-t border-hairline pt-4">
                <p className="text-[10px] uppercase tracking-wider text-canton-muted">
                  Issuing now
                </p>
                <div className="mt-2 space-y-1.5">
                  {data.issuingMiningRounds.slice(0, 3).map((r) => (
                    <div
                      key={r.round}
                      className="flex items-center justify-between rounded-lg bg-canton-black/40 px-3 py-2 text-xs"
                    >
                      <span className="font-mono text-canton-muted">#{r.round}</span>
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                        {r.featuredReward.toFixed(2)} CC
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer info */}
            <div className="mt-4 flex items-center gap-2 border-t border-hairline pt-3 text-[10px] text-canton-muted">
              <Radio className="h-3 w-3" />
              <span className="font-mono truncate">
                {data.dsoPartyId?.slice(0, 32)}…
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}