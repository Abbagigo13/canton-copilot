// lib/ecosystem.ts
export type Project = {
  slug: string;
  name: string;
  tagline: string;
  tags: string[];
  category: "AI & Agents" | "DeFi" | "Trading" | "Payments" | "DevTools" | "RWA" | "Bridges";
  votes: number;
  hearts: number;
  tvl?: string;
  featured?: boolean;
  live: boolean;
};

export const projects: Project[] = [
  {
    slug: "silvana",
    name: "Silvana",
    tagline: "Private, non-custodial, agentic DeFi Layer on Canton.",
    tags: ["AI & Agents", "Trading", "Exchanges"],
    category: "AI & Agents",
    votes: 52997,
    hearts: 29139,
    featured: true,
    live: true,
  },
  {
    slug: "temple",
    name: "Temple Digital Group",
    tagline: "24/7 non-custodial institutional trading, bridge, and asset issuance platform.",
    tags: ["Trading", "Exchange", "Bridge"],
    category: "Trading",
    votes: 309065,
    hearts: 113449,
    tvl: "$6.68M",
    live: true,
  },
  {
    slug: "send",
    name: "Send",
    tagline: "Peer-to-peer money built for global use. Privacy-first payments on Canton.",
    tags: ["Wallets", "Payments", "Stablecoin"],
    category: "Payments",
    votes: 236436,
    hearts: 89179,
    live: true,
  },
  {
    slug: "cashen",
    name: "Cashen",
    tagline: "Bilateral marketplace for locked Canton Coin (CC) delegations.",
    tags: ["Locked CC", "Fixed Yield", "Credit Marketplace"],
    category: "DeFi",
    votes: 134654,
    hearts: 68892,
    live: true,
  },
  {
    slug: "cantex",
    name: "Cantex",
    tagline: "Decentralized exchange on Canton Network with atomic settlement and self-custody.",
    tags: ["Wallets", "Trading", "Exchanges"],
    category: "DeFi",
    votes: 173933,
    hearts: 38743,
    tvl: "$640K",
    live: true,
  },
  {
    slug: "dorklabs",
    name: "Dork Labs",
    tagline: "Modular, cross-chain financial infrastructure for the next generation of blockchains.",
    tags: ["DeFi", "Lending"],
    category: "DeFi",
    votes: 97339,
    hearts: 34578,
    live: true,
  },
  {
    slug: "bitdynamics",
    name: "Bit Dynamics",
    tagline: "Open-source tooling layer for Canton: one-command LocalNet, live contract explorer, and more.",
    tags: ["Developer Tools", "Node Operations", "DEX"],
    category: "DevTools",
    votes: 50822,
    hearts: 34402,
    live: true,
  },
  {
    slug: "cantrustai",
    name: "CanTrustAI",
    tagline: "AI inference gateway with private x402 payments settled on Canton.",
    tags: ["Payments", "Developer Tools"],
    category: "AI & Agents",
    votes: 69703,
    hearts: 28547,
    live: true,
  },
  {
    slug: "onens",
    name: "OneNS",
    tagline: "Payments infrastructure for Canton — clean settlement flows for institutions.",
    tags: ["Payments", "Featured App"],
    category: "Payments",
    votes: 41820,
    hearts: 22104,
    live: true,
  },
  {
    slug: "tradecraft",
    name: "Tradecraft",
    tagline: "AMM protocol with the deepest CC liquidity pool on Canton.",
    tags: ["AMM", "DEX"],
    category: "DeFi",
    votes: 87214,
    hearts: 31009,
    tvl: "$3.74M",
    live: true,
  },
  {
    slug: "alpend",
    name: "Alpend",
    tagline: "Lending protocol for CC and CIP-56 tokens on Canton.",
    tags: ["Lending", "DeFi"],
    category: "DeFi",
    votes: 64330,
    hearts: 24889,
    tvl: "$3.10M",
    live: true,
  },
  {
    slug: "aurelis",
    name: "Aurelis Trust",
    tagline: "Tokenized bond issuance and lifecycle on Canton.",
    tags: ["RWA", "Bonds"],
    category: "RWA",
    votes: 39402,
    hearts: 18201,
    live: true,
  },
];

export const CATEGORIES = [
  "All",
  "AI & Agents",
  "DeFi",
  "Trading",
  "Payments",
  "DevTools",
  "RWA",
] as const;

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}