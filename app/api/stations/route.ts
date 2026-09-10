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
  const q = searchParams.get("q") || "";

  if (!q || q.length < 2) {
    return NextResponse.json({ stations: [] });
  }

  try {
    initRailKit();
    const result = await stationsByName(q);

    if (result.success && result.data?.stations) {
      const stations = result.data.stations.map((s: { code: string; name: string }) => ({
        code: s.code,
        name: s.name,
      }));
      return NextResponse.json({ stations });
    }

    return NextResponse.json({ stations: [] });
  } catch (error) {
    console.error("Station search error:", error);
    return NextResponse.json({ stations: [] });
  }
}
