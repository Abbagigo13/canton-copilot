// components/PremiumGate.tsx
"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles, Coins } from "lucide-react";
import { useWallet } from "@/lib/wallet";

export default function PremiumGate({ children }: { children: React.ReactNode }) {
  const { connected, isPremium, queriesUsed, FREE_LIMIT, payForPremium, balance } = useWallet();

  // Free tier still available
  if (queriesUsed < FREE_LIMIT || isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="grid h-14 w-14 place-items-center rounded-2xl bg-canton-gold/10 ring-1 ring-canton-gold/30"
      >
        <Lock className="h-6 w-6 text-canton-gold" />
      </motion.div>

      <h3 className="mt-4 text-sm font-medium">Free queries exhausted</h3>
      <p className="mt-1.5 max-w-[260px] text-[11px] leading-relaxed text-canton-muted">
        You&apos;ve used all {FREE_LIMIT} free AI queries. Unlock unlimited access with a one-time payment.
      </p>

      <div className="mt-5 w-full rounded-xl border border-canton-gold/30 bg-canton-gold/5 p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-canton-gold" />
            Unlimited AI queries
          </span>
          <span className="tabular text-sm font-semibold text-canton-gold">1 CC</span>
        </div>
        <p className="mt-1 text-[10px] text-canton-muted">one-time · valid for this session</p>
      </div>

      {connected ? (
        <button
          onClick={payForPremium}
          className="btn-primary mt-4 w-full py-2.5 text-sm"
        >
          <Coins className="h-3.5 w-3.5" />
          Pay 1 CC with Grofty
        </button>
      ) : (
        <p className="mt-4 text-[11px] text-canton-muted">
          Connect your wallet to continue
        </p>
      )}

      {connected && (
        <p className="mt-2 text-[10px] text-canton-muted">
          Balance: {balance.toFixed(4)} CC
        </p>
      )}
    </div>
  );
}