"use client";

import { X } from "lucide-react";
import type { ChartFilters } from "@/lib/hooks/use-url-filters";

const STATUS_LABELS: Record<string, string> = {
  vacant: "Vacant",
  part: "Part Journey",
  occupied: "Occupied",
};

export function ActiveFilterChips({
  filters,
  onChange,
}: {
  filters: ChartFilters;
  onChange: (patch: Partial<ChartFilters>) => void;
}) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.from) chips.push({ key: "from", label: `From: ${filters.from}`, onRemove: () => onChange({ from: null }) });
  if (filters.to) chips.push({ key: "to", label: `To: ${filters.to}`, onRemove: () => onChange({ to: null }) });
  if (filters.status !== "all")
    chips.push({
      key: "status",
      label: `Status: ${STATUS_LABELS[filters.status]}`,
      onRemove: () => onChange({ status: "all" }),
    });
  if (filters.className !== "all")
    chips.push({ key: "class", label: `Class: ${filters.className}`, onRemove: () => onChange({ className: "all" }) });
  if (filters.coach !== "all")
    chips.push({ key: "coach", label: `Coach: ${filters.coach}`, onRemove: () => onChange({ coach: "all" }) });
  if (filters.berthType !== "all")
    chips.push({
      key: "berthType",
      label: `Berth: ${filters.berthType.replace("_", " ")}`,
      onRemove: () => onChange({ berthType: "all" }),
    });
  if (filters.q) chips.push({ key: "q", label: `Search: "${filters.q}"`, onRemove: () => onChange({ q: "" }) });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.onRemove}
          className="flex items-center gap-1.5 rounded-full border border-border-strong bg-surface-2 px-2.5 py-1 text-xs text-muted hover:text-foreground"
        >
          {chip.label}
          <X size={12} />
        </button>
      ))}
    </div>
  );
}
