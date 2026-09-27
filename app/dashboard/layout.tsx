// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Menu, Sparkles, X } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import AIChat from "@/components/AIChat";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { AIProvider } from "@/lib/aiContext";
import { WalletProvider } from "@/lib/wallet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AIProvider>
      <WalletProvider>
        <div className="flex h-[100svh] overflow-hidden bg-canton-black">
          {/* desktop sidebar */}
          <aside className="hidden w-64 shrink-0 border-r border-hairline bg-canton-navy lg:block">
            <DashboardSidebar />
          </aside>

          {/* mobile drawer */}
          <AnimatePresence>
            {mobileNav && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileNav(false)}
                  className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 340, damping: 34 }}
                  className="fixed inset-y-0 left-0 z-50 w-64 border-r border-hairline bg-canton-navy lg:hidden"
                >
                  <button
                    type="button"
                    onClick={() => setMobileNav(false)}
                    className="absolute right-3 top-5 rounded-lg p-2 text-canton-muted hover:text-canton-text"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <DashboardSidebar />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* Mobile top bar */}
            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-hairline bg-canton-navy/60 px-4 backdrop-blur sm:px-6 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileNav(true)}
                className="rounded-lg p-2 text-canton-muted transition-colors hover:bg-white/5 hover:text-canton-text"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex-1" />
              <ConnectWalletButton />
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="btn-primary px-3 py-2"
              >
                <Sparkles className="h-4 w-4" />
              </button>
            </header>

            <div className="flex min-h-0 flex-1">
              <main className="thin-scrollbar flex-1 overflow-y-auto p-4 sm:p-6">
                {children}
              </main>

              <motion.aside
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="hidden w-[380px] shrink-0 border-l border-hairline bg-canton-navy/40 p-4 xl:block"
              >
                <div className="h-full">
                  <AIChat />
                </div>
              </motion.aside>
            </div>
          </div>

          {/* Mobile chat sheet */}
          <AnimatePresence>
            {chatOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setChatOpen(false)}
                  className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm xl:hidden"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                  className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-canton-navy p-3 xl:hidden"
                >
                  <button
                    type="button"
                    onClick={() => setChatOpen(false)}
                    className="mb-2 inline-flex items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-xs text-canton-muted hover:text-canton-text"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to dashboard
                  </button>
                  <div className="min-h-0 flex-1">
                    <AIChat />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </WalletProvider>
    </AIProvider>
  );
}