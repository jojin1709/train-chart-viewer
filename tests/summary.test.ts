import { describe, it, expect } from "vitest";
import { computeSummary } from "@/lib/chart/summary";
import type { Coach, Station } from "@/types";

const route: Station[] = [
  { code: "A", name: "Station A", routeIndex: 0 },
  { code: "B", name: "Station B", routeIndex: 1 },
  { code: "C", name: "Station C", routeIndex: 2 },
];

const coaches: Coach[] = [
  {
    coachNumber: "S1",
    className: "SL",
    berths: [
      { id: "S1-1", berthNumber: 1, coachNumber: "S1", className: "SL", berthType: "LOWER", occupancy: [], hasSegmentData: true },
      {
        id: "S1-2",
        berthNumber: 2,
        coachNumber: "S1",
        className: "SL",
        berthType: "UPPER",
        occupancy: [{ occupiedFrom: "A", occupiedTo: "C", confirmed: true }],
        hasSegmentData: true,
      },
      {
        id: "S1-3",
        berthNumber: 3,
        coachNumber: "S1",
        className: "SL",
        berthType: "MIDDLE",
        occupancy: [{ occupiedFrom: "A", occupiedTo: "B", confirmed: true }],
        hasSegmentData: true,
      },
    ],
    layout: [{ bayNumber: 1, berthIds: ["S1-1", "S1-2", "S1-3"] }],
  },
];

describe("computeSummary", () => {
  it("counts vacant, occupied and part-journey berths correctly for a segment", () => {
    const summary = computeSummary(coaches, route, "A", "C");
    expect(summary.totalBerths).toBe(3);
    expect(summary.vacant).toBe(1);
    expect(summary.occupied).toBe(1);
    expect(summary.partJourney).toBe(1);
    expect(summary.byClass.SL.total).toBe(3);
  });

  it("marks everything unknown when no segment is selected", () => {
    const summary = computeSummary(coaches, route, null, null);
    expect(summary.unknown).toBe(3);
    expect(summary.vacant).toBe(0);
  });
});
