"use client";

import * as React from "react";
import { Search, Loader2, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveRouteStop {
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
}

interface LiveTrainData {
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
  route: LiveRouteStop[];
}

export default function LiveTrackingPage() {
  const [trainNumber, setTrainNumber] = React.useState("");
  const [date, setDate] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<LiveTrainData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const today = new Date();
    const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setDate(formatted);
  }, []);

  async function handleTrack() {
    if (!trainNumber || trainNumber.length !== 5) {
      setError("Train number must be 5 digits");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const dateParam = date ? date.replace(/-/g, "") : "";
      const res = await fetch(`/api/train-live?train=${trainNumber}${dateParam ? `&date=${date}` : ""}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "Train not found");
      } else if (json.data) {
        setData(json.data);
      } else {
        setError("No data found");
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
            placeholder="YYYY-MM-DD"
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
            <span>{error}</span>
          </div>
        )}

        {data && (
          <div className="mt-6 space-y-4">
            {/* Train Header */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {data.trainNumber} - {data.trainName}
                  </h2>
                  <p className="text-sm text-muted">Date: {data.startDate}</p>
                </div>
                <div className="text-right">
                  {data.currentLocation && (
                    <>
                      <div className="flex items-center gap-2">
                        <MapPin className="text-accent" size={18} />
                        <span className="font-semibold text-foreground">
                          {data.currentLocation.stationCode}
                        </span>
                      </div>
                      <p className="text-sm text-muted">
                        {data.currentLocation.status}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                <p className="text-xs text-muted-2">Status</p>
                <p className={`text-lg font-bold ${data.delayMinutes > 0 ? "text-part" : "text-vacant"}`}>
                  {data.status}
                </p>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                <p className="text-xs text-muted-2">Delay</p>
                <p className={`text-lg font-bold ${data.delayMinutes > 0 ? "text-part" : "text-vacant"}`}>
                  {data.delayMinutes > 0 ? `${data.delayMinutes} min` : "On Time"}
                </p>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                <p className="text-xs text-muted-2">Speed</p>
                <p className="text-lg font-bold text-foreground">
                  {data.currentLocation?.speedKmh || 0} km/h
                </p>
              </div>
              {data.nextHalt && (
                <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                  <p className="text-xs text-muted-2">Next Stop</p>
                  <p className="text-lg font-bold text-accent">{data.nextHalt.stationCode}</p>
                  <p className="text-xs text-muted">{data.nextHalt.stationName}</p>
                </div>
              )}
            </div>

            {/* Route Timeline */}
            {data.route && data.route.length > 0 && (
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <h3 className="mb-4 font-semibold text-foreground">Route Timeline</h3>
                <div className="space-y-2">
                  {data.route.filter((s) => s.isHalt).map((stop) => {
                    const currentCode = data.currentLocation?.stationCode;
                    const isCurrent = stop.stationCode === currentCode;
                    const delay = stop.delayDeparture || stop.delayArrival || 0;

                    return (
                      <div
                        key={stop.sequence}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          isCurrent
                            ? "border-accent bg-accent/10"
                            : "border-border bg-surface"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              stop.status === "departed"
                                ? "bg-vacant"
                                : stop.status === "at-station"
                                ? "bg-part"
                                : "bg-muted-2"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-foreground">{stop.stationCode}</p>
                            <p className="text-xs text-muted">{stop.stationName}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-muted-2" />
                            <span className="text-muted-2">Sched:</span>
                            <span className="font-medium text-foreground">
                              {stop.scheduledDeparture || stop.scheduledArrival || "-"}
                            </span>
                          </div>
                          {(stop.actualDeparture || stop.actualArrival) && (
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-accent" />
                              <span className="text-muted-2">Actual:</span>
                              <span className="font-medium text-accent">
                                {stop.actualDeparture || stop.actualArrival}
                              </span>
                            </div>
                          )}
                          {stop.platform && (
                            <p className="text-xs text-muted-2">Platform: {stop.platform}</p>
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
