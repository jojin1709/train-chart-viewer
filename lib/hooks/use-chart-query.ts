"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReservationChart } from "@/types";

interface ChartApiError {
  error: string;
  reason?: string;
}

export function useChartQuery(trainNumber: string, date: string) {
  return useQuery<ReservationChart, ChartApiError>({
    queryKey: ["chart", trainNumber, date],
    enabled: Boolean(trainNumber && date),
    queryFn: async () => {
      const res = await fetch(
        `/api/chart?train=${encodeURIComponent(trainNumber)}&date=${encodeURIComponent(date)}`
      );
      const body = await res.json();
      if (!res.ok) {
        throw { error: body.error ?? "Unable to retrieve the reservation chart.", reason: body.reason };
      }
      return body.chart as ReservationChart;
    },
  });
}
