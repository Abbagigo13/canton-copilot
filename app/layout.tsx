import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Canton Copilot — AI Intelligence for the Canton Network",
    template: "%s · Canton Copilot",
  },
  description:
    "Canton Copilot turns Canton Network activity into plain-language answers. Live network analytics, privacy-aware insights, and an AI agent that speaks Daml.",
  applicationName: "Canton Copilot",
  keywords: [
    "Canton Network",
    "Daml",
    "privacy blockchain",
    "AI copilot",
    "HackCanton",
    "institutional DeFi",
  ],
  authors: [{ name: "Canton Copilot Team" }],
  openGraph: {
    title: "Canton Copilot — AI Intelligence for the Canton Network",
    description:
      "Ask questions in plain English. Get answers grounded in live Canton Network data.",
    siteName: "Canton Copilot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Canton Copilot",
    description:
      "AI intelligence layer for the Canton Network. Built for HackCanton S3.",
  },
};

export const viewport: Viewport = {
  themeColor: "#06090F",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark`}>
      <body className="min-h-screen bg-canton-black text-canton-text">
        {children}
      </body>
    </html>
  );
}
