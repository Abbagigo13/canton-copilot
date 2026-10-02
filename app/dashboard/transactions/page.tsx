"use client";

import { motion } from "framer-motion";
import { Activity, ArrowUpRight, CircleDollarSign, Filter } from "lucide-react";
import { dashboardMetrics } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { useAIContext } from "@/lib/aiContext";

export default function TransactionsPage() {
  const transactions = dashboardMetrics.recentActivity;

    const { setPageContext } = useAIContext();
  useEffect(() => {
    setPageContext("Transactions", { transactions });
  }, [setPageContext, transactions]);

  const [liveRounds, setLiveRounds] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/ledger/dso")
      .then((r) => r.json())
      .then((d) => {
        if (d.live) setLiveRounds(d.issuingMiningRounds || []);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium">Transactions</h1>
                    <p className="text-[11px] text-canton-muted">
            All ledger activity across your parties ·{" "}
            <span className="text-canton-muted/70">top rows live from Silvana DevNet, rest simulated</span>
          </p>
        </div>
        <button className="btn-ghost text-xs">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Total</p>
          <p className="mt-1 text-xl font-semibold">{dashboardMetrics.kpis.transactions.value.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Settled</p>
          <p className="mt-1 text-xl font-semibold text-emerald-400">98.4%</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Pending</p>
          <p className="mt-1 text-xl font-semibold text-canton-gold">1.6%</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-canton-muted">
              <th className="px-5 py-3 font-medium">Counterparty</th>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Time</th>
            </tr>
          </thead>
                    <tbody>
            {liveRounds.map((r, i) => (
              <motion.tr
                key={`live-${r.round}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-t border-hairline bg-canton-cyan/[0.03] hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3.5 font-medium">Silvana DevNet</td>
                <td className="px-5 py-3.5 text-canton-muted">Mining round #{r.round} issuance</td>
                <td className="px-5 py-3.5 text-right tabular">{r.featuredReward} CC</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-canton-cyan/10 px-2.5 py-1 text-[11px] font-medium text-canton-cyan">
                    live
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-canton-muted">
                  {r.opensAt ? new Date(r.opensAt).toLocaleTimeString() : "—"}
                </td>
              </motion.tr>
            ))}
            {transactions.map((row, i) => (
              <motion.tr
                key={row.party + i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className="border-t border-hairline hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3.5 font-medium">{row.party}</td>
                <td className="px-5 py-3.5 text-canton-muted">{row.action}</td>
                <td className="px-5 py-3.5 text-right tabular">{row.amount}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    row.status === "settled" ? "bg-emerald-500/10 text-emerald-400"
                      : row.status === "pending" ? "bg-canton-gold/12 text-canton-gold"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-canton-muted">{row.time}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}