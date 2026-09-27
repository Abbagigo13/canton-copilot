// app/api/ledger/dso/route.ts
import { NextResponse } from "next/server";
import { callUnary } from "@/lib/silvana";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dso = await callUnary<any, any>("getDsoRates", {});

    // Debug log so we can see the exact response shape from Silvana
    console.log("🔍 RAW DSO RESPONSE:", JSON.stringify(dso, null, 2));

    // proto-loader with keepCase:true converts camelCase → snake_case.
    // We try BOTH just in case.
    const pick = (obj: any, camel: string, snake: string) =>
      obj?.[camel] ?? obj?.[snake] ?? "";

    return NextResponse.json({
      live: true,
      ccUsdRate: parseFloat(pick(dso, "ccUsdRate", "cc_usd_rate") || "0"),
      amuletPrice: parseFloat(pick(dso, "amuletPrice", "amulet_price") || "0"),
      currentRound: pick(dso, "currentRound", "current_round") || "0",
      dsoPartyId: pick(dso, "dsoPartyId", "dso_party_id") || "",
      openMiningRounds: (
        dso.openMiningRounds ??
        dso.open_mining_rounds ??
        []
      ).map((r: any) => ({
        round: r.roundNumber ?? r.round_number,
        price: parseFloat(r.amuletPrice ?? r.amulet_price ?? "0"),
        opensAt: r.opensAt ?? r.opens_at,
        closesAt: r.targetClosesAt ?? r.target_closes_at,
      })),
      issuingMiningRounds: (
        dso.issuingMiningRounds ??
        dso.issuing_mining_rounds ??
        []
      ).map((r: any) => ({
        round: r.roundNumber ?? r.round_number,
        featuredReward: parseFloat(
          r.issuancePerFeaturedAppRewardCoupon ??
            r.issuance_per_featured_app_reward_coupon ??
            "0"
        ),
        unfeaturedReward: parseFloat(
          r.issuancePerUnfeaturedAppRewardCoupon ??
            r.issuance_per_unfeatured_app_reward_coupon ??
            "0"
        ),
        opensAt: r.opensAt ?? r.opens_at,
      })),
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Silvana gRPC error:", error?.message);
    return NextResponse.json(
      {
        live: false,
        error: error?.message || "Failed to reach Silvana",
      },
      { status: 503 }
    );
  }
}