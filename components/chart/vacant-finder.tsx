"use client";

import * as React from "react";
import { Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BERTH_TYPE_LABEL } from "@/lib/utils";
import type { BerthWithStatus } from "@/types";

export function VacantFinder({
  berths,
  from,
  to,
  onSelectBerth,
}: {
  berths: (BerthWithStatus & { className: string })[];
  from: string | null;
  to: string | null;
  onSelectBerth: (b: BerthWithStatus & { className: string }) => void;
}) {
  const [run, setRun] = React.useState(false);
  const canRun = Boolean(from && to);

  const vacant = React.useMemo(
    () => berths.filter((b) => b.segmentStatus === "FULL_JOURNEY_VACANT"),
    [berths]
  );

  const grouped = React.useMemo(() => {
    const byClass = new Map<string, Map<string, (BerthWithStatus & { className: string })[]>>();
    for (const b of vacant) {
      if (!byClass.has(b.className)) byClass.set(b.className, new Map());
      const byCoach = byClass.get(b.className)!;
      if (!byCoach.has(b.coachNumber)) byCoach.set(b.coachNumber, []);
      byCoach.get(b.coachNumber)!.push(b);
    }
    return byClass;
  }, [vacant]);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Find Vacant Berths</h3>
          <p className="mt-0.5 text-xs text-muted-2">
            Berths fully vacant for the selected journey segment, grouped by class and coach.
          </p>
        </div>
        <Button size="sm" disabled={!canRun} onClick={() => setRun(true)}>
          <Search size={14} />
          Find Vacant Berths
        </Button>
      </div>

      {!canRun && (
        <p className="mt-4 text-xs text-muted-2">Select a From and To station to use this feature.</p>
      )}

      {run && canRun && (
        <div className="mt-5">
          {vacant.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <SearchX className="text-muted-2" size={22} />
              <p className="text-sm text-muted">No vacant berths found for this journey segment.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {Array.from(grouped.entries()).map(([cls, byCoach]) => (
                <div key={cls}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">{cls}</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from(byCoach.entries()).map(([coach, list]) => (
                      <div key={coach} className="rounded-lg border border-border bg-surface-2 p-3">
                        <p className="mb-1.5 text-sm font-medium text-foreground">{coach}</p>
                        <ul className="flex flex-col gap-1">
                          {list
                            .sort((a, b) => a.berthNumber - b.berthNumber)
                            .map((b) => (
                              <li key={b.id}>
                                <button
                                  onClick={() => onSelectBerth(b)}
                                  className="flex w-full items-center justify-between rounded px-1.5 py-1 text-xs text-muted hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                                >
                                  <span>{b.berthNumber}</span>
                                  <span>{BERTH_TYPE_LABEL[b.berthType] ?? b.berthType}</span>
                                </button>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
