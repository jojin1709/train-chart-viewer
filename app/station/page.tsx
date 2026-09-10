"use client";

import * as React from "react";
import { Search, Loader2, MapPin, AlertCircle, Train } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StationTrain {
  [key: string]: unknown;
  train_number?: string;
  train_no?: string;
  number?: string;
  no?: string;
  train_name?: string;
  name?: string;
  title?: string;
  arrival?: string | { time?: string; scheduled?: string; actual?: string };
  scheduled_arrival?: string | { time?: string; scheduled?: string };
  departure?: string | { time?: string; scheduled?: string; actual?: string };
  scheduled_departure?: string | { time?: string; scheduled?: string };
  delay?: number;
  late?: number;
  platform?: number | string;
  plat?: number | string;
  status?: string;
}

export default function StationLivePage() {
  const [stationCode, setStationCode] = React.useState("");
  const [hours, setHours] = React.useState("2");
  const [loading, setLoading] = React.useState(false);
  const [trains, setTrains] = React.useState<StationTrain[]>([]);
  const [stationName, setStationName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [fetched, setFetched] = React.useState(false);

  async function handleSearch() {
    if (!stationCode) {
      setError("Station code is required");
      return;
    }

    setLoading(true);
    setError(null);
    setTrains([]);
    setStationName("");

    try {
      const res = await fetch(`/api/station-live?station=${stationCode.toUpperCase()}&hrs=${hours}`);
      const result = await res.json();

      if (result.success !== false && result.data) {
        const data = result.data;
        setStationName(data.station_name || data.station || stationCode.toUpperCase());

        // Handle different response formats
        let trainList: StationTrain[] = [];
        if (Array.isArray(data.trains)) {
          trainList = data.trains;
        } else if (Array.isArray(data.data)) {
          trainList = data.data;
        } else if (Array.isArray(data)) {
          trainList = data;
        }

        setTrains(trainList);
        setFetched(true);
      } else if (result.error) {
        setError(result.error);
        setFetched(true);
      } else {
        setTrains([]);
        setFetched(true);
      }
    } catch {
      setError("Network error. Please try again.");
      setFetched(true);
    } finally {
      setLoading(false);
    }
  }

  function getTrainNumber(train: StationTrain): string {
    // Try multiple possible field names
    const val = train.train_number || train.train_no || train.number || train.no || train.id || train.trainNo;
    if (typeof val === "string") return val;
    if (typeof val === "object" && val !== null) return JSON.stringify(val);
    return "";
  }

  function getTrainName(train: StationTrain): string {
    // Try multiple possible field names
    const name = train.train_name || train.name || train.title || train.trainName;
    if (typeof name === "string") return name;
    if (typeof name === "object" && name !== null) {
      const obj = name as Record<string, unknown>;
      return String(obj.name || obj.title || obj.text || JSON.stringify(obj));
    }
    return "";
  }

  function extractTime(val: unknown): string {
    if (!val) return "-";
    if (typeof val === "string") return val;
    if (typeof val === "object" && val !== null) {
      const obj = val as Record<string, unknown>;
      return String(obj.time || obj.scheduled || obj.actual || obj.timestamp || JSON.stringify(obj));
    }
    return String(val);
  }

  function getArrival(train: StationTrain): string {
    return extractTime(train.arrival || train.scheduled_arrival);
  }

  function getDeparture(train: StationTrain): string {
    return extractTime(train.departure || train.scheduled_departure);
  }

  function getDelay(train: StationTrain): number {
    return Number(train.delay || train.late || 0);
  }

  function getPlatform(train: StationTrain): number | string {
    const p = train.platform || train.plat;
    if (typeof p === "object" && p !== null) return JSON.stringify(p);
    return p || "-";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Station Live Status</h1>
        <p className="mt-2 text-muted">View live train arrivals and departures at any station</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={stationCode}
            onChange={(e) => setStationCode(e.target.value.toUpperCase())}
            placeholder="Station code (e.g. NDLS)"
            className="flex-1 rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <select
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="2">Next 2 hours</option>
            <option value="4">Next 4 hours</option>
            <option value="8">Next 8 hours</option>
          </select>
          <Button onClick={handleSearch} disabled={loading || !stationCode}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            Search
          </Button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft p-4 text-danger">
            <AlertCircle size={18} />
            <span>{typeof error === "string" ? error : "An error occurred"}</span>
          </div>
        )}

        {fetched && !error && trains.length === 0 && (
          <div className="mt-6 rounded-lg border border-border bg-surface-2 p-8 text-center">
            <Train className="mx-auto mb-3 text-muted-2" size={40} />
            <p className="text-muted">No trains found in the selected time window</p>
          </div>
        )}

        {trains.length > 0 && (
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="text-accent" size={20} />
              <h2 className="text-xl font-semibold text-foreground">
                {stationName || stationCode.toUpperCase()}
              </h2>
              <span className="text-sm text-muted">- {trains.length} trains</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-muted-2">Train</th>
                    <th className="px-4 py-3 text-left text-muted-2">Name</th>
                    <th className="px-4 py-3 text-left text-muted-2">Arrival</th>
                    <th className="px-4 py-3 text-left text-muted-2">Departure</th>
                    <th className="px-4 py-3 text-left text-muted-2">Platform</th>
                    <th className="px-4 py-3 text-left text-muted-2">Delay</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map((train, idx) => {
                    const delay = getDelay(train);
                    return (
                      <tr key={idx} className="border-b border-border hover:bg-surface-2">
                        <td className="px-4 py-3 font-medium text-foreground">
                          {getTrainNumber(train)}
                        </td>
                        <td className="px-4 py-3 text-muted">{getTrainName(train)}</td>
                        <td className="px-4 py-3 text-foreground">{getArrival(train)}</td>
                        <td className="px-4 py-3 text-foreground">{getDeparture(train)}</td>
                        <td className="px-4 py-3 text-foreground">{getPlatform(train)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-medium ${
                              delay > 0 ? "text-part" : "text-vacant"
                            }`}
                          >
                            {delay > 0 ? `${delay} min` : "On Time"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
