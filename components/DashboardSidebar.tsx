"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { GraduationCap, User } from "lucide-react";
import { Compass } from "lucide-react";
import {
  Activity,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const NAV: { label: string; icon: LucideIcon; href: string; badge?: string }[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Transactions", icon: Activity, href: "/dashboard/transactions" },
  { label: "Counterparties", icon: Users, href: "/dashboard/counterparties" },
  { label: "Assets", icon: Wallet, href: "/dashboard/assets" },
  { label: "Copilot", icon: MessageSquare, href: "/dashboard/copilot", badge: "AI" },
  { label: "Compliance", icon: ShieldCheck, href: "/dashboard/compliance" },
  { label: "Contracts", icon: FileText, href: "/dashboard/contracts" },
  { label: "News", icon: Newspaper, href: "/dashboard/news" },
  { label: "Learn", icon: GraduationCap, href: "/dashboard/learn" },
  { label: "Profile", icon: User, href: "/dashboard/profile" },
  { label: "Ecosystem", icon: Compass, href: "/dashboard/ecosystem" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-canton-cyan/12 ring-1 ring-canton-cyan/30">
          <Sparkles className="h-4 w-4 text-canton-cyan" />
        </span>
        <span className="text-sm font-semibold tracking-tight">
          Canton<span className="text-canton-cyan">Copilot</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={false}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "text-canton-text"
                  : "text-canton-muted hover:bg-white/4 hover:text-canton-text"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-canton-cyan/10 ring-1 ring-canton-cyan/25"
                />
              )}
              <item.icon
                className={`relative h-[18px] w-[18px] ${isActive ? "text-canton-cyan" : ""}`}
              />
              <span className="relative flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="relative rounded-md bg-canton-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-canton-gold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <Link
          href="/dashboard/settings"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            pathname === "/dashboard/settings"
              ? "text-canton-text bg-canton-cyan/10 ring-1 ring-canton-cyan/25"
              : "text-canton-muted hover:bg-white/4 hover:text-canton-text"
          }`}
        >
          <Settings className="h-[18px] w-[18px]" />
          Settings
        </Link>
      </div>
    </div>
  );
}