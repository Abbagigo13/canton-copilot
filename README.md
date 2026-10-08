# Canton Copilot

> The AI layer for the Canton Network — an analytics copilot that reads your scoped ledger and answers in plain English.

**Live demo:** https://canton-copilot.vercel.app/dashboard
**Demo video:** [PASTE LOOM/YOUTUBE LINK]
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
- **11 dashboard pages** — Overview, Transactions, Counterparties, Assets, Copilot, Compliance, Contracts, News, Learn, Profile, Ecosystem
- **Ecosystem directory** — 12 Canton projects with filters + per-project AI queries
- **Learn & Earn** — 8 lessons with quizzes, XP, and badges (persisted in localStorage)
- **Anomaly detection** — flags counterparties >2σ off baseline with AI-generated investigations
- **Command palette (⌘K)** — navigate anywhere or fire AI actions from one keystroke
- **Grofty wallet gate** — 5 free AI queries, then 1 CC unlocks unlimited
- **Transaction drawer** — click any activity row for full Daml payload + "Ask Copilot"

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, React Three Fiber, Framer Motion, Recharts
- **AI:** Qwen (Alibaba DashScope, Singapore endpoint) — streaming, cached
- **Live data:** gRPC via `@grpc/grpc-js`, Silvana DevNet
- **Wallet:** Grofty dApp SDK (`@groftylabs/dapp-sdk`, CIP-0103 compatible)
- **State:** localStorage for chat history, learning progress, wallet session

## Run Locally

```bash
npm install
echo "DASHSCOPE_API_KEY=sk-your-key" > .env.local
npm run dev

Open http://localhost:3000 — dashboard is at http://localhost:3000/dashboard.

npm install takes 1–2 minutes. If npm warns about peer dependencies, ignore it; if it errors, run npm install --legacy-peer-deps.

Requires Node 18.17+ (Node 20 LTS recommended).

Optional: connect Qwen
The AI chat requires DASHSCOPE_API_KEY to be set in .env.local. Without it, the API route returns an error — there is no fallback demo mode.
cp .env.example .env.local   # then paste your DashScope key
Restart npm run dev after editing .env.local.

Wallet Gate (Grofty Integration)
The AI copilot is wallet-gated: 5 free queries, then 1 CC unlocks unlimited.

Connect flow uses Grofty's official dApp SDK via CIP-0103 discovery

If the Grofty Chrome extension isn't installed, the app falls back to a simulated wallet (dev mode) so the flow remains demo-able

Payment is simulated in this build — the CC transfer modal, balance decrement, and unlock logic all run client-side

Production flow (documented as roadmap):

1.User signs a 1 CC transfer via the Grofty extension

2.Canton ledger atomically settles to the app's merchant party (canton-copilot-merchant::1220…)

3.Backend listens for the settlement event, verifies it, marks the wallet as premium

4.Premium state persists across sessions
This demonstrates a viable monetization model — CC micro-payments per AI session — enabled by Canton's atomic settlement.

Data	Status	Source
CC/USD rate, mining rounds, DSO state	Live	Silvana DevNet gRPC (lib/silvana.ts → /api/ledger/dso)
Assets — Canton Coin card	Live	Same Silvana source
Transactions — mining round issuance rows	Live	issuingMiningRounds from /api/ledger/dso
Network-wide validator/round stats	Attempted, blocked	Public Global Synchronizer Scan API returned 403 from both local and Vercel-hosted requests. API key application to cctools.network pending.
Overview KPIs, charts, activity table	Simulated	Canton's privacy model doesn't expose per-party transaction detail publicly — only the participant's own node ever sees it. Illustrative of what an institution's own deployment would show. Labeled "Simulated" in UI.
Counterparties, Contracts, Compliance, News, Learn	Simulated	Illustrative overlays, labeled in-page where applicable.
AI responses	Live	Qwen (Alibaba DashScope) with streaming + LRU/TTL cache. Page context is drawn from the page's own data (mock or live).
Everything above reflects what's actually reachable without institutional API keys. The dashboard was built to degrade honestly rather than fake live access.

File Structure
Path	What it is
app/page.tsx	Landing page — 3D hero, scroll animations, features, how-it-works
app/dashboard/layout.tsx	Dashboard shell: sidebar, mobile nav, AI chat panel
app/dashboard/*/page.tsx	11 dashboard pages (Overview, Transactions, etc.)
app/api/ai/route.ts	Qwen endpoint with streaming + LRU/TTL cache
app/api/ledger/dso/route.ts	Silvana gRPC proxy — returns live CC/USD + mining rounds
components/Hero3D.tsx	R3F network globe (2,200 points, pauses off-screen)
components/AIChat.tsx	Chat panel — streaming, page-aware, persisted
components/CantonCoinPanel.tsx	Live CC/USD + mining round display
components/CommandPalette.tsx	⌘K palette for navigation + AI actions
components/TransactionDrawer.tsx	Slide-in Daml contract detail + "Ask Copilot"
components/ConnectWalletButton.tsx	Grofty wallet connect flow
components/PremiumGate.tsx	Free-queries-exhausted paywall
lib/qwen.ts	Qwen client config
lib/silvana.ts	gRPC client for Silvana DevNet
lib/wallet.tsx	Wallet context (Grofty + fallback)
lib/lessons.ts	8 lessons for the Learn page
lib/mockData.ts	Simulated institutional data
proto/silvana/ledger/v1/*.proto	gRPC proto definitions
Token Budget
1.Every AI answer is cached for 1 hour, keyed on pageName + prompt + context slice — repeat questions cost 0 tokens

2.System prompt ships a compact page-context snapshot instead of a schema dump

3.Output capped at 300 tokens per answer via max_tokens

4.Streaming responses so the user sees tokens as they generate

5.Logs show 📡 Qwen call [Page] "…" on API hits and ✅ Cache hit for [Page] "…" on cache hits

Notes
.Uses React 18 + Next 14 + R3F v8 deliberately; R3F v9 requires React 19.

.Not affiliated with Digital Asset or the Canton Foundation.

.Built for HackCanton Season 3, Track 4 (Data, Analytics & Ecosystem Dashboards).

.Grofty Wallet Bounty submission — wallet integration in core AI flow.

---

### 📌 What to Do Now

1. **Open your GitHub README** (https://github.com/Abbagigo13/canton-copilot)
2. Click the pencil icon to edit
3. **Select all, delete, paste the new README above**
4. Replace `[PASTE LOOM/YOUTUBE LINK]` with your actual video URL once you record
5. Commit with message: `Update README with accurate live/simulated labeling and wallet section`

---

### 🎬 Then — Video

You have **~1 day**. Video is the last critical piece.

**Reply with:**
- ✅ **"README updated"** → I'll give you the final submission checklist
- 🎬 **"Recording now"** → go get it done, come back when the URL is live

Go update the README, then record. 🚀
