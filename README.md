<div align="center">

# RailChart Explorer

**Explore Indian Railway reservation charts, coaches, and berth availability with clarity.**

An independent interface for viewing reservation-chart information — not affiliated with, endorsed by, or operated by IRCTC or Indian Railways.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

**[Live Demo](https://train-chart-viewer.vercel.app)** · **[Report Bug](https://github.com/jojin1709/train-chart-viewer/issues)** · **[Request Feature](https://github.com/jojin1709/train-chart-viewer/issues)**

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
| **Chart Explorer** | Train search, journey date, boarding (From), destination (To) with async pickers |
| **Coach Layout** | Dynamic visual layout generated from actual berth data |
| **Filters** | Journey segment, status, class, coach, berth type — URL-shareable |
| **Vacant Finder** | Find vacant berths grouped by class and coach |
| **PNR Check** | Check PNR status and see passenger details |
| **Live Tracking** | Track trains in real-time with live status |
| **Fare Lookup** | Find fare details between stations |
| **Station Live** | See live departures/arrivals at any station |
| **Cancelled Trains** | View list of cancelled trains |
| **Accessible** | Responsive (320px–1920px), keyboard-friendly |
| **Privacy** | No login, no accounts, no tracking, no passenger data |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Data:** RailKit SDK (Indian Railway API)
- **Icons:** Lucide React

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/jojin1709/train-chart-viewer.git
cd train-chart-viewer
npm install
```

### Environment Variables

Create a `.env.local` file:

```bash
RAILKIT_API_KEY=your_api_key_here
RAILCHART_DATA_MODE=railkit
```

Get your API key from [RailKit](https://railkit.io).

### Run

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Search trains, view reservation charts |
| Chart | `/chart/[trainNumber]` | Coach layout and berth availability |
| PNR | `/pnr` | Check PNR status |
| Live | `/live` | Track trains in real-time |
| Fare | `/fare` | Look up fares between stations |
| Station | `/station` | Live station departures/arrivals |
| Cancelled | `/cancelled` | View cancelled trains |

## Development

```bash
npm run dev       # Dev server with hot reload
npm run build     # Production build
npm run lint      # ESLint
```

## Vercel Deployment

1. Push to GitHub
2. Import in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables:
   - `RAILKIT_API_KEY` — your RailKit API key
   - `RAILCHART_DATA_MODE` — set to `railkit`
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jojin1709/train-chart-viewer)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RAILKIT_API_KEY` | Yes | Your RailKit API key for live data |
| `RAILCHART_DATA_MODE` | Yes | Set to `railkit` for live data |

## Data Accuracy

- **Live data**: Real-time data from RailKit API (Indian Railway data provider)
- **No passenger data**: No names, phone numbers, or PNRs are stored
- **Segment vacancy**: Only computed when segment data is available

## Disclaimer

Reservation-chart information can change. Always verify important travel information with the official railway source before making decisions.

---

**RailChart Explorer** is an independent interface and is not affiliated with or operated by IRCTC or Indian Railways.
