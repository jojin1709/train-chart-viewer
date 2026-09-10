import type { Berth, BerthWithStatus, SegmentVacancyStatus, Station } from "@/types";

/**
 * Computes, for a single berth, whether it is vacant / part-vacant /
 * occupied for a specific FROM -> TO journey segment.
 *
 * This deliberately works at "leg" granularity (the stretch of track
 * between two consecutive stations on the route) rather than assuming a
 * berth is simply "empty" or "full" for the whole train. That is what
 * lets the app distinguish part-journey vacancy from full vacancy.
 *
 * Returns UNKNOWN (with a reason) whenever the source data does not
 * support this calculation — the app must never guess.
 */
export function computeSegmentStatus(
  berth: Berth,
  route: Station[],
  fromCode: string,
  toCode: string
): { status: SegmentVacancyStatus; reason?: string } {
  const fromIdx = route.findIndex((s) => s.code === fromCode);
  const toIdx = route.findIndex((s) => s.code === toCode);

  if (fromIdx === -1 || toIdx === -1) {
    return { status: "UNKNOWN", reason: "Selected station is not on this train's route." };
  }
  if (fromIdx >= toIdx) {
    return { status: "UNKNOWN", reason: "Destination must come after the boarding station on the route." };
  }
  if (!berth.hasSegmentData) {
    return {
      status: "UNKNOWN",
      reason: "Segment availability cannot be determined from the available chart data.",
    };
  }

  const legCount = route.length - 1;
  if (legCount <= 0) {
    return { status: "UNKNOWN", reason: "Route information is incomplete." };
  }

  const legOccupied = new Array<boolean>(legCount).fill(false);

  for (const rec of berth.occupancy) {
    const occStart = route.findIndex((s) => s.code === rec.occupiedFrom);
    const occEnd = route.findIndex((s) => s.code === rec.occupiedTo);
    if (occStart === -1 || occEnd === -1 || occStart >= occEnd) continue;
    for (let leg = occStart; leg < occEnd; leg++) {
      legOccupied[leg] = true;
    }
  }

  let anyOccupied = false;
  let anyFree = false;
  for (let leg = fromIdx; leg < toIdx; leg++) {
    if (legOccupied[leg]) anyOccupied = true;
    else anyFree = true;
  }

  if (anyOccupied && anyFree) return { status: "PART_JOURNEY_VACANT" };
  if (anyOccupied && !anyFree) return { status: "OCCUPIED" };
  return { status: "FULL_JOURNEY_VACANT" };
}

export function withSegmentStatus(
  berths: Berth[],
  route: Station[],
  fromCode: string | null,
  toCode: string | null
): BerthWithStatus[] {
  return berths.map((b) => {
    if (!fromCode || !toCode) {
      return { ...b, segmentStatus: "UNKNOWN", segmentStatusReason: "No journey segment selected." };
    }
    const { status, reason } = computeSegmentStatus(b, route, fromCode, toCode);
    return { ...b, segmentStatus: status, segmentStatusReason: reason };
  });
}
