"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import AIChat from "@/components/AIChat";
import { useEffect } from "react";
import { useAIContext } from "@/lib/aiContext";
import { dashboardMetrics, counterparties, assets, complianceAlerts, contracts } from "@/lib/mockData";

export default function CopilotPage() {
      const { setPageContext } = useAIContext();
  useEffect(() => {
    setPageContext("Copilot", {
      kpis: dashboardMetrics.kpis,
      counterparties,
      assets,
      alerts: complianceAlerts,
      contracts,
    });
  }, [setPageContext]);
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium">Copilot</h1>
          <p className="text-[11px] text-canton-muted">
            AI workspace scoped to your party rights
          </p>
        </div>
        <span className="badge">
          <span className="h-1.5 w-1.5 rounded-full bg-canton-cyan animate-pulse-glow" />
          Qwen-powered
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Left rail — suggested actions + scoping */}
        <div className="space-y-3">
          <div className="card p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-canton-cyan" />
              <p className="text-xs font-medium">Privacy scope</p>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-canton-muted">
              Copilot inherits your party rights. It can only see contracts you
              are already a stakeholder on.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-canton-cyan/8 px-2.5 py-1.5 text-[11px] ring-1 ring-canton-cyan/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-canton-text">participant-1.canton</span>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-canton-gold" />
              <p className="text-xs font-medium">Capabilities</p>
            </div>
            <ul className="mt-2 space-y-1.5 text-[11px] text-canton-muted">
              <li>• Natural-language ledger queries</li>
              <li>• Counterparty exposure lookups</li>
              <li>• Anomaly investigation</li>
              <li>• Compliance risk triage</li>
              <li>• Contract template explanations</li>
            </ul>
          </div>

          <div className="card p-4">
            <p className="text-[11px] uppercase tracking-wider text-canton-muted">
              Token budget
            </p>
            <p className="mt-1 text-sm font-semibold text-canton-cyan">500K</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "12%" }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="h-full rounded-full bg-canton-cyan"
              />
            </div>
            <p className="mt-1.5 text-[10px] text-canton-muted">
              ~438K remaining this season
            </p>
          </div>
        </div>

        {/* Main chat */}
        <div className="h-[calc(100svh-8rem)] xl:h-[calc(100svh-6rem)]">
          <AIChat />
        </div>
      </div>
    </>
  );
}