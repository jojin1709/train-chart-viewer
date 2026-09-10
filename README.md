<div align="center">

# RailChart Explorer

**Explore Indian Railway reservation charts, coaches, and berth availability with clarity.**

An independent interface for viewing reservation-chart information — not affiliated with, endorsed by, or operated by IRCTC or Indian Railways.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-20%20passed-brightgreen)](#testing)

**[Live Demo](#)** · **[Report Bug](https://github.com/jojin1709/train-chart-viewer/issues)** · **[Request Feature](https://github.com/jojin1709/train-chart-viewer/issues)**

</div>

---

## What is RailChart Explorer?

Pick a train, a journey date, a boarding station (From) and a destination station (To), then see which berths are actually vacant for **that specific segment** of the journey — not just "empty-looking" on a single snapshot.

A berth can be:

- **Vacant** — free for the whole selected segment
- **Part Journey Vacant** — occupied for part of the segment, free for the rest
- **Occupied** — booked for the whole segment
- **Unknown** — shown when the data doesn't support a confident answer. The app never guesses.

## Features

| Feature | Description |
|---------|-------------|
| Search | Train / journey date / From / To with async, keyboard-navigable pickers |
| Chart Results | Train header, chart status, summary stats, per-class breakdown |
| Coach Map | Dynamic visual layout generated from actual berth data (not hard-coded) |
| Filters | Journey segment, status, class, coach, berth type — URL-shareable |
| Vacant Finder | Find vacant berths grouped by class and coach |
| Berth Details | Type, status, occupancy segments, privacy-first (no PII shown) |
| Accessible | Responsive (320px–1920px), keyboard-friendly, reduced-motion aware |
| Privacy | No login, no accounts, no tracking, no passenger data |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Validation:** Zod
- **Data Fetching:** TanStack Query
- **Icons:** Lucide React
- **Testing:** Vitest

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/jojin1709/train-chart-viewer.git
cd train-chart-viewer
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Try these trains:**
- **22648** — Kochuveli – Chennai Central SF Express
- **12621** — Tamil Nadu Express

## Development

```bash
npm run dev       # Dev server with hot reload
npm run build     # Production build
npm run lint      # ESLint
npm test          # Run tests (vitest)
```

## Testing

```bash
npm test
```

All 20 tests pass, covering:

- Segment vacancy logic (full/part/occupied classification)
- Multi-record occupancy and out-of-route stations
- Reversed From/To handling
- Summary computation across classes and segments
- Input validation schemas

## Vercel Deployment

This app deploys to Vercel with zero configuration:

1. Push to GitHub
2. Import in [Vercel Dashboard](https://vercel.com/new) → Framework auto-detected as Next.js
3. No environment variables needed for fixture mode
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jojin1709/train-chart-viewer)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `RAILCHART_DATA_MODE` | `fixture` | Data provider mode (`fixture` or `live`) |

No environment variables are required for the default fixture-data mode. See `.env.example` for details.

## Data Provider Architecture

All data access goes through a single interface:

```
lib/providers/
  types.ts            — RailwayDataProvider interface
  fixtureProvider.ts  — Demo data implementation (default)
  index.ts            — Provider factory (selected by RAILCHART_DATA_MODE)
```

API routes and pages depend only on `getProvider()` — never on a concrete provider. This means a real, authorized data source can be added later without changing any UI code.

> **No scraping, no bypassing IRCTC's authentication, CAPTCHA, or rate limits.** No such integration is bundled with this project.

## Data Accuracy

- **Fixture mode** (default): Deterministic demo data for trains `22648` and `12621` only. All responses are clearly labeled as fixture data.
- **Live mode**: Placeholder for a future authorized data source. Currently returns an error — never falls back to fixture data.
- **Segment vacancy**: Only computed when `hasSegmentData` is true. Otherwise shows "Segment availability cannot be determined."
- **No passenger data**: No names, phone numbers, or PNRs are modeled, stored, or displayed.

## License

This project is open source. See the repository for license details.

## Disclaimer

Reservation-chart information can change. Always verify important travel information with the official railway source before making decisions.

---

**RailChart Explorer** is an independent interface and is not affiliated with or operated by IRCTC or Indian Railways.
