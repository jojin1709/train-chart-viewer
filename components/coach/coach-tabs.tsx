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
            ? "border-accent bg-accent text-accent-foreground"
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
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-surface text-muted hover:text-foreground hover:bg-surface-2"
          )}
        >
          <span className="font-semibold">{coach.coachNumber}</span>
          <span className="text-[10px] font-normal opacity-70">{coach.className}</span>
        </button>
      ))}
    </div>
  );
}

export function ClassTabs({
  coaches,
  activeClass,
  onSelect,
}: {
  coaches: Coach[];
  activeClass: string;
  onSelect: (cls: string) => void;
}) {
  const classes = Array.from(new Set(coaches.map((c) => c.className)));

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Classes">
      <button
        role="tab"
        aria-selected={activeClass === "all"}
        onClick={() => onSelect("all")}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
          activeClass === "all"
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border bg-surface text-muted hover:text-foreground hover:bg-surface-2"
        )}
      >
        All Classes
      </button>
      {classes.map((cls) => (
        <button
          key={cls}
          role="tab"
          aria-selected={activeClass === cls}
          onClick={() => onSelect(cls)}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            activeClass === cls
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-surface text-muted hover:text-foreground hover:bg-surface-2"
          )}
        >
          {classLabel(cls)}
        </button>
      ))}
    </div>
  );
}

export function classLabel(cls: string): string {
  const labels: Record<string, string> = {
    "1A": "1A",
    "2A": "2A",
    "3A": "3A",
    "3E": "3E",
    SL: "SL",
    CC: "CC",
    EC: "EC",
    "2S": "2S",
    FC: "FC",
  };
  return labels[cls] ?? cls;
}
