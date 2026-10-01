"use client";

import { motion } from "framer-motion";
import { Plus, ShieldCheck, ShieldAlert, TrendingUp, Users } from "lucide-react";
import { counterparties } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { useAIContext } from "@/lib/aiContext";

export default function CounterpartiesPage() {
        const { setPageContext } = useAIContext();
  useEffect(() => {
    setPageContext("Counterparties", { counterparties });
  }, [setPageContext]);

  const [screening, setScreening] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const names = counterparties.map((c) => c.name).join(",");
    fetch(`/api/compliance/screen?names=${encodeURIComponent(names)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.live) return;
        const map: Record<string, boolean> = {};
        d.results.forEach((r: any) => (map[r.name] = r.hit));
        setScreening(map);
      })
      .catch(() => {});
  }, []);
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium">Counterparties</h1>
                    <p className="text-[11px] text-canton-muted">
            Parties you share at least one active contract with ·{" "}
            <span className="text-canton-muted/70">simulated overlay</span>
          </p>
        </div>
        <button className="btn-primary text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add counterparty
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Active</p>
          <p className="mt-1 text-xl font-semibold">{counterparties.filter((c) => c.status === "active").length}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Under review</p>
          <p className="mt-1 text-xl font-semibold text-canton-gold">
            {counterparties.filter((c) => c.status === "review").length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Total exposure</p>
          <p className="mt-1 text-xl font-semibold text-canton-cyan">
            ${(counterparties.reduce((s, c) => s + c.exposure, 0) / 1_000_000).toFixed(1)}M
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {counterparties.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card card-hover p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-canton-cyan/10 ring-1 ring-canton-cyan/25">
                  <Users className="h-5 w-5 text-canton-cyan" />
                </span>
                <div>
                  <h3 className="text-sm font-medium">{c.name}</h3>
                  <p className="text-[11px] text-canton-muted">since {c.since}</p>
                </div>
              </div>
                            <div className="flex flex-col items-end gap-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    c.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-canton-gold/12 text-canton-gold"
                  }`}
                >
                  {c.status}
                </span>
                {c.name in screening && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] ${
                      screening[c.name] ? "text-red-400" : "text-canton-muted"
                    }`}
                    title="Live check against the US Treasury OFAC SDN list"
                  >
                    {screening[c.name] ? (
                      <ShieldAlert className="h-2.5 w-2.5" />
                    ) : (
                      <ShieldCheck className="h-2.5 w-2.5" />
                    )}
                    {screening[c.name] ? "Sanctions hit" : "OFAC clear"}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-canton-muted">Exposure</p>
                <p className="tabular text-sm font-semibold text-canton-cyan">
                  ${(c.exposure / 1_000_000).toFixed(2)}M
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-canton-muted">30d volume</p>
                <p className="tabular text-sm font-semibold">
                  ${(c.volume30d / 1_000_000).toFixed(1)}M
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
              <span className="text-[11px] text-canton-muted">
                {c.transactions} transactions
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                Active
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}