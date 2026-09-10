import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { OFFICIAL_SOURCE_URL } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How RailChart Explorer helps you read reservation charts and find vacant berths.",
};

const STEPS = [
  { title: "Enter train details", desc: "Type a train number or name and pick it from the results." },
  { title: "Select journey date", desc: "Choose the date the reservation chart applies to." },
  { title: "Select From and To stations", desc: "Pick your boarding and destination stations along the route." },
  { title: "Load the reservation chart", desc: "RailChart Explorer retrieves coach and berth information for that train and date." },
  { title: "Filter coaches, classes and berths", desc: "Narrow down by class, coach, berth type, or status, or search directly." },
  { title: "Find vacant or part-journey berths", desc: "Use \"Find Vacant Berths\" to see berths that are actually free for your specific segment." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">How It Works</h1>
      <p className="mt-3 text-muted">
        RailChart Explorer is an independent tool for reading railway reservation charts more
        easily. Here is how a typical search works.
      </p>

      <ol className="mt-8 flex flex-col gap-5">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-foreground">{step.title}</p>
              <p className="mt-0.5 text-sm text-muted">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-xl border border-accent/30 bg-accent-soft p-5">
        <p className="text-sm text-foreground">
          Reservation-chart information can change. Always verify important travel information
          with the official railway source before making decisions.
        </p>
        <a
          href={OFFICIAL_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          Open Official Railway Source
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 text-sm text-muted">
        <p className="font-medium text-foreground">A note on data accuracy</p>
        <p className="mt-2 leading-relaxed">
          RailChart Explorer never invents chart, train, or berth data. When a reliable source
          isn&apos;t available for a request, the app says so clearly instead of guessing —
          including when segment-level vacancy cannot be determined from the underlying data.
        </p>
      </div>
    </div>
  );
}
