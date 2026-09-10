"use client";

import * as React from "react";
import { Search, Loader2, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StationTrain {
  train_number: string;
  train_name: string;
  arrival: string | null;
  departure: string | null;
  delay: number;
  platform: number | null;
  status: string;
}

interface StationData {
  success: boolean;
  data?: {
    station_code: string;
    station_name: string;
    trains: StationTrain[];
  };
  error?: string;
}

export default function StationLivePage() {
  const [stationCode, setStationCode] = React.useState("");
  const [hours, setHours] = React.useState("2");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<StationData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSearch() {
    if (!stationCode) {
      setError("Station code is required");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/station-live?station=${stationCode.toUpperCase()}&hrs=${hours}`);
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to fetch station status");
      } else {
        setData(result);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
            {error}
          </div>
        )}

        {data?.data && (
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="text-accent" size={20} />
              <h2 className="text-xl font-semibold text-foreground">
                {data.data.station_code} - {data.data.station_name}
              </h2>
            </div>

            {data.data.trains.length === 0 ? (
              <div className="rounded-lg border border-border bg-surface-2 p-8 text-center">
                <p className="text-muted">No trains found in the selected time window</p>
              </div>
            ) : (
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
                      <th className="px-4 py-3 text-left text-muted-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.trains.map((train, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-surface-2">
                        <td className="px-4 py-3 font-medium text-foreground">{train.train_number}</td>
                        <td className="px-4 py-3 text-muted">{train.train_name}</td>
                        <td className="px-4 py-3 text-foreground">{train.arrival || "-"}</td>
                        <td className="px-4 py-3 text-foreground">{train.departure || "-"}</td>
                        <td className="px-4 py-3 text-foreground">{train.platform || "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-medium ${
                              train.delay > 0 ? "text-part" : "text-vacant"
                            }`}
                          >
                            {train.delay > 0 ? `${train.delay} min` : "On Time"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-1 text-xs font-semibold ${
                              train.status === "On Time"
                                ? "bg-vacant/20 text-vacant"
                                : train.status === "Delayed"
                                ? "bg-part/20 text-part"
                                : "bg-occupied/20 text-occupied"
                            }`}
                          >
                            {train.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
