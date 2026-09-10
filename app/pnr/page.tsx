"use client";

import * as React from "react";
import { Search, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PNRPassenger {
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
}

interface PNRData {
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
  passengers: PNRPassenger[];
}

export default function PNRPage() {
  const [pnr, setPnr] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<PNRData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCheck() {
    if (!pnr || pnr.length !== 10) {
      setError("PNR must be exactly 10 digits");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/pnr?pnr=${pnr}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "PNR not found");
      } else if (json.data) {
        setData(json.data);
      } else {
        setError("No PNR data found");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
                    {data.train.number} - {data.train.name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-2">Journey Date:</span>
                  <span className="ml-2 font-medium text-foreground">{data.journey.date}</span>
                </div>
                <div>
                  <span className="text-muted-2">Class:</span>
                  <span className="ml-2 font-medium text-foreground">{data.journey.class}</span>
                </div>
                <div>
                  <span className="text-muted-2">Quota:</span>
                  <span className="ml-2 font-medium text-foreground">{data.journey.quota}</span>
                </div>
              </div>
            </div>

            {/* Route */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Route</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-foreground">
                  {data.train.boardingPoint.code} ({data.train.boardingPoint.name})
                </span>
                <span className="text-muted-2">→</span>
                <span className="font-medium text-foreground">
                  {data.train.reservationUpto.code} ({data.train.reservationUpto.name})
                </span>
              </div>
            </div>

            {/* Chart Status */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Chart Status</h3>
              <div className="flex items-center gap-2">
                {data.charting.isPrepared ? (
                  <CheckCircle className="text-vacant" size={18} />
                ) : (
                  <AlertCircle className="text-muted-2" size={18} />
                )}
                <span className="font-medium text-foreground">{data.charting.status}</span>
              </div>
            </div>

            {/* Passengers */}
            {data.passengers.length > 0 && (
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <h3 className="mb-3 font-semibold text-foreground">Passenger Status</h3>
                <div className="space-y-3">
                  {data.passengers.map((p) => {
                    const status = p.currentStatus || p.bookingStatus;
                    const isCNF = p.isConfirmed;
                    const isRAC = p.isRAC;
                    const isWL = p.isWaitlisted;

                    return (
                      <div key={p.passengerNumber} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            Passenger {p.passengerNumber}
                          </span>
                          <div className="mt-1 text-xs text-muted-2">
                            Coach: {p.coach || "-"} | Berth: {p.berthNumber || "-"} ({p.berthCode || "-"})
                          </div>
                          <div className="mt-0.5 text-xs text-muted-2">
                            Booked: {p.bookingStatus}
                          </div>
                        </div>
                        <span
                          className={`rounded px-2 py-1 text-xs font-semibold ${
                            isCNF
                              ? "bg-vacant/20 text-vacant"
                              : isRAC
                              ? "bg-part/20 text-part"
                              : isWL
                              ? "bg-danger/20 text-danger"
                              : "bg-occupied/20 text-occupied"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fare */}
            {data.journey.bookingFare && (
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <h3 className="mb-2 font-semibold text-foreground">Fare Details</h3>
                <div className="text-sm">
                  <span className="text-muted-2">Total Fare:</span>
                  <span className="ml-2 text-lg font-bold text-accent">₹{data.journey.bookingFare}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
