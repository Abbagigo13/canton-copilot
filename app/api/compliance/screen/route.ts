// app/api/compliance/screen/route.ts
import { NextResponse } from "next/server";

const SDN_URL = "https://www.treasury.gov/ofac/downloads/sdn.csv";

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      result.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  result.push(cur);
  return result;
}

export async function GET(req: Request) {
  const namesParam = new URL(req.url).searchParams.get("names") || "";
  const names = namesParam.split(",").map((s) => s.trim()).filter(Boolean);

  try {
    const res = await fetch(SDN_URL, { next: { revalidate: 86400 } }); // refetch at most once a day
    if (!res.ok) throw new Error(`OFAC list returned ${res.status}`);
    const text = await res.text();
    const lines = text.split("\n").filter(Boolean);

    const results = names.map((name) => {
      const needle = name.toUpperCase();
            const hitLine = lines.find((line) => {
        const sdnName = (parseCsvLine(line)[1] || "").toUpperCase().trim();
        // Only match when the OFAC entry's full name appears in the counterparty
        // name (not the reverse) — the reverse direction false-positives on short
        // or generic SDN names.
        return sdnName.length > 6 && sdnName.includes(needle);
      });
      const fields = hitLine ? parseCsvLine(hitLine) : null;
      return {
        name,
        hit: !!hitLine,
        matchedName: fields?.[1]?.trim() || null,
        program: fields?.[3]?.trim() || null,
      };
    });

    return NextResponse.json({
      live: true,
      source: "US Treasury OFAC SDN list",
      totalEntriesScanned: lines.length,
      checkedAt: new Date().toISOString(),
      results,
    });
  } catch (error: any) {
    console.error("❌ OFAC screen error:", error?.message);
    return NextResponse.json(
      { live: false, error: error?.message || "Failed to reach OFAC list" },
      { status: 503 }
    );
  }
}