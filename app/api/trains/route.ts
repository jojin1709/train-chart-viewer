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
      if (result.success && result.data?.trainInfo) {
        const t = result.data.trainInfo;
        return NextResponse.json({
          trains: [{ number: t.train_no || q, name: t.train_name || "" }],
        });
      }
      return NextResponse.json({ trains: [] });
    }

    // Search by name
    if (q.length >= 2) {
      const result = await trainsByName(q);
      if (result.success && result.data?.trains) {
        const trains = result.data.trains.map((t: { trainNo: string; trainName: string }) => ({
          number: t.trainNo,
          name: t.trainName,
        }));
        return NextResponse.json({ trains });
      }
    }

    return NextResponse.json({ trains: [] });
  } catch (error) {
    console.error("Train search error:", error);
    return NextResponse.json({ trains: [] });
  }
}
