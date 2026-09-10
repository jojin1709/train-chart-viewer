import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-surface shadow-sm shadow-black/20", className)}
      {...props}
    />
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-border-strong bg-surface-2 px-3 text-sm text-foreground placeholder:text-muted-2",
        "focus-visible:outline-2 focus-visible:outline-accent",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} aria-hidden="true" />;
}
