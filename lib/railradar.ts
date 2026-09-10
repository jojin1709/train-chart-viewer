const BASE_URL = "https://api.railradar.in/v1";

function getApiKey(): string {
  const key = process.env.RAILRADAR_API_KEY;
  if (!key) throw new Error("RAILRADAR_API_KEY not set");
  return key;
}

async function railradarFetch<T = unknown>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`RailRadar ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ---- Trains ----

export interface TrainSearchResult {
  number: string;
  name: string;
  source: string;
  dest: string;
  sourceName: string;
  destName: string;
}

export async function searchTrains(q: string, limit = 20): Promise<TrainSearchResult[]> {
  const res = await railradarFetch<{ success: boolean; data: Array<{ number: string; name: string; source: string; dest: string; sourceName: string; destName: string }> }>("/lookup/search/trains", { q, limit: String(limit) });
  if (!res.success || !res.data) return [];
  return res.data;
}

export interface TrainInfo {
  number: string;
  name: string;
  type: string;
  category: string;
  source: { code: string; name: string };
  destination: { code: string; name: string };
  runDays: string[];
  distance: number;
  duration: number;
  totalHalts: number;
  coachPosition: string;
}

export interface TrainRouteStop {
  sequence: number;
  station: { code: string; name: string };
  arrival: string | null;
  departure: string | null;
  arrivalDay: number;
  departureDay: number;
  distance: number;
  isHalt: boolean;
  platform: string | null;
}

export interface TrainInfoResponse {
  train: TrainInfo;
  route: TrainRouteStop[];
}

export async function getTrainInfo(number: string): Promise<TrainInfoResponse | null> {
  try {
    const res = await railradarFetch<{ success: boolean; data: TrainInfoResponse }>(`/trains/${number}`, { haltsOnly: "true" });
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}

// ---- Coaches ----

export interface CoachInfo {
  position: number;
  code: string;
  category: string;
  classType: string;
  name: string;
  totalBerths: number;
  hasSeats: boolean;
  color: string;
}

export interface Blueprint {
  classCode: string;
  className: string;
  totalBerths: number;
  hasSeats: boolean;
  cabins: Array<{
    cabinNumber: number;
    main: Array<{ number: number; type: string; name: string }>;
    side: Array<{ number: number; type: string; name: string }>;
  }>;
}

export interface CoachesResponse {
  trainNumber: string;
  trainName: string;
  baseFormation: string;
  totalCoaches: number;
  coaches: CoachInfo[];
  blueprints: Record<string, Blueprint>;
  summary: Record<string, number>;
}

export async function getTrainCoaches(number: string): Promise<CoachesResponse | null> {
  try {
    const res = await railradarFetch<{ success: boolean; data: CoachesResponse }>(`/trains/${number}/coaches`);
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}

// ---- Live Status ----

export interface LiveStatus {
  trainNumber: string;
  trainName: string;
  startDate: string;
  status: string;
  delayMinutes: number;
  currentLocation: {
    stationCode: string;
    status: string;
    segmentProgress: number;
    speedKmh: number;
  } | null;
  nextHalt: {
    stationCode: string;
    stationName: string;
    sequence: number;
    distance: number;
  } | null;
  route: Array<{
    sequence: number;
    stationCode: string;
    stationName: string;
    isHalt: boolean;
    scheduledArrival: string | null;
    scheduledDeparture: string | null;
    actualArrival: string | null;
    actualDeparture: string | null;
    delayArrival: number | null;
    delayDeparture: number | null;
    status: string;
    distance: number;
    platform: string | null;
  }>;
}

export async function getTrainLiveStatus(number: string, date?: string): Promise<LiveStatus | null> {
  try {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    const res = await railradarFetch<{ success: boolean; data: LiveStatus }>(`/trains/${number}/live`, params);
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}

// ---- PNR ----

export interface PNRData {
  pnrNumber: string;
  train: {
    number: string;
    name: string;
    source: { code: string; name: string };
    destination: { code: string; name: string };
    boardingPoint: { code: string; name: string };
    reservationUpto: { code: string; name: string };
  };
  journey: {
    date: string;
    class: string;
    quota: string;
    bookingFare: string;
  };
  charting: {
    isPrepared: boolean;
    status: string;
    chartUrl: string;
  };
  passengers: Array<{
    passengerNumber: number;
    bookingStatus: string;
    currentStatus: string;
    coach: string;
    berthNumber: number;
    berthCode: string;
    coachPosition: string;
    isConfirmed: boolean;
    isRAC: boolean;
    isWaitlisted: boolean;
    isCancelled: boolean;
  }>;
}

export async function getPNRStatus(pnr: string): Promise<PNRData | null> {
  try {
    const res = await railradarFetch<{ success: boolean; data: PNRData }>(`/pnr/${pnr}`);
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}

// ---- Fare ----

export interface FareData {
  trainNumber: string;
  trainName: string;
  sourceStation: string;
  destinationStation: string;
  classCode: string;
  quotaCode: string;
  totalFare: number;
  breakdown: {
    baseFare: number;
    reservationCharge: number;
    superfastCharge: number;
    otherCharge: number;
    tatkalFare: number;
    goodsServiceTax: number;
    cateringCharge: number;
    dynamicFare: number;
  };
}

export async function getTrainFare(
  number: string,
  source: string,
  destination: string,
  date: string,
  classCode: string,
  quotaCode = "GN"
): Promise<FareData | null> {
  try {
    const res = await railradarFetch<{ success: boolean; data: FareData }>(`/trains/${number}/fare`, {
      source,
      destination,
      journeyDate: date,
      classCode,
      quotaCode,
    });
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}

// ---- Station Search ----

export interface StationSearchResult {
  code: string;
  name: string;
  city: string;
}

export async function searchStations(q: string, limit = 20): Promise<StationSearchResult[]> {
  const res = await railradarFetch<{ success: boolean; data: StationSearchResult[] }>("/lookup/search/stations", { q, limit: String(limit) });
  if (!res.success || !res.data) return [];
  return res.data;
}

// ---- Live Station Board ----

export interface StationLiveTrain {
  train: {
    number: string;
    name: string;
    type: string;
    source: string;
    destination: string;
    runDays: string[];
  };
  stop: {
    sequence: number;
    arrival: string | null;
    departure: string | null;
    day: number;
    distance: number;
  };
  live: {
    type: string;
    expectedDepartureTime: string | null;
    platform: string | null;
    delayMinutes: number;
  };
}

export interface StationLiveBoard {
  station: { code: string; name: string };
  window: { from: string; to: string; hoursBack: number; hoursAhead: number };
  count: number;
  trains: StationLiveTrain[];
}

export async function getStationLiveBoard(code: string, hours: 2 | 4 | 6 | 8 = 4): Promise<StationLiveBoard | null> {
  try {
    const res = await railradarFetch<{ success: boolean; data: StationLiveBoard }>(`/stations/${code}/live`, { hours: String(hours) });
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}
