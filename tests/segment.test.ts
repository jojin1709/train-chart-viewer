import { describe, it, expect } from "vitest";
import { computeSegmentStatus } from "@/lib/chart/segment";
import type { Berth, Station } from "@/types";

const route: Station[] = [
  { code: "A", name: "Station A", routeIndex: 0 },
  { code: "B", name: "Station B", routeIndex: 1 },
  { code: "C", name: "Station C", routeIndex: 2 },
  { code: "D", name: "Station D", routeIndex: 3 },
  { code: "E", name: "Station E", routeIndex: 4 },
];

function makeBerth(overrides: Partial<Berth> = {}): Berth {
  return {
    id: "T-1",
    berthNumber: 1,
    coachNumber: "T",
    className: "SL",
    berthType: "LOWER",
    occupancy: [],
    hasSegmentData: true,
    ...overrides,
  };
}

describe("computeSegmentStatus", () => {
  it("reports full journey vacancy when there is no occupancy at all", () => {
    const berth = makeBerth({ occupancy: [] });
    const result = computeSegmentStatus(berth, route, "A", "E");
    expect(result.status).toBe("FULL_JOURNEY_VACANT");
  });

  it("reports occupied when the occupancy record fully covers the segment", () => {
    const berth = makeBerth({ occupancy: [{ occupiedFrom: "A", occupiedTo: "E", confirmed: true }] });
    const result = computeSegmentStatus(berth, route, "A", "E");
    expect(result.status).toBe("OCCUPIED");
  });

  it("reports occupied when the occupancy record covers exactly the requested sub-segment", () => {
    const berth = makeBerth({ occupancy: [{ occupiedFrom: "B", occupiedTo: "D", confirmed: true }] });
    const result = computeSegmentStatus(berth, route, "B", "D");
    expect(result.status).toBe("OCCUPIED");
  });

  it("reports part-journey vacancy when occupancy overlaps only part of the segment", () => {
    const berth = makeBerth({ occupancy: [{ occupiedFrom: "A", occupiedTo: "C", confirmed: true }] });
    const result = computeSegmentStatus(berth, route, "A", "E");
    expect(result.status).toBe("PART_JOURNEY_VACANT");
  });

  it("reports full journey vacancy for a segment that does not overlap the occupied range", () => {
    const berth = makeBerth({ occupancy: [{ occupiedFrom: "A", occupiedTo: "B", confirmed: true }] });
    const result = computeSegmentStatus(berth, route, "C", "E");
    expect(result.status).toBe("FULL_JOURNEY_VACANT");
  });

  it("reports occupied when multiple occupancy records together cover the whole segment", () => {
    const berth = makeBerth({
      occupancy: [
        { occupiedFrom: "A", occupiedTo: "C", confirmed: true },
        { occupiedFrom: "C", occupiedTo: "E", confirmed: true },
      ],
    });
    const result = computeSegmentStatus(berth, route, "A", "E");
    expect(result.status).toBe("OCCUPIED");
  });

  it("returns UNKNOWN with a reason when the source lacks segment-level data", () => {
    const berth = makeBerth({ hasSegmentData: false, occupancy: [{ occupiedFrom: "A", occupiedTo: "E", confirmed: false }] });
    const result = computeSegmentStatus(berth, route, "A", "E");
    expect(result.status).toBe("UNKNOWN");
    expect(result.reason).toBeTruthy();
  });

  it("returns UNKNOWN when the destination comes before the origin on the route", () => {
    const berth = makeBerth();
    const result = computeSegmentStatus(berth, route, "D", "B");
    expect(result.status).toBe("UNKNOWN");
  });

  it("returns UNKNOWN when a station is not on this train's route", () => {
    const berth = makeBerth();
    const result = computeSegmentStatus(berth, route, "A", "ZZ");
    expect(result.status).toBe("UNKNOWN");
  });

  it("never fabricates a vacant/occupied result when data is insufficient", () => {
    const berth = makeBerth({ hasSegmentData: false });
    const result = computeSegmentStatus(berth, route, "A", "B");
    expect(result.status).not.toBe("FULL_JOURNEY_VACANT");
    expect(result.status).not.toBe("OCCUPIED");
  });
});
