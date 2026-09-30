// components/LiveIndicator.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function LiveIndicator({
  lastUpdated,
  onRefresh,
}: {
  lastUpdated: Date;
  onRefresh: () => void;
}) {
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Recompute "seconds ago" every second
  useEffect(() => {
    const tick = () => {
      const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      setSecondsAgo(diff);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleClick = () => {
    setIsRefreshing(true);
    onRefresh();
    // Brief spin animation
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const label =
    secondsAgo < 5
      ? "just now"
      : secondsAgo < 60
        ? `${secondsAgo}s ago`
        : `${Math.floor(secondsAgo / 60)}m ago`;

  return (
    <div className="flex items-center gap-2">
            <span
        className="badge hidden sm:inline-flex"
        title="Institution and transaction detail on this page is a simulated overlay — Canton's privacy model doesn't expose this level of detail publicly. The Canton Coin panel and News tab are real live data."
      >
        <span className="h-1.5 w-1.5 rounded-full bg-canton-gold" />
        Simulated
      </span>

      <button
        type="button"
        onClick={handleClick}
        className="group inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-canton-black/60 px-2.5 py-1.5 text-xs text-canton-muted transition-colors hover:border-canton-cyan/40 hover:text-canton-text"
        aria-label="Refresh data"
      >
        <motion.span
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="inline-flex"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </motion.span>
        <span className="tabular">{label}</span>
      </button>
    </div>
  );
}