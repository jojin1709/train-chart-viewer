import { NextRequest, NextResponse } from "next/server";
import { configure, liveAtStation } from "railkit";

export const runtime = "nodejs";

function initRailKit() {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stationCode = searchParams.get("station");
  const hours = searchParams.get("hrs") || "2";

  if (!stationCode) {
    return NextResponse.json({ success: false, error: "Station code required" }, { status: 400 });
  }

  if (!["2", "4", "8"].includes(hours)) {
    return NextResponse.json({ success: false, error: "Hours must be 2, 4, or 8" }, { status: 400 });
  }

  try {
    initRailKit();
    const result = await liveAtStation(stationCode.toUpperCase(), parseInt(hours) as 2 | 4 | 8);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Station live error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch station status" }, { status: 500 });
  }
}
