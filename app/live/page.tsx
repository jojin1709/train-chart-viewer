"use client";

import * as React from "react";
import { Search, Loader2, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveTrainData {
  success: boolean;
  data?: {
    train_number: string;
    train_name: string;
    date: string;
    current_station: { code: string; name: string };
    status: string;
    delay: number;
    speed: number;
    route: {
      station: { code: string; name: string };
      arrival: string | null;
      departure: string | null;
      actual_arrival: string | null;
      actual_departure: string | null;
      delay: number;
      platform: number | null;
      status: string;
    }[];
  };
  error?: string;
}

export default function LiveTrackingPage() {
  const [trainNumber, setTrainNumber] = React.useState("");
  const [date, setDate] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<LiveTrainData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Set default date to today in DD-MM-YYYY format
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
    setDate(formatted);
  }, []);

  async function handleTrack() {
    if (!trainNumber || trainNumber.length !== 5) {
      setError("Train number must be exactly 5 digits");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/train-live?train=${trainNumber}&date=${date}`);
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to track train");
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
            {error}
          </div>
        )}

        {data?.data && (
          <div className="mt-6 space-y-4">
            {/* Train Header */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {data.data.train_number} - {data.data.train_name}
                  </h2>
                  <p className="text-sm text-muted">Date: {data.data.date}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-accent" size={18} />
                    <span className="font-semibold text-foreground">{data.data.current_station.code}</span>
                  </div>
                  <p className="text-sm text-muted">{data.data.current_station.name}</p>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                <p className="text-xs text-muted-2">Status</p>
                <p className={`text-lg font-bold ${data.data && data.data.delay > 0 ? "text-part" : "text-vacant"}`}>
                  {data.data?.status}
                </p>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                <p className="text-xs text-muted-2">Delay</p>
                <p className={`text-lg font-bold ${data.data && data.data.delay > 0 ? "text-part" : "text-vacant"}`}>
                  {data.data && data.data.delay > 0 ? `${data.data.delay} min` : "On Time"}
                </p>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-surface-2 p-4 text-center">
                <p className="text-xs text-muted-2">Speed</p>
                <p className="text-lg font-bold text-foreground">{data.data?.speed} km/h</p>
              </div>
            </div>

            {/* Route Timeline */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-4 font-semibold text-foreground">Route Timeline</h3>
              <div className="space-y-2">
                {data.data?.route.map((stop, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      stop.station.code === data.data?.current_station.code
                        ? "border-accent bg-accent/10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          stop.status === "Reached"
                            ? "bg-vacant"
                            : stop.status === "Approaching"
                            ? "bg-part"
                            : "bg-muted-2"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-foreground">{stop.station.code}</p>
                        <p className="text-xs text-muted">{stop.station.name}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-2" />
                        <span className="text-muted-2">Sched:</span>
                        <span className="font-medium text-foreground">{stop.departure || stop.arrival || "-"}</span>
                      </div>
                      {stop.actual_departure && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-accent" />
                          <span className="text-muted-2">Actual:</span>
                          <span className="font-medium text-accent">{stop.actual_departure}</span>
                        </div>
                      )}
                      {stop.platform && (
                        <p className="text-xs text-muted-2">Platform: {stop.platform}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
