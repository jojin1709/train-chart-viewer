import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const RAILKIT_BASE_URL = "https://api.railkit.in/api/v1";

function getApiKey(): string {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY is not configured");
  return key;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trainNo = searchParams.get("train");
  const date = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const cls = searchParams.get("class");
  const quota = searchParams.get("quota") || "GN";

  if (!trainNo || !/^\d{5}$/.test(trainNo)) {
    return NextResponse.json(
      { error: "Train number must be exactly 5 digits" },
      { status: 400 }
    );
  }

  if (!date || !from || !to || !cls) {
    return NextResponse.json(
      { error: "Date, from, to, and class are required" },
      { status: 400 }
    );
  }

  try {
    const apiKey = getApiKey();
    const response = await fetch(
      `${RAILKIT_BASE_URL}/fare/${trainNo}/${date}/${from}/${to}/${cls}/${quota}`,
      {
        headers: {
          "x-api-key": apiKey,
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `RailKit API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fare lookup error:", error);
    return NextResponse.json(
      { error: "Failed to lookup fare" },
      { status: 500 }
    );
  }
}
