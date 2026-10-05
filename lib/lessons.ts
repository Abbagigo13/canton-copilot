// lib/lessons.ts
export type Lesson = {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  duration: string;
  xp: number;
  badge: string;
  sections: { heading: string; body: string }[];
  quiz: { question: string; options: string[]; correct: number }[];
};

export const lessons: Lesson[] = [
  {
    slug: "canton-fundamentals",
    title: "Canton Fundamentals",
    level: "Beginner",
    description: "Learn the basics of Canton Network, CC token, and governance.",
    duration: "12 min",
    xp: 26,
    badge: "canton-scholar",
    sections: [
      {
        heading: "What is Canton Network?",
        body: "Canton is a privacy-first blockchain network designed for institutional finance. Unlike public chains, Canton uses sub-transaction privacy — each party sees only the contracts they are authorized to see. There is no shared global state visible to all participants.",
      },
      {
        heading: "The Global Synchronizer",
        body: "The Global Synchronizer is Canton's shared infrastructure layer. It coordinates atomic settlement across multiple domains without revealing transaction contents. Super Validators secure it by running the protocol and earning CC rewards.",
      },
      {
        heading: "Canton Coin (CC)",
        body: "CC is the network's native utility token. It's used for transaction fees, validator rewards, and app rewards. The CC/USD rate is currently around $0.12 and fluctuates based on mining round activity.",
      },
    ],
    quiz: [
      {
        question: "What makes Canton different from public blockchains?",
        options: [
          "Faster transactions",
          "Sub-transaction privacy",
          "Cheaper fees",
          "Larger block size",
        ],
        correct: 1,
      },
      {
        question: "What is the Global Synchronizer?",
        options: [
          "A wallet",
          "A smart contract",
          "Canton's shared infrastructure layer",
          "A token",
        ],
        correct: 2,
      },
    ],
  },
  {
    slug: "defi-on-canton",
    title: "DeFi on Canton",
    level: "Intermediate",
    description: "Understand how DeFi protocols work on Canton and how to read APY.",
    duration: "18 min",
    xp: 46,
    badge: "defi-graduate",
    sections: [
      {
        heading: "AMMs vs Order Books",
        body: "Canton supports both automated market makers (AMMs) and order-book DEXs. Temple Digital leads with an order-book model at $6.68M TVL; Tradecraft and Cantex use AMMs. Each has different liquidity and pricing tradeoffs.",
      },
      {
        heading: "Reading APY",
        body: "APY on Canton pools reflects fee income divided by liquidity, annualized. Pools showing >15% APY usually have high volatility or low liquidity. Prime pools (CC/USDCx) typically sit in the 8-12% range.",
      },
      {
        heading: "Settlement Finality",
        body: "Canton's atomic settlement means a DvP transaction either fully succeeds or fully fails — there is no partial state. This is a key advantage for institutional DeFi over Ethereum's asynchronous settlement.",
      },
    ],
    quiz: [
      {
        question: "What's the primary advantage of Canton's settlement model?",
        options: [
          "Lower fees",
          "Atomic settlement (no partial state)",
          "Faster block times",
          "Better UX",
        ],
        correct: 1,
      },
    ],
  },
  {
    slug: "rwa-on-canton",
    title: "Real-World Assets on Canton",
    level: "Intermediate",
    description: "Tokenized RWA on Canton: compliance, settlement, and the wrapped-asset alphabet.",
    duration: "15 min",
    xp: 46,
    badge: "rwa-expert",
    sections: [
      {
        heading: "Why RWA needs privacy",
        body: "Real-world assets like bonds, equities, and commodities involve regulated parties with confidentiality requirements. Canton's privacy model lets a bond issuer reveal only the relevant terms to each investor — not the full cap table.",
      },
      {
        heading: "CIP-56 Token Standard",
        body: "CIP-56 is Canton's canonical token interface. It supports multi-issuer instruments, preapproval-based spending, and canonical transfer semantics. It's currently in final review.",
      },
    ],
    quiz: [
      {
        question: "What does CIP-56 standardize?",
        options: [
          "Wallet keys",
          "Token interfaces",
          "Block times",
          "Validator selection",
        ],
        correct: 1,
      },
    ],
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}