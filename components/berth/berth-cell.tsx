"use client";

import { cn, BERTH_TYPE_SHORT } from "@/lib/utils";
import type { SegmentVacancyStatus } from "@/types";

const STYLE: Record<SegmentVacancyStatus, string> = {
  FULL_JOURNEY_VACANT: "bg-vacant-soft border-vacant/40 text-vacant hover:brightness-110",
  PART_JOURNEY_VACANT: "bg-part-soft border-part/40 text-part hover:brightness-110",
  OCCUPIED: "bg-occupied-soft border-occupied/25 text-occupied hover:brightness-110",
  UNKNOWN: "bg-surface-2 border-border-strong text-muted-2 hover:brightness-110",
};

export function BerthCell({
  berthNumber,
  berthType,
  status,
  onClick,
}: {
  berthNumber: number;
  berthType: string;
  status: SegmentVacancyStatus;
  onClick: () => void;
}) {
  const label = `Berth ${berthNumber}, ${BERTH_TYPE_SHORT[berthType] ?? berthType}, ${statusText(status)}`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-12 w-full flex-col items-center justify-center rounded-md border text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-accent",
        STYLE[status]
      )}
    >
      <span className="text-sm font-semibold leading-none">{berthNumber}</span>
      <span className="mt-0.5 text-[10px] leading-none opacity-80">{BERTH_TYPE_SHORT[berthType] ?? "?"}</span>
    </button>
  );
}

function statusText(status: SegmentVacancyStatus): string {
  switch (status) {
    case "FULL_JOURNEY_VACANT":
      return "vacant";
    case "PART_JOURNEY_VACANT":
      return "part journey vacant";
    case "OCCUPIED":
      return "occupied";
    default:
      return "status unknown";
  }
}
