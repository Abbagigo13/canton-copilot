# Canton Copilot

AI intelligence layer for the Canton Network. Built for HackCanton Season 3.

Next.js 14 (App Router) · TypeScript · Tailwind · React Three Fiber · Framer Motion · Recharts · Qwen

## Run it

```bash
npm install
npm run dev
```

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
