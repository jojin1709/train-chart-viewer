import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BERTH_TYPE_LABEL: Record<string, string> = {
  LOWER: "Lower",
  MIDDLE: "Middle",
  UPPER: "Upper",
  SIDE_LOWER: "Side Lower",
  SIDE_UPPER: "Side Upper",
  SIDE_MIDDLE: "Side Middle",
  UNKNOWN: "Unknown",
};

export const BERTH_TYPE_SHORT: Record<string, string> = {
  LOWER: "LB",
  MIDDLE: "MB",
  UPPER: "UB",
  SIDE_LOWER: "SL",
  SIDE_UPPER: "SU",
  SIDE_MIDDLE: "SM",
  UNKNOWN: "?",
};

export const STATUS_LABEL: Record<string, string> = {
  FULL_JOURNEY_VACANT: "Vacant",
  PART_JOURNEY_VACANT: "Part journey",
  OCCUPIED: "Occupied",
  UNKNOWN: "Unknown",
};

export function formatDateLong(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
