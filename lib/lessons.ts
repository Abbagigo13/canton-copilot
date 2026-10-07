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
        options: ["Faster transactions", "Sub-transaction privacy", "Cheaper fees", "Larger block size"],
        correct: 1,
      },
      {
        question: "What is the Global Synchronizer?",
        options: ["A wallet", "A smart contract", "Canton's shared infrastructure layer", "A token"],
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
        options: ["Lower fees", "Atomic settlement (no partial state)", "Faster block times", "Better UX"],
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
        options: ["Wallet keys", "Token interfaces", "Block times", "Validator selection"],
        correct: 1,
      },
    ],
  },
  {
    slug: "global-synchronizer",
    title: "The Global Synchronizer",
    level: "Intermediate",
    description: "How Canton coordinates atomic settlement across domains without exposing transaction contents.",
    duration: "14 min",
    xp: 38,
    badge: "synchronizer-scholar",
    sections: [
      {
        heading: "What it is",
        body: "The Global Synchronizer is Canton's shared coordination layer. It orders, sequences, and finalizes transactions across multiple participant domains — without any single validator seeing the full content of a transaction. It is secured by a set of Super Validators who run the protocol and earn CC rewards in return.",
      },
      {
        heading: "Why it exists",
        body: "If every domain ran independently, cross-domain settlement would need a trusted intermediary or a bridge — both of which reintroduce exactly the counterparty risk Canton was designed to eliminate. The Synchronizer gives Canton a shared settlement layer while preserving the privacy of individual domains.",
      },
      {
        heading: "Who secures it",
        body: "Super Validators are institutions that have been approved by a governance vote. Marex became one in September 2026. Each Super Validator commits to running the protocol, submitting evidence of delivery, and complying with the reward schedule tied to the network's CC issuance.",
      },
    ],
    quiz: [
      {
        question: "What does the Global Synchronizer do?",
        options: ["Stores all transactions publicly", "Coordinates atomic settlement across domains", "Issues CC", "Runs smart contracts"],
        correct: 1,
      },
      {
        question: "How do Super Validators earn rewards?",
        options: ["Selling user data", "Running the protocol and proving delivery", "Trading CC", "Minting NFTs"],
        correct: 1,
      },
    ],
  },
  {
    slug: "canton-coin",
    title: "Canton Coin (CC) Economics",
    level: "Beginner",
    description: "How CC works: mining rounds, rewards, DSO, and the CC/USD rate.",
    duration: "11 min",
    xp: 22,
    badge: "cc-economist",
    sections: [
      {
        heading: "What CC is",
        body: "Canton Coin is the network's native utility token. It pays for transaction fees, rewards validators, funds development via the DSO, and can be paid to Featured Apps that drive network activity. Unlike gas tokens on public chains, CC has a fixed issuance schedule and algorithmic supply mechanics.",
      },
      {
        heading: "Mining rounds",
        body: "Canton issues CC in discrete time windows called mining rounds — roughly every 10 minutes. Each round has an issuance target and allocates CC to featured app rewards, validator rewards, unfeatured app rewards, and the development fund. You can see the current round live on the Overview dashboard.",
      },
      {
        heading: "The DSO and CC/USD",
        body: "The DSO (Decentralized Synchronizer Operations) manages the network's economic parameters — including the CC/USD rate, which floats with market conditions. At the time of writing, CC is around $0.12. The DSO Party ID is also the identifier you'll see in ledger events.",
      },
    ],
    quiz: [
      {
        question: "How often does a Canton mining round close?",
        options: ["Every minute", "Roughly every 10 minutes", "Every hour", "Once a day"],
        correct: 1,
      },
    ],
  },
  {
    slug: "daml-basics",
    title: "Daml Smart Contracts",
    level: "Intermediate",
    description: "How Daml contracts define signatories, observers, and multi-party workflows on Canton.",
    duration: "20 min",
    xp: 52,
    badge: "daml-developer",
    sections: [
      {
        heading: "Contract structure",
        body: "A Daml contract has three essential parts: a template that defines its schema, a set of signatories (who must consent to its creation), and a set of observers (who can see but not act). Every contract's visibility is determined at the ledger level by these party lists — not by the application layer.",
      },
      {
        heading: "Choices and state transitions",
        body: "Contracts advance through choices — functions that consume the current contract and produce new ones. A DvP contract, for example, has an accept choice that atomically transfers both legs. If either leg fails, both fail. There is no partial state.",
      },
      {
        heading: "Where Daml differs from Solidity",
        body: "Solidity contracts are public by default. Daml contracts are private by default — a contract only exists on the ledgers of its signatories and observers. This is why Canton can support institutional workflows that public chains cannot: privacy is enforced by the language and the ledger, not by convention.",
      },
    ],
    quiz: [
      {
        question: "What determines who can see a Daml contract?",
        options: ["The application code", "The signatories and observers list at the ledger level", "A server-side database", "The token metadata"],
        correct: 1,
      },
      {
        question: "What happens if one leg of an atomic DvP fails?",
        options: ["Partial settlement", "Both legs fail", "The contract pauses", "A human intervenes"],
        correct: 1,
      },
    ],
  },
  {
    slug: "privacy-model",
    title: "Canton's Privacy Model",
    level: "Advanced",
    description: "Why sub-transaction privacy is a ledger invariant, not an application promise.",
    duration: "16 min",
    xp: 62,
    badge: "privacy-expert",
    sections: [
      {
        heading: "Privacy as an invariant",
        body: "On public blockchains, privacy is a feature you bolt on — mixers, ZK proofs, off-chain channels. On Canton, privacy is an invariant: a contract is only ever replicated to the nodes of its parties. There is no global state that contains the transaction — so there is nothing to leak.",
      },
      {
        heading: "Sub-transaction privacy",
        body: "Unlike ZK-rollups (which hide data but reveal proofs on a shared chain) or privacy-coins (which hide sender and receiver but reveal amounts to the validator), Canton's privacy operates at the level of the individual contract. Two parties in the same transaction see different views of it.",
      },
      {
        heading: "Implications for analytics",
        body: "Because each participant sees only their own scope, there is no global index — which is why Canton has no block explorer, and why products like Copilot must respect party rights at the ledger level. This is a feature, not a limitation: it's what makes Canton suitable for institutional finance.",
      },
    ],
    quiz: [
      {
        question: "How is Canton's privacy different from a ZK-rollup?",
        options: ["It's faster", "It hides data at the contract level, not the proof level", "It uses more gas", "It's centralized"],
        correct: 1,
      },
    ],
  },
  {
    slug: "grofty-wallet",
    title: "Grofty Wallet & CIP-0103",
    level: "Beginner",
    description: "How Canton wallets work, what CIP-0103 is, and how to sign transactions safely.",
    duration: "12 min",
    xp: 28,
    badge: "wallet-adopter",
    sections: [
      {
        heading: "What a Canton wallet does",
        body: "A Canton wallet holds your party keys and signs transactions on your behalf. Unlike Ethereum wallets, Canton wallets also manage party IDs — the on-ledger identity that determines what you can see and act on. Grofty Wallet is the CIP-0103 standard dApp wallet for Canton.",
      },
      {
        heading: "CIP-0103 in one minute",
        body: "CIP-0103 is Canton's dApp wallet announcement standard. It lets any CIP-0103 dApp discover and connect to any CIP-0103 wallet automatically — no per-wallet integration needed. Grofty implements it, and PartyLayer is a reference CIP-0103 wallet picker.",
      },
      {
        heading: "Self-custody vs custodial",
        body: "Self-custody wallets (like Grofty) keep your keys locally — you sign every transaction, and no third party can move funds. Custodial wallets hold keys on your behalf, which is more convenient but introduces counterparty risk. For institutional Canton users, self-custody is the norm.",
      },
    ],
    quiz: [
      {
        question: "What does CIP-0103 standardize?",
        options: ["Token transfers", "dApp wallet discovery and connection", "Validator selection", "Mining rounds"],
        correct: 1,
      },
    ],
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}