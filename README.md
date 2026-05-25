# Bergen County Towns

A multi-tenant information platform serving 9 Bergen County, NJ town websites from a single Next.js application.

## Live Sites

| Town | Domain | Status |
|------|--------|--------|
| Allendale | [allendale.info](https://allendale.info) | DNS pending |
| Fort Lee | [fortlee.info](https://fortlee.info) | DNS pending |
| Franklin Lakes | [franklinlakes.info](https://franklinlakes.info) | CNAME configured |
| Hackensack | [hackensack.info](https://hackensack.info) | DNS pending |
| Paramus | [paramus.info](https://paramus.info) | DNS pending |
| Ridgewood | [ridgewood.info](https://ridgewood.info) | DNS pending |
| Tenafly | [tenafly.info](https://tenafly.info) | DNS pending |
| Teterboro | [teterboro.info](https://teterboro.info) | DNS pending |
| Wyckoff | [wyckoff.info](https://wyckoff.info) | CNAME configured |

Preview: [bergen-towns.vercel.app](https://bergen-towns.vercel.app)

## Architecture

```
Request → Middleware (hostname detection) → x-town-slug header → Server Components → JSON data → Rendered page
```

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with per-town CSS custom properties
- **Data**: Static JSON files in `data/` — no database
- **Hosting**: Vercel (fedago org)
- **Multi-tenancy**: Middleware maps hostname to town slug; all 9 domains serve the same app

## Content Sections

Every town gets these 9 sections:

1. **Overview** — population, geography, school district, governance
2. **Real Estate & Taxes** — median home price, property tax rate, assessments
3. **Municipal Services** — trash, recycling, water, permits, parking
4. **Rules & Ordinances** — noise, property maintenance, pets, parking, rentals
5. **Schools** — public/private schools, ratings, nearby higher ed
6. **For Buyers** — commute, cost of living, pros/cons
7. **For Visitors** — restaurants, parks, events, attractions
8. **Local Government** — mayor, council, meetings, contacts
9. **Emergency** — police/fire non-emergency, hospitals, utilities

## Project Structure

```
bergen-towns/
├── src/
│   ├── app/                    # Next.js App Router pages (one per section)
│   ├── components/             # Header, Footer, Nav, Map, InfoCard, ContactCard
│   ├── lib/
│   │   ├── types.ts            # TypeScript interfaces for TownData
│   │   ├── towns.ts            # Data loading (getTownData, getTownSlug)
│   │   └── constants.ts        # Section navigation definitions
│   └── middleware.ts           # Hostname → town slug mapping
├── data/
│   ├── ridgewood.json          # Town-specific content (one per town)
│   ├── wyckoff.json
│   └── ...                     # 9 total JSON files
├── next.config.ts
└── package.json
```

## Local Development

```bash
npm install
npm run dev
```

Test different towns locally using the `?town=` query parameter:

- http://localhost:3000/?town=ridgewood
- http://localhost:3000/?town=fort-lee
- http://localhost:3000/schools?town=wyckoff

## Editing Town Content

Town data lives in `data/{slug}.json`. Each file follows the `TownData` TypeScript interface defined in `src/lib/types.ts`. Edit the JSON directly — changes deploy automatically on push.

## DNS Configuration (IONOS)

For each domain, set:
- **A record**: `@` → `76.76.21.21`
- **CNAME**: `www` → `cname.vercel-dns.com`

## Adding a New Town

1. Create `data/{slug}.json` following the `TownData` schema
2. Add the domain mapping in `src/middleware.ts`
3. Add the town to `ALL_TOWN_SLUGS` in `src/lib/towns.ts`
4. Add the town pin in `src/components/BergenCountyMap.tsx`
5. Add the town to `TOWN_DISPLAY` in `src/components/Footer.tsx`
6. Add the domain in Vercel dashboard
7. Configure DNS
