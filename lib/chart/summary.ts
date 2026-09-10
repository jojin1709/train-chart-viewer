import type { BerthWithStatus, ChartSummary, Coach } from "@/types";
import { withSegmentStatus } from "./segment";
import type { Station } from "@/types";

export function computeSummary(
  coaches: Coach[],
  route: Station[],
  from: string | null,
  to: string | null
): ChartSummary {
  const summary: ChartSummary = {
    totalCoaches: coaches.length,
    totalBerths: 0,
    vacant: 0,
    partJourney: 0,
    occupied: 0,
    unknown: 0,
    byClass: {},
  };

  for (const coach of coaches) {
    const berths = withSegmentStatus(coach.berths, route, from, to);
    if (!summary.byClass[coach.className]) {
      summary.byClass[coach.className] = { total: 0, vacant: 0, partJourney: 0, occupied: 0 };
    }
    const classBucket = summary.byClass[coach.className];

    for (const b of berths) {
      summary.totalBerths++;
      classBucket.total++;
      switch (b.segmentStatus) {
        case "FULL_JOURNEY_VACANT":
          summary.vacant++;
          classBucket.vacant++;
          break;
        case "PART_JOURNEY_VACANT":
          summary.partJourney++;
          classBucket.partJourney++;
          break;
        case "OCCUPIED":
          summary.occupied++;
          classBucket.occupied++;
          break;
        default:
          summary.unknown++;
      }
    }
  }

  return summary;
}

export function allBerthsWithStatus(
  coaches: Coach[],
  route: Station[],
  from: string | null,
  to: string | null
): (BerthWithStatus & { className: string })[] {
  const result: (BerthWithStatus & { className: string })[] = [];
  for (const coach of coaches) {
    const berths = withSegmentStatus(coach.berths, route, from, to);
    for (const b of berths) result.push({ ...b, className: coach.className });
  }
  return result;
}
