import { SearchForm } from "@/components/search/search-form";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
      <section className="grid flex-1 grid-cols-1 items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 py-1 text-xs font-medium text-muted">
            Independent chart explorer · not affiliated with IRCTC
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Find the right berth, faster.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Explore reservation charts, coach layouts and berth availability with a clean,
            fast interface. Filter by class, coach, and berth type — and see exactly which
            berths are vacant for your specific journey segment.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {[
              ["Segment-aware", "Full vs. part-journey vacancy, calculated per berth"],
              ["No login", "Anonymous, public, and free to use"],
              ["Honest data", "Clearly labeled when data isn't available"],
            ].map(([title, desc]) => (
              <div key={title}>
                <dt className="text-sm font-semibold text-foreground">{title}</dt>
                <dd className="mt-1 text-xs text-muted-2 leading-relaxed">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>

        <SearchForm />
      </section>
    </div>
  );
}
