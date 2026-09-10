"use client";

import { cn } from "@/lib/utils";
import type { Coach } from "@/types";

export function CoachTabs({
  coaches,
  activeCoach,
  onSelect,
}: {
  coaches: Coach[];
  activeCoach: string;
  onSelect: (coachNumber: string) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Coaches">
      <button
        role="tab"
        aria-selected={activeCoach === "all"}
        onClick={() => onSelect("all")}
        className={cn(
          "flex shrink-0 flex-col items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors min-w-[64px]",
          activeCoach === "all"
            ? "border-accent bg-accent-soft text-accent"
            : "border-border bg-surface text-muted hover:text-foreground hover:bg-surface-2"
        )}
      >
        All
      </button>
      {coaches.map((coach) => (
        <button
          key={coach.coachNumber}
          role="tab"
          aria-selected={activeCoach === coach.coachNumber}
          onClick={() => onSelect(coach.coachNumber)}
          className={cn(
            "flex shrink-0 flex-col items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors min-w-[64px]",
            activeCoach === coach.coachNumber
              ? "border-accent bg-accent-soft text-accent"
              : "border-border bg-surface text-muted hover:text-foreground hover:bg-surface-2"
          )}
        >
          <span>{coach.coachNumber}</span>
          <span className="text-[10px] font-normal text-muted-2">{coach.className}</span>
        </button>
      ))}
    </div>
  );
}
