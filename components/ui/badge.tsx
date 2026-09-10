import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "neutral",
  children,
}: {
  className?: string;
  variant?: "neutral" | "vacant" | "part" | "occupied" | "accent";
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    neutral: "bg-surface-2 text-muted border border-border-strong",
    vacant: "bg-vacant-soft text-vacant border border-vacant/30",
    part: "bg-part-soft text-part border border-part/30",
    occupied: "bg-occupied-soft text-occupied border border-occupied/20",
    accent: "bg-accent-soft text-accent border border-accent/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
