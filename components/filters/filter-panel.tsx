"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChartFilters, StatusFilter } from "@/lib/hooks/use-url-filters";
import type { Coach, Station } from "@/types";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "vacant", label: "Vacant" },
  { value: "part", label: "Part Journey" },
  { value: "occupied", label: "Occupied" },
];

const BERTH_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "LOWER", label: "Lower" },
  { value: "MIDDLE", label: "Middle" },
  { value: "UPPER", label: "Upper" },
  { value: "SIDE_LOWER", label: "Side Lower" },
  { value: "SIDE_UPPER", label: "Side Upper" },
];

export function FilterPanel({
  route,
  coaches,
  classes,
  filters,
  onChange,
  onClear,
}: {
  route: Station[];
  coaches: Coach[];
  classes: string[];
  filters: ChartFilters;
  onChange: (patch: Partial<ChartFilters>) => void;
  onClear: () => void;
}) {
  const fromIdx = route.findIndex((s) => s.code === filters.from);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-2">Journey Segment</p>
        <div className="grid grid-cols-2 gap-3">
          <RouteSelect
            label="From"
            value={filters.from}
            options={route}
            onChange={(v) => onChange({ from: v, to: filters.to && route.findIndex((s) => s.code === filters.to) <= route.findIndex((s) => s.code === v) ? null : filters.to })}
          />
          <RouteSelect
            label="To"
            value={filters.to}
            options={fromIdx >= 0 ? route.slice(fromIdx + 1) : route}
            onChange={(v) => onChange({ to: v })}
          />
        </div>
      </div>

      <FilterGroup label="Status">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <ChipButton
              key={opt.value}
              active={filters.status === opt.value}
              onClick={() => onChange({ status: opt.value })}
            >
              {opt.label}
            </ChipButton>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Class">
        <div className="flex flex-wrap gap-1.5">
          <ChipButton active={filters.className === "all"} onClick={() => onChange({ className: "all" })}>
            All
          </ChipButton>
          {classes.map((c) => (
            <ChipButton key={c} active={filters.className === c} onClick={() => onChange({ className: c })}>
              {c}
            </ChipButton>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Coach">
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          <ChipButton active={filters.coach === "all"} onClick={() => onChange({ coach: "all" })}>
            All
          </ChipButton>
          {coaches.map((c) => (
            <ChipButton
              key={c.coachNumber}
              active={filters.coach === c.coachNumber}
              onClick={() => onChange({ coach: c.coachNumber })}
            >
              {c.coachNumber}
            </ChipButton>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Berth Type">
        <div className="flex flex-wrap gap-1.5">
          {BERTH_TYPE_OPTIONS.map((opt) => (
            <ChipButton
              key={opt.value}
              active={filters.berthType === opt.value}
              onClick={() => onChange({ berthType: opt.value })}
            >
              {opt.label}
            </ChipButton>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Search">
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-2" />
          <Input
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Search coach or berth number"
            className="pl-9"
          />
        </div>
      </FilterGroup>

      <Button variant="outline" size="sm" onClick={onClear} className="justify-center">
        <X size={14} />
        Clear Filters
      </Button>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-2">{label}</p>
      {children}
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-border-strong bg-surface-2 text-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function RouteSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: Station[];
  onChange: (v: string | null) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-medium text-muted-2">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="h-10 w-full rounded-md border border-border-strong bg-surface-2 px-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-accent"
      >
        <option value="">Select</option>
        {options.map((s) => (
          <option key={s.code} value={s.code}>
            {s.code} — {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}
