"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type StatusFilter = "all" | "vacant" | "part" | "occupied";

export interface ChartFilters {
  from: string | null;
  to: string | null;
  status: StatusFilter;
  className: string; // "all" or a TrainClass
  coach: string; // "all" or coach number
  berthType: string; // "all" or a BerthType
  q: string;
  view: "coach" | "list";
}

const DEFAULTS: ChartFilters = {
  from: null,
  to: null,
  status: "all",
  className: "all",
  coach: "all",
  berthType: "all",
  q: "",
  view: "coach",
};

export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: ChartFilters = React.useMemo(
    () => ({
      from: searchParams.get("from") ?? DEFAULTS.from,
      to: searchParams.get("to") ?? DEFAULTS.to,
      status: (searchParams.get("status") as StatusFilter) ?? DEFAULTS.status,
      className: searchParams.get("class") ?? DEFAULTS.className,
      coach: searchParams.get("coach") ?? DEFAULTS.coach,
      berthType: searchParams.get("berthType") ?? DEFAULTS.berthType,
      q: searchParams.get("q") ?? DEFAULTS.q,
      view: (searchParams.get("view") as "coach" | "list") ?? DEFAULTS.view,
    }),
    [searchParams]
  );

  const date = searchParams.get("date") ?? "";

  const setFilters = React.useCallback(
    (patch: Partial<ChartFilters>) => {
      const params = new URLSearchParams(searchParams.toString());
      const merged = { ...filters, ...patch };
      for (const [key, value] of Object.entries(merged)) {
        const paramKey = key === "className" ? "class" : key;
        if (value === null || value === "" || value === "all" || value === DEFAULTS[key as keyof ChartFilters]) {
          if (key === "status" || key === "view") {
            // keep explicit defaults out of URL unless changed
            if (value === DEFAULTS[key as keyof ChartFilters]) {
              params.delete(paramKey);
              continue;
            }
          } else if (value === null || value === "" || value === "all") {
            params.delete(paramKey);
            continue;
          }
        }
        params.set(paramKey, String(value));
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [filters, pathname, router, searchParams]
  );

  const clearFilters = React.useCallback(() => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [date, pathname, router]);

  return { filters, setFilters, clearFilters, date };
}
