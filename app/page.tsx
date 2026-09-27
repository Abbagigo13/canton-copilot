"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  EyeOff,
  FileSearch,
  Github,
  Layers,
  Radio,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";

// The globe is client-only and heavy; keep it out of the initial bundle.
const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-canton-radial" />,
});

/* ---------------------------- animation ---------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ data ------------------------------ */

const STATS = [
  { value: "1.2M+", label: "Ledger events indexed" },
  { value: "38", label: "Synchronizers tracked" },
  { value: "<1.4s", label: "Median answer latency" },
  { value: "100%", label: "Privacy-scoped queries" },
];

const PROBLEMS = [
  {
    icon: EyeOff,
    title: "Privacy hides the signal",
    body: "Canton's sub-transaction privacy is the point — but it means no block explorer can hand you a portfolio view. Teams end up guessing.",
  },
  {
    icon: FileSearch,
    title: "Daml is a specialist skill",
    body: "Answering \"what is my counterparty exposure today?\" means writing a query against contract templates most business users will never learn.",
  },
  {
    icon: TriangleAlert,
    title: "Risk shows up late",
    body: "Settlement failures and stalled workflows are discovered in a Monday report, not in the minute they happen.",
  },
];

const SOLUTIONS = [
  {
    icon: Bot,
    title: "Ask in plain English",
    body: "Copilot translates natural language into scoped ledger queries, runs them, and explains the result with the numbers attached.",
  },
  {
    icon: ShieldCheck,
    title: "Your visibility, enforced",
    body: "Every query inherits the caller's party rights. Copilot can only summarise contracts you are already a stakeholder on.",
  },
  {
    icon: Radio,
    title: "Live, not batched",
    body: "Streaming ledger updates feed the dashboard and the agent, so anomalies surface as they happen — with a suggested next action.",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "Natural-language ledger queries",
    body: "\"Show me all unsettled DvP trades over $5M\" becomes a typed query, executed and cited.",
    tone: "cyan" as const,
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    body: "Volume, settlement velocity, active parties and app usage in one live surface.",
    tone: "cyan" as const,
  },
  {
    icon: ShieldCheck,
    title: "Privacy-preserving by design",
    body: "No shared index, no data leaving your participant node's authorization scope.",
    tone: "gold" as const,
  },
  {
    icon: Layers,
    title: "Multi-app awareness",
    body: "Correlates activity across tokenized assets, payments and registry apps on one network.",
    tone: "cyan" as const,
  },
  {
    icon: Zap,
    title: "Anomaly alerts",
    body: "Statistical baselines per counterparty flag stalled workflows before they become breaks.",
    tone: "gold" as const,
  },
  {
    icon: FileSearch,
    title: "Auditable answers",
    body: "Every response links back to the contract IDs and offsets it was derived from.",
    tone: "cyan" as const,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Connect your participant node",
    body: "Point Copilot at a JSON Ledger API endpoint and hand it a read-scoped token. Nothing else is required.",
  },
  {
    step: "02",
    title: "Copilot builds a private index",
    body: "Events visible to your parties are normalised into a compact, in-scope schema the model can reason over.",
  },
  {
    step: "03",
    title: "Ask, monitor, act",
    body: "Query in natural language, watch the live dashboard, and get alerted when the network behaves unusually.",
  },
];

/* ------------------------------ page ------------------------------ */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <main className="relative overflow-hidden">
      {/* ------------------------------ nav ------------------------------ */}
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="glass mx-auto mt-4 flex w-[min(1160px,calc(100%-2rem))] items-center justify-between rounded-2xl px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-canton-cyan/12 ring-1 ring-canton-cyan/30">
              <Sparkles className="h-4 w-4 text-canton-cyan" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Canton<span className="text-canton-cyan">Copilot</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-canton-muted md:flex">
            <a href="#problem" className="transition-colors hover:text-canton-text">
              Problem
            </a>
            <a href="#features" className="transition-colors hover:text-canton-text">
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-canton-text">
              How it works
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost hidden sm:inline-flex"
              aria-label="View source on GitHub"
            >
              <Github className="h-4 w-4" />
              <span className="hidden lg:inline">Source</span>
            </a>
            <Link href="/dashboard" className="btn-primary">
              Launch app
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* --------------------- fixed 3D globe background --------------------- */}
      {/* The globe is now fixed and fills the entire viewport, running behind
          the nav and hero text. It stays put as the page scrolls. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Hero3D />
      </div>

      {/* ----------------------------- hero ----------------------------- */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center justify-center px-6 pt-28"
      >
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeUp}>
              <span className="badge">
                <span className="h-1.5 w-1.5 rounded-full bg-canton-cyan animate-pulse-glow" />
                HackCanton Season 3
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl"
            >
              The AI layer for the
              <br />
              <span className="text-gradient">Canton Network</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 max-w-xl text-balance text-base leading-relaxed text-canton-muted sm:text-lg"
            >
              A privacy-aware copilot that reads your ledger, answers in plain
              language, and shows you the network in real time — without ever
              leaving your visibility scope.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
            >
              <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
                Open the dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#problem" className="btn-ghost px-6 py-3 text-base">
                Why it matters
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* stats strip */}
        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 bottom-8 z-10 mx-auto grid w-[min(1000px,calc(100%-3rem))] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-canton-navy/70 backdrop-blur md:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-canton-navy/60 px-5 py-4 text-center">
              <dt className="tabular text-xl font-semibold text-canton-text sm:text-2xl">
                {s.value}
              </dt>
              <dd className="mt-0.5 text-[11px] uppercase tracking-wider text-canton-muted">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* -------------------------- problem / fix ------------------------- */}
      <section id="problem" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <span className="badge">The gap</span>
            <h2 className="mt-5 text-3xl font-semibold sm:text-5xl">
              Canton is private by design.
              <span className="text-canton-muted">
                {" "}
                That makes it hard to see.
              </span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            {/* problems */}
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-4"
            >
              <li className="mb-6 text-xs font-medium uppercase tracking-widest text-canton-muted">
                Today
              </li>
              {PROBLEMS.map((p) => (
                <motion.li
                  key={p.title}
                  variants={fadeUp}
                  className="card card-hover p-5"
                >
                  <div className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/8 ring-1 ring-red-500/20">
                      <p.icon className="h-5 w-5 text-red-400/80" />
                    </span>
                    <div>
                      <h3 className="text-base font-medium">{p.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-canton-muted">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            {/* solutions */}
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-4"
            >
              <li className="mb-6 text-xs font-medium uppercase tracking-widest text-canton-cyan">
                With Canton Copilot
              </li>
              {SOLUTIONS.map((s) => (
                <motion.li
                  key={s.title}
                  variants={fadeUp}
                  className="card card-hover relative overflow-hidden p-5"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-canton-cyan/8 blur-2xl"
                  />
                  <div className="relative flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canton-cyan/10 ring-1 ring-canton-cyan/25">
                      <s.icon className="h-5 w-5 text-canton-cyan" />
                    </span>
                    <div>
                      <h3 className="text-base font-medium">{s.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-canton-muted">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* ---------------------------- features --------------------------- */}
      <section id="features" className="relative px-6 py-28">
        <div aria-hidden className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="badge">Capabilities</span>
            <h2 className="mt-5 text-3xl font-semibold sm:text-5xl">
              Everything you need to
              <span className="text-gradient"> read the network</span>
            </h2>
            <p className="mt-4 text-canton-muted">
              Six primitives, one surface. Built on the Canton JSON Ledger API and
              a Qwen-powered reasoning layer.
            </p>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((f) => (
              <motion.article
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="card card-hover group p-6"
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${
                    f.tone === "gold"
                      ? "bg-canton-gold/10 ring-canton-gold/25"
                      : "bg-canton-cyan/10 ring-canton-cyan/25"
                  }`}
                >
                  <f.icon
                    className={`h-5 w-5 ${
                      f.tone === "gold" ? "text-canton-gold" : "text-canton-cyan"
                    }`}
                  />
                </span>
                <h3 className="mt-5 text-base font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-canton-muted">
                  {f.body}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --------------------------- how it works ------------------------ */}
      <section id="how" className="relative px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal className="max-w-2xl">
            <span className="badge">Three steps</span>
            <h2 className="mt-5 text-3xl font-semibold sm:text-5xl">
              Live in an afternoon
            </h2>
          </Reveal>

          <div className="mt-14 space-y-px overflow-hidden rounded-2xl border border-hairline">
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i}>
                <div className="group flex flex-col gap-4 bg-canton-navy p-7 transition-colors hover:bg-[#111a2b] sm:flex-row sm:items-center sm:gap-8">
                  <span className="font-mono text-2xl font-semibold text-canton-cyan/40 transition-colors group-hover:text-canton-cyan">
                    {s.step}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{s.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-canton-muted">
                      {s.body}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-canton-muted opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- cta ----------------------------- */}
      <section className="relative px-6 pb-28">
        <Reveal className="mx-auto max-w-4xl">
          <div className="card relative overflow-hidden px-8 py-16 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-canton-radial"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-canton-gold/8 blur-3xl"
            />
            <div className="relative">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Ask your ledger a question
              </h2>
              <p className="mx-auto mt-4 max-w-md text-canton-muted">
                The dashboard runs on seeded demo data — no node required to try
                it.
              </p>
              <Link
                href="/dashboard"
                className="btn-primary mt-8 px-7 py-3 text-base"
              >
                Launch Canton Copilot
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ----------------------------- footer ---------------------------- */}
      <footer className="border-t border-hairline px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-canton-muted sm:flex-row">
          <p>
            Canton Copilot · Built for{" "}
            <span className="text-canton-text">HackCanton Season 3</span>
          </p>
          <p className="font-mono text-xs">
            Not affiliated with Digital Asset. Demo data only.
          </p>
        </div>
      </footer>
    </main>
  );
}