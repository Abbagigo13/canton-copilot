// components/CommandPalette.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  FileText,
  LayoutDashboard,
  MessageSquare,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: Activity },
  { label: "Counterparties", href: "/dashboard/counterparties", icon: Users },
  { label: "Assets", href: "/dashboard/assets", icon: Wallet },
  { label: "Copilot", href: "/dashboard/copilot", icon: MessageSquare },
  { label: "Compliance", href: "/dashboard/compliance", icon: ShieldCheck },
  { label: "Contracts", href: "/dashboard/contracts", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const AI_ACTIONS = [
  {
    label: "Investigate Friday spike",
    icon: Search,
    prompt: "Investigate the volume spike on Friday. Which counterparty drove it and by how much?",
  },
  {
    label: "Show unsettled DvP",
    icon: BarChart3,
    prompt: "List any pending or unsettled DvP settlements. Include counterparty and amount.",
  },
  {
    label: "Flag compliance risks",
    icon: ShieldCheck,
    prompt: "Analyze the recent activity. Are there any compliance risks or failed transactions?",
  },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Keyboard shortcut: ⌘K / Ctrl+K to open, Esc to close
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const goTo = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[20%] z-[101] w-[min(620px,calc(100%-2rem))] -translate-x-1/2"
          >
            <Command
              className="overflow-hidden rounded-2xl border border-hairline bg-canton-navy shadow-2xl"
              loop
            >
              {/* Input row */}
              <div className="flex items-center gap-3 border-b border-hairline px-4">
                <Search className="h-4 w-4 shrink-0 text-canton-muted" />
                <Command.Input
                  autoFocus
                  placeholder="Search pages, ask Copilot, run actions…"
                  className="flex-1 bg-transparent py-4 text-sm text-canton-text outline-none placeholder:text-canton-muted/70"
                />
                <kbd className="hidden rounded border border-hairline bg-canton-black/60 px-1.5 py-0.5 font-mono text-[10px] text-canton-muted sm:inline">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <Command.List className="thin-scrollbar max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-canton-muted">
                  No results found.
                </Command.Empty>

                {/* Navigation group */}
                <Command.Group
                  heading="Navigate"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-canton-muted"
                >
                  {NAV_ITEMS.map((item) => (
                    <Command.Item
                      key={item.href}
                      onSelect={() => goTo(item.href)}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-canton-text aria-selected:bg-canton-cyan/10 aria-selected:text-canton-cyan"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-canton-cyan/10 ring-1 ring-canton-cyan/25">
                        <item.icon className="h-3.5 w-3.5 text-canton-cyan" />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <span className="text-[10px] text-canton-muted opacity-0 transition-opacity group-aria-selected:opacity-100">
                        ↵
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* AI actions group */}
                <Command.Group
                  heading="Ask Copilot"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-canton-muted"
                >
                  {AI_ACTIONS.map((action) => (
                    <Command.Item
                      key={action.label}
                      onSelect={() => {
                        setOpen(false);
                        // Fire the AI action by writing to a custom event
                        // the AIChat component listens for
                        window.dispatchEvent(
                          new CustomEvent("copilot-action", { detail: action.prompt })
                        );
                      }}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-canton-text aria-selected:bg-canton-gold/10 aria-selected:text-canton-gold"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-canton-gold/10 ring-1 ring-canton-gold/25">
                        <action.icon className="h-3.5 w-3.5 text-canton-gold" />
                      </span>
                      <span className="flex-1">{action.label}</span>
                      <Sparkles className="h-3.5 w-3.5 text-canton-muted opacity-0 transition-opacity group-aria-selected:opacity-100" />
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              {/* Footer hint */}
              <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5 text-[10px] text-canton-muted">
                <span>
                  Press <kbd className="rounded border border-hairline bg-canton-black/60 px-1 py-0.5 font-mono">⌘K</kbd> anywhere to open
                </span>
                <span>↑↓ to navigate · ↵ to select</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}