import { NextRequest, NextResponse } from "next/server";
import { configure, trackTrain } from "railkit";

export const runtime = "nodejs";

function initRailKit() {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trainNumber = searchParams.get("train");
  const date = searchParams.get("date");

  if (!trainNumber || !/^\d{5}$/.test(trainNumber)) {
    return NextResponse.json({ error: "Train number must be 5 digits" }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ error: "Date required (DD-MM-YYYY)" }, { status: 400 });
  }

  try {
    initRailKit();
    const result = await trackTrain(trainNumber, date);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Live tracking error:", error);
    return NextResponse.json({ error: "Failed to track train" }, { status: 500 });
  }
}
