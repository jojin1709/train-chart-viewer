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

    // Normalize the response
    if (result.success && result.data) {
      const trains = Array.isArray(result.data) ? result.data : [];
      return NextResponse.json({ success: true, data: trains });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error("Cancelled trains error:", error);
    return NextResponse.json({ success: true, data: [], error: "Failed to fetch" });
  }
}
