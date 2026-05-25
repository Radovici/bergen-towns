# Bergen County Towns

## What this is

Multi-tenant Next.js 15 app serving 9 Bergen County, NJ town information websites from a single codebase. Each `.info` domain (ridgewood.info, wyckoff.info, etc.) serves the same app with town-specific content.

## Architecture

- **Middleware** (`src/middleware.ts`) detects hostname and sets `x-town-slug` header
- **Server components** read the header via `getTownData()` and load JSON from `data/{slug}.json`
- **No database** — town content is static JSON files, versioned in git
- **Per-town theming** via CSS custom properties injected on `<html>` element

## Key files

- `src/lib/types.ts` — TypeScript interfaces (TownData schema). All JSON files must conform.
- `src/lib/towns.ts` — `getTownData()` and `getTownSlug()` helpers used by every page.
- `src/middleware.ts` — hostname-to-slug mapping. Add new domains here.
- `src/lib/constants.ts` — section navigation definitions.
- `data/*.json` — one file per town, all following the TownData schema.

## Adding a town

1. Create `data/{slug}.json` matching the TownData interface
2. Add domain mapping in `src/middleware.ts`
3. Add slug to `ALL_TOWN_SLUGS` in `src/lib/towns.ts`
4. Add pin in `src/components/BergenCountyMap.tsx`
5. Add entry in `src/components/Footer.tsx` TOWN_DISPLAY
6. Add domain in Vercel dashboard + configure DNS

## Local dev

```bash
npm run dev
# Use ?town=slug to test different towns: http://localhost:3000/?town=fort-lee
```

## Deployment

- Vercel project: `fedago/bergen-towns`
- GitHub: `Radovici/bergen-towns`
- Domains managed in Vercel dashboard; DNS at IONOS
- Auto-deploys on push to main
