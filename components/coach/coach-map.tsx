import { BerthCell } from "@/components/berth/berth-cell";
import type { BerthWithStatus, Coach } from "@/types";

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
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {coach.coachNumber} <span className="font-normal text-muted">— {classLabel(coach.className)}</span>
        </h3>
        <span className="text-xs text-muted-2">{coach.berths.length} berths</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coach.layout.map((bay) => {
          const berths = bay.berthIds
            .map((id) => berthStatusById.get(id))
            .filter((b): b is BerthWithStatus => Boolean(b));
          const visibleInBay = berths.filter((b) => visibleBerthIds.has(b.id));
          if (visibleInBay.length === 0) return null;

          const main = berths.filter((b) => !b.berthType.startsWith("SIDE"));
          const side = berths.filter((b) => b.berthType.startsWith("SIDE"));

          return (
            <div key={bay.bayNumber} className="rounded-lg border border-border bg-surface-2 p-2.5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-2">
                Bay {bay.bayNumber}
              </p>
              <div className="flex gap-2">
                <div className={`grid flex-1 gap-1.5 ${main.length > 3 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {main.map((b) =>
                    visibleBerthIds.has(b.id) ? (
                      <BerthCell
                        key={b.id}
                        berthNumber={b.berthNumber}
                        berthType={b.berthType}
                        status={b.segmentStatus}
                        onClick={() => onSelectBerth(b)}
                      />
                    ) : (
                      <div key={b.id} className="h-12 rounded-md border border-dashed border-border opacity-30" />
                    )
                  )}
                </div>
                {side.length > 0 && (
                  <div className="grid w-16 shrink-0 gap-1.5">
                    {side.map((b) =>
                      visibleBerthIds.has(b.id) ? (
                        <BerthCell
                          key={b.id}
                          berthNumber={b.berthNumber}
                          berthType={b.berthType}
                          status={b.segmentStatus}
                          onClick={() => onSelectBerth(b)}
                        />
                      ) : (
                        <div key={b.id} className="h-12 rounded-md border border-dashed border-border opacity-30" />
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function classLabel(cls: string): string {
  const labels: Record<string, string> = {
    "1A": "AC First Class",
    "2A": "AC 2-Tier",
    "3A": "AC 3-Tier",
    "3E": "AC 3-Tier Economy",
    SL: "Sleeper Class",
  };
  return labels[cls] ?? cls;
}
