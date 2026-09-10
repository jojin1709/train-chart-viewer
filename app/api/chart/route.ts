import { NextRequest, NextResponse } from "next/server";
import { chartRequestSchema } from "@/lib/validation/schemas";
import { getProvider } from "@/lib/providers";
import { normalizeChart } from "@/lib/chart/normalizer";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = chartRequestSchema.safeParse({
    train: searchParams.get("train") ?? "",
    date: searchParams.get("date") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const provider = getProvider();
  const result = await provider.getReservationChart({
    trainNumber: parsed.data.train,
    journeyDate: parsed.data.date,
  });

  if (!result.ok) {
    const statusMap: Record<string, number> = {
      NOT_FOUND: 404,
      INVALID_INPUT: 400,
      RATE_LIMITED: 429,
      TIMEOUT: 504,
      UNAVAILABLE: 503,
    };
    return NextResponse.json(
      { error: result.message, reason: result.reason },
      { status: statusMap[result.reason] ?? 502 }
    );
  }

  return NextResponse.json({ chart: normalizeChart(result.data) });
}
