/**
 * FIXTURE DATA — NOT LIVE RAILWAY DATA
 * A small set of demo trains used only when RAILCHART_DATA_MODE=fixture.
 */
import type { Train } from "@/types";

export const FIXTURE_TRAINS: (Train & { hasFixtureChart: boolean })[] = [
  { number: "22648", name: "Kochuveli - Chennai Central SF Express", hasFixtureChart: true },
  { number: "12621", name: "Tamil Nadu Express", hasFixtureChart: true },
  { number: "12002", name: "New Delhi - Bhopal Shatabdi Express", hasFixtureChart: true },
  { number: "12951", name: "Mumbai Rajdhani Express", hasFixtureChart: true },
  { number: "12615", name: "Grand Trunk Express", hasFixtureChart: true },
  { number: "17230", name: "Sabari Express", hasFixtureChart: true },
  { number: "12259", name: "Sealdah Duronto Express", hasFixtureChart: true },
  { number: "12609", name: "Mumbai Central - Chennai Central Express", hasFixtureChart: true },
  { number: "12010", name: "Ahmedabad - Mumbai Shatabdi Express", hasFixtureChart: true },
  { number: "12301", name: "Howrah - New Delhi Rajdhani Express", hasFixtureChart: true },
  { number: "12434", name: "Chennai Central - Hazrat Nizamuddin Rajdhani Express", hasFixtureChart: true },
  { number: "12625", name: "Kerala Express", hasFixtureChart: true },
  { number: "12723", name: "AP Express", hasFixtureChart: true },
  { number: "16382", name: "Kanyakumari - Coimbatore Express", hasFixtureChart: false },
];

export function searchTrainsFixture(query: string): Train[] {
  const q = query.trim().toLowerCase();
  if (!q) return FIXTURE_TRAINS.map(({ number, name }) => ({ number, name }));
  return FIXTURE_TRAINS.filter(
    (t) => t.number.includes(q) || (t.name?.toLowerCase().includes(q) ?? false)
  ).map(({ number, name }) => ({ number, name }));
}
