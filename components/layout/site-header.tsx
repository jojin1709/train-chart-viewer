"use client";

import Link from "next/link";
import { ExternalLink, Menu, X } from "lucide-react";
import * as React from "react";
import { RailChartLogo } from "./logo";

const OFFICIAL_SOURCE_URL = "https://www.indianrail.gov.in/enquiry/";

const NAV_ITEMS = [
  { href: "/", label: "Chart Search" },
  { href: "/pnr", label: "PNR Status" },
  { href: "/live", label: "Live Tracking" },
  { href: "/fare", label: "Fare Check" },
  { href: "/station", label: "Station Live" },
  { href: "/cancelled", label: "Cancelled" },
  { href: "/about", label: "How It Works" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <RailChartLogo className="h-8 w-8" />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            RailChart <span className="text-muted font-normal">Explorer</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={OFFICIAL_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-xs sm:text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors shrink-0 sm:flex"
          >
            Official Source
            <ExternalLink size={14} />
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-muted hover:text-foreground hover:bg-surface-2 lg:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-surface px-4 py-3 lg:hidden" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={OFFICIAL_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            Official Source
            <ExternalLink size={14} />
          </a>
        </nav>
      )}
    </header>
  );
}

export { OFFICIAL_SOURCE_URL };
