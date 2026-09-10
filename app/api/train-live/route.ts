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
  const trainNumber = searchParams.get("train");
  const date = searchParams.get("date");

  if (!trainNumber || !/^\d{5}$/.test(trainNumber)) {
    return NextResponse.json(
      { error: "Train number must be exactly 5 digits" },
      { status: 400 }
    );
  }

  if (!date) {
    return NextResponse.json(
      { error: "Date is required (DD-MM-YYYY format)" },
      { status: 400 }
    );
  }

  try {
    const apiKey = getApiKey();
    const response = await fetch(`${RAILKIT_BASE_URL}/trains/${trainNumber}/live/${date}`, {
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
    console.error("Live tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track train" },
      { status: 500 }
    );
  }
}
