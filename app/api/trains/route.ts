import { NextRequest, NextResponse } from "next/server";
import { searchTrains } from "@/lib/railradar";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q || q.length < 2) {
    return NextResponse.json({ trains: [] });
  }

  try {
    const trains = await searchTrains(q, 20);
    return NextResponse.json({
      trains: trains.map((t) => ({ number: t.number, name: t.name })),
    });
  } catch (error) {
    console.error("Train search error:", error);
    return NextResponse.json({ trains: [] });
  }
}
