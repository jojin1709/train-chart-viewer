"use client";

import * as React from "react";
import { Loader2, AlertCircle, Train } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CancelledTrain {
  train_number: string;
  train_name: string;
  source_station?: { code: string; name: string };
  destination_station?: { code: string; name: string };
  from_station?: { code: string; name: string };
  to_station?: { code: string; name: string };
  cancellation_type?: string;
  type?: string;
}

export default function CancelledPage() {
  const [loading, setLoading] = React.useState(false);
  const [trains, setTrains] = React.useState<CancelledTrain[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [fetched, setFetched] = React.useState(false);

  async function handleFetch() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cancelled");
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setTrains(result.data);
      } else {
        setTrains([]);
      }
      setFetched(true);
    } catch {
      setError("Network error. Please try again.");
      setTrains([]);
      setFetched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Cancelled Trains</h1>
        <p className="mt-2 text-muted">View all fully and partially cancelled trains</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <Button onClick={handleFetch} disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Train size={18} />}
          Fetch Cancelled Trains
        </Button>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft p-4 text-danger">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {fetched && !error && trains.length === 0 && (
          <div className="mt-6 rounded-lg border border-border bg-surface-2 p-8 text-center">
            <Train className="mx-auto mb-3 text-muted-2" size={40} />
            <p className="text-muted">No cancelled trains at the moment</p>
            <p className="mt-1 text-xs text-muted-2">All trains are running on schedule</p>
          </div>
        )}

        {trains.length > 0 && (
          <div className="mt-6 space-y-3">
            {trains.map((train, idx) => {
              const fromStation = train.source_station || train.from_station;
              const toStation = train.destination_station || train.to_station;
              const cancelType = train.cancellation_type || train.type || "FULL";

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-4"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {train.train_number} - {train.train_name}
                    </p>
                    {fromStation && toStation && (
                      <p className="mt-1 text-sm text-muted">
                        {fromStation.code} → {toStation.code}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded px-3 py-1 text-xs font-semibold ${
                      cancelType === "FULL" || cancelType === "FULLY_CANCELLED"
                        ? "bg-danger/20 text-danger"
                        : "bg-part/20 text-part"
                    }`}
                  >
                    {cancelType === "FULL" || cancelType === "FULLY_CANCELLED"
                      ? "Fully Cancelled"
                      : "Partially Cancelled"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
