import type { ProviderResult, ReservationChart, Station, Train } from "@/types";
import type { RailwayDataProvider } from "./types";
import { searchStationsFixture } from "@/fixtures/stations";
import { searchTrainsFixture } from "@/fixtures/trains";
import { buildFixtureChart } from "@/fixtures/charts";

/**
 * FixtureRailwayProvider serves clearly-labeled development/demo data only.
 * It is intentionally limited to a couple of known train numbers so the
 * application never pretends to have data it doesn't — an unknown train
 * number correctly returns NOT_FOUND instead of fabricated content.
 */
export class FixtureRailwayProvider implements RailwayDataProvider {
  readonly name = "fixture";
  readonly isFixtureProvider = true;

  async getTrainSuggestions(query: string): Promise<ProviderResult<Train[]>> {
    await simulateLatency();
    return { ok: true, data: searchTrainsFixture(query) };
  }

  async getStations(query: string): Promise<ProviderResult<Station[]>> {
    await simulateLatency();
    return { ok: true, data: searchStationsFixture(query) };
  }

  async getReservationChart(params: {
    trainNumber: string;
    journeyDate: string;
  }): Promise<ProviderResult<ReservationChart>> {
    await simulateLatency();
    const chart = buildFixtureChart(params);
    if (!chart) {
      return {
        ok: false,
        reason: "NOT_FOUND",
        message:
          "No fixture chart is available for this train number. Fixture mode only includes a small set of demo trains (try 22648 or 12621).",
      };
    }
    return { ok: true, data: chart };
  }
}

function simulateLatency(): Promise<void> {
  const ms = 150 + Math.floor(Math.random() * 250);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
