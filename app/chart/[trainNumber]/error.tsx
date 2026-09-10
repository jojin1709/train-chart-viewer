"use client";

import { useEffect } from "react";
import { ChartErrorState } from "@/components/chart/chart-error";

export default function ChartError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Intentionally not logging error details to the console in production
    // to avoid exposing internals to users; a real deployment would send
    // this to server-side error tracking instead.
  }, [error]);

  return (
    <ChartErrorState
      message="Something went wrong while rendering this chart. Please try again."
      onRetry={reset}
    />
  );
}
