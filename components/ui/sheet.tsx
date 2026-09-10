"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  title,
  children,
  side = "right",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  side?: "right" | "bottom";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "absolute bg-surface border-border-strong shadow-2xl flex flex-col",
          side === "right"
            ? "right-0 top-0 h-full w-full max-w-md border-l animate-[slideIn_.18s_ease-out]"
            : "bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl border-t"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 grow">{children}</div>
      </div>
    </div>
  );
}
