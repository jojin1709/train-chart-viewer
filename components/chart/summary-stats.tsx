import type { ChartSummary } from "@/types";

export function SummaryStats({ summary }: { summary: ChartSummary }) {
  const classEntries = Object.entries(summary.byClass);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Stat label="Coaches" value={summary.totalCoaches} />
        <Stat label="Berths" value={summary.totalBerths} />
        <Stat label="Vacant" value={summary.vacant} tone="text-vacant" />
        <Stat label="Part Journey" value={summary.partJourney} tone="text-part" />
        <Stat label="Occupied" value={summary.occupied} tone="text-occupied" />
      </div>

      {classEntries.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-2">By Class</p>
          <div className="flex flex-wrap gap-3">
            {classEntries.map(([cls, s]) => (
              <div
                key={cls}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2"
              >
                <span className="text-sm font-semibold text-foreground">{cls}</span>
                <span className="text-xs text-muted-2">
                  <span className="text-vacant">{s.vacant}</span> ·{" "}
                  <span className="text-part">{s.partJourney}</span> ·{" "}
                  <span className="text-occupied">{s.occupied}</span> / {s.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <p className={`text-2xl font-semibold tabular-nums ${tone ?? "text-foreground"}`}>{value}</p>
      <p className="text-xs text-muted-2">{label}</p>
    </div>
  );
}
