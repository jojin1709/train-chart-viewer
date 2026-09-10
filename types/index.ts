/**
 * RailChart Explorer — Core domain types
 *
 * These are the NORMALIZED internal types that every UI component consumes.
 * Raw provider responses (whatever shape they arrive in) must be converted
 * into these types by a normalizer (see lib/chart/normalizer.ts) before the
 * UI ever sees them. This keeps the UI decoupled from any specific upstream
 * data source.
 */

export type TrainClass = "1A" | "2A" | "3A" | "3E" | "SL" | "CC" | "2S" | "EC" | "FC";

export type BerthType =
  | "LOWER"
  | "MIDDLE"
  | "UPPER"
  | "SIDE_LOWER"
  | "SIDE_UPPER"
  | "SIDE_MIDDLE"
  | "UNKNOWN";

/**
 * Vacancy status for a berth relative to a specific journey segment
 * (a FROM -> TO selection made by the user).
 *
 * IMPORTANT: this is only ever computed when the underlying data actually
 * supports it. See lib/chart/segment.ts.
 */
export type SegmentVacancyStatus =
  | "FULL_JOURNEY_VACANT"
  | "PART_JOURNEY_VACANT"
  | "OCCUPIED"
  | "UNKNOWN"; // data insufficient to determine

export interface Station {
  code: string; // e.g. "TVCN"
  name: string; // e.g. "Trivandrum North"
  /** Ordinal position of this station along the train's route, if known. */
  routeIndex?: number;
  /** Scheduled arrival/departure, if known (not guaranteed by all providers). */
  arrival?: string | null;
  departure?: string | null;
  distanceKm?: number | null;
}

export interface JourneySegment {
  from: Station;
  to: Station;
}

/**
 * Raw occupancy record for a berth, as far as the chart data source reports
 * it. A berth may have zero, one, or multiple occupancy records across the
 * full route (e.g. occupied Delhi -> Kanpur, then vacant Kanpur -> onward).
 */
export interface OccupancyRecord {
  /** Station code where this occupancy begins. */
  occupiedFrom: string;
  /** Station code where this occupancy ends. */
  occupiedTo: string;
  /** Whether this record is confirmed by the chart (vs. inferred). */
  confirmed: boolean;
}

export interface Berth {
  id: string; // stable id: `${coachNumber}-${berthNumber}`
  berthNumber: number;
  coachNumber: string;
  className: TrainClass;
  berthType: BerthType;
  /** Full-route occupancy segments known from the chart, if any. */
  occupancy: OccupancyRecord[];
  /**
   * Whether the source chart provides enough segment-level detail to
   * compute part-journey vacancy for this berth at all. If false, only
   * a coarse "occupied on the chart" / "vacant on the chart" status can
   * be shown, never segment-specific status.
   */
  hasSegmentData: boolean;
}

export interface Coach {
  coachNumber: string; // e.g. "B2"
  className: TrainClass;
  /** Physical position in the train, if known (1 = closest to engine). */
  position?: number;
  berths: Berth[];
  /** Row/column layout hints for the visual coach map, per class. */
  layout: CoachLayoutBay[];
}

/** A "bay" is a group of berths that are physically adjacent (e.g. a compartment). */
export interface CoachLayoutBay {
  bayNumber: number;
  berthIds: string[];
}

export type ChartStatus = "PREPARED" | "NOT_PREPARED" | "UNAVAILABLE" | "UNKNOWN";

export interface ChartMeta {
  chartingStation?: string | null;
  firstChartTime?: string | null; // ISO timestamp
  status: ChartStatus;
  /** When RailChart Explorer itself fetched/derived this data. */
  dataRetrievedAt: string; // ISO timestamp
  /** Human-readable description of where this data came from. */
  sourceLabel: string;
  /** True when this response is demo/fixture data, never real chart data. */
  isFixtureData: boolean;
}

export interface Train {
  number: string;
  name: string | null;
}

export interface ReservationChart {
  train: Train;
  journeyDate: string; // YYYY-MM-DD
  route: Station[]; // ordered stations, if known
  coaches: Coach[];
  meta: ChartMeta;
}

export interface ChartSummary {
  totalCoaches: number;
  totalBerths: number;
  vacant: number;
  partJourney: number;
  occupied: number;
  unknown: number;
  byClass: Record<string, { total: number; vacant: number; partJourney: number; occupied: number }>;
}

export interface BerthWithStatus extends Berth {
  segmentStatus: SegmentVacancyStatus;
  /** Explanation shown to the user when status is UNKNOWN. */
  segmentStatusReason?: string;
}

/** Result of a provider call that may legitimately be "no data available". */
export type ProviderResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "NOT_FOUND" | "UNAVAILABLE" | "TIMEOUT" | "RATE_LIMITED" | "INVALID_INPUT"; message: string };
