"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";

export type CardFormat = "number" | "compact" | "currency" | "percent";
export type CardTone = "cyan" | "gold";

export interface DashboardCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  /** Percentage change vs. previous period. Positive, negative or 0. */
  delta?: number;
  /** Rendered under the delta, e.g. "vs. last 7d". */
  deltaLabel?: string;
  format?: CardFormat;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  tone?: CardTone;
  /** Small inline trend line. 6–24 values looks best. */
  sparkline?: number[];
  /** Stagger index for the entrance animation. */
  index?: number;
}

/* ----------------------------- helpers ----------------------------- */

function makeFormatter(
  format: CardFormat,
  decimals: number
): (n: number) => string {
  switch (format) {
    case "currency":
      return (n) =>
        new Intl.NumberFormat("en-US", {
          notation: Math.abs(n) >= 1_000_000 ? "compact" : "standard",
          maximumFractionDigits: Math.abs(n) >= 1_000_000 ? 2 : decimals,
          minimumFractionDigits: Math.abs(n) >= 1_000_000 ? 0 : decimals,
        }).format(n);
    case "compact":
      return (n) =>
        new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(n);
    case "percent":
      return (n) => `${n.toFixed(decimals)}`;
    default:
      return (n) =>
        new Intl.NumberFormat("en-US", {
          maximumFractionDigits: decimals,
          minimumFractionDigits: decimals,
        }).format(n);
  }
}

function sparkPath(data: number[], w = 100, h = 30): string {
  if (data.length < 2) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 2) - 1;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/* --------------------------- count-up value ------------------------ */

function CountUp({
  value,
  format,
  decimals,
  active,
  delay,
}: {
  value: number;
  format: CardFormat;
  decimals: number;
  active: boolean;
  delay: number;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const formatter = makeFormatter(format, decimals);
  const text = useTransform(mv, (latest) => formatter(latest));

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [active, value, delay, reduce, mv]);

  return <motion.span>{text}</motion.span>;
}

/* ------------------------------- card ------------------------------ */

export default function DashboardCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel = "vs. last 7d",
  format = "number",
  prefix,
  suffix,
  decimals = 0,
  tone = "cyan",
  sparkline,
  index = 0,
}: DashboardCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const delay = index * 0.09;

  const accent =
    tone === "gold"
      ? {
          text: "text-canton-gold",
          ring: "ring-canton-gold/25",
          bg: "bg-canton-gold/10",
          stroke: "#D4A017",
          glow: "bg-canton-gold/8",
        }
      : {
          text: "text-canton-cyan",
          ring: "ring-canton-cyan/25",
          bg: "bg-canton-cyan/10",
          stroke: "#00D1FF",
          glow: "bg-canton-cyan/8",
        };

  const trend =
    delta === undefined || delta === 0 ? "flat" : delta > 0 ? "up" : "down";
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
        ? "text-red-400"
        : "text-canton-muted";

  const gradientId = `spark-${label.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="card card-hover relative overflow-hidden p-5"
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl ${accent.glow}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-canton-muted">
          {label}
        </p>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${accent.bg} ${accent.ring}`}
        >
          <Icon className={`h-[18px] w-[18px] ${accent.text}`} />
        </span>
      </div>

      <div className="relative mt-4 flex items-end gap-1.5">
        <span className="tabular text-3xl font-semibold leading-none tracking-tight">
          {prefix}
          <CountUp
            value={value}
            format={format}
            decimals={decimals}
            active={inView}
            delay={delay + 0.15}
          />
          {suffix}
        </span>
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 text-sm font-medium ${trendColor}`}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {delta !== undefined && (
              <span className="tabular">
                {Math.abs(delta).toFixed(1)}%
              </span>
            )}
          </span>
          <span className="text-xs text-canton-muted">{deltaLabel}</span>
        </div>

        {sparkline && sparkline.length > 1 && (
          <svg
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            className="h-8 w-20 shrink-0"
            aria-hidden
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent.stroke} stopOpacity="0.35" />
                <stop offset="100%" stopColor={accent.stroke} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${sparkPath(sparkline)} L100,30 L0,30 Z`}
              fill={`url(#${gradientId})`}
            />
            <motion.path
              d={sparkPath(sparkline)}
              fill="none"
              stroke={accent.stroke}
              strokeWidth={1.6}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : undefined}
              transition={{ duration: 1.2, delay: delay + 0.25, ease: "easeOut" }}
            />
          </svg>
        )}
      </div>
    </motion.div>
  );
}
