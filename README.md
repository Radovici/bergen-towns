# Bergen County Towns

A multi-tenant information platform serving all 70 Bergen County, NJ municipalities from a single Next.js application.

## Live Sites

**Dedicated domains** (9 towns):

| Town | Domain |
|------|--------|
| Allendale | [allendale.info](https://allendale.info) |
| Fort Lee | [fortlee.info](https://fortlee.info) |
| Franklin Lakes | [franklinlakes.info](https://franklinlakes.info) |
| Hackensack | [hackensack.info](https://hackensack.info) |
| Paramus | [paramus.info](https://paramus.info) |
| Ridgewood | [ridgewood.info](https://ridgewood.info) |
| Tenafly | [tenafly.info](https://tenafly.info) |
| Teterboro | [teterboro.info](https://teterboro.info) |
| Wyckoff | [wyckoff.info](https://wyckoff.info) |

**All 70 towns**: [bergen-towns.vercel.app](https://bergen-towns.vercel.app) (use `?town={slug}` for any municipality)

## Architecture

```
Request → Middleware (hostname / ?town= / cookie) → x-town-slug header → Server Components → JSON data → Rendered page
```

- **Framework**: Next.js 15 (App Router), TypeScript
- **Styling**: Tailwind CSS with per-town CSS custom properties
- **Data**: 70 static JSON files in `data/` — no database
- **Hosting**: Vercel (fedago org)
- **Multi-tenancy**: Middleware maps hostname to town slug with cookie persistence
- **Analytics**: Google Analytics 4 + Vercel Speed Insights
- **Tests**: 30 tests (vitest) covering data integrity, neighbor symmetry, middleware resolution

## Features

- **11 sections per town**: Overview, Real Estate & Taxes, Municipal Services, Rules & Ordinances, Schools, For Buyers, For Visitors, Local Government, Emergency, County Map, Sponsorship
- **Cross-town search**: Full-text search across all 70 towns from the header, current-town results prioritized
- **Neighbor links**: Geographic adjacency chips at the top of every page
- **Interactive county map**: NJ overview → zoomed Bergen County with town border polygons, major roads (GSP, I-80, I-95, Rte 17, 4, 208, Palisades Pkwy), hospitals, landmarks
- **Sponsorship page**: Three tiers with per-town contact emails
- **Scrollable nav**: Gradient-fade arrow buttons when tabs overflow on mobile

## Project Structure

```
bergen-towns/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home/Overview
│   │   ├── real-estate/        # Real Estate & Taxes
│   │   ├── services/           # Municipal Services
│   │   ├── rules/              # Rules & Ordinances
│   │   ├── schools/            # Schools
│   │   ├── buyers/             # For Buyers
│   │   ├── visitors/           # For Visitors
│   │   ├── government/         # Local Government
│   │   ├── emergency/          # Emergency
│   │   ├── map/                # Interactive County Map
│   │   ├── sponsorship/        # Sponsorship & Partnerships
│   │   └── api/search/         # Search API route
│   ├── components/             # Header, Footer, Nav, BergenMap, SearchBar, etc.
│   ├── lib/
│   │   ├── types.ts            # TypeScript interfaces for TownData
│   │   ├── town-registry.ts    # All 70 towns, neighbors, URL routing
│   │   ├── towns.ts            # Data loading helpers
│   │   ├── search-index.ts     # Full-text search index builder
│   │   └── constants.ts        # Section navigation definitions
│   └── middleware.ts           # Hostname → town slug mapping + cookie
├── data/                       # 70 town JSON files
├── tests/                      # Vitest test suites
├── next.config.ts
└── package.json
```

## Local Development

```bash
npm install
npm run dev
npm test
```

Test different towns: `http://localhost:3000/?town=ridgewood`

## Editing Town Content

Edit `data/{slug}.json` directly. Conforms to `TownData` interface in `src/lib/types.ts`. Changes auto-deploy on push.

## DNS Configuration (IONOS)

For each owned domain:
- **A record**: `@` → `76.76.21.21`
- **CNAME**: `www` → `cname.vercel-dns.com`

## Adding a New Town

1. Create `data/{slug}.json` following the `TownData` schema
2. Add entry in `src/lib/town-registry.ts` with neighbors
3. Add polygon in `src/components/BergenMap.tsx`
4. If custom domain: add to `src/middleware.ts` + Vercel dashboard + DNS
