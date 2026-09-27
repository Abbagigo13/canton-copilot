"use client";

import { motion } from "framer-motion";
import { Layers, Plus, Wallet } from "lucide-react";
import { assets } from "@/lib/mockData";
import { useEffect } from "react";
import { useAIContext } from "@/lib/aiContext";

export default function AssetsPage() {
      const { setPageContext } = useAIContext();
  useEffect(() => {
    setPageContext("Assets", { assets });
  }, [setPageContext]);
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium">Assets</h1>
          <p className="text-[11px] text-canton-muted">
            Tokenized instruments visible to your parties
          </p>
        </div>
        <button className="btn-primary text-xs">
          <Plus className="h-3.5 w-3.5" />
          Issue asset
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Instruments</p>
          <p className="mt-1 text-xl font-semibold">{assets.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Active</p>
          <p className="mt-1 text-xl font-semibold text-emerald-400">
            {assets.filter((a) => a.status === "active").length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Total supply</p>
          <p className="mt-1 text-xl font-semibold text-canton-cyan">$192.1M</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card card-hover p-5"
          >
            <div className="flex items-start justify-between">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${
                  a.tone === "gold"
                    ? "bg-canton-gold/10 ring-canton-gold/25"
                    : "bg-canton-cyan/10 ring-canton-cyan/25"
                }`}
              >
                <Layers
                  className={`h-5 w-5 ${
                    a.tone === "gold" ? "text-canton-gold" : "text-canton-cyan"
                  }`}
                />
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  a.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-white/5 text-canton-muted"
                }`}
              >
                {a.status}
              </span>
            </div>

            <h3 className="mt-4 text-sm font-medium">{a.name}</h3>
            <p className="text-[11px] text-canton-muted">{a.type}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-canton-muted">Supply</p>
                <p className="tabular text-sm font-semibold">{a.supply}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-canton-muted">Holders</p>
                <p className="tabular text-sm font-semibold">{a.holders}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-[11px] text-canton-muted">
              <span>Issued {a.issued}</span>
              <span>Maturity {a.maturity}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}