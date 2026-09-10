"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useChartQuery } from "@/lib/hooks/use-chart-query";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import { computeSummary, allBerthsWithStatus } from "@/lib/chart/summary";
import { TrainHeader } from "@/components/chart/train-header";
import { SummaryStats } from "@/components/chart/summary-stats";
import { ChartPageSkeleton } from "@/components/chart/chart-skeleton";
import { ChartErrorState } from "@/components/chart/chart-error";
import { CoachTabs } from "@/components/coach/coach-tabs";
import { CoachMap } from "@/components/coach/coach-map";
import { BerthTable } from "@/components/chart/berth-table";
import { VacantFinder } from "@/components/chart/vacant-finder";
import { FilterPanel } from "@/components/filters/filter-panel";
import { ActiveFilterChips } from "@/components/filters/active-filter-chips";
import { BerthDetailSheet } from "@/components/berth/berth-detail-sheet";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BerthWithStatus } from "@/types";

export default function ChartPage() {
  const params = useParams<{ trainNumber: string }>();
  const trainNumber = params.trainNumber;
  const { filters, setFilters, clearFilters, date } = useUrlFilters();

  const { data: chart, isLoading, isError, error, refetch } = useChartQuery(trainNumber, date);

  const [activeCoach, setActiveCoach] = React.useState("all");
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
  const [selectedBerth, setSelectedBerth] = React.useState<(BerthWithStatus & { className: string }) | null>(null);

  const summary = React.useMemo(
    () => (chart ? computeSummary(chart.coaches, chart.route, filters.from, filters.to) : null),
    [chart, filters.from, filters.to]
  );

  const allBerths = React.useMemo(
    () => (chart ? allBerthsWithStatus(chart.coaches, chart.route, filters.from, filters.to) : []),
    [chart, filters.from, filters.to]
  );

  const filteredBerths = React.useMemo(() => {
    return allBerths.filter((b) => {
      if (activeCoach !== "all" && b.coachNumber !== activeCoach) return false;
      if (filters.coach !== "all" && b.coachNumber !== filters.coach) return false;
      if (filters.className !== "all" && b.className !== filters.className) return false;
      if (filters.berthType !== "all" && b.berthType !== filters.berthType) return false;
      if (filters.status !== "all") {
        const map: Record<string, string> = {
          vacant: "FULL_JOURNEY_VACANT",
          part: "PART_JOURNEY_VACANT",
          occupied: "OCCUPIED",
        };
        if (b.segmentStatus !== map[filters.status]) return false;
      }
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const matches =
          b.coachNumber.toLowerCase().includes(q) || String(b.berthNumber).includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [allBerths, activeCoach, filters]);

  const visibleBerthIds = React.useMemo(() => new Set(filteredBerths.map((b) => b.id)), [filteredBerths]);

  if (isLoading) return <ChartPageSkeleton />;

  if (isError || !chart) {
    return (
      <ChartErrorState
        message={(error as unknown as { error?: string })?.error ?? "Please try again in a moment."}
        onRetry={() => refetch()}
      />
    );
  }

  const classes = Array.from(new Set(chart.coaches.map((c) => c.className)));
  const visibleCoaches =
    activeCoach === "all" ? chart.coaches : chart.coaches.filter((c) => c.coachNumber === activeCoach);
  const segmentLabel = filters.from && filters.to ? `${filters.from} → ${filters.to}` : "Full route";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
      <TrainHeader chart={chart} from={filters.from} to={filters.to} />
      {summary && <SummaryStats summary={summary} />}

      <VacantFinder
        berths={allBerths}
        from={filters.from}
        to={filters.to}
        onSelectBerth={setSelectedBerth}
      />

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Desktop filter sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 rounded-xl border border-border bg-surface p-5">
            <FilterPanel
              route={chart.route}
              coaches={chart.coaches}
              classes={classes}
              filters={filters}
              onChange={setFilters}
              onClear={clearFilters}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <ActiveFilterChips filters={filters} onChange={setFilters} />
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFilterDrawerOpen(true)}>
                <SlidersHorizontal size={14} />
                Filters
              </Button>
              <div className="flex rounded-md border border-border-strong bg-surface-2 p-0.5">
                <ViewToggleButton
                  active={filters.view === "coach"}
                  onClick={() => setFilters({ view: "coach" })}
                  icon={<LayoutGrid size={14} />}
                  label="Coach View"
                />
                <ViewToggleButton
                  active={filters.view === "list"}
                  onClick={() => setFilters({ view: "list" })}
                  icon={<List size={14} />}
                  label="List View"
                />
              </div>
            </div>
          </div>

          <CoachTabs coaches={chart.coaches} activeCoach={activeCoach} onSelect={setActiveCoach} />

          <div className="mt-4">
            {filters.view === "list" ? (
              <BerthTable berths={filteredBerths} onSelectBerth={setSelectedBerth} segmentLabel={segmentLabel} />
            ) : visibleCoaches.length === 0 ? (
              <EmptyState message="No coaches match the current filters." />
            ) : (
              <div className="flex flex-col gap-4">
                {visibleCoaches.map((coach) => {
                  const berthMap = new Map(
                    allBerths.filter((b) => b.coachNumber === coach.coachNumber).map((b) => [b.id, b])
                  );
                  const coachHasVisible = coach.berths.some((b) => visibleBerthIds.has(b.id));
                  if (!coachHasVisible) return null;
                  return (
                    <CoachMap
                      key={coach.coachNumber}
                      coach={coach}
                      berthStatusById={berthMap}
                      onSelectBerth={(b) => setSelectedBerth({ ...b, className: coach.className })}
                      visibleBerthIds={visibleBerthIds}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen} title="Filters" side="bottom">
        <FilterPanel
          route={chart.route}
          coaches={chart.coaches}
          classes={classes}
          filters={filters}
          onChange={setFilters}
          onClear={clearFilters}
        />
      </Sheet>

      <BerthDetailSheet
        berth={selectedBerth}
        className={selectedBerth?.className ?? ""}
        route={chart.route}
        from={filters.from}
        to={filters.to}
        open={Boolean(selectedBerth)}
        onOpenChange={(open) => !open && setSelectedBerth(null)}
      />
    </div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-10 text-center">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
