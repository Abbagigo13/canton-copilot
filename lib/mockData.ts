// lib/mockData.ts

export const dashboardMetrics = {
  // KPI values (used by the page + sent to the AI as context)
  kpis: {
    settledVolume: { value: 901.4, change: 18.4, trend: "up" as const },
    transactions: { value: 7124, change: 11.2, trend: "up" as const },
    activeParties: { value: 1284, change: 6.8, trend: "up" as const },
    settlementRate: { value: 99.2, change: -0.4, trend: "down" as const },
  },

  // Volume history (area chart)
  volumeHistory: [
    { day: "Mon", volume: 96, transactions: 820, topCounterparty: "Bank A" },
    { day: "Tue", volume: 118, transactions: 1042, topCounterparty: "Fund B" },
    { day: "Wed", volume: 104, transactions: 934, topCounterparty: "Corp C" },
    { day: "Thu", volume: 149, transactions: 1310, topCounterparty: "Bank A" },
    { day: "Fri", volume: 186, transactions: 1588, topCounterparty: "Bank A", reason: "Large DvP settlement of $50M" },
    { day: "Sat", volume: 121, transactions: 742, topCounterparty: "Fund B" },
    { day: "Sun", volume: 127, transactions: 688, topCounterparty: "Corp C" },
  ],

  // App usage (bar chart)
  appUsage: [
    { app: "Tokenized Bonds", calls: 4820, tone: "cyan" as const },
    { app: "DvP Settlement", calls: 3910, tone: "cyan" as const },
    { app: "Payments", calls: 2640, tone: "gold" as const },
    { app: "Asset Registry", calls: 1780, tone: "cyan" as const },
    { app: "Collateral", calls: 1120, tone: "cyan" as const },
  ],

  // Recent activity table
  recentActivity: [
    { party: "Meridian Capital", action: "Coupon distribution", amount: "$18.4M", status: "settled" as const, time: "2m ago" },
    { party: "Halden Securities", action: "DvP allocation", amount: "$5.2M", status: "pending" as const, time: "9m ago" },
    { party: "Nordveil Bank", action: "Collateral pledge", amount: "$2.8M", status: "settled" as const, time: "17m ago" },
    { party: "Kestrel Asset Mgmt", action: "Settlement instruction", amount: "$940K", status: "failed" as const, time: "24m ago" },
    { party: "Aurelis Trust", action: "Bond issuance", amount: "$40.0M", status: "settled" as const, time: "38m ago" },
  ],
};

export type DashboardMetrics = typeof dashboardMetrics;

// Filter helpers for interactive charts
export function getFilteredData(appName: string | null, data: typeof dashboardMetrics) {
  if (!appName) return data;

  // Simulate filtering by scaling the volume data based on the selected app
  const appFactors: Record<string, number> = {
    "Tokenized Bonds": 0.35,
    "DvP Settlement": 0.28,
    "Payments": 0.18,
    "Asset Registry": 0.12,
    "Collateral": 0.07,
  };

  const factor = appFactors[appName] ?? 1;

  return {
    ...data,
    volumeHistory: data.volumeHistory.map((d) => ({
      ...d,
      volume: Math.round(d.volume * factor),
      transactions: Math.round(d.transactions * factor),
    })),
    recentActivity: data.recentActivity.filter((row) => {
      const action = row.action.toLowerCase();
      if (appName === "Tokenized Bonds") return action.includes("bond") || action.includes("coupon");
      if (appName === "DvP Settlement") return action.includes("dvp") || action.includes("settlement");
      if (appName === "Payments") return action.includes("payment");
      if (appName === "Asset Registry") return action.includes("registration") || action.includes("issuance");
      if (appName === "Collateral") return action.includes("collateral");
      return true;
    }),
  };
}

// ---------- Counterparties ----------
export const counterparties = [
  { id: "meridian", name: "Meridian Capital", exposure: 12480000, volume30d: 42100000, transactions: 142, status: "active" as const, since: "2024-03-12" },
  { id: "halden", name: "Halden Securities", exposure: 5210000, volume30d: 18900000, transactions: 87, status: "active" as const, since: "2024-06-04" },
  { id: "nordveil", name: "Nordveil Bank", exposure: 2870000, volume30d: 11200000, transactions: 63, status: "active" as const, since: "2024-08-21" },
  { id: "kestrel", name: "Kestrel Asset Mgmt", exposure: 940000, volume30d: 4100000, transactions: 21, status: "review" as const, since: "2025-01-15" },
  { id: "aurelis", name: "Aurelis Trust", exposure: 40000000, volume30d: 88000000, transactions: 204, status: "active" as const, since: "2023-11-30" },
  { id: "corvus", name: "Corvus Partners", exposure: 1730000, volume30d: 6800000, transactions: 39, status: "active" as const, since: "2024-12-09" },
];

// ---------- Assets ----------
export const assets = [
  { id: "tb-2026-q1", name: "Tokenized Bond 2026-Q1", type: "Bond", supply: "$42.0M", holders: 18, issued: "2026-01-15", maturity: "2027-01-15", status: "active" as const, tone: "cyan" as const },
  { id: "dvp-eur-usd", name: "DvP Settlement Pool", type: "Settlement", supply: "$128.4M", holders: 6, issued: "2025-06-01", maturity: "rolling", status: "active" as const, tone: "cyan" as const },
  { id: "pay-net", name: "Payment Network", type: "Payments", supply: "$12.8M", holders: 24, issued: "2024-02-10", maturity: "rolling", status: "active" as const, tone: "gold" as const },
  { id: "reg-eu", name: "Asset Registry — EU", type: "Registry", supply: "—", holders: 142, issued: "2023-10-01", maturity: "—", status: "active" as const, tone: "cyan" as const },
  { id: "col-prime", name: "Prime Collateral Pool", type: "Collateral", supply: "$8.9M", holders: 4, issued: "2025-09-12", maturity: "rolling", status: "active" as const, tone: "cyan" as const },
  { id: "tb-legacy", name: "Legacy Bond 2024-C", type: "Bond", supply: "$0", holders: 0, issued: "2024-04-01", maturity: "2026-04-01", status: "matured" as const, tone: "cyan" as const },
];

// ---------- Compliance ----------
export const complianceAlerts = [
  { id: "CA-001", severity: "high" as const, party: "Kestrel Asset Mgmt", issue: "Settlement instruction failed", detail: "Counterparty did not confirm instruction within SLA window (24h).", time: "24m ago", action: "Escalate" },
  { id: "CA-002", severity: "medium" as const, party: "Halden Securities", issue: "Unsettled DvP approaching T+2", detail: "Trade aged beyond standard settlement window.", time: "1h ago", action: "Review" },
  { id: "CA-003", severity: "low" as const, party: "Nordveil Bank", issue: "Collateral revaluation due", detail: "Scheduled daily revaluation pending for 3 instruments.", time: "3h ago", action: "Schedule" },
  { id: "CA-004", severity: "high" as const, party: "Corvus Partners", issue: "Unusual activity spike", detail: "Transaction volume 4.2x above 30-day baseline.", time: "5h ago", action: "Investigate" },
  { id: "CA-005", severity: "medium" as const, party: "Aurelis Trust", issue: "Bond issuance KYC refresh due", detail: "Investor KYC documents expire in 7 days.", time: "8h ago", action: "Notify" },
];

// ---------- Contracts ----------
export const contracts = [
  { id: "0000a3f1", template: "Main.Iou", parties: ["Bank A", "Meridian Capital"], status: "active" as const, created: "2026-09-12", payload: { amount: "1.2M", currency: "USD", issuer: "Bank A" } },
  { id: "0000a3f2", template: "Main.Asset", parties: ["Fund B", "Aurelis Trust"], status: "active" as const, created: "2026-09-14", payload: { assetId: "tb-2026-q1", quantity: 42000000, owner: "Aurelis Trust" } },
  { id: "0000a3f3", template: "Main.DvP", parties: ["Halden Securities", "Nordveil Bank"], status: "pending" as const, created: "2026-09-15", payload: { delivery: "tb-2026-q1", payment: "5.2M USD" } },
  { id: "0000a3f4", template: "Main.Collateral", parties: ["Nordveil Bank", "Bank A"], status: "active" as const, created: "2026-09-10", payload: { amount: "2.8M", currency: "USD" } },
  { id: "0000a3f5", template: "Main.Settlement", parties: ["Kestrel Asset Mgmt", "Meridian Capital"], status: "archived" as const, created: "2026-09-08", payload: { amount: "940K", currency: "USD" } },
];


// ---------- Anomaly Detection ----------

export type Anomaly = {
  id: string;
  severity: "high" | "medium";
  party: string;
  metric: string;
  baseline: number;
  current: number;
  deviation: number;
  description: string;
  suggestedAction: string;
};

export function detectAnomalies(data: typeof dashboardMetrics): Anomaly[] {
  const anomalies: Anomaly[] = [];

  const baselines: Record<string, { dailyVolume: number; dailyTx: number }> = {
    "Meridian Capital": { dailyVolume: 30, dailyTx: 4 },
    "Halden Securities": { dailyVolume: 12, dailyTx: 3 },
    "Nordveil Bank": { dailyVolume: 8, dailyTx: 2 },
    "Kestrel Asset Mgmt": { dailyVolume: 10, dailyTx: 3 },
    "Aurelis Trust": { dailyVolume: 55, dailyTx: 6 },
    "Corvus Partners": { dailyVolume: 5, dailyTx: 1 },
  };

  const currentDay: Record<string, { volume: number; tx: number }> = {
    "Meridian Capital": { volume: 42, tx: 5 },
    "Halden Securities": { volume: 15, tx: 4 },
    "Nordveil Bank": { volume: 7, tx: 2 },
    "Kestrel Asset Mgmt": { volume: 2, tx: 1 },
    "Aurelis Trust": { volume: 22, tx: 2 },
    "Corvus Partners": { volume: 14, tx: 4 },
  };

  for (const [party, base] of Object.entries(baselines)) {
    const curr = currentDay[party];
    if (!curr) continue;

    const volumeDev =
      (curr.volume - base.dailyVolume) /
      Math.max(base.dailyVolume * 0.3, 1);
    const txDev =
      (curr.tx - base.dailyTx) / Math.max(base.dailyTx * 0.3, 1);
    const maxDev = Math.max(Math.abs(volumeDev), Math.abs(txDev));

    if (maxDev >= 2.5) {
      const isSpike = volumeDev > 0;
      anomalies.push({
        id: `AN-${party.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        severity: maxDev >= 4 ? "high" : "medium",
        party,
        metric: "Daily volume",
        baseline: base.dailyVolume,
        current: curr.volume,
        deviation: +maxDev.toFixed(1),
        description: isSpike
          ? `${party}'s daily volume is ${volumeDev.toFixed(1)}σ above baseline — possible liquidity event or coordinated activity.`
          : `${party}'s volume is ${Math.abs(volumeDev).toFixed(1)}σ below baseline — workflow may be stalled.`,
        suggestedAction: isSpike
          ? "Investigate the source of unusual activity."
          : "Check for stalled settlement or failed instructions.",
      });
    }
  }

  return anomalies.sort((a, b) => b.deviation - a.deviation);
}

// ---------- Canton News ----------
export const news = [
  {
    id: "n1",
    title: "Marex wins approval for Canton Super Validator role",
    source: "CantonNews",
    category: "Network",
    time: "2h ago",
    body: "Marex has been approved by the Canton Foundation to participate in the Super Validator program, following a 9-4 vote on September 25. The firm will operate across clearing, financing, and collateral services for regulated customers.",
  },
  {
    id: "n2",
    title: "Digital Asset releases Daml Smart Contract Audit framework",
    source: "AppsFactory",
    category: "Governance",
    time: "8h ago",
    body: "A new audit framework from Digital Asset provides standardized checks for Daml smart contracts deployed on Canton. The framework includes automated verification of privacy guarantees and template invariants.",
  },
  {
    id: "n3",
    title: "Canton Network exceeds 47,000 tracked contracts",
    source: "CCTools",
    category: "Ecosystem",
    time: "1d ago",
    body: "Total active contracts on the Global Synchronizer crossed 47,000 this week, with tokenized bonds and DvP settlement driving the majority of volume. Silvana, Temple Digital, and Send lead the ecosystem by TVL.",
  },
  {
    id: "n4",
    title: "CIP-56 token standard reaches final review",
    source: "Canton Core",
    category: "Governance",
    time: "2d ago",
    body: "The CIP-56 token standard for multi-issuer instruments is now in final review. It introduces a canonical interface for tokenized assets and preapproval-based spending allowances.",
  },
  {
    id: "n5",
    title: "HackCanton Season 3 registration closes with 353 teams",
    source: "AppsFactory",
    category: "Ecosystem",
    time: "3d ago",
    body: "Season 3 has drawn 353 unique teams from 48 countries. Five tracks: RWA, DeFi, Funds/DAOs, Data/Analytics, and Open. Submission deadline is October 9, 2026.",
  },
  {
    id: "n6",
    title: "Silvana launches agentic DeFi layer on Canton",
    source: "Silvana",
    category: "Ecosystem",
    time: "4d ago",
    body: "Silvana's private, non-custodial agentic DeFi layer is now live on Canton DevNet. It enables autonomous agents to trade and settle without exposing strategies — with private RFQ and atomic DvP.",
  },
  {
    id: "n7",
    title: "Canton Foundation approves two new Super Validators",
    source: "Canton Foundation",
    category: "Network",
    time: "5d ago",
    body: "Two additional Super Validator operators have been approved, expanding the network's validator set. The approval followed a governance vote with over 60% participation.",
  },
];