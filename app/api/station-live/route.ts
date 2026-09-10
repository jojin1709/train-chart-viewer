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
  const stationCode = searchParams.get("station");
  const hours = searchParams.get("hrs") || "2";

  if (!stationCode) {
    return NextResponse.json(
      { error: "Station code is required" },
      { status: 400 }
    );
  }

  if (!["2", "4", "8"].includes(hours)) {
    return NextResponse.json(
      { error: "Hours must be 2, 4, or 8" },
      { status: 400 }
    );
  }

  try {
    const apiKey = getApiKey();
    const response = await fetch(
      `${RAILKIT_BASE_URL}/stations/${stationCode.toUpperCase()}/live?hrs=${hours}`,
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
    console.error("Station live error:", error);
    return NextResponse.json(
      { error: "Failed to fetch station live status" },
      { status: 500 }
    );
  }
}
