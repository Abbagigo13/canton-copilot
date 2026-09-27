// app/api/scan/network/route.ts
import { NextResponse } from "next/server";

const SCAN_BASE = "https://scan.sv-1.global.canton.network.sync.global/api/scan";

export async function GET() {
  try {
    const res = await fetch(`${SCAN_BASE}/v0/dso`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Scan API returned ${res.status}`);
    const dso = await res.json();

    return NextResponse.json({
      live: true,
      dsoPartyId: dso.dso_party_id ?? dso.dsoPartyId ?? "",
      votingThreshold: dso.voting_threshold ?? dso.votingThreshold ?? null,
      activeSuperValidators: Array.isArray(dso.sv_node_states)
        ? dso.sv_node_states.length
        : null,
      initialRound: dso.initial_round ?? dso.initialRound ?? null,
      fetchedAt: new Date().toISOString(),
      raw: dso,
    });
  } catch (error: any) {
    console.error("❌ Scan API error:", error?.message);
    return NextResponse.json(
      { live: false, error: error?.message || "Failed to reach Scan API" },
      { status: 503 }
    );
  }
}