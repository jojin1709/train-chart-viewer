"use client";

import * as React from "react";
import { Search, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PassengerData {
  serialNumber?: string;
  serial_number?: string;
  booking?: { status?: string; coach?: string; berthNo?: number; berth_number?: number; berthCode?: string; berth_code?: string; details?: string };
  current?: { status?: string; coach?: string; berthNo?: number; berth_number?: number; berthCode?: string; berth_code?: string; details?: string };
}

interface PNRResponse {
  success?: boolean;
  data?: {
    pnr?: string;
    train?: Record<string, unknown>;
    journey?: Record<string, unknown>;
    chart?: Record<string, unknown>;
    booking?: Record<string, unknown>;
    passengers?: PassengerData[];
  };
  error?: string;
}

export default function PNRPage() {
  const [pnr, setPnr] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<PNRResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCheck() {
    if (!pnr || pnr.length !== 10) {
      setError("PNR must be exactly 10 digits");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/pnr?pnr=${pnr}`);
      const data = await res.json();

      if (data.success === false && data.error) {
        setError(data.error);
      } else if (data.success === true || data.data) {
        setResult(data);
      } else {
        setError("No PNR data found");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Helper to safely extract string from nested objects
  function str(val: unknown): string {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (typeof val === "object" && val !== null) {
      const obj = val as Record<string, unknown>;
      return String(obj.name || obj.code || obj.text || JSON.stringify(obj));
    }
    return String(val);
  }

  function num(val: unknown): number {
    if (!val) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "string") return parseInt(val) || 0;
    return 0;
  }

  const data = result?.data;

  // Extract train info
  const train = data?.train || {};
  const trainNumber = str(train.number || train.train_number || train.train_no);
  const trainName = str(train.name || train.train_name);

  // Extract journey info
  const journey = (data?.journey || {}) as Record<string, unknown>;
  const journeyDate = str(journey.dateOfJourney || journey.date_of_journey || journey.journey_date);
  const className = str(journey.class || journey.coach_class);
  const quota = str(journey.quota);
  const source = (journey.source || journey.from || journey.boarding_point || {}) as Record<string, unknown>;
  const sourceCode = str(source.code || source.station_code);
  const sourceName = str(source.name || source.station_name);
  const dest = (journey.destination || journey.to || {}) as Record<string, unknown>;
  const destCode = str(dest.code || dest.station_code);
  const destName = str(dest.name || dest.station_name);

  // Extract chart status
  const chart = data?.chart || {};
  const chartStatus = str(chart.status || chart.chart_status);

  // Extract fare
  const booking = data?.booking || {};
  const fare = num(booking.fare || booking.ticketFare || booking.ticket_fare || booking.total_fare);

  // Extract passengers
  const passengers = data?.passengers || [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">PNR Status Check</h1>
        <p className="mt-2 text-muted">Check your booking status with 10-digit PNR number</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="Enter 10-digit PNR number"
            className="flex-1 rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent"
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
          <Button onClick={handleCheck} disabled={loading || pnr.length !== 10}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            Check
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
            {/* Train Info */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Train Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-2">Train:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {trainNumber} {trainName ? `- ${trainName}` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-muted-2">Journey Date:</span>
                  <span className="ml-2 font-medium text-foreground">{journeyDate}</span>
                </div>
                <div>
                  <span className="text-muted-2">Class:</span>
                  <span className="ml-2 font-medium text-foreground">{className}</span>
                </div>
                <div>
                  <span className="text-muted-2">Quota:</span>
                  <span className="ml-2 font-medium text-foreground">{quota}</span>
                </div>
              </div>
            </div>

            {/* Route */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Route</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-foreground">
                  {sourceCode} {sourceName ? `(${sourceName})` : ""}
                </span>
                <span className="text-muted-2">→</span>
                <span className="font-medium text-foreground">
                  {destCode} {destName ? `(${destName})` : ""}
                </span>
              </div>
            </div>

            {/* Chart Status */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Chart Status</h3>
              <div className="flex items-center gap-2">
                {chartStatus.toLowerCase().includes("prepared") ? (
                  <CheckCircle className="text-vacant" size={18} />
                ) : (
                  <AlertCircle className="text-muted-2" size={18} />
                )}
                <span className="font-medium text-foreground">{chartStatus || "Not Available"}</span>
              </div>
            </div>

            {/* Passengers */}
            {passengers.length > 0 && (
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <h3 className="mb-3 font-semibold text-foreground">Passenger Status</h3>
                <div className="space-y-3">
                  {passengers.map((p, idx) => {
                    const current = p.current || p.booking || {};
                    const status = str(current.status);
                    const coach = str(current.coach);
                    const berthNo = current.berthNo || current.berth_number;
                    const berthCode = str(current.berthCode || current.berth_code);

                    return (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            Passenger {idx + 1}
                          </span>
                          <div className="mt-1 text-xs text-muted-2">
                            Coach: {coach} | Berth: {berthNo || "-"} ({berthCode})
                          </div>
                        </div>
                        <span
                          className={`rounded px-2 py-1 text-xs font-semibold ${
                            status === "CNF"
                              ? "bg-vacant/20 text-vacant"
                              : status === "RAC"
                              ? "bg-part/20 text-part"
                              : status === "WL"
                              ? "bg-danger/20 text-danger"
                              : "bg-occupied/20 text-occupied"
                          }`}
                        >
                          {status || "Unknown"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fare */}
            {fare > 0 && (
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <h3 className="mb-2 font-semibold text-foreground">Fare Details</h3>
                <div className="text-sm">
                  <span className="text-muted-2">Total Fare:</span>
                  <span className="ml-2 text-lg font-bold text-accent">₹{fare}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
