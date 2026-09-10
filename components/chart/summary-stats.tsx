import type { ChartSummary } from "@/types";

export function SummaryStats({ summary }: { summary: ChartSummary }) {
  const classEntries = Object.entries(summary.byClass);

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Main stats header - IRCTC style */}
      <div className="border-b border-border bg-gradient-to-r from-accent/20 to-transparent px-5 py-4">
        <h3 className="text-base font-semibold text-foreground">
          Chart Summary
        </h3>
        <p className="mt-1 text-sm text-muted">
          <span className="text-vacant font-semibold">{summary.vacant}</span> vacant berths across{" "}
          <span className="font-semibold text-foreground">{summary.totalCoaches}</span> coaches
        </p>
      </div>

      {/* Class breakdown - IRCTC style */}
      {classEntries.length > 0 && (
        <div className="border-b border-border px-5 py-4">
          <div className="flex flex-wrap gap-4">
            {classEntries.map(([cls, s]) => (
              <div key={cls} className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-muted-2">{classFullName(cls)}</span>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-vacant font-bold">{s.vacant}</span>
                  <span className="text-muted-2">(Vacant)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed stats */}
      <div className="grid grid-cols-2 gap-4 px-5 py-4 sm:grid-cols-4">
        <Stat label="Total Berths" value={summary.totalBerths} />
        <Stat label="Vacant" value={summary.vacant} tone="text-vacant" />
        <Stat label="Part Journey" value={summary.partJourney} tone="text-part" />
        <Stat label="Occupied" value={summary.occupied} tone="text-occupied" />
      </div>

      {/* Legend */}
      <div className="border-t border-border bg-surface-2 px-5 py-3">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-vacant" />
            <span className="text-muted">Vacant for full journey</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-part" />
            <span className="text-muted">Part journey vacant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-occupied" />
            <span className="text-muted">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-surface-2 border border-border" />
            <span className="text-muted">Status unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold tabular-nums ${tone ?? "text-foreground"}`}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-2">{label}</p>
    </div>
  );
}

function classFullName(cls: string): string {
  const labels: Record<string, string> = {
    "1A": "First AC (1A)",
    "2A": "Second AC (2A)",
    "3A": "Third AC (3A)",
    "3E": "Third AC Economy (3E)",
    SL: "Sleeper (SL)",
    CC: "Chair Car (CC)",
    EC: "Executive Chair (EC)",
    "2S": "Second Sitting (2S)",
  };
  return labels[cls] ?? cls;
}
