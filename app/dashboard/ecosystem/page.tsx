// app/dashboard/ecosystem/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Heart, ThumbsUp, TrendingUp, Search } from "lucide-react";
import { projects, CATEGORIES, formatNumber } from "@/lib/ecosystem";
import { useAIContext } from "@/lib/aiContext";

export default function EcosystemPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const { setPageContext } = useAIContext();

  const filtered = useMemo(() => {
    return projects
      .filter((p) => category === "All" || p.category === category)
      .filter(
        (p) =>
          query.trim() === "" ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tagline.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.votes - a.votes);
  }, [category, query]);

  useEffect(() => {
    setPageContext("Ecosystem", { projects, filtered });
  }, [setPageContext, filtered]);

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-sm font-medium">Ecosystem</h1>
          <p className="text-[11px] text-canton-muted">
            {projects.length} Canton Network projects · discover, filter, and ask Copilot about them
          </p>
        </div>
        <span className="badge">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
          Live data via CCTools API (beta)
        </span>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-canton-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="w-56 rounded-xl border border-hairline bg-canton-black/60 py-2 pl-9 pr-3 text-xs text-canton-text placeholder:text-canton-muted/70 focus:border-canton-cyan/40 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] transition-colors ${
                category === c
                  ? "bg-canton-cyan/10 text-canton-cyan ring-1 ring-canton-cyan/25"
                  : "text-canton-muted hover:text-canton-text"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card card-hover flex flex-col p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-canton-cyan/20 to-canton-blue/20 ring-1 ring-canton-cyan/25 text-sm font-semibold text-canton-cyan">
                {p.name[0]}
              </span>
              <div className="flex flex-col items-end gap-1">
                {p.featured && (
                  <span className="rounded-full bg-canton-gold/12 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-canton-gold">
                    Highlight
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider ${
                    p.live
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-white/5 text-canton-muted"
                  }`}
                >
                  <span className="h-1 w-1 rounded-full bg-current" />
                  {p.live ? "Live" : "Preview"}
                </span>
              </div>
            </div>

            <h3 className="mt-3 text-sm font-medium">{p.name}</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-canton-muted line-clamp-3">
              {p.tagline}
            </p>

            <div className="mt-3 flex flex-wrap gap-1">
              {p.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-canton-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {p.tvl && (
              <div className="mt-3 border-t border-hairline pt-3">
                <p className="text-[9px] uppercase tracking-wider text-canton-muted">
                  TVL
                </p>
                <p className="tabular mt-0.5 text-sm font-semibold text-canton-cyan">
                  {p.tvl}
                </p>
              </div>
            )}

            <div className="mt-auto flex items-center justify-between border-t border-hairline pt-3">
              <div className="flex items-center gap-3 text-[10px] text-canton-muted">
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {formatNumber(p.votes)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-2.5 w-2.5" />
                  {formatNumber(p.hearts)}
                </span>
              </div>
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("copilot-action", {
                      detail: `Tell me everything you know about "${p.name}" on Canton Network. What does it do, and how does it use Canton's privacy features?`,
                    })
                  )
                }
                className="inline-flex items-center gap-1 text-[10px] text-canton-cyan transition-opacity hover:opacity-80"
              >
                Ask Copilot
                <ExternalLink className="h-2.5 w-2.5" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}