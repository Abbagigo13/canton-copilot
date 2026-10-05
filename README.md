# Canton Copilot

> The AI layer for the Canton Network — an analytics copilot that reads your scoped ledger and answers in plain English.

**Live demo:** https://canton-copilot.vercel.app/dashboard
**Demo video:** [PASTE YOUR LOOM/YOUTUBE LINK]
**Submission:** HackCanton Season 3 · Track 4 (Data, Analytics & Ecosystem Dashboards)

---

## Why Canton?

Canton is the only blockchain where **privacy is a ledger-level invariant** — not an application-layer promise. Every party sees only the contracts they are authorized to see, enforced by the protocol itself.

This is Canton's greatest strength. It's also why there's no block explorer, no shared index, and no way for an institutional participant to see their own counterparty exposure in real time. Daml queries are a specialist skill most treasury and compliance staff will never learn.

**Canton Copilot closes that gap.** It's an AI that inherits the caller's party rights, reads what the participant node is authorized to see, and answers operational questions in plain English — without leaking anything outside the visibility scope.

On any other chain, this product couldn't exist. On Canton, it has to exist.

---

## What It Does

- **Live Canton data** — CC/USD rate, mining rounds, DSO state streaming from Silvana's DevNet gRPC endpoint (`orderbook-devnet.silvana.dev:443`)
- **AI Copilot on every page** — Qwen-powered, page-aware, streaming responses, token-efficient caching
- **8 dashboard pages** — Overview, Transactions, Counterparties, Assets, Copilot, Compliance, Contracts, News
- **Ecosystem directory** — 12 Canton projects with category filters and per-project AI queries
- **Learn & Earn** — 3 lesson paths with quizzes, XP, and badges stored in localStorage
- **Anomaly detection** — flags counterparties >2σ off baseline with AI-generated investigations
- **Command palette (⌘K)** — navigate anywhere or fire AI actions from one keystroke
- **Grofty wallet gate** — 5 free AI queries, then 1 CC payment to unlock unlimited
- **Transaction drawer** — click any activity row for full Daml payload + "Ask Copilot"

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, React Three Fiber, Framer Motion, Recharts
- **AI:** Qwen (Alibaba DashScope, Singapore endpoint)
- **Live data:** gRPC via `@grpc/grpc-js`, Silvana DevNet
- **Wallet:** Grofty dApp SDK (CIP-0103)

## Run Locally

```bash
npm install
echo "DASHSCOPE_API_KEY=sk-your-key" > .env.local
npm run dev

Open <http://localhost:3000> — the dashboard is at <http://localhost:3000/dashboard>.

`npm install` takes 1–2 minutes (three.js and Next are the big ones). If npm
warns about peer dependencies, it is safe to ignore; if it *errors*, run
`npm install --legacy-peer-deps`.

Requires Node 18.17+ (Node 20 LTS recommended).

## Optional: connect Qwen

The AI chat works with no configuration — it serves built-in demo answers and
labels them "demo data". To use the real model:

```bash
cp .env.example .env.local   # then paste your DashScope key
```

Restart `npm run dev` after editing `.env.local`.

## What's where

| Path                           | What it is                                                        |
| ------------------------------ | ----------------------------------------------------------------- |
| `app/page.tsx`                 | Landing page: 3D hero, scroll animations, features, how it works  |
| `app/dashboard/page.tsx`       | Dashboard: sidebar, header, 4 KPI cards, 2 charts, activity table |
| `app/api/ai/route.ts`          | Qwen endpoint with LRU+TTL cache, rate limit and token budget     |
| `components/Hero3D.tsx`        | R3F network globe — 2,200 points, pauses when scrolled out of view |
| `components/DashboardCard.tsx` | KPI card with count-up number and animated sparkline              |
| `components/AIChat.tsx`        | Chat panel with pulsing "thinking" state and typewriter reveal   |
| `lib/qwen.ts`                  | Qwen client, compressed ledger context, token accounting         |

## Token budget

- Every answer is cached for 1 hour, keyed on a normalised prompt — repeat
  questions cost 0 tokens and are served even after the budget guard trips.
- The system prompt ships a compact ledger snapshot (~330 tokens) instead of a
  schema dump, and only the last 4 conversation turns are sent.
- Output is capped at 550 tokens per answer, so ~500 fresh questions fit in 500k.
- `GET /api/ai` returns live usage, cache size and hit count.

## Data sources

| Data | Status | Source |
| ---- | ------ | ------ |
| Canton Coin price, mining rounds, DSO info | **Live** | Silvana DevNet gRPC (`lib/silvana.ts` → `/api/ledger/dso`) |
| News | **Live** | Canton Foundation forum RSS (`/api/news`) |
| Network-wide validator/round stats | Attempted, blocked | The public Global Synchronizer Scan API (`scan.sv-1.global.canton.network.sync.global`) returned `403` from both local and Vercel-hosted requests — likely a datacenter-IP block on their end, not something fixable client-side. An API key application to `cctools.network` for elevated access is pending. |
| Institution-level activity (Counterparties, Contracts, Compliance alerts, Overview KPIs) | Simulated overlay | Canton's privacy model doesn't expose per-party transaction detail publicly — only the involved parties' own nodes ever see it. This panel is illustrative of what an institution's own Canton Copilot deployment would show once connected to their participant node, clearly labeled "Simulated" in the UI. |
| Assets — Canton Coin card | **Live** | Silvana DevNet gRPC (`/api/ledger/dso`), same source as the CC price panel. The rest of the Assets tab (tokenized bonds, registries) is simulated. |
| Transactions — top rows | **Live** | Mining round issuance events from Silvana DevNet (`/api/ledger/dso` → `issuingMiningRounds`), real round numbers and reward amounts. Rows below are simulated institutional settlements. |

We applied for elevated Canton API access (`cctools.network`) to cover the remaining institutional-level data, pending as of writing. Everything above reflects what's live without that key — the dashboard was built to degrade honestly rather than wait.

## Notes

- Uses React 18 + Next 14 + R3F v8 deliberately; R3F v9 requires React 19.
- Not affiliated with Digital Asset.
