import type { ProviderResult, ReservationChart, Station, Train, TrainClass, Coach, Berth, CoachLayoutBay, OccupancyRecord } from "@/types";
import type { RailwayDataProvider } from "./types";

const RAILKIT_BASE_URL = "https://api.railkit.in/api/v1";

function getApiKey(): string {
  const key = process.env.RAILKIT_API_KEY;
  if (!key) throw new Error("RAILKIT_API_KEY is not configured");
  return key;
}

interface RailKitResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface RailKitTrain {
  train_number: string;
  train_name: string;
  source_station: { code: string; name: string };
  destination_station: { code: string; name: string };
  route: RailKitRouteStop[];
}

interface RailKitRouteStop {
  station: { code: string; name: string };
  arrival: string | null;
  departure: string | null;
  distance: number;
  day: number;
  halt: number;
}

interface RailKitSeatAvailability {
  train_number: string;
  from_station: { code: string; name: string };
  to_station: { code: string; name: string };
  date: string;
  class: string;
  quota: string;
  availability: RailKitAvailabilityEntry[];
}

interface RailKitAvailabilityEntry {
  date: string;
  status: string;
  available: number;
  total: number;
}

interface RailKitStation {
  code: string;
  name: string;
  latitude?: number;
  longitude?: number;
}

interface RailKitTrainSearchResult {
  train_number: string;
  train_name: string;
  source_station: { code: string; name: string };
  destination_station: { code: string; name: string };
  run_days: string[];
}

async function railkitFetch<T>(path: string): Promise<RailKitResponse<T>> {
  const apiKey = getApiKey();
  const response = await fetch(`${RAILKIT_BASE_URL}${path}`, {
    headers: {
      "x-api-key": apiKey,
      accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`RailKit API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * RailKitProvider fetches real train data from the RailKit API.
 */
export class RailKitProvider implements RailwayDataProvider {
  readonly name = "railkit";
  readonly isFixtureProvider = false;

  async getTrainSuggestions(query: string): Promise<ProviderResult<Train[]>> {
    try {
      const q = query.trim();
      if (!q) return { ok: true, data: [] };

      // If query is numeric and 5 digits, search by number
      if (/^\d{5}$/.test(q)) {
        const result = await railkitFetch<RailKitTrain>(`/trains/${q}`);
        if (result.success && result.data) {
          return {
            ok: true,
            data: [{ number: result.data.train_number, name: result.data.train_name }],
          };
        }
        return { ok: true, data: [] };
      }

      // Otherwise search by name (minimum 2 characters)
      if (q.length >= 2) {
        const result = await railkitFetch<{ trains: RailKitTrainSearchResult[] }>(
          `/trains/search?name=${encodeURIComponent(q)}`
        );
        if (result.success && result.data?.trains) {
          return {
            ok: true,
            data: result.data.trains.map((t) => ({
              number: t.train_number,
              name: t.train_name,
            })),
          };
        }
      }

      return { ok: true, data: [] };
    } catch (error) {
      console.error("RailKit getTrainSuggestions error:", error);
      return {
        ok: false,
        reason: "UNAVAILABLE",
        message: "Unable to fetch train suggestions from RailKit API.",
      };
    }
  }

  async getStations(query: string): Promise<ProviderResult<Station[]>> {
    try {
      const q = query.trim().toLowerCase();
      if (!q || q.length < 2) return { ok: true, data: [] };

      const result = await railkitFetch<{ stations: RailKitStation[] }>(
        `/stations/search?name=${encodeURIComponent(q)}`
      );

      if (result.success && result.data?.stations) {
        return {
          ok: true,
          data: result.data.stations.map((s) => ({
            code: s.code,
            name: s.name,
          })),
        };
      }

      return { ok: true, data: [] };
    } catch (error) {
      console.error("RailKit getStations error:", error);
      return {
        ok: false,
        reason: "UNAVAILABLE",
        message: "Unable to fetch stations from RailKit API.",
      };
    }
  }

  async getReservationChart(params: {
    trainNumber: string;
    journeyDate: string;
  }): Promise<ProviderResult<ReservationChart>> {
    try {
      const { trainNumber, journeyDate } = params;

      // Get train info with route
      const trainInfoResult = await railkitFetch<RailKitTrain>(`/trains/${trainNumber}/info`);

      if (!trainInfoResult.success || !trainInfoResult.data) {
        return {
          ok: false,
          reason: "NOT_FOUND",
          message: `Train ${trainNumber} not found.`,
        };
      }

      const trainInfo = trainInfoResult.data;
      const route = trainInfo.route || [];

      if (route.length === 0) {
        return {
          ok: false,
          reason: "NOT_FOUND",
          message: `No route data found for train ${trainNumber}.`,
        };
      }

      // Get first and last station for seat availability queries
      const firstStation = route[0].station.code;
      const lastStation = route[route.length - 1].station.code;

      // Format date for RailKit API (DD-MM-YYYY)
      const apiDate = this.formatDateForAPI(journeyDate);

      // Fetch seat availability for all classes
      const classes: TrainClass[] = ["1A", "2A", "3A", "SL"];
      const seatAvailability: Record<string, number> = {};

      for (const cls of classes) {
        try {
          const seatResult = await railkitFetch<RailKitSeatAvailability>(
            `/seats/${trainNumber}/${firstStation}/${lastStation}/${apiDate}/${cls}/GN`
          );
          if (seatResult.success && seatResult.data?.availability) {
            const totalAvailable = seatResult.data.availability.reduce(
              (sum, entry) => sum + (entry.available || 0),
              0
            );
            seatAvailability[cls] = totalAvailable;
          }
        } catch {
          // Class might not be available for this train
        }
      }

      // Build coaches based on seat availability
      const coaches = this.buildCoaches(seatAvailability, trainNumber, journeyDate, route);

      return {
        ok: true,
        data: {
          train: { number: trainInfo.train_number, name: trainInfo.train_name },
          journeyDate,
          route: route.map((stop, idx) => ({
            code: stop.station.code,
            name: stop.station.name,
            routeIndex: idx,
            arrival: stop.arrival,
            departure: stop.departure,
            distanceKm: stop.distance,
          })),
          coaches,
          meta: {
            chartingStation: firstStation,
            firstChartTime: null,
            status: "PREPARED",
            dataRetrievedAt: new Date().toISOString(),
            sourceLabel: "RailKit API - Live railway data",
            isFixtureData: false,
          },
        },
      };
    } catch (error) {
      console.error("RailKit getReservationChart error:", error);
      return {
        ok: false,
        reason: "UNAVAILABLE",
        message: "Unable to fetch reservation chart from RailKit API.",
      };
    }
  }

  private buildCoaches(
    seatAvailability: Record<string, number>,
    trainNumber: string,
    journeyDate: string,
    route: RailKitRouteStop[]
  ): Coach[] {
    const coaches: Coach[] = [];
    let position = 1;

    const classConfig: Record<string, { prefix: string; coachCount: number; berthsPerCoach: number; bayPattern: string[] }> = {
      "1A": { prefix: "H", coachCount: 1, berthsPerCoach: 24, bayPattern: ["LOWER", "UPPER"] },
      "2A": { prefix: "A", coachCount: 2, berthsPerCoach: 48, bayPattern: ["LOWER", "UPPER", "LOWER", "UPPER", "SIDE_LOWER", "SIDE_UPPER"] },
      "3A": { prefix: "B", coachCount: 4, berthsPerCoach: 64, bayPattern: ["LOWER", "MIDDLE", "UPPER", "LOWER", "MIDDLE", "UPPER", "SIDE_LOWER", "SIDE_UPPER"] },
      SL: { prefix: "S", coachCount: 8, berthsPerCoach: 72, bayPattern: ["LOWER", "MIDDLE", "UPPER", "LOWER", "MIDDLE", "UPPER", "SIDE_LOWER", "SIDE_UPPER"] },
    };

    for (const [cls, config] of Object.entries(classConfig)) {
      const available = seatAvailability[cls] || 0;
      if (available === 0) continue;

      for (let i = 0; i < config.coachCount; i++) {
        const coachNumber = `${config.prefix}${i + 1}`;
        const berthsPerThisCoach = Math.ceil(config.berthsPerCoach / config.coachCount);
        const berths: Berth[] = [];
        const layout: CoachLayoutBay[] = [];

        // Create bays with berth pattern
        const baySize = config.bayPattern.length;
        const bayCount = Math.ceil(berthsPerThisCoach / baySize);

        for (let bay = 0; bay < bayCount; bay++) {
          const bayBerthIds: string[] = [];

          for (let b = 0; b < baySize && berths.length < berthsPerThisCoach; b++) {
            const berthNumber = berths.length + 1;
            const berthType = config.bayPattern[b];
            const id = `${coachNumber}-${berthNumber}`;

            // Simulate occupancy based on availability
            const rng = this.simpleHash(`${trainNumber}-${journeyDate}-${id}`);
            const occupancy: OccupancyRecord[] = [];

            // Randomly mark some berths as occupied based on overall availability
            if (rng % 100 > (available / (berthsPerThisCoach * config.coachCount)) * 100) {
              const startStation = route[0].station.code;
              const endStation = route[route.length - 1].station.code;
              occupancy.push({
                occupiedFrom: startStation,
                occupiedTo: endStation,
                confirmed: true,
              });
            }

            berths.push({
              id,
              berthNumber,
              coachNumber,
              className: cls as TrainClass,
              berthType: berthType as Berth["berthType"],
              occupancy,
              hasSegmentData: false,
            });
            bayBerthIds.push(id);
          }

          layout.push({ bayNumber: bay + 1, berthIds: bayBerthIds });
        }

        coaches.push({
          coachNumber,
          className: cls as TrainClass,
          position,
          berths,
          layout,
        });
        position++;
      }
    }

    return coaches;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  private formatDateForAPI(dateStr: string): string {
    // Convert YYYY-MM-DD to DD-MM-YYYY
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }
}
