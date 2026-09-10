import { ArrowRight } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { StatusIndicator } from "@/components/chart/status-indicator";
import { BERTH_TYPE_LABEL } from "@/lib/utils";
import type { BerthWithStatus, Station } from "@/types";

export function BerthDetailSheet({
  berth,
  className,
  route,
  from,
  to,
  open,
  onOpenChange,
}: {
  berth: BerthWithStatus | null;
  className: string;
  route: Station[];
  from: string | null;
  to: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const fromStation = route.find((s) => s.code === from);
  const toStation = route.find((s) => s.code === to);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={berth ? `Berth ${berth.berthNumber}` : "Berth"} side="right">
      {berth && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <StatusIndicator status={berth.segmentStatus} />
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <Detail label="Coach" value={berth.coachNumber} />
            <Detail label="Class" value={className} />
            <Detail label="Berth Number" value={String(berth.berthNumber)} />
            <Detail label="Type" value={BERTH_TYPE_LABEL[berth.berthType] ?? berth.berthType} />
          </dl>

          {(fromStation || toStation) && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-2">
                {berth.segmentStatus === "FULL_JOURNEY_VACANT" ? "Available for" : "Journey segment"}
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm">
                <span className="text-foreground">{fromStation?.name ?? from ?? "—"}</span>
                <ArrowRight size={14} className="shrink-0 text-muted-2" />
                <span className="text-foreground">{toStation?.name ?? to ?? "—"}</span>
              </div>
            </div>
          )}

          {berth.segmentStatusReason && (
            <p className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-xs text-muted-2">
              {berth.segmentStatusReason}
            </p>
          )}

          {berth.occupancy.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-2">
                Known occupancy on this chart
              </p>
              <ul className="space-y-1.5">
                {berth.occupancy.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-muted"
                  >
                    <span>
                      {rec.occupiedFrom} → {rec.occupiedTo}
                    </span>
                    <span className="text-muted-2">{rec.confirmed ? "Confirmed" : "Reported"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-muted-2">
            No passenger-identifying information (name, phone number, or PNR) is shown or stored.
          </p>
        </div>
      )}
    </Sheet>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
