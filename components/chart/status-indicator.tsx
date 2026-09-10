import { Check, CircleDashed, CircleSlash, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SegmentVacancyStatus } from "@/types";

const CONFIG: Record<
  SegmentVacancyStatus,
  { label: string; icon: typeof Check; text: string; bg: string; border: string }
> = {
  FULL_JOURNEY_VACANT: {
    label: "Vacant",
    icon: Check,
    text: "text-vacant",
    bg: "bg-vacant-soft",
    border: "border-vacant/30",
  },
  PART_JOURNEY_VACANT: {
    label: "Part journey",
    icon: CircleDashed,
    text: "text-part",
    bg: "bg-part-soft",
    border: "border-part/30",
  },
  OCCUPIED: {
    label: "Occupied",
    icon: CircleSlash,
    text: "text-occupied",
    bg: "bg-occupied-soft",
    border: "border-occupied/20",
  },
  UNKNOWN: {
    label: "Unknown",
    icon: HelpCircle,
    text: "text-muted-2",
    bg: "bg-surface-2",
    border: "border-border-strong",
  },
};

export function StatusIndicator({
  status,
  size = "md",
  className,
}: {
  status: SegmentVacancyStatus;
  size?: "sm" | "md";
  className?: string;
}) {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        cfg.bg,
        cfg.text,
        cfg.border,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <Icon size={size === "sm" ? 12 : 14} aria-hidden="true" />
      <span>{cfg.label}</span>
    </span>
  );
}

export function statusLabel(status: SegmentVacancyStatus): string {
  return CONFIG[status].label;
}
