// app/api/news/route.ts
import { NextResponse } from "next/server";

const FEED_URL = "https://forum.canton.network/latest.rss";

export async function GET() {
  try {
    const res = await fetch(FEED_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Forum RSS returned ${res.status}`);
    const xml = await res.text();

    // Minimal RSS <item> parser — no extra npm package needed
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
      const block = m[1];
      const pick = (tag: string) => {
        const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
        return match ? match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
      };
      return {
        title: pick("title"),
        link: pick("link"),
        time: pick("pubDate"),
        body: pick("description").replace(/<[^>]+>/g, "").slice(0, 220),
      };
    });

    return NextResponse.json({ live: true, items: items.slice(0, 8), fetchedAt: new Date().toISOString() });
  } catch (error: any) {
    console.error("❌ News feed error:", error?.message);
    return NextResponse.json({ live: false, error: error?.message || "Failed to reach forum feed" }, { status: 503 });
  }
}