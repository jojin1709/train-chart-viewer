import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { RailChartLogo } from "./logo";

const OFFICIAL_SOURCE_URL = "https://www.indianrail.gov.in/enquiry/";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <RailChartLogo className="h-8 w-8" />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            RailChart <span className="text-muted font-normal">Explorer</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            Chart Search
          </Link>
          <Link
            href="/about"
            className="rounded-md px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            How It Works
          </Link>
        </nav>

        <a
          href={OFFICIAL_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-xs sm:text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors shrink-0"
        >
          Official Source
          <ExternalLink size={14} />
        </a>
      </div>
    </header>
  );
}

export { OFFICIAL_SOURCE_URL };
