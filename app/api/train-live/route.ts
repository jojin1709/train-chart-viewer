import { NextRequest, NextResponse } from "next/server";
import { getTrainLiveStatus } from "@/lib/railradar";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const train = searchParams.get("train") || "";
  const date = searchParams.get("date") || undefined;

  if (!train) {
    return NextResponse.json({ error: "Train number required" }, { status: 400 });
  }

  try {
    const data = await getTrainLiveStatus(train, date);
    if (!data) {
      return NextResponse.json({ error: "Train not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Live status error:", error);
    return NextResponse.json({ error: "Failed to fetch live status" }, { status: 500 });
  }
}
