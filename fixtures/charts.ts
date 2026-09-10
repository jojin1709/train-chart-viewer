/**
 * FIXTURE DATA — NOT LIVE RAILWAY DATA
 *
 * Generates a deterministic, clearly-labeled demo reservation chart for a
 * small set of known fixture train numbers. This is used only when
 * RAILCHART_DATA_MODE=fixture (the default in local/dev, since no
 * authorized live chart API is configured). It must never be served as if
 * it were real chart data — every chart produced here carries
 * meta.isFixtureData = true and a source label saying so.
 */
import type {
  Berth,
  BerthType,
  Coach,
  CoachLayoutBay,
  OccupancyRecord,
  ReservationChart,
  Station,
  TrainClass,
} from "@/types";
import { FIXTURE_TRAINS } from "./trains";
import { FIXTURE_STATIONS } from "./stations";

// --- deterministic PRNG (mulberry32) seeded from a string --------------
function hashString(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function rngFor(...parts: string[]) {
  return mulberry32(hashString(parts.join("|")));
}

function stationByCode(code: string): Station {
  const s = FIXTURE_STATIONS.find((st) => st.code === code);
  if (!s) throw new Error(`Fixture station not found: ${code}`);
  return s;
}

function buildRoute(codes: string[]): Station[] {
  return codes.map((code, idx) => ({ ...stationByCode(code), routeIndex: idx }));
}

// Berth type patterns per "bay" for each class, in physical order.
const BAY_PATTERNS: Record<string, BerthType[]> = {
  "1A": ["LOWER", "UPPER"],
  "2A": ["LOWER", "UPPER", "LOWER", "UPPER", "SIDE_LOWER", "SIDE_UPPER"],
  "3A": ["LOWER", "MIDDLE", "UPPER", "LOWER", "MIDDLE", "UPPER", "SIDE_LOWER", "SIDE_UPPER"],
  "3E": ["LOWER", "MIDDLE", "UPPER", "LOWER", "MIDDLE", "UPPER", "SIDE_LOWER", "SIDE_UPPER"],
  SL: ["LOWER", "MIDDLE", "UPPER", "LOWER", "MIDDLE", "UPPER", "SIDE_LOWER", "SIDE_UPPER"],
};

function buildCoach(params: {
  coachNumber: string;
  className: TrainClass;
  bays: number;
  position: number;
  route: Station[];
  journeyDate: string;
  trainNumber: string;
  /** When false, occupancy segment detail is withheld (simulates a source
   * that only reports coarse occupied/vacant, not per-segment data). */
  hasSegmentData: boolean;
}): Coach {
  const pattern = BAY_PATTERNS[params.className] ?? BAY_PATTERNS.SL;
  const berths: Berth[] = [];
  const layout: CoachLayoutBay[] = [];
  let berthNumber = 1;

  for (let bay = 0; bay < params.bays; bay++) {
    const berthIds: string[] = [];
    for (const berthType of pattern) {
      const id = `${params.coachNumber}-${berthNumber}`;
      const rng = rngFor(params.trainNumber, params.journeyDate, id);
      const occupancy: OccupancyRecord[] = [];

      if (params.hasSegmentData) {
        const roll = rng();
        const lastIdx = params.route.length - 1;
        if (roll < 0.38) {
          // Fully occupied for the entire route.
          occupancy.push({
            occupiedFrom: params.route[0].code,
            occupiedTo: params.route[lastIdx].code,
            confirmed: true,
          });
        } else if (roll < 0.62) {
          // Fully vacant — no occupancy records.
        } else {
          // Occupied for a sub-segment of the route only.
          const startIdx = Math.floor(rng() * (lastIdx - 1));
          const endIdx = Math.min(lastIdx, startIdx + 1 + Math.floor(rng() * (lastIdx - startIdx)));
          occupancy.push({
            occupiedFrom: params.route[startIdx].code,
            occupiedTo: params.route[Math.max(startIdx + 1, endIdx)].code,
            confirmed: true,
          });
        }
      } else {
        // Coarse source: only knows "currently occupied" or not, no segments.
        const roll = rng();
        if (roll < 0.5) {
          occupancy.push({
            occupiedFrom: params.route[0].code,
            occupiedTo: params.route[params.route.length - 1].code,
            confirmed: false,
          });
        }
      }

      berths.push({
        id,
        berthNumber,
        coachNumber: params.coachNumber,
        className: params.className,
        berthType,
        occupancy,
        hasSegmentData: params.hasSegmentData,
      });
      berthIds.push(id);
      berthNumber++;
    }
    layout.push({ bayNumber: bay + 1, berthIds });
  }

  return {
    coachNumber: params.coachNumber,
    className: params.className,
    position: params.position,
    berths,
    layout,
  };
}

export interface FixtureChartRequest {
  trainNumber: string;
  journeyDate: string;
}

export function buildFixtureChart(req: FixtureChartRequest): ReservationChart | null {
  const trainDef = FIXTURE_TRAINS.find((t) => t.number === req.trainNumber);
  if (!trainDef || !trainDef.hasFixtureChart) return null;

  if (req.trainNumber === "22648") {
    const route = buildRoute(["TVCN", "KYJ", "ERS", "AWY", "TCR", "WKI", "SRR", "PGT", "CBE", "ED", "SA", "JTJ", "KPD", "MAS"]);
    const coachDefs: { coachNumber: string; className: TrainClass; bays: number }[] = [
      { coachNumber: "A1", className: "3A", bays: 8 },
      { coachNumber: "B1", className: "3A", bays: 8 },
      { coachNumber: "B2", className: "3A", bays: 8 },
      { coachNumber: "E1", className: "3E", bays: 8 },
      { coachNumber: "S1", className: "SL", bays: 9 },
      { coachNumber: "S2", className: "SL", bays: 9 },
      { coachNumber: "S3", className: "SL", bays: 9 },
      { coachNumber: "S4", className: "SL", bays: 9 },
      { coachNumber: "S5", className: "SL", bays: 9 },
    ];
    const coaches = coachDefs.map((c, idx) =>
      buildCoach({
        ...c,
        position: idx + 2,
        route,
        journeyDate: req.journeyDate,
        trainNumber: req.trainNumber,
        hasSegmentData: true,
      })
    );
    return {
      train: { number: trainDef.number, name: trainDef.name },
      journeyDate: req.journeyDate,
      route,
      coaches,
      meta: {
        chartingStation: "TVCN",
        firstChartTime: `${req.journeyDate}T20:11:00+05:30`,
        status: "PREPARED",
        dataRetrievedAt: new Date().toISOString(),
        sourceLabel: "Development fixture data — not live railway data",
        isFixtureData: true,
      },
    };
  }

  if (req.trainNumber === "12621") {
    const route = buildRoute(["MAS", "KPD", "JTJ", "SA", "ED", "CBE", "PGT", "SRR"]);
    const coachDefs: { coachNumber: string; className: TrainClass; bays: number }[] = [
      { coachNumber: "H1", className: "1A", bays: 6 },
      { coachNumber: "A1", className: "2A", bays: 6 },
      { coachNumber: "B1", className: "3A", bays: 8 },
      { coachNumber: "B2", className: "3A", bays: 8 },
      { coachNumber: "S1", className: "SL", bays: 9 },
      { coachNumber: "S2", className: "SL", bays: 9 },
    ];
    const coaches = coachDefs.map((c, idx) =>
      buildCoach({
        ...c,
        position: idx + 2,
        route,
        journeyDate: req.journeyDate,
        trainNumber: req.trainNumber,
        // Simulate a source that cannot report per-segment detail for this
        // particular train, to exercise the "cannot be determined" UI path.
        hasSegmentData: false,
      })
    );
    return {
      train: { number: trainDef.number, name: trainDef.name },
      journeyDate: req.journeyDate,
      route,
      coaches,
      meta: {
        chartingStation: "MAS",
        firstChartTime: `${req.journeyDate}T18:40:00+05:30`,
        status: "PREPARED",
        dataRetrievedAt: new Date().toISOString(),
        sourceLabel: "Development fixture data — not live railway data",
        isFixtureData: true,
      },
    };
  }

  return null;
}
