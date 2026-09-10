import { NextRequest, NextResponse } from "next/server";
import { searchStations } from "@/lib/railradar";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q || q.length < 2) {
    return NextResponse.json({ stations: [] });
  }

  try {
    const stations = await searchStations(q, 20);
    return NextResponse.json({
      stations: stations.map((s) => ({ code: s.code, name: s.name })),
    });
  } catch (error) {
    console.error("Station search error:", error);
    return NextResponse.json({ stations: [] });
  }
}
