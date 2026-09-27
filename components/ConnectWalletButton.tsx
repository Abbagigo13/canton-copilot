// components/ConnectWalletButton.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wallet, X, Check, Copy } from "lucide-react";
import { useWallet } from "@/lib/wallet";

export default function ConnectWalletButton() {
  const { connected, address, balance, connect, disconnect } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await connect();
    setConnecting(false);
    setModalOpen(false);
  };

  if (connected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-canton-cyan/30 bg-canton-cyan/8 px-3 py-2 text-xs text-canton-text transition-colors hover:bg-canton-cyan/15"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono">{address.slice(0, 6)}…{address.slice(-4)}</span>
          <span className="tabular text-canton-gold">{balance.toFixed(2)} CC</span>
        </button>

        <AnimatePresence>
          {modalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOpen(false)}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                className="fixed left-1/2 top-1/2 z-[101] w-[min(400px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-hairline bg-canton-navy p-6"
              >
                <h3 className="text-sm font-medium">Wallet connected</h3>
                <p className="mt-1 text-[11px] text-canton-muted">via Grofty Wallet</p>

                <div className="mt-4 rounded-xl bg-canton-black/50 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-canton-muted">Address</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex-1 truncate font-mono text-xs text-canton-text">{address}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(address)}
                      className="rounded-lg p-1.5 text-canton-muted hover:bg-white/5 hover:text-canton-text"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-canton-black/50 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-canton-muted">Balance</p>
                  <p className="tabular mt-1 text-lg font-semibold text-canton-gold">
                    {balance.toFixed(4)} CC
                  </p>
                </div>

                <button
                  onClick={() => { disconnect(); setModalOpen(false); }}
                  className="mt-4 w-full rounded-xl border border-hairline bg-canton-black/40 py-2 text-xs text-canton-muted transition-colors hover:border-red-500/30 hover:text-red-400"
                >
                  Disconnect
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-canton-black/60 px-3 py-2 text-xs text-canton-text transition-colors hover:border-canton-cyan/40"
      >
        <Wallet className="h-3.5 w-3.5 text-canton-cyan" />
        Connect Wallet
      </button>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              className="fixed left-1/2 top-1/2 z-[101] w-[min(420px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-hairline bg-canton-navy p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#044AB3] to-canton-cyan ring-1 ring-canton-cyan/30">
                    <Wallet className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <h3 className="text-sm font-medium">Grofty Wallet</h3>
                    <p className="text-[11px] text-canton-muted">Canton Network Gateway</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-1.5 text-canton-muted hover:bg-white/5 hover:text-canton-text"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-canton-muted">
                Connect. Sign. Transact. Grofty Wallet is the gateway to Canton Network
                — no participant node required.
              </p>

              <ul className="mt-4 space-y-1.5 text-[11px] text-canton-muted">
                <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-400" /> Sign transactions with Ed25519</li>
                <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-400" /> Access your party&apos;s ledger scope</li>
                <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-400" /> Pay per AI query in Canton Coin</li>
              </ul>

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="btn-primary mt-5 w-full py-2.5 text-sm disabled:opacity-60"
              >
                {connecting ? "Connecting…" : "Connect Grofty Wallet"}
              </button>

              <p className="mt-3 text-center text-[10px] text-canton-muted">
                Demo mode · mainnet-ready
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}