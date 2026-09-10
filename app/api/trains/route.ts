import { NextRequest, NextResponse } from "next/server";
import { searchQuerySchema } from "@/lib/validation/schemas";
import { getProvider } from "@/lib/providers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = searchQuerySchema.safeParse(searchParams.get("q") ?? "");
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const provider = getProvider();
  const result = await provider.getTrainSuggestions(parsed.data);

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 502 });
  }

  return NextResponse.json({ trains: result.data, isFixtureData: provider.isFixtureProvider });
}
