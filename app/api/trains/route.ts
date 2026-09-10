import { NextResponse } from "next/server";
import { configure, getTrainInfo } from "railkit";

export const runtime = "nodejs";

function initRailKit() {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    initRailKit();

    // If numeric 5 digits, search by number
    if (/^\d{5}$/.test(q)) {
      const result = await getTrainInfo(q);
      if (result.success && result.data) {
        const train = result.data;
        return NextResponse.json({
          success: true,
          data: [{ number: train.train_number, name: train.train_name }],
        });
      }
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error("Train search error:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}
