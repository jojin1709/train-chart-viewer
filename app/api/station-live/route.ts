import { NextRequest, NextResponse } from "next/server";
import { getStationLiveBoard } from "@/lib/railradar";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const station = searchParams.get("station") || "";
  const hours = Number(searchParams.get("hours") || "4") as 2 | 4 | 6 | 8;

  if (!station) {
    return NextResponse.json({ error: "Station code required" }, { status: 400 });
  }

  try {
    const data = await getStationLiveBoard(station, hours);
    if (!data) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Station live error:", error);
    return NextResponse.json({ error: "Failed to fetch station live data" }, { status: 500 });
  }
}
