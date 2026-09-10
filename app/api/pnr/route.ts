import { NextRequest, NextResponse } from "next/server";
import { getPNRStatus } from "@/lib/railradar";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pnr = searchParams.get("pnr") || "";

  if (!pnr || !/^\d{10}$/.test(pnr)) {
    return NextResponse.json({ error: "Invalid PNR number" }, { status: 400 });
  }

  try {
    const data = await getPNRStatus(pnr);
    if (!data) {
      return NextResponse.json({ error: "PNR not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("PNR check error:", error);
    return NextResponse.json({ error: "Failed to fetch PNR status" }, { status: 500 });
  }
}
