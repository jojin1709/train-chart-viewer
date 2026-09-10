import { NextRequest, NextResponse } from "next/server";
import { configure, checkPNRStatus } from "railkit";

export const runtime = "nodejs";

function initRailKit() {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pnr = searchParams.get("pnr");

  if (!pnr || !/^\d{10}$/.test(pnr)) {
    return NextResponse.json({ success: false, error: "PNR must be 10 digits" }, { status: 400 });
  }

  try {
    initRailKit();
    const result = await checkPNRStatus(pnr);

    // SDK returns { success: boolean, data: {...}, error?: string }
    // Pass through directly
    return NextResponse.json(result);
  } catch (error) {
    console.error("PNR check error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
