import { NextRequest, NextResponse } from "next/server";
import { getTrainFare } from "@/lib/railradar";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const train = searchParams.get("train") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const cls = searchParams.get("class") || "";
  const quota = searchParams.get("quota") || "GN";

  if (!train || !from || !to || !date || !cls) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  try {
    const data = await getTrainFare(train, from, to, date, cls, quota);
    if (!data) {
      return NextResponse.json({ error: "Fare not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Fare lookup error:", error);
    return NextResponse.json({ error: "Failed to fetch fare" }, { status: 500 });
  }
}
