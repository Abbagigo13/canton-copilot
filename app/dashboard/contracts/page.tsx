"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { contracts } from "@/lib/mockData";
import { useEffect } from "react";
import { useAIContext } from "@/lib/aiContext";

export default function ContractsPage() {
  const [expanded, setExpanded] = useState<string | null>(contracts[0]?.id ?? null);
    const { setPageContext } = useAIContext();
  useEffect(() => {
    setPageContext("Contracts", { contracts });
  }, [setPageContext]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-sm font-medium">Contracts</h1>
                <p className="text-[11px] text-canton-muted">
          Active Daml contracts visible to your parties ·{" "}
          <span className="text-canton-muted/70">simulated overlay</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Total</p>
          <p className="mt-1 text-xl font-semibold">{contracts.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Active</p>
          <p className="mt-1 text-xl font-semibold text-emerald-400">
            {contracts.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Pending</p>
          <p className="mt-1 text-xl font-semibold text-canton-gold">
            {contracts.filter((c) => c.status === "pending").length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {contracts.map((c, i) => {
          const isOpen = expanded === c.id;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : c.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canton-cyan/10 ring-1 ring-canton-cyan/25">
                  <FileText className="h-5 w-5 text-canton-cyan" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs text-canton-muted">{c.id}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        c.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : c.status === "pending"
                            ? "bg-canton-gold/12 text-canton-gold"
                            : "bg-white/5 text-canton-muted"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium">{c.template}</p>
                </div>

                <div className="hidden sm:block text-right">
                  <p className="text-[10px] uppercase tracking-wider text-canton-muted">Created</p>
                  <p className="text-xs">{c.created}</p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-canton-muted transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-hairline"
                  >
                    <div className="grid gap-4 p-5 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-canton-muted">
                          Signatories & observers
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {c.parties.map((p) => (
                            <span
                              key={p}
                              className="rounded-lg bg-canton-cyan/8 px-2 py-1 text-[11px] text-canton-cyan ring-1 ring-canton-cyan/25"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-canton-muted">
                          Payload
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-lg bg-canton-black/50 p-3 font-mono text-[11px] text-canton-text">
                          {JSON.stringify(c.payload, null, 2)}
                        </pre>
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-between border-t border-hairline pt-3">
                        <span className="font-mono text-[10px] text-canton-muted">
                          template: {c.template}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(c.id)}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-canton-muted hover:text-canton-text"
                          >
                            <Copy className="h-3 w-3" />
                            Copy ID
                          </button>
                          <button
                            onClick={() =>
                              window.dispatchEvent(
                                new CustomEvent("copilot-action", {
                                  detail: `Explain this Daml contract on the Canton Network.

Contract data:
- Contract ID: ${c.id}
- Template: ${c.template}
- Status: ${c.status}
- Created: ${c.created}
- Parties: ${c.parties.join(", ")}
- Payload: ${JSON.stringify(c.payload)}

Explain in plain English: what this contract does, who has visibility over it (signatories and observers), and what would trigger its archival or settlement.`,
                                })
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-canton-cyan hover:opacity-80"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Ask Copilot
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}