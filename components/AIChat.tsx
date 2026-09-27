// components/AIChat.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Search, BarChart3, AlertTriangle } from "lucide-react";
import { useAIContext } from "@/lib/aiContext";
import { useWallet } from "@/lib/wallet";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import PremiumGate from "@/components/PremiumGate";

const STORAGE_KEY = "canton-copilot-chat";

const SUGGESTED_ACTIONS = [
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
    icon: AlertTriangle,
    prompt: "Analyze the recent activity. Are there any compliance risks or failed transactions I should know about?",
  },
];

function loadMessages(): { role: "user" | "assistant"; content: string }[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function AIChat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >(loadMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { pageName, pageContext } = useAIContext();
  const { incrementQuery, isPremium, queriesUsed, FREE_LIMIT } = useWallet();

  // Persist to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Listen for command palette actions
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) handleSend(customEvent.detail);
    };
    window.addEventListener("copilot-action", handler);
    return () => window.removeEventListener("copilot-action", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (overridePrompt?: string) => {
    const userMessage = overridePrompt || input.trim();
    if (!userMessage) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          pageName,
          contextData: pageContext,
        }),
      });

      if (!response.body) throw new Error("No stream in response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: accumulated,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Stream error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Failed to connect to the AI backend.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      incrementQuery();
    }
  };

  const remaining = Math.max(0, FREE_LIMIT - queriesUsed);

  return (
    <div className="flex flex-col h-full bg-canton-surface border border-hairline rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-hairline flex items-center gap-2 flex-wrap">
        <Bot className="w-5 h-5 text-canton-cyan" />
        <h3 className="text-sm font-semibold text-canton-text">Copilot</h3>
        <span className="text-[10px] uppercase tracking-wider text-canton-muted">
          · {pageName}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <ConnectWalletButton />
        </div>
      </div>

      {/* Free tier counter */}
      {!isPremium && remaining > 0 && (
        <div className="border-b border-hairline bg-canton-cyan/5 px-4 py-2 text-[10px] text-canton-cyan">
          {remaining} free {remaining === 1 ? "query" : "queries"} remaining ·
          connect wallet to unlock unlimited
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 thin-scrollbar">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-center text-canton-muted text-sm">
              Ask about {pageName.toLowerCase()} data.
            </p>

            <div className="space-y-2 pt-2">
              {SUGGESTED_ACTIONS.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  onClick={() => handleSend(action.prompt)}
                  disabled={isLoading}
                  className="group w-full flex items-center gap-3 rounded-xl border border-hairline bg-canton-black/40 px-3 py-2.5 text-left text-xs transition-all hover:border-canton-cyan/40 hover:bg-canton-cyan/5 disabled:opacity-50"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-canton-cyan/10 ring-1 ring-canton-cyan/25 group-hover:bg-canton-cyan/15">
                    <action.icon className="h-3.5 w-3.5 text-canton-cyan" />
                  </span>
                  <span className="text-canton-text">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-canton-blue" : "bg-canton-cyan"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-canton-black" />
              )}
            </div>
            <div
              className={`p-3 rounded-lg text-sm max-w-[80%] ${
                msg.role === "user"
                  ? "bg-canton-blue text-white"
                  : "bg-hairline/40 text-canton-text"
              }`}
            >
              {msg.content}
              {isLoading &&
                i === messages.length - 1 &&
                msg.role === "assistant" &&
                msg.content.length > 0 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="ml-0.5 inline-block h-3.5 w-1.5 -mb-0.5 bg-canton-cyan"
                  />
                )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-canton-cyan flex items-center justify-center">
              <Bot className="w-4 h-4 text-canton-black" />
            </div>
            <div className="p-3 rounded-lg bg-hairline/40 flex gap-1 items-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="w-2 h-2 rounded-full bg-canton-cyan"
              />
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-canton-cyan"
              />
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-canton-cyan"
              />
            </div>
          </div>
        )}
      </div>

      {/* Input — gated */}
      <PremiumGate>
        <div className="p-4 border-t border-hairline">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Ask about ${pageName.toLowerCase()}...`}
              className="flex-1 bg-canton-black border border-hairline rounded-lg px-3 py-2 text-sm text-canton-text focus:outline-none focus:border-canton-cyan/60 placeholder:text-canton-muted/70"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading}
              className="p-2 bg-canton-cyan rounded-lg hover:bg-canton-cyan/80 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-canton-black" />
            </button>
          </div>
        </div>
      </PremiumGate>
    </div>
  );
}