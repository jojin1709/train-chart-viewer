import type { ProviderResult, ReservationChart, Station, Train } from "@/types";

/**
 * RailwayDataProvider is the boundary between RailChart Explorer's UI and
 * any actual data source. The UI and API routes depend ONLY on this
 * interface — never on a concrete provider — so a real, authorized
 * upstream integration can be dropped in later without touching the UI.
 *
 * Implementations MUST:
 *  - never fabricate data
 *  - never bypass authentication, CAPTCHA, or anti-bot mechanisms of any
 *    upstream system
 *  - return a ProviderResult with ok:false when data cannot be legitimately
 *    retrieved, rather than inventing a plausible-looking response
 */
export interface RailwayDataProvider {
  readonly name: string;
  /** True if this provider only ever returns clearly-labeled fixture data. */
  readonly isFixtureProvider: boolean;

  getTrainSuggestions(query: string): Promise<ProviderResult<Train[]>>;

  getStations(query: string): Promise<ProviderResult<Station[]>>;

  getReservationChart(params: {
    trainNumber: string;
    journeyDate: string; // YYYY-MM-DD
  }): Promise<ProviderResult<ReservationChart>>;
}
