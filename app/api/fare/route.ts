import { NextRequest, NextResponse } from "next/server";
import { configure, fareLookup } from "railkit";

export const runtime = "nodejs";

function initRailKit() {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trainNo = searchParams.get("train");
  const date = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const cls = searchParams.get("class");
  const quota = searchParams.get("quota") || "GN";

  if (!trainNo || !date || !from || !to || !cls) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  try {
    initRailKit();
    const result = await fareLookup(trainNo, date, from, to, cls, quota);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fare lookup error:", error);
    return NextResponse.json({ error: "Failed to get fare" }, { status: 500 });
  }
}
