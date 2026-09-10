"use client";

import * as React from "react";
import { Search, Loader2, MapPin, Clock, AlertCircle, Train } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RouteStop {
  station?: { code: string; name: string };
  station_code?: string;
  station_name?: string;
  arrival?: string;
  departure?: string;
  scheduled_arrival?: string;
  scheduled_departure?: string;
  actual_arrival?: string;
  actual_departure?: string;
  delay?: number;
  platform?: number;
  status?: string;
}

interface LiveTrainInfo {
  train_number?: string;
  train_name?: string;
  date?: string;
  current_station?: { code: string; name: string } | string;
  status?: string;
  delay?: number;
  speed?: number;
  route?: RouteStop[];
}

export default function LiveTrackingPage() {
  const [trainNumber, setTrainNumber] = React.useState("");
  const [date, setDate] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [trainInfo, setTrainInfo] = React.useState<LiveTrainInfo | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
    setDate(formatted);
  }, []);

  async function handleTrack() {
    if (!trainNumber || trainNumber.length !== 5) {
      setError("Train number must be 5 digits");
      return;
    }

    setLoading(true);
    setError(null);
    setTrainInfo(null);

    try {
      const res = await fetch(`/api/train-live?train=${trainNumber}&date=${date}`);
      const result = await res.json();

      if (result.success !== false && result.data) {
        setTrainInfo(result.data);
      } else {
        setError(result.error || "Train not found");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getStationCode(station: { code: string; name: string } | string | undefined): string {
    if (!station) return "";
    if (typeof station === "string") return station;
    return station.code || "";
  }

  function getStationName(station: { code: string; name: string } | string | undefined): string {
    if (!station) return "";
    if (typeof station === "string") return "";
    return station.name || "";
  }

  function getStopStation(stop: RouteStop): { code: string; name: string } {
    if (stop.station) return stop.station;
    return {
      code: String(stop.station_code || ""),
      name: String(stop.station_name || ""),
    };
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Live Train Tracking</h1>
        <p className="mt-2 text-muted">Track your train in real-time with live status</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="Train number (5 digits)"
            className="flex-1 rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent"
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          />
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="DD-MM-YYYY"
            className="w-full rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent sm:w-40"
          />
          <Button onClick={handleTrack} disabled={loading || trainNumber.length !== 5}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            Track
          </Button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft p-4 text-danger">
            <AlertCircle size={18} />
            <span>{typeof error === "string" ? error : "An error occurred"}</span>
          </div>
        )}

        {trainInfo && (
          <div className="mt-6 space-y-4">
            {/* Train Header */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {String(trainInfo.train_number || "")} - {String(trainInfo.train_name || "")}
                  </h2>
                  <p className="text-sm text-muted">Date: {String(trainInfo.date || "")}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-accent" size={18} />
                    <span className="font-semibold text-foreground">
                      {getStationCode(trainInfo.current_station)}
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    {getStationName(trainInfo.current_station)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                <p className="text-xs text-muted-2">Status</p>
                <p className={`text-lg font-bold ${Number(trainInfo.delay || 0) > 0 ? "text-part" : "text-vacant"}`}>
                  {String(trainInfo.status || "Unknown")}
                </p>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                <p className="text-xs text-muted-2">Delay</p>
                <p className={`text-lg font-bold ${Number(trainInfo.delay || 0) > 0 ? "text-part" : "text-vacant"}`}>
                  {Number(trainInfo.delay || 0) > 0 ? `${trainInfo.delay} min` : "On Time"}
                </p>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                <p className="text-xs text-muted-2">Speed</p>
                <p className="text-lg font-bold text-foreground">{String(trainInfo.speed || 0)} km/h</p>
              </div>
            </div>

            {/* Route Timeline */}
            {trainInfo.route && trainInfo.route.length > 0 && (
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <h3 className="mb-4 font-semibold text-foreground">Route Timeline</h3>
                <div className="space-y-2">
                  {trainInfo.route.map((stop, idx) => {
                    const station = getStopStation(stop);
                    const currentCode = getStationCode(trainInfo.current_station);
                    const isCurrent = station.code === currentCode;
                    const delay = Number(stop.delay || 0);

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          isCurrent
                            ? "border-accent bg-accent/10"
                            : "border-border bg-surface"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              stop.status === "Reached" || stop.status === "departed"
                                ? "bg-vacant"
                                : stop.status === "Approaching" || stop.status === "arrived"
                                ? "bg-part"
                                : "bg-muted-2"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-foreground">{station.code}</p>
                            <p className="text-xs text-muted">{station.name}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-muted-2" />
                            <span className="text-muted-2">Sched:</span>
                            <span className="font-medium text-foreground">
                              {String(stop.departure || stop.scheduled_departure || stop.arrival || stop.scheduled_arrival || "-")}
                            </span>
                          </div>
                          {(stop.actual_departure || stop.actual_arrival) && (
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-accent" />
                              <span className="text-muted-2">Actual:</span>
                              <span className="font-medium text-accent">
                                {String(stop.actual_departure || stop.actual_arrival)}
                              </span>
                            </div>
                          )}
                          {stop.platform && (
                            <p className="text-xs text-muted-2">Platform: {String(stop.platform)}</p>
                          )}
                          {delay > 0 && (
                            <p className="text-xs text-part">+{delay} min late</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
