import { NextResponse } from "next/server";
import { configure, cancelList } from "railkit";

export const runtime = "nodejs";

function initRailKit() {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY not set");
  configure(key);
}

export async function GET() {
  try {
    initRailKit();
    const result = await cancelList();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cancelled trains error:", error);
    return NextResponse.json({ error: "Failed to fetch cancelled trains" }, { status: 500 });
  }
}
