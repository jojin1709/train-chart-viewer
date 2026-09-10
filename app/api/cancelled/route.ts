import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const RAILKIT_BASE_URL = "https://api.railkit.in/api/v1";

function getApiKey(): string {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY is not configured");
  return key;
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = getApiKey();
    const response = await fetch(`${RAILKIT_BASE_URL}/trains/cancelled`, {
      headers: {
        "x-api-key": apiKey,
        accept: "application/json",
      },
    });

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
    console.error("Cancelled trains error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cancelled trains" },
      { status: 500 }
    );
  }
}
