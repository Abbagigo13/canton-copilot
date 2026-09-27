"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { complianceAlerts } from "@/lib/mockData";
import { useEffect, useMemo } from "react";
import { useAIContext } from "@/lib/aiContext";

const SEVERITY_STYLES = {
  high: { icon: ShieldAlert, bg: "bg-red-500/10", text: "text-red-400", ring: "ring-red-500/25" },
  medium: { icon: AlertTriangle, bg: "bg-canton-gold/12", text: "text-canton-gold", ring: "ring-canton-gold/25" },
  low: { icon: ShieldCheck, bg: "bg-canton-cyan/10", text: "text-canton-cyan", ring: "ring-canton-cyan/25" },
};

export default function CompliancePage() {
  const counts = useMemo(() => ({
    high: complianceAlerts.filter((a) => a.severity === "high").length,
    medium: complianceAlerts.filter((a) => a.severity === "medium").length,
    low: complianceAlerts.filter((a) => a.severity === "low").length,
  }), []);
  const { setPageContext } = useAIContext();
  useEffect(() => {
    setPageContext("Compliance", {
      alerts: complianceAlerts,
      counts,
    });
  }, [setPageContext, counts]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-sm font-medium">Compliance</h1>
        <p className="text-[11px] text-canton-muted">
          Risk signals across your visible contracts
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">High severity</p>
          <p className="mt-1 text-xl font-semibold text-red-400">{counts.high}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Medium</p>
          <p className="mt-1 text-xl font-semibold text-canton-gold">{counts.medium}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wider text-canton-muted">Low</p>
          <p className="mt-1 text-xl font-semibold text-canton-cyan">{counts.low}</p>
        </div>
      </div>

      <div className="space-y-3">
        {complianceAlerts.map((a, i) => {
          const s = SEVERITY_STYLES[a.severity];
          const Icon = s.icon;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card card-hover p-5"
            >
              <div className="flex gap-4">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${s.bg} ${s.ring}`}>
                  <Icon className={`h-5 w-5 ${s.text}`} />
                </span>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.bg} ${s.text}`}>
                          {a.severity}
                        </span>
                        <span className="font-mono text-[10px] text-canton-muted">{a.id}</span>
                      </div>
                      <h3 className="mt-2 text-sm font-medium">{a.issue}</h3>
                      <p className="text-[11px] text-canton-muted">{a.party}</p>
                    </div>
                    <span className="text-[11px] text-canton-muted whitespace-nowrap">{a.time}</span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-canton-muted">
                    {a.detail}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      AI-assisted triage ready
                    </span>
                    <button className="text-[11px] font-medium text-canton-cyan hover:opacity-80">
                      {a.action} →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}