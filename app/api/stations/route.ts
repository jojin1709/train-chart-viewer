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

    if (result.success && result.data) {
      const stationsData = result.data;

      // Handle different response formats
      let stations: { code: string; name: string }[] = [];

      if (Array.isArray(stationsData)) {
        stations = stationsData.map((s: Record<string, unknown>) => ({
          code: String(s.code || s.station_code || ""),
          name: String(s.name || s.station_name || ""),
        }));
      } else if (typeof stationsData === "object" && stationsData !== null) {
        const obj = stationsData as Record<string, unknown>;
        if (Array.isArray(obj.stations)) {
          stations = obj.stations.map((s: Record<string, unknown>) => ({
            code: String(s.code || s.station_code || ""),
            name: String(s.name || s.station_name || ""),
          }));
        }
      }

      return NextResponse.json({ stations });
    }

    return NextResponse.json({ stations: [] });
  } catch (error) {
    console.error("Station search error:", error);
    return NextResponse.json({ stations: [] });
  }
}
