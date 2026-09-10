import type { ReservationChart } from "@/types";

/**
 * All provider output must pass through here before reaching the UI.
 *
 * The current FixtureRailwayProvider already returns data in the
 * normalized shape, so this is currently a defensive pass-through. A
 * future real provider that returns a different raw shape should do its
 * own mapping into ReservationChart and this function should keep doing
 * light validation/defaulting — it is the single seam the UI depends on,
 * so provider changes never require UI changes.
 */
export function normalizeChart(raw: ReservationChart): ReservationChart {
  return {
    ...raw,
    coaches: raw.coaches.map((c) => ({
      ...c,
      berths: c.berths.map((b) => ({ ...b, occupancy: b.occupancy ?? [] })),
    })),
  };
}
