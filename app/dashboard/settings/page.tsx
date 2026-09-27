"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Link2, Save, Server, Shield, Wallet } from "lucide-react";
import { useEffect } from "react";
import { useAIContext } from "@/lib/aiContext";

export default function SettingsPage() {
  const [connected, setConnected] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
    const { setPageContext } = useAIContext();
  useEffect(() => {
    setPageContext("Settings", { node: "participant-1.canton", status: "connected" });
  }, [setPageContext]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-sm font-medium">Settings</h1>
        <p className="text-[11px] text-canton-muted">
          Configure your Canton participant connection
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* Node connection */}
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-canton-cyan/10 ring-1 ring-canton-cyan/25">
                <Server className="h-5 w-5 text-canton-cyan" />
              </span>
              <div>
                <h2 className="text-sm font-medium">Participant node</h2>
                <p className="text-[11px] text-canton-muted">
                  JSON Ledger API endpoint
                </p>
              </div>
            </div>
            {connected && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                Connected
              </motion.span>
            )}
          </div>

          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-canton-muted">
                Ledger API URL
              </span>
              <input
                type="text"
                defaultValue="https://participant-1.canton.example.com"
                className="mt-1.5 w-full rounded-xl border border-hairline bg-canton-black/60 px-3 py-2 text-sm text-canton-text focus:border-canton-cyan/40 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-canton-muted">
                Participant ID
              </span>
              <input
                type="text"
                defaultValue="participant-1.canton"
                className="mt-1.5 w-full rounded-xl border border-hairline bg-canton-black/60 px-3 py-2 font-mono text-xs text-canton-text focus:border-canton-cyan/40 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-canton-muted">
                Read-scoped token
              </span>
              <input
                type="password"
                defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="mt-1.5 w-full rounded-xl border border-hairline bg-canton-black/60 px-3 py-2 font-mono text-xs text-canton-text focus:border-canton-cyan/40 focus:outline-none"
              />
            </label>
          </div>
        </section>

        {/* Privacy scope */}
        <section className="card p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-canton-gold/10 ring-1 ring-canton-gold/25">
              <Shield className="h-5 w-5 text-canton-gold" />
            </span>
            <div>
              <h2 className="text-sm font-medium">Privacy scope</h2>
              <p className="text-[11px] text-canton-muted">
                Enforced by Canton — not configurable
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-canton-black/50 px-3 py-2">
              <span className="text-canton-muted">Party rights inheritance</span>
              <span className="text-emerald-400">Enabled</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-canton-black/50 px-3 py-2">
              <span className="text-canton-muted">Sub-transaction privacy</span>
              <span className="text-emerald-400">Enforced</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-canton-black/50 px-3 py-2">
              <span className="text-canton-muted">Cross-domain leakage</span>
              <span className="text-emerald-400">Blocked</span>
            </div>
          </div>
        </section>

        {/* AI settings */}
        <section className="card p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-canton-cyan/10 ring-1 ring-canton-cyan/25">
              <Wallet className="h-5 w-5 text-canton-cyan" />
            </span>
            <div>
              <h2 className="text-sm font-medium">AI token budget</h2>
              <p className="text-[11px] text-canton-muted">
                Qwen · 500K tokens per season
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-canton-muted">Used</span>
              <span className="tabular text-canton-text">61,842 / 500,000</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "12.4%" }}
                transition={{ duration: 1.2 }}
                className="h-full rounded-full bg-gradient-to-r from-canton-cyan to-canton-gold"
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-canton-muted">
                <input type="checkbox" defaultChecked className="rounded" />
                Cache repeated queries (recommended)
              </label>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save changes
              </>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-canton-muted">
          <Link2 className="h-3 w-3" />
          Connection is simulated in this demo. Bring your own node to go live.
        </div>
      </div>
    </>
  );
}