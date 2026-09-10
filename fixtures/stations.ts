/**
 * FIXTURE DATA — NOT LIVE RAILWAY DATA
 *
 * This file contains a small, hand-picked set of real Indian Railways
 * station codes/names used ONLY to demonstrate the RailChart Explorer UI
 * in development mode. It is not a live or complete station database.
 */
import type { Station } from "@/types";

export const FIXTURE_STATIONS: Station[] = [
  { code: "TVC", name: "Thiruvananthapuram Central", routeIndex: 0, distanceKm: 0 },
  { code: "TVCN", name: "Trivandrum North (Kochuveli)", routeIndex: 0, distanceKm: 0 },
  { code: "KYJ", name: "Kollam Junction", routeIndex: 1, distanceKm: 71 },
  { code: "QLN", name: "Kollam Junction", routeIndex: 1, distanceKm: 71 },
  { code: "ERN", name: "Ernakulam Junction", routeIndex: 2, distanceKm: 218 },
  { code: "ERS", name: "Ernakulam Junction (South)", routeIndex: 2, distanceKm: 218 },
  { code: "AWY", name: "Aluva", routeIndex: 3, distanceKm: 240 },
  { code: "TCR", name: "Thrissur", routeIndex: 4, distanceKm: 283 },
  { code: "WKI", name: "Wadakkanchery", routeIndex: 5, distanceKm: 300 },
  { code: "SRR", name: "Shoranur Junction", routeIndex: 6, distanceKm: 316 },
  { code: "PGT", name: "Palakkad Junction", routeIndex: 7, distanceKm: 360 },
  { code: "CBE", name: "Coimbatore Junction", routeIndex: 8, distanceKm: 420 },
  { code: "ED", name: "Erode Junction", routeIndex: 9, distanceKm: 490 },
  { code: "SA", name: "Salem Junction", routeIndex: 10, distanceKm: 560 },
  { code: "JTJ", name: "Jolarpettai Junction", routeIndex: 11, distanceKm: 640 },
  { code: "KPD", name: "Katpadi Junction", routeIndex: 12, distanceKm: 690 },
  { code: "MAS", name: "Chennai Central", routeIndex: 13, distanceKm: 780 },
  { code: "MDU", name: "Madurai Junction", routeIndex: 0, distanceKm: 0 },
  { code: "TPJ", name: "Tiruchirappalli Junction", routeIndex: 1, distanceKm: 130 },
  { code: "TEN", name: "Tirunelveli Junction", routeIndex: 0, distanceKm: 0 },
  { code: "NDLS", name: "New Delhi", routeIndex: 0, distanceKm: 0 },
  { code: "BCT", name: "Mumbai Central", routeIndex: 0, distanceKm: 0 },
];

export function searchStationsFixture(query: string): Station[] {
  const q = query.trim().toLowerCase();
  if (!q) return FIXTURE_STATIONS.slice(0, 8);
  return FIXTURE_STATIONS.filter(
    (s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  ).slice(0, 12);
}
