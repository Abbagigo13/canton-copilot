// app/dashboard/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import LiveIndicator from "@/components/LiveIndicator";
import TransactionDrawer from "@/components/TransactionDrawer";
import AnomalyBanner from "@/components/AnomalyBanner";
import CantonCoinPanel from "@/components/CantonCoinPanel";
import { useLiveData } from "@/lib/useLiveData";
import { getFilteredData, detectAnomalies } from "@/lib/mockData";
import { useAIContext } from "@/lib/aiContext";

/* ---------------------------- chart tooltip ------------------------ */

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
}

function ChartTooltip({
  active,
  label,
  payload,
  prefix = "",
  suffix = "",
}: {
  active?: boolean;
  label?: string | number;
  payload?: TooltipPayloadItem[];
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs shadow-glow">
      <p className="mb-1 font-medium text-canton-text">{label}</p>
      {payload.map((p) => (
        <p key={String(p.dataKey)} className="tabular text-canton-muted">
          <span className="text-canton-cyan">
            {prefix}
            {typeof p.value === "number"
              ? p.value.toLocaleString("en-US")
              : p.value}
            {suffix}
          </span>{" "}
          {p.name}
        </p>
      ))}
    </div>
  );
}

/* ------------------------------ page ------------------------------ */

export default function OverviewPage() {
  const { data: liveData, lastUpdated, refresh } = useLiveData();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const [selectedTx, setSelectedTx] = useState<
    (typeof liveData.recentActivity)[0] | null
  >(null);

  const dashboardMetrics = useMemo(
    () => getFilteredData(selectedApp, liveData),
    [selectedApp, liveData]
  );

    const [anomalies, setAnomalies] = useState<ReturnType<typeof detectAnomalies>>([]);

  useEffect(() => {
    // Defer to client-only to avoid SSR hydration mismatch
    setAnomalies(detectAnomalies(dashboardMetrics));
  }, [dashboardMetrics]);

  const { setPageContext } = useAIContext();

  useEffect(() => {
    setPageContext("Overview", {
      kpis: dashboardMetrics.kpis,
      volumeHistory: dashboardMetrics.volumeHistory,
      appUsage: dashboardMetrics.appUsage,
      recentActivity: dashboardMetrics.recentActivity,
    });
  }, [setPageContext, dashboardMetrics]);

  return (
    <>
      {/* ---------- header ---------- */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
          <h1 className="text-sm font-medium">Overview</h1>
          <p className="text-[11px] text-canton-muted">
            Global Synchronizer · last 7 days ·{" "}
            <span className="text-canton-muted/70">simulated institutional overlay</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  ctrlKey: true,
                })
              );
            }}
            className="hidden items-center gap-2 rounded-xl border border-hairline bg-canton-black/60 px-3 py-2 text-xs text-canton-muted transition-colors hover:border-canton-cyan/40 hover:text-canton-text md:inline-flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded border border-hairline bg-canton-black/60 px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>

          <LiveIndicator lastUpdated={lastUpdated} onRefresh={refresh} />
        </div>
      </div>

      {/* ---------- anomaly banner ---------- */}
      <AnomalyBanner
        anomalies={anomalies}
        onInvestigate={(prompt: string) => {
          window.dispatchEvent(
            new CustomEvent("copilot-action", { detail: prompt })
          );
        }}
      />

      {/* ---------- KPI cards ---------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          index={0}
          label="Settled volume"
          value={dashboardMetrics.kpis.settledVolume.value}
          prefix="$"
          suffix="M"
          decimals={1}
          delta={dashboardMetrics.kpis.settledVolume.change}
          icon={CircleDollarSign}
          sparkline={dashboardMetrics.volumeHistory.map((v) => v.volume)}
        />
        <DashboardCard
          index={1}
          label="Transactions"
          value={dashboardMetrics.kpis.transactions.value}
          delta={dashboardMetrics.kpis.transactions.change}
          icon={Activity}
          sparkline={dashboardMetrics.volumeHistory.map((v) => v.transactions)}
        />
        <DashboardCard
          index={2}
          label="Active parties"
          value={dashboardMetrics.kpis.activeParties.value}
          delta={dashboardMetrics.kpis.activeParties.change}
          icon={Users}
          tone="gold"
          sparkline={[
            980,
            1024,
            1090,
            1102,
            1188,
            1240,
            dashboardMetrics.kpis.activeParties.value,
          ]}
        />
        <DashboardCard
          index={3}
          label="Settlement rate"
          value={dashboardMetrics.kpis.settlementRate.value}
          suffix="%"
          decimals={1}
          format="percent"
          delta={dashboardMetrics.kpis.settlementRate.change}
          icon={ShieldCheck}
          sparkline={[
            99.8,
            99.7,
            99.6,
            99.4,
            99.1,
            99.3,
            dashboardMetrics.kpis.settlementRate.value,
          ]}
        />
      </div>

      {/* ---------- charts ---------- */}
      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="card p-5 xl:col-span-3"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium">Settled volume</h2>
              <p className="mt-0.5 text-xs text-canton-muted">
                USD millions, daily
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              18.4%
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dashboardMetrics.volumeHistory}
                margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D1FF" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#00D1FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} dy={8} />
                <YAxis axisLine={false} tickLine={false} width={48} />
                <Tooltip
                  cursor={{ stroke: "#00D1FF", strokeOpacity: 0.25 }}
                  content={<ChartTooltip prefix="$" suffix="M" />}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  name="settled"
                  stroke="#00D1FF"
                  strokeWidth={2}
                  fill="url(#volumeFill)"
                  activeDot={{
                    r: 4,
                    fill: "#00D1FF",
                    stroke: "#06090F",
                    strokeWidth: 2,
                  }}
                  animationDuration={1400}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="card p-5 xl:col-span-2"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium">App usage</h2>
              <p className="mt-0.5 text-xs text-canton-muted">
                {selectedApp
                  ? `Filtered: ${selectedApp}`
                  : "Ledger API calls, last 7d · click to filter"}
              </p>
            </div>
            {selectedApp && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedApp(null)}
                className="inline-flex items-center gap-1 rounded-lg bg-canton-cyan/12 px-2 py-1 text-[11px] font-medium text-canton-cyan ring-1 ring-canton-cyan/30 transition-colors hover:bg-canton-cyan/20"
              >
                <X className="h-3 w-3" />
                Clear
              </motion.button>
            )}
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardMetrics.appUsage}
                layout="vertical"
                margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v / 1000}k`}
                />
                <YAxis
                  type="category"
                  dataKey="app"
                  axisLine={false}
                  tickLine={false}
                  width={104}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,209,255,0.06)" }}
                  content={<ChartTooltip />}
                />
                <Bar
                  dataKey="calls"
                  name="calls"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                  animationDuration={1200}
                  cursor="pointer"
                  onClick={(data: { app: string }) => {
                    setSelectedApp(data.app === selectedApp ? null : data.app);
                  }}
                >
                  {dashboardMetrics.appUsage.map((entry) => (
                    <Cell
                      key={entry.app}
                      fill={
                        selectedApp === null
                          ? entry.tone === "gold"
                            ? "#D4A017"
                            : "#00D1FF"
                          : selectedApp === entry.app
                            ? "#00D1FF"
                            : "#1A2332"
                      }
                      fillOpacity={
                        selectedApp === null || selectedApp === entry.app
                          ? 0.85
                          : 0.4
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>

      {/* ---------- live Canton Coin panel ---------- */}
      <div className="mt-4">
        <CantonCoinPanel />
      </div>

      {/* ---------- recent activity ---------- */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.55 }}
        className="card mt-4 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h2 className="text-sm font-medium">Recent activity</h2>
          <button className="text-xs text-canton-cyan transition-opacity hover:opacity-80">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
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
              {dashboardMetrics.recentActivity.map((row, i) => (
                <motion.tr
                  key={row.party + i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                  onClick={() => setSelectedTx(row)}
                  className="cursor-pointer border-t border-hairline transition-colors hover:bg-white/[0.04]"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium">
                    {row.party}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-canton-muted">
                    {row.action}
                  </td>
                  <td className="tabular whitespace-nowrap px-5 py-3.5 text-right">
                    {row.amount}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        row.status === "settled"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : row.status === "pending"
                            ? "bg-canton-gold/12 text-canton-gold"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right text-canton-muted">
                    {row.time}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ---------- transaction drawer ---------- */}
      <TransactionDrawer
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onAskCopilot={(prompt) => {
          window.dispatchEvent(
            new CustomEvent("copilot-action", { detail: prompt })
          );
        }}
      />
    </>
  );
}