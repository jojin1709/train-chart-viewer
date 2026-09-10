/**
 * FIXTURE DATA — NOT LIVE RAILWAY DATA
 * A tiny set of demo trains used only when RAILCHART_DATA_MODE=fixture.
 */
import type { Train } from "@/types";

export const FIXTURE_TRAINS: (Train & { hasFixtureChart: boolean })[] = [
  { number: "22648", name: "Kochuveli - Chennai Central SF Express", hasFixtureChart: true },
  { number: "12621", name: "Tamil Nadu Express", hasFixtureChart: true },
  { number: "16382", name: "Kanyakumari - Coimbatore Express", hasFixtureChart: false },
];

export function searchTrainsFixture(query: string): Train[] {
  const q = query.trim().toLowerCase();
  if (!q) return FIXTURE_TRAINS.map(({ number, name }) => ({ number, name }));
  return FIXTURE_TRAINS.filter(
    (t) => t.number.includes(q) || (t.name?.toLowerCase().includes(q) ?? false)
  ).map(({ number, name }) => ({ number, name }));
}
