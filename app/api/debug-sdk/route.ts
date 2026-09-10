import { NextRequest, NextResponse } from "next/server";
import { configure, trainsByName, getTrainInfo } from "railkit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "tamil";
  
  const key = process.env.RAILKIT_API_KEY;
  if (!key) return NextResponse.json({ error: "No API key" });
  configure(key);

  try {
    // Test trainsByName
    const nameResult = await trainsByName(q);
    
    // Test getTrainInfo with a known number
    const numResult = await getTrainInfo("12621");

    return NextResponse.json({
      trainsByName: {
        success: nameResult.success,
        data: nameResult.data,
        keys: nameResult.data ? Object.keys(nameResult.data) : [],
        isArray: Array.isArray(nameResult.data),
        firstItem: Array.isArray(nameResult.data) ? nameResult.data[0] : null,
        firstItemKeys: Array.isArray(nameResult.data) && nameResult.data[0] ? Object.keys(nameResult.data[0]) : [],
      },
      getTrainInfo: {
        success: numResult.success,
        data: numResult.data,
        keys: numResult.data ? Object.keys(numResult.data) : [],
      }
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg });
  }
}
