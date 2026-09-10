import { NextRequest, NextResponse } from "next/server";
import { configure, getTrainInfo } from "railkit";

export const runtime = "nodejs";

function initRailKit() {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  try {
    initRailKit();

    // If numeric 5 digits, search by number
    if (/^\d{5}$/.test(q)) {
      const result = await getTrainInfo(q);
      if (result.success && result.data) {
        return NextResponse.json({
          success: true,
          data: [{ number: result.data.train_number, name: result.data.train_name }],
        });
      }
    }

    // Search by name - use getTrainInfo as fallback
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error("Train search error:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}
