"use client";

import * as React from "react";
import { Search, Loader2, IndianRupee, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FareData {
  success: boolean;
  data?: {
    train_number: string;
    from_station: { code: string; name: string };
    to_station: { code: string; name: string };
    date: string;
    class: string;
    quota: string;
    fare_breakdown: {
      base_fare: number;
      reservation_charge: number;
      superfast_charge: number;
      catering_charge: number;
      gst: number;
      dynamic_fare: number;
      total: number;
    };
  };
  error?: string;
}

export default function FarePage() {
  const [trainNo, setTrainNo] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [date, setDate] = React.useState("");
  const [cls, setCls] = React.useState("SL");
  const [quota, setQuota] = React.useState("GN");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<FareData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

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
    setData(null);

    try {
      const res = await fetch(
        `/api/fare?train=${trainNo}&date=${date}&from=${from.toUpperCase()}&to=${to.toUpperCase()}&class=${cls}&quota=${quota}`
      );
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to lookup fare");
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
            {error}
          </div>
        )}

        {data?.data && (
          <div className="mt-6 space-y-4">
            {/* Journey Info */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Journey Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-2">Train:</span>
                  <span className="ml-2 font-medium text-foreground">{data.data.train_number}</span>
                </div>
                <div>
                  <span className="text-muted-2">Date:</span>
                  <span className="ml-2 font-medium text-foreground">{data.data.date}</span>
                </div>
                <div>
                  <span className="text-muted-2">From:</span>
                  <span className="ml-2 font-medium text-foreground">{data.data.from_station.code}</span>
                </div>
                <div>
                  <span className="text-muted-2">To:</span>
                  <span className="ml-2 font-medium text-foreground">{data.data.to_station.code}</span>
                </div>
                <div>
                  <span className="text-muted-2">Class:</span>
                  <span className="ml-2 font-medium text-foreground">{data.data.class}</span>
                </div>
                <div>
                  <span className="text-muted-2">Quota:</span>
                  <span className="ml-2 font-medium text-foreground">{data.data.quota}</span>
                </div>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="mb-3 font-semibold text-foreground">Fare Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Base Fare</span>
                  <span className="font-medium text-foreground">₹{data.data.fare_breakdown.base_fare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Reservation Charge</span>
                  <span className="font-medium text-foreground">₹{data.data.fare_breakdown.reservation_charge}</span>
                </div>
                {data.data.fare_breakdown.superfast_charge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Superfast Charge</span>
                    <span className="font-medium text-foreground">₹{data.data.fare_breakdown.superfast_charge}</span>
                  </div>
                )}
                {data.data.fare_breakdown.catering_charge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Catering Charge</span>
                    <span className="font-medium text-foreground">₹{data.data.fare_breakdown.catering_charge}</span>
                  </div>
                )}
                {data.data.fare_breakdown.gst > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">GST</span>
                    <span className="font-medium text-foreground">₹{data.data.fare_breakdown.gst}</span>
                  </div>
                )}
                {data.data.fare_breakdown.dynamic_fare > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Dynamic Fare</span>
                    <span className="font-medium text-foreground">₹{data.data.fare_breakdown.dynamic_fare}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total Fare</span>
                    <span className="text-xl font-bold text-accent">₹{data.data.fare_breakdown.total}</span>
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
