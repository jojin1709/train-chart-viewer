import { BerthCell } from "@/components/berth/berth-cell";
import type { BerthWithStatus, Coach } from "@/types";
import { classLabel } from "./coach-tabs";

export function CoachMap({
  coach,
  berthStatusById,
  onSelectBerth,
  visibleBerthIds,
}: {
  coach: Coach;
  berthStatusById: Map<string, BerthWithStatus>;
  onSelectBerth: (berth: BerthWithStatus) => void;
  visibleBerthIds: Set<string>;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-foreground">{coach.coachNumber}</span>
          <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
            {classLabel(coach.className)}
          </span>
        </div>
        <span className="text-xs text-muted-2">{coach.berths.length} berths</span>
      </div>

      <div className="p-4">
        {/* Main berths (lower, middle, upper) */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-vacant" />
            <span className="text-xs text-muted-2">Lower / Middle / Upper Berths</span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {coach.layout.map((bay) => {
              const berths = bay.berthIds
                .map((id) => berthStatusById.get(id))
                .filter((b): b is BerthWithStatus => Boolean(b));
              const mainBerths = berths.filter((b) => !b.berthType.startsWith("SIDE"));
              return mainBerths.map((b) =>
                visibleBerthIds.has(b.id) ? (
                  <BerthCell
                    key={b.id}
                    berthNumber={b.berthNumber}
                    berthType={b.berthType}
                    status={b.segmentStatus}
                    onClick={() => onSelectBerth(b)}
                  />
                ) : null
              );
            })}
          </div>
        </div>

        {/* Side berths */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-part" />
            <span className="text-xs text-muted-2">Side Berths</span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {coach.layout.map((bay) => {
              const berths = bay.berthIds
                .map((id) => berthStatusById.get(id))
                .filter((b): b is BerthWithStatus => Boolean(b));
              const sideBerths = berths.filter((b) => b.berthType.startsWith("SIDE"));
              return sideBerths.map((b) =>
                visibleBerthIds.has(b.id) ? (
                  <BerthCell
                    key={b.id}
                    berthNumber={b.berthNumber}
                    berthType={b.berthType}
                    status={b.segmentStatus}
                    onClick={() => onSelectBerth(b)}
                  />
                ) : null
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
