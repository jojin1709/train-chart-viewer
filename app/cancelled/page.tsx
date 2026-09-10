"use client";

import * as React from "react";
import { Loader2, AlertCircle, Train } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CancelledTrain {
  train_number: string;
  train_name: string;
  source_station: { code: string; name: string };
  destination_station: { code: string; name: string };
  cancellation_type: "FULL" | "PARTIAL";
  affected_segment?: string;
}

interface CancelledData {
  success: boolean;
  data?: CancelledTrain[];
  error?: string;
}

export default function CancelledPage() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<CancelledData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFetch() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cancelled");
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to fetch cancelled trains");
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

        {data?.data && (
          <div className="mt-6">
            {data.data.length === 0 ? (
              <div className="rounded-lg border border-border bg-surface-2 p-8 text-center">
                <p className="text-muted">No cancelled trains at the moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.data.map((train, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-4"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {train.train_number} - {train.train_name}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {train.source_station.code} → {train.destination_station.code}
                      </p>
                    </div>
                    <span
                      className={`rounded px-3 py-1 text-xs font-semibold ${
                        train.cancellation_type === "FULL"
                          ? "bg-danger/20 text-danger"
                          : "bg-part/20 text-part"
                      }`}
                    >
                      {train.cancellation_type === "FULL" ? "Fully Cancelled" : "Partially Cancelled"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
