"use client";

import * as React from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FareBreakdown {
  baseFare: number;
  reservationCharge: number;
  superfastCharge: number;
  otherCharge: number;
  tatkalFare: number;
  goodsServiceTax: number;
  cateringCharge: number;
  dynamicFare: number;
}

interface FareData {
  trainNumber: string;
  trainName: string;
  sourceStation: string;
  destinationStation: string;
  classCode: string;
  quotaCode: string;
  totalFare: number;
  breakdown: FareBreakdown;
}

export default function FarePage() {
  const [trainNo, setTrainNo] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [date, setDate] = React.useState("");
  const [cls, setCls] = React.useState("SL");
  const [quota, setQuota] = React.useState("GN");
  const [loading, setLoading] = React.useState(false);
  const [fareData, setFareData] = React.useState<FareData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const today = new Date();
    const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setDate(formatted);
  }, []);

  async function handleLookup() {
    if (!trainNo || !from || !to || !date) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);
    setFareData(null);

    try {
      const res = await fetch(
        `/api/fare?train=${trainNo}&from=${from.toUpperCase()}&to=${to.toUpperCase()}&date=${date}&class=${cls}&quota=${quota}`
      );
      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || "Failed to fetch fare");
      } else if (json.data) {
        setFareData(json.data);
      } else {
        setError("No fare data found");
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
        <h1 className="text-3xl font-bold text-foreground">Fare Lookup</h1>
        <p className="mt-2 text-muted">Check ticket fare with complete breakdown</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1 block text-xs text-muted-2">Train Number</label>
            <input
              type="text"
              value={trainNo}
              onChange={(e) => setTrainNo(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="5-digit train number"
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-2">From Station</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value.toUpperCase())}
              placeholder="e.g. NDLS"
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-2">To Station</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value.toUpperCase())}
              placeholder="e.g. MAS"
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-2">Date (YYYY-MM-DD)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-2">Class</label>
            <select
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="SL">Sleeper (SL)</option>
              <option value="3A">AC 3-Tier (3A)</option>
              <option value="2A">AC 2-Tier (2A)</option>
              <option value="1A">AC First (1A)</option>
              <option value="CC">Chair Car (CC)</option>
              <option value="EC">Executive Chair (EC)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-2">Quota</label>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className="w-full rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="GN">General (GN)</option>
              <option value="TQ">Tatkal (TQ)</option>
              <option value="LD">Ladies (LD)</option>
              <option value="PT">Premium Tatkal (PT)</option>
            </select>
          </div>
        </div>

        <Button onClick={handleLookup} disabled={loading} className="mt-4 w-full">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          Check Fare
        </Button>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft p-4 text-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {fareData && (
          <div className="mt-6 space-y-4">
            {/* Train Info */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Train Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-2">Train:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {fareData.trainNumber} - {fareData.trainName}
                  </span>
                </div>
                <div>
                  <span className="text-muted-2">Route:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {fareData.sourceStation} → {fareData.destinationStation}
                  </span>
                </div>
                <div>
                  <span className="text-muted-2">Class:</span>
                  <span className="ml-2 font-medium text-foreground">{fareData.classCode}</span>
                </div>
                <div>
                  <span className="text-muted-2">Quota:</span>
                  <span className="ml-2 font-medium text-foreground">{fareData.quotaCode}</span>
                </div>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-3 font-semibold text-foreground">Fare Breakdown</h3>
              <div className="space-y-2 text-sm">
                {fareData.breakdown.baseFare > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Base Fare</span>
                    <span className="font-medium text-foreground">₹{fareData.breakdown.baseFare}</span>
                  </div>
                )}
                {fareData.breakdown.reservationCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Reservation Charge</span>
                    <span className="font-medium text-foreground">₹{fareData.breakdown.reservationCharge}</span>
                  </div>
                )}
                {fareData.breakdown.superfastCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Superfast Charge</span>
                    <span className="font-medium text-foreground">₹{fareData.breakdown.superfastCharge}</span>
                  </div>
                )}
                {fareData.breakdown.cateringCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Catering Charge</span>
                    <span className="font-medium text-foreground">₹{fareData.breakdown.cateringCharge}</span>
                  </div>
                )}
                {fareData.breakdown.goodsServiceTax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">GST</span>
                    <span className="font-medium text-foreground">₹{fareData.breakdown.goodsServiceTax}</span>
                  </div>
                )}
                {fareData.breakdown.dynamicFare > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Dynamic Fare</span>
                    <span className="font-medium text-foreground">₹{fareData.breakdown.dynamicFare}</span>
                  </div>
                )}
                {fareData.breakdown.otherCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Other Charges</span>
                    <span className="font-medium text-foreground">₹{fareData.breakdown.otherCharge}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total Fare</span>
                    <span className="text-xl font-bold text-accent">₹{fareData.totalFare}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
