// app/dashboard/news/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink, Filter } from "lucide-react";
import { news } from "@/lib/mockData";
import { useAIContext } from "@/lib/aiContext";

const CATEGORIES = ["All", "Network", "Governance", "Ecosystem"];

export default function NewsPage() {
  const [filter, setFilter] = useState("All");
  const { setPageContext } = useAIContext();

  useEffect(() => {
    setPageContext("News", { news });
  }, [setPageContext]);

  const filtered = filter === "All" ? news : news.filter((n) => n.category === filter);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium">News</h1>
          <p className="text-[11px] text-canton-muted">
            Canton Network activity from across the ecosystem
          </p>
        </div>
        <div className="flex items-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] transition-colors ${
                filter === c
                  ? "bg-canton-cyan/10 text-canton-cyan ring-1 ring-canton-cyan/25"
                  : "text-canton-muted hover:text-canton-text"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card card-hover p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-canton-cyan/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-canton-cyan">
                <Newspaper className="h-2.5 w-2.5" />
                {item.category}
              </span>
              <span className="text-[10px] text-canton-muted whitespace-nowrap">
                {item.time}
              </span>
            </div>

            <h3 className="mt-3 text-sm font-medium leading-snug">{item.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-canton-muted">{item.body}</p>

            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
              <span className="text-[10px] text-canton-muted">
                via <span className="text-canton-text">{item.source}</span>
              </span>
              <button className="inline-flex items-center gap-1 text-[10px] text-canton-cyan transition-opacity hover:opacity-80">
                Read more
                <ExternalLink className="h-2.5 w-2.5" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}