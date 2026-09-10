import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateLong } from "@/lib/utils";
import type { ReservationChart } from "@/types";

export function TrainHeader({
  chart,
  from,
  to,
}: {
  chart: ReservationChart;
  from: string | null;
  to: string | null;
}) {
  const fromStation = chart.route.find((s) => s.code === from);
  const toStation = chart.route.find((s) => s.code === to);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{chart.train.number}</h1>
          <p className="mt-0.5 text-sm text-muted">{chart.train.name ?? "Train name not available"}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">Journey Date</p>
          <p className="text-sm font-medium text-foreground">{formatDateLong(chart.journeyDate)}</p>
        </div>
      </div>

      {(fromStation || toStation) && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">From</p>
            <p className="text-sm font-medium text-foreground">
              {fromStation ? `${fromStation.name} (${fromStation.code})` : "Not selected"}
            </p>
          </div>
          <ArrowRight size={18} className="text-muted-2 shrink-0" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">To</p>
            <p className="text-sm font-medium text-foreground">
              {toStation ? `${toStation.name} (${toStation.code})` : "Not selected"}
            </p>
          </div>
        </div>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Charting Station" value={chart.meta.chartingStation ?? "Not available"} />
        <Field
          label="First Chart"
          value={
            chart.meta.firstChartTime
              ? new Date(chart.meta.firstChartTime).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Not available"
          }
        />
        <Field label="Chart Status" value={chart.meta.status.replace("_", " ")} />
        <Field
          label="Data Retrieved"
          value={new Date(chart.meta.dataRetrievedAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      </dl>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground capitalize">{value}</dd>
    </div>
  );
}
