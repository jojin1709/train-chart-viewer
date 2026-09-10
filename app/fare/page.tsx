"use client";

import * as React from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FareInfo {
  base_fare?: number;
  reservation_charge?: number;
  superfast_charge?: number;
  catering_charge?: number;
  gst?: number;
  dynamic_fare?: number;
  total?: number;
  total_fare?: number;
  fare?: number;
}

export default function FarePage() {
  const [trainNo, setTrainNo] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [date, setDate] = React.useState("");
  const [cls, setCls] = React.useState("SL");
  const [quota, setQuota] = React.useState("GN");
  const [loading, setLoading] = React.useState(false);
  const [fareData, setFareData] = React.useState<FareInfo | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
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
        `/api/fare?train=${trainNo}&date=${date}&from=${from.toUpperCase()}&to=${to.toUpperCase()}&class=${cls}&quota=${quota}`
      );
      const result = await res.json();

      if (result.success !== false && result.data) {
        const data = result.data;
        // Handle different response formats
        const fareInfo: FareInfo = {
          base_fare: Number(data.base_fare || data.baseFare || 0),
          reservation_charge: Number(data.reservation_charge || data.reservationCharge || 0),
          superfast_charge: Number(data.superfast_charge || data.superfastCharge || 0),
          catering_charge: Number(data.catering_charge || data.cateringCharge || 0),
          gst: Number(data.gst || 0),
          dynamic_fare: Number(data.dynamic_fare || data.dynamicFare || 0),
          total: Number(data.total || data.total_fare || data.totalFare || data.fare || 0),
        };
        setFareData(fareInfo);
      } else {
        setError(result.error || "Failed to fetch fare");
      }
      setFetched(true);
    } catch {
      setError("Network error. Please try again.");
      setFetched(true);
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
            <label className="mb-1 block text-xs text-muted-2">Date (DD-MM-YYYY)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="DD-MM-YYYY"
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
              <option value="SS">Senior Citizen (SS)</option>
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
            <span>{typeof error === "string" ? error : "An error occurred"}</span>
          </div>
        )}

        {fetched && !error && fareData && (
          <div className="mt-6 space-y-4">
            {/* Fare Breakdown */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-3 font-semibold text-foreground">Fare Breakdown</h3>
              <div className="space-y-2 text-sm">
                {fareData.base_fare ? (
                  <div className="flex justify-between">
                    <span className="text-muted">Base Fare</span>
                    <span className="font-medium text-foreground">₹{fareData.base_fare}</span>
                  </div>
                ) : null}
                {fareData.reservation_charge ? (
                  <div className="flex justify-between">
                    <span className="text-muted">Reservation Charge</span>
                    <span className="font-medium text-foreground">₹{fareData.reservation_charge}</span>
                  </div>
                ) : null}
                {fareData.superfast_charge ? (
                  <div className="flex justify-between">
                    <span className="text-muted">Superfast Charge</span>
                    <span className="font-medium text-foreground">₹{fareData.superfast_charge}</span>
                  </div>
                ) : null}
                {fareData.catering_charge ? (
                  <div className="flex justify-between">
                    <span className="text-muted">Catering Charge</span>
                    <span className="font-medium text-foreground">₹{fareData.catering_charge}</span>
                  </div>
                ) : null}
                {fareData.gst ? (
                  <div className="flex justify-between">
                    <span className="text-muted">GST</span>
                    <span className="font-medium text-foreground">₹{fareData.gst}</span>
                  </div>
                ) : null}
                {fareData.dynamic_fare ? (
                  <div className="flex justify-between">
                    <span className="text-muted">Dynamic Fare</span>
                    <span className="font-medium text-foreground">₹{fareData.dynamic_fare}</span>
                  </div>
                ) : null}
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total Fare</span>
                    <span className="text-xl font-bold text-accent">₹{fareData.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {fetched && !error && !fareData && (
          <div className="mt-6 rounded-lg border border-border bg-surface-2 p-8 text-center">
            <p className="text-muted">No fare data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
