import { AlertTriangle, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFICIAL_SOURCE_URL } from "@/components/layout/site-header";

export function ChartErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <div className="rounded-full bg-danger-soft p-3">
        <AlertTriangle className="text-danger" size={28} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Unable to retrieve the reservation chart right now.
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onRetry} variant="primary">
          <RotateCcw size={16} />
          Try Again
        </Button>
        <a
          href={OFFICIAL_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-2"
        >
          Open Official Source
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
