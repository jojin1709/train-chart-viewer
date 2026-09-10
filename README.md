# RailChart Explorer

Explore reservation charts, coaches and berth availability with clarity.

RailChart Explorer is an **independent** interface for exploring Indian
Railway reservation-chart information. It is not affiliated with, endorsed
by, or operated by IRCTC or Indian Railways.

## 1. Project overview

The core idea: pick a train, a journey date, a boarding station (From) and a
destination station (To), then see which berths are actually vacant for
*that specific segment* of the journey — not just "empty-looking" on a
single snapshot. A berth can be:

- **Vacant** for the whole selected segment
- **Part journey vacant** — occupied for part of the segment, free for the
  rest
- **Occupied** for the whole segment
- **Unknown** — shown explicitly whenever the underlying data doesn't
  support a confident answer. The app never guesses.

## 2. Features

- Train / journey date / From / To search with async, keyboard-navigable
  station and train pickers
- Reservation chart results: train header, chart status, summary stats,
  per-class breakdown
- Coach tabs, dynamic visual coach map (layout generated from the actual
  berth data — not hard-coded per coach), and a sortable/searchable list
  view
- Filters: journey segment, status, class, coach, berth type, free-text
  search — all reflected in the URL for shareable links
- "Find Vacant Berths" mode, grouped by class and coach
- Berth detail panel with type, status, known occupancy segments, and a
  privacy note (no passenger names, phone numbers, or PNRs are ever shown)
- Skeleton loading states, friendly error states with retry + link to the
  official source, and empty states throughout
- Fully responsive (320px–1920px), keyboard accessible, reduced-motion
  aware, no color-only status indicators
- No login, no accounts, no tracking

## 3. Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Zod · TanStack
Query · Lucide icons · Vitest

## 4. Local installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`. Try train **22648** (Kochuveli – Chennai
Central SF Express) or **12621** (Tamil Nadu Express) with a From/To on
their routes.

## 5. Environment variables

See [`.env.example`](./.env.example). Nothing is required for the default
fixture-data mode. `RAILCHART_DATA_MODE` selects the data provider (see
§10).

## 6. Development

```bash
npm run dev       # dev server with hot reload
npm run lint       # ESLint
npx tsc --noEmit   # type-check
npm test           # unit tests (vitest)
```

## 7. Testing

`npm test` runs unit tests covering:

- Segment vacancy logic — full/part/occupied classification, multi-record
  occupancy, out-of-route stations, reversed From/To, and the "insufficient
  data → UNKNOWN, never guess" rule
- Summary computation across classes and segments
- Input validation schemas (train number, date, station code)

## 8. Production build

```bash
npm run build
npm start
```

## 9. Vercel deployment

The app has no filesystem persistence, no long-running processes, and no
external database — it deploys to Vercel with default settings:

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import it in the Vercel dashboard (Framework: Next.js — auto-detected).
3. Add any environment variables from `.env.example` you want to override
   (none are required for fixture mode).
4. Deploy.

## 10. Data-provider architecture

All data access goes through a single interface,
[`RailwayDataProvider`](./lib/providers/types.ts):

```
lib/providers/
  types.ts            — the RailwayDataProvider interface
  fixtureProvider.ts  — demo-data implementation (default)
  index.ts            — provider factory, selected by RAILCHART_DATA_MODE
```

API routes and pages depend only on `getProvider()` from
`lib/providers/index.ts` — never on a concrete provider. This means a real,
authorized reservation-chart data source can be added later as a new class
implementing `RailwayDataProvider`, without changing any UI code.

Raw provider output passes through `lib/chart/normalizer.ts` before
reaching the UI, so a future provider with a differently-shaped raw
response only needs to map into the normalized types in `types/index.ts`.

**No scraping, no bypassing IRCTC's authentication, CAPTCHA, or rate
limits.** No such integration is bundled with this project.

## 11. Important data-accuracy limitations

- **Fixture mode (default, `RAILCHART_DATA_MODE=fixture`)** serves
  deterministic, clearly-labeled demo data for exactly two train numbers
  (`22648`, `12621`). Every chart response carries
  `meta.isFixtureData: true` and a `meta.sourceLabel` saying so, and the UI
  surfaces an explicit "Fixture data" badge. Any other train number
  correctly returns "not found" — the app never invents a chart for an
  unrecognized train.
- **"Live" mode (`RAILCHART_DATA_MODE=live`)** is a placeholder for a
  future, authorized data source. No such integration exists in this
  codebase. Setting this value makes every request return a clear "no
  authorized live data source is configured" error — it does **not** fall
  back to fixture data, because doing so would risk presenting demo data as
  if it were real.
- Segment vacancy (`FULL_JOURNEY_VACANT` / `PART_JOURNEY_VACANT` /
  `OCCUPIED`) is only ever computed when a berth's `hasSegmentData` flag is
  true. When a source can't support segment-level detail, the UI shows
  "Segment availability cannot be determined from the available chart
  data." instead of guessing.
- No passenger-identifying information (name, phone number, PNR) is
  modeled, stored, or displayed anywhere in this application.

## 12. Official-source disclaimer

Reservation-chart information can change. Always verify important travel
information with the official railway source before making decisions.
RailChart Explorer links to the official IRCTC enquiry page from the header,
the About page, and every error state.

---

RailChart Explorer is an independent interface and is not affiliated with
or operated by IRCTC or Indian Railways.
