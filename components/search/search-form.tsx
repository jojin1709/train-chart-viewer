"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Search } from "lucide-react";
import { AsyncCombobox, type ComboOption } from "./async-combobox";
import { Button } from "@/components/ui/button";
import { todayISO } from "@/lib/utils";

const RECENT_STATIONS_KEY = "railchart:recentStations";

function loadRecentStations(): ComboOption[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(RECENT_STATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function pushRecentStation(opt: ComboOption) {
  if (typeof window === "undefined") return;
  const existing = loadRecentStations().filter((o) => o.value !== opt.value);
  const updated = [opt, ...existing].slice(0, 5);
  sessionStorage.setItem(RECENT_STATIONS_KEY, JSON.stringify(updated));
}

async function fetchTrains(query: string): Promise<ComboOption[]> {
  const res = await fetch(`/api/trains?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.trains ?? []).map((t: { number: string; name: string | null }) => ({
    value: t.number,
    label: t.name ?? "Name not available",
  }));
}

async function fetchStations(query: string): Promise<ComboOption[]> {
  const res = await fetch(`/api/stations?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.stations ?? []).map((s: { code: string; name: string }) => ({
    value: s.code,
    label: s.name,
  }));
}

export function SearchForm() {
  const router = useRouter();
  const [train, setTrain] = React.useState<ComboOption | null>(null);
  const [date, setDate] = React.useState(todayISO());
  const [from, setFrom] = React.useState<ComboOption | null>(null);
  const [to, setTo] = React.useState<ComboOption | null>(null);
  const [recent, setRecent] = React.useState<ComboOption[]>(() => loadRecentStations());
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!train) return setError("Enter a train number or name.");
    if (!date) return setError("Select a journey date.");
    if (!from) return setError("Select a boarding station.");
    if (!to) return setError("Select a destination station.");
    if (from.value === to.value) return setError("Boarding and destination stations must be different.");

    pushRecentStation(from);
    pushRecentStation(to);
    setRecent(loadRecentStations());

    const params = new URLSearchParams({ date, from: from.value, to: to.value });
    router.push(`/chart/${train.value}?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-5 sm:p-7 shadow-xl shadow-black/30"
    >
      <div className="mb-1.5">
        <label htmlFor="train-input" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-2">
          Train
        </label>
        <TrainInput id="train-input" value={train} onChange={setTrain} />
      </div>

      <div className="mt-4">
        <label htmlFor="journey-date" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-2">
          Journey Date
        </label>
        <input
          id="journey-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 w-full rounded-md border border-border-strong bg-surface-2 px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AsyncCombobox
          id="from-station"
          label="From"
          placeholder="Select boarding station"
          value={from}
          onChange={setFrom}
          fetchOptions={fetchStations}
          recentOptions={recent}
        />
        <AsyncCombobox
          id="to-station"
          label="To"
          placeholder="Select destination station"
          value={to}
          onChange={setTo}
          fetchOptions={fetchStations}
          recentOptions={recent}
        />
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full">
        <Search size={18} />
        View Reservation Chart
      </Button>

      <p className="mt-3 text-center text-xs text-muted-2">
        Search any train number or name to view reservation chart.
      </p>
    </form>
  );
}

function TrainInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: ComboOption | null;
  onChange: (v: ComboOption | null) => void;
}) {
  return (
    <AsyncCombobox
      id={id}
      label=""
      placeholder="Train number or name (e.g. 22648)"
      value={value}
      onChange={onChange}
      fetchOptions={fetchTrains}
    />
  );
}
