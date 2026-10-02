// app/api/ledger/service-info/route.ts
import { NextResponse } from "next/server";
import { callUnary } from "@/lib/silvana";

export const runtime = "nodejs";

export async function GET() {
  try {
    const info = await callUnary<any, any>("getServiceInfo", {});

    const pick = (obj: any, camel: string, snake: string) => obj?.[camel] ?? obj?.[snake] ?? "";

    return NextResponse.json({
      live: true,
      providerId: pick(info, "providerId", "provider_id"),
      version: pick(info, "version", "version"),
      networkId: pick(info, "networkId", "network_id"),
      synchronizerId: pick(info, "synchronizerId", "synchronizer_id"),
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ GetServiceInfo error:", error?.message);
    return NextResponse.json(
      { live: false, error: error?.message || "Failed to reach Silvana" },
      { status: 503 }
    );
  }
}