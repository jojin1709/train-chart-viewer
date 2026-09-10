import type { RailwayDataProvider } from "./types";
import { FixtureRailwayProvider } from "./fixtureProvider";

/**
 * Provider factory.
 *
 * RAILCHART_DATA_MODE controls which provider backs the application:
 *   - "fixture" (default): serves clearly-labeled demo data only.
 *   - "live": reserved for a future, authorized upstream integration.
 *     No such integration exists yet. Setting this value without also
 *     providing a real implementation will make the app correctly report
 *     "data unavailable" rather than silently falling back to fixtures —
 *     see LiveProviderNotConfigured below.
 *
 * The rest of the application (API routes, server components) must only
 * ever import getProvider() from this file — never a concrete provider
 * class directly — so swapping in a real data source later requires no
 * UI changes.
 */

let cached: RailwayDataProvider | null = null;

export function getProvider(): RailwayDataProvider {
  if (cached) return cached;

  const mode = process.env.RAILCHART_DATA_MODE ?? "fixture";

  if (mode === "live") {
    // Intentionally not implemented: no authorized live reservation-chart
    // API has been integrated. We deliberately do NOT fall back to
    // fixture data here, because doing so would silently present demo
    // data as if it were real — exactly what this project must not do.
    cached = new LiveProviderNotConfigured();
    return cached;
  }

  cached = new FixtureRailwayProvider();
  return cached;
}

class LiveProviderNotConfigured implements RailwayDataProvider {
  readonly name = "live-not-configured";
  readonly isFixtureProvider = false;

  async getTrainSuggestions() {
    return {
      ok: false as const,
      reason: "UNAVAILABLE" as const,
      message: "No authorized live data source is configured.",
    };
  }
  async getStations() {
    return {
      ok: false as const,
      reason: "UNAVAILABLE" as const,
      message: "No authorized live data source is configured.",
    };
  }
  async getReservationChart() {
    return {
      ok: false as const,
      reason: "UNAVAILABLE" as const,
      message: "No authorized live data source is configured.",
    };
  }
}

export type { RailwayDataProvider } from "./types";
