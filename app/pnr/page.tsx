"use client";

import * as React from "react";
import { Search, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PassengerInfo {
  serialNumber?: string;
  serial_number?: string;
  booking?: { status: string; coach: string; berthNo: number; berthCode: string; details: string };
  current?: { status: string; coach: string; berthNo: number; berthCode: string; details: string };
}

interface PNRData {
  pnr?: string;
  train?: { number: string; name: string } | { train_number: string; train_name: string };
  journey?: {
    dateOfJourney?: string;
    date_of_journey?: string;
    class?: string;
    quota?: string;
    source?: { code: string; name: string };
    destination?: { code: string; name: string };
    boardingPoint?: { code: string; name: string };
    boarding_point?: { code: string; name: string };
    distance?: number;
  };
  chart?: { status: string } | { chart_status: string };
  booking?: { fare: number; ticketFare: number; ticket_fare: number; bookingDate: string };
  passengers?: PassengerInfo[];
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
      const result = await res.json();

      if (result.success !== false && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to check PNR");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getTrainNumber(): string {
    if (!data?.train) return "";
    const t = data.train as Record<string, unknown>;
    return String(t.number || t.train_number || "");
  }

  function getTrainName(): string {
    if (!data?.train) return "";
    const t = data.train as Record<string, unknown>;
    return String(t.name || t.train_name || "");
  }

  function getJourneyDate(): string {
    if (!data?.journey) return "";
    const j = data.journey;
    return String(j.dateOfJourney || j.date_of_journey || "");
  }

  function getClassName(): string {
    if (!data?.journey) return "";
    return String(data.journey.class || "");
  }

  function getQuota(): string {
    if (!data?.journey) return "";
    return String(data.journey.quota || "");
  }

  function getSourceCode(): string {
    if (!data?.journey?.source) return "";
    return String(data.journey.source.code || "");
  }

  function getSourceName(): string {
    if (!data?.journey?.source) return "";
    return String(data.journey.source.name || "");
  }

  function getDestCode(): string {
    if (!data?.journey?.destination) return "";
    return String(data.journey.destination.code || "");
  }

  function getDestName(): string {
    if (!data?.journey?.destination) return "";
    return String(data.journey.destination.name || "");
  }

  function getChartStatus(): string {
    if (!data?.chart) return "";
    const c = data.chart as Record<string, unknown>;
    return String(c.status || c.chart_status || "");
  }

  function getTicketFare(): number {
    if (!data?.booking) return 0;
    const b = data.booking;
    return Number(b.ticketFare || b.ticket_fare || b.fare || 0);
  }

  function getPassengers(): PassengerInfo[] {
    return data?.passengers || [];
  }

  function getPassengerNumber(p: PassengerInfo): string {
    return String(p.serialNumber || p.serial_number || "");
  }

  function getCurrentStatus(p: PassengerInfo) {
    const current = p.current || p.booking;
    if (!current) return { status: "Unknown", coach: "", berthNo: 0, berthCode: "" };
    return {
      status: String(current.status || "Unknown"),
      coach: String(current.coach || ""),
      berthNo: Number(current.berthNo || 0),
      berthCode: String(current.berthCode || ""),
    };
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
            <span>{typeof error === "string" ? error : "An error occurred"}</span>
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
                    {getTrainNumber()} - {getTrainName()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-2">Journey Date:</span>
                  <span className="ml-2 font-medium text-foreground">{getJourneyDate()}</span>
                </div>
                <div>
                  <span className="text-muted-2">Class:</span>
                  <span className="ml-2 font-medium text-foreground">{getClassName()}</span>
                </div>
                <div>
                  <span className="text-muted-2">Quota:</span>
                  <span className="ml-2 font-medium text-foreground">{getQuota()}</span>
                </div>
              </div>
            </div>

            {/* Route */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Route</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-foreground">
                  {getSourceCode()} ({getSourceName()})
                </span>
                <span className="text-muted-2">→</span>
                <span className="font-medium text-foreground">
                  {getDestCode()} ({getDestName()})
                </span>
              </div>
            </div>

            {/* Chart Status */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Chart Status</h3>
              <div className="flex items-center gap-2">
                {getChartStatus().toLowerCase().includes("prepared") ? (
                  <CheckCircle className="text-vacant" size={18} />
                ) : (
                  <XCircle className="text-muted-2" size={18} />
                )}
                <span className="font-medium text-foreground">{getChartStatus()}</span>
              </div>
            </div>

            {/* Passengers */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-3 font-semibold text-foreground">Passenger Status</h3>
              <div className="space-y-3">
                {getPassengers().map((p, idx) => {
                  const status = getCurrentStatus(p);
                  return (
                    <div key={idx} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                      <div>
                        <span className="text-sm font-medium text-foreground">{getPassengerNumber(p)}</span>
                        <div className="mt-1 text-xs text-muted-2">
                          Coach: {status.coach} | Berth: {status.berthNo} ({status.berthCode})
                        </div>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          status.status === "CNF"
                            ? "bg-vacant/20 text-vacant"
                            : status.status === "RAC"
                            ? "bg-part/20 text-part"
                            : "bg-occupied/20 text-occupied"
                        }`}
                      >
                        {status.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fare */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Fare Details</h3>
              <div className="text-sm">
                <span className="text-muted-2">Total Fare:</span>
                <span className="ml-2 text-lg font-bold text-accent">₹{getTicketFare()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
