import { NextRequest, NextResponse } from "next/server";
import { configure, getTrainInfo, trainsByName } from "railkit";

export const runtime = "nodejs";

function initRailKit() {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json({ trains: [] });
  }

  try {
    initRailKit();

    // If numeric, search by train number
    if (/^\d{3,6}$/.test(q)) {
      const result = await getTrainInfo(q);
      if (result.success && result.data) {
        const t = result.data as Record<string, unknown>;
        const num = String(t.train_number || t.number || q);
        const name = String(t.train_name || t.name || "");
        return NextResponse.json({ trains: [{ number: num, name: name }] });
      }
      return NextResponse.json({ trains: [] });
    }

    // Search by name
    if (q.length >= 2) {
      const result = await trainsByName(q);
      if (result.success && result.data) {
        const trainsData = result.data;

        // Handle different response formats
        let trains: { number: string; name: string }[] = [];

        if (Array.isArray(trainsData)) {
          trains = trainsData.map((t: Record<string, unknown>) => ({
            number: String(t.train_number || t.number || t.train_no || ""),
            name: String(t.train_name || t.name || ""),
          }));
        } else if (typeof trainsData === "object" && trainsData !== null) {
          const obj = trainsData as Record<string, unknown>;
          if (Array.isArray(obj.trains)) {
            trains = obj.trains.map((t: Record<string, unknown>) => ({
              number: String(t.train_number || t.number || t.train_no || ""),
              name: String(t.train_name || t.name || ""),
            }));
          }
        }

        return NextResponse.json({ trains });
      }
    }

    return NextResponse.json({ trains: [] });
  } catch (error) {
    console.error("Train search error:", error);
    return NextResponse.json({ trains: [] });
  }
}
