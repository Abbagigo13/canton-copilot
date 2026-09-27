// components/TransactionDrawer.tsx
"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Bot, Copy, FileText, X } from "lucide-react";

type Transaction = {
  party: string;
  action: string;
  amount: string;
  status: "settled" | "pending" | "failed";
  time: string;
};

export default function TransactionDrawer({
  transaction,
  onClose,
  onAskCopilot,
}: {
  transaction: Transaction | null;
  onClose: () => void;
  onAskCopilot: (prompt: string) => void;
}) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (transaction) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [transaction, onClose]);

  const handleAsk = () => {
  if (!transaction) return;
  const richPrompt = `Analyze this specific transaction in detail:

- Counterparty: ${transaction.party}
- Action: ${transaction.action}
- Amount: ${transaction.amount}
- Status: ${transaction.status}
- Time: ${transaction.time}

Explain what likely happened, whether the status is concerning, and what the operator should do next (if anything).`;

  onAskCopilot(richPrompt);
  onClose();
};

  return (
    <AnimatePresence>
      {transaction && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-[480px] flex-col border-l border-hairline bg-canton-navy"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-canton-cyan/10 ring-1 ring-canton-cyan/25">
                  <FileText className="h-4 w-4 text-canton-cyan" />
                </span>
                <div>
                  <h3 className="text-sm font-medium">Transaction details</h3>
                  <p className="font-mono text-[10px] text-canton-muted">
                    0000{Math.random().toString(16).slice(2, 6)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-canton-muted transition-colors hover:bg-white/5 hover:text-canton-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="thin-scrollbar flex-1 overflow-y-auto p-5">
              {/* Status banner */}
              <div
                className={`mb-5 rounded-xl p-4 ring-1 ${
                  transaction.status === "settled"
                    ? "bg-emerald-500/8 ring-emerald-500/25"
                    : transaction.status === "pending"
                      ? "bg-canton-gold/8 ring-canton-gold/25"
                      : "bg-red-500/8 ring-red-500/25"
                }`}
              >
                <p className="text-[10px] uppercase tracking-wider text-canton-muted">
                  Status
                </p>
                <p
                  className={`mt-1 text-lg font-semibold capitalize ${
                    transaction.status === "settled"
                      ? "text-emerald-400"
                      : transaction.status === "pending"
                        ? "text-canton-gold"
                        : "text-red-400"
                  }`}
                >
                  {transaction.status}
                </p>
              </div>

              {/* Detail rows */}
              <div className="space-y-4">
                <Detail label="Counterparty" value={transaction.party} />
                <Detail label="Action" value={transaction.action} />
                <Detail label="Amount" value={transaction.amount} />
                <Detail label="Time" value={transaction.time} />

                <div className="border-t border-hairline pt-4">
                  <Detail
                    label="Template"
                    value="Main.DvP"
                    mono
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-canton-muted">
                    Signatories & Observers
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-lg bg-canton-cyan/8 px-2 py-1 text-[11px] text-canton-cyan ring-1 ring-canton-cyan/25">
                      {transaction.party}
                    </span>
                    <span className="rounded-lg bg-canton-cyan/8 px-2 py-1 text-[11px] text-canton-cyan ring-1 ring-canton-cyan/25">
                      Meridian Capital
                    </span>
                  </div>
                </div>
              </div>

              {/* Payload */}
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-wider text-canton-muted">
                  Payload
                </p>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-canton-black/50 p-3 font-mono text-[11px] leading-relaxed text-canton-text">
{JSON.stringify(
  {
    amount: transaction.amount,
    action: transaction.action,
    counterparty: transaction.party,
    status: transaction.status,
  },
  null,
  2
)}
                </pre>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-hairline p-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-hairline bg-canton-black/60 px-3 py-2.5 text-xs text-canton-muted transition-colors hover:border-canton-cyan/40 hover:text-canton-text"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy ID
                </button>
                <button
                  type="button"
                  onClick={handleAsk}
                  className="btn-primary inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-xs"
                >
                  <Bot className="h-3.5 w-3.5" />
                  Ask Copilot
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Detail({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-canton-muted">
        {label}
      </p>
      <p className={`mt-0.5 text-sm ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}