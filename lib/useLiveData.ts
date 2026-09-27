// lib/useLiveData.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { dashboardMetrics } from "./mockData";

export function useLiveData() {
  const [data, setData] = useState(dashboardMetrics);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Function that nudges the KPI values (simulates live data)
  const jitter = useCallback(() => {
    setData((prev) => ({
      ...prev,
      kpis: {
        settledVolume: {
          ...prev.kpis.settledVolume,
          value: +(prev.kpis.settledVolume.value + (Math.random() * 4 - 2)).toFixed(1),
        },
        transactions: {
          ...prev.kpis.transactions,
          value: Math.floor(prev.kpis.transactions.value + Math.random() * 20),
        },
        activeParties: {
          ...prev.kpis.activeParties,
          value: Math.floor(prev.kpis.activeParties.value + Math.random() * 5),
        },
        settlementRate: {
          ...prev.kpis.settlementRate,
          value: +(99 + Math.random()).toFixed(1),
        },
      },
    }));
    setLastUpdated(new Date());
  }, []);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(jitter, 30000);
    return () => clearInterval(interval);
  }, [jitter]);

  return { data, lastUpdated, refresh: jitter };
}