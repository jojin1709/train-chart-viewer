import { NextRequest, NextResponse } from "next/server";
import { configure, stationsByName } from "railkit";

export const runtime = "nodejs";

function initRailKit() {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    initRailKit();
    const result = await stationsByName(q);
    if (result.success && result.data?.stations) {
      return NextResponse.json({
        success: true,
        data: result.data.stations.map((s: { code: string; name: string }) => ({
          code: s.code,
          name: s.name,
        })),
      });
    }
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error("Station search error:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}
