"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import { StatusIndicator } from "@/components/chart/status-indicator";
import { BERTH_TYPE_SHORT } from "@/lib/utils";
import type { BerthWithStatus } from "@/types";

type SortKey = "coach" | "berthNumber" | "berthType" | "className" | "status";

export function BerthTable({
  berths,
  onSelectBerth,
  segmentLabel,
}: {
  berths: (BerthWithStatus & { className: string })[];
  onSelectBerth: (b: BerthWithStatus & { className: string }) => void;
  segmentLabel: string;
}) {
  const [sortKey, setSortKey] = React.useState<SortKey>("coach");
  const [sortDir, setSortDir] = React.useState<1 | -1>(1);

  const sorted = React.useMemo(() => {
    const copy = [...berths];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "coach":
          cmp = a.coachNumber.localeCompare(b.coachNumber);
          break;
        case "berthNumber":
          cmp = a.berthNumber - b.berthNumber;
          break;
        case "berthType":
          cmp = a.berthType.localeCompare(b.berthType);
          break;
        case "className":
          cmp = a.className.localeCompare(b.className);
          break;
        case "status":
          cmp = a.segmentStatus.localeCompare(b.segmentStatus);
          break;
      }
      return cmp * sortDir;
    });
    return copy;
  }, [berths, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  if (berths.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-10 text-center">
        <p className="text-sm text-muted">No matching berths for the current filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-2">
            <Th label="Coach" sortKey="coach" active={sortKey} dir={sortDir} onSort={toggleSort} />
            <Th label="Berth" sortKey="berthNumber" active={sortKey} dir={sortDir} onSort={toggleSort} />
            <Th label="Type" sortKey="berthType" active={sortKey} dir={sortDir} onSort={toggleSort} />
            <Th label="Class" sortKey="className" active={sortKey} dir={sortDir} onSort={toggleSort} />
            <Th label="Status" sortKey="status" active={sortKey} dir={sortDir} onSort={toggleSort} />
            <th className="px-4 py-2.5 font-medium">Segment</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((b) => (
            <tr
              key={b.id}
              tabIndex={0}
              onClick={() => onSelectBerth(b)}
              onKeyDown={(e) => e.key === "Enter" && onSelectBerth(b)}
              className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <td className="px-4 py-2.5 font-medium text-foreground">{b.coachNumber}</td>
              <td className="px-4 py-2.5 tabular-nums">{b.berthNumber}</td>
              <td className="px-4 py-2.5 text-muted">{BERTH_TYPE_SHORT[b.berthType] ?? b.berthType}</td>
              <td className="px-4 py-2.5 text-muted">{b.className}</td>
              <td className="px-4 py-2.5">
                <StatusIndicator status={b.segmentStatus} size="sm" />
              </td>
              <td className="px-4 py-2.5 text-xs text-muted-2">{segmentLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  label,
  sortKey,
  active,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  active: SortKey;
  dir: 1 | -1;
  onSort: (k: SortKey) => void;
}) {
  return (
    <th className="px-4 py-2.5 font-medium">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent rounded"
      >
        {label}
        <ArrowUpDown size={11} className={active === sortKey ? "text-accent" : "text-muted-2"} />
        <span className="sr-only">{active === sortKey ? (dir === 1 ? "ascending" : "descending") : ""}</span>
      </button>
    </th>
  );
}
