# Bergen County Towns

## What this is

Multi-tenant Next.js 15 app serving all 70 Bergen County, NJ municipalities from a single codebase. 9 towns have dedicated `.info` domains; the rest are served via `bergen-towns.vercel.app/?town={slug}`.

## Architecture

- **Middleware** (`src/middleware.ts`) detects hostname → sets `x-town-slug` header → persists in cookie
- **Server components** read the header via `getTownData()` and load JSON from `data/{slug}.json`
- **No database** — town content is static JSON files, versioned in git
- **Per-town theming** via CSS custom properties injected on `<html>` element
- **Town registry** (`src/lib/town-registry.ts`) — all 70 towns with geographic neighbors and URL routing

## Key files

- `src/lib/types.ts` — TypeScript interfaces (TownData schema). All JSON files must conform.
- `src/lib/town-registry.ts` — all 70 towns, neighbor relationships, URL routing (domain vs vercel.app)
- `src/lib/towns.ts` — `getTownData()` and `getTownSlug()` helpers used by every page.
- `src/middleware.ts` — hostname-to-slug mapping + cookie persistence. Priority: domain > ?town= param > cookie > default (ridgewood).
- `src/lib/constants.ts` — section navigation definitions.
- `src/lib/search-index.ts` — builds full-text search index from all 70 town JSON files.
- `data/*.json` — one file per town (70 total), all following the TownData schema.

## Sections (11 per town)

Overview, Real Estate & Taxes, Municipal Services, Rules & Ordinances, Schools, For Buyers, For Visitors, Local Government, Emergency, County Map, Sponsorship

## Features

- **Search** — `/api/search` route, cross-town full-text search, current-town results boosted (+50 score)
- **Neighbor links** — geographic adjacency chips at top of every page
- **County map** — NJ overview → zoomed Bergen County SVG with town border polygons, roads, landmarks
- **Sponsorship** — four tiers with Stripe Checkout subscriptions (see `src/lib/sponsorship.ts`), plus per-town contact emails ({slug}@radovici.com catchall)
- **Nav scroll arrows** — gradient fade arrows when tabs overflow
- **Analytics** — Google Analytics 4 (env: NEXT_PUBLIC_GA_ID), Vercel Speed Insights

## Adding a town

1. Create `data/{slug}.json` matching the TownData interface
2. Add entry in `src/lib/town-registry.ts` (slug, name, neighbors, optional domain)
3. Add polygon in `src/components/BergenMap.tsx`
4. If it has a custom domain: add domain mapping in `src/middleware.ts` + Vercel dashboard + DNS

## Sponsorship payments

Stripe Checkout handles sponsorship subscriptions. Tiers defined in `src/lib/sponsorship.ts`. Checkout flow: `CheckoutButton` → `POST /api/checkout` → Stripe redirect → `/sponsorship/success`. Webhook at `POST /api/webhook`.

Env vars: `STRIPE_SECRET_KEY` (required), `STRIPE_WEBHOOK_SECRET` (required for production).

See `docs/sponsorship-payments-setup.md` (human guide) and `docs/sponsorship-payments-agent-guide.md` (AI agent guide) for full details.

## Tests

```bash
npm test  # 30 tests: data integrity, neighbor symmetry, middleware resolution
```

## Local dev

```bash
npm run dev
# Use ?town=slug to test different towns: http://localhost:3000/?town=fort-lee
```

## Deployment

- Vercel project: `fedago/test` (GitHub: `Radovici/bergen-towns`)
- Two branches: `dev` (UAT) and `main` (PRD)
  - **`dev`** — default working branch. Push here freely. Every push auto-deploys a Vercel preview. Shows amber "UAT Preview" banner.
  - **`main`** — production. Protected: requires a PR (no direct push). Serves the 9 `.info` domains.
- 9 custom domains + 9 www variants configured in Vercel
- DNS at IONOS (A → 76.76.21.21, CNAME www → cname.vercel-dns.com)

### Day-to-day work

All commits go to `dev`. Agents and humans work on `dev` (or feature branches off `dev`).

### Shipping to production

```bash
gh pr create --base main --head dev --title "Ship to production"
# Then merge the PR on GitHub (or: gh pr merge --merge)
```

### Branch protection

`main` has GitHub branch protection: PRs required, no direct pushes. This prevents agents from accidentally deploying to production.
