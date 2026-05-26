# Sponsorship Payments — Agent Integration Guide

This document is written for AI agents (like the Bergen County agent) that need to understand and work with the sponsorship payment system in the Bergen Towns codebase.

## Architecture overview

Bergen Towns uses **Stripe Checkout** (server-side redirect) for sponsorship subscriptions. There is no client-side Stripe.js — the flow is:

```
User clicks "Subscribe" button
  → Client component calls POST /api/checkout
    → Server creates Stripe Checkout Session
      → User redirected to checkout.stripe.com
        → After payment, redirected to /sponsorship/success
          → Stripe sends webhook to /api/webhook
```

## Key files

| File | Role | Type |
|---|---|---|
| `src/lib/sponsorship.ts` | Tier definitions (`TIERS` array) and partnership opportunities (`OPPORTUNITIES` array) | Shared data |
| `src/app/sponsorship/page.tsx` | Main sponsorship page — server component, renders tiers and checkout buttons | Server component |
| `src/app/sponsorship/checkout-button.tsx` | "Subscribe" button — client component, calls checkout API | Client component (`"use client"`) |
| `src/app/sponsorship/success/page.tsx` | Post-checkout success page | Server component |
| `src/app/api/checkout/route.ts` | Creates Stripe Checkout Session — `POST /api/checkout` | API route |
| `src/app/api/webhook/route.ts` | Handles Stripe webhook events — `POST /api/webhook` | API route |

## Tier data structure

```typescript
interface SponsorshipTier {
  id: string;           // e.g., "founders_special", "community_sponsor"
  name: string;         // e.g., "Founder's Special"
  price: string;        // Display price, e.g., "$1/mo"
  priceCents: number;   // Price in cents, e.g., 100
  interval: "month";    // Billing interval
  features: string[];   // Feature list for the card
  highlight: boolean;   // If true, gets "Limited Offer" badge and border highlight
}
```

Current tiers (defined in `src/lib/sponsorship.ts`):
- `founders_special` — $1/mo (highlighted, limited offer)
- `community_sponsor` — $99/mo
- `town_partner` — $299/mo
- `county_partner` — $799/mo

## How to modify tiers

Edit `src/lib/sponsorship.ts`. Each tier needs an `id`, `name`, `price` (display string), `priceCents` (integer, in US cents), `interval`, `features` array, and `highlight` boolean.

Stripe Products/Prices are created dynamically via `price_data` in the Checkout Session — no pre-configuration in the Stripe Dashboard required. Adding or changing a tier in the code is all that's needed.

## Checkout API

**Endpoint:** `POST /api/checkout`

**Request body:**
```json
{
  "tierId": "founders_special",
  "townSlug": "ridgewood",
  "townName": "Ridgewood"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Error responses:**
- `400` — `{ "error": "Invalid tier" }` (tier ID not found in `TIERS`)
- `500` — Stripe API error (missing or invalid `STRIPE_SECRET_KEY`)

**Stripe Session metadata:**
Every checkout session is tagged with `tier_id`, `town_slug`, `town_name`. These flow through to the subscription object in Stripe.

## Webhook API

**Endpoint:** `POST /api/webhook`

**Events handled:**
- `checkout.session.completed` — logs new subscription
- `customer.subscription.deleted` — logs cancellation

**Required env var:** `STRIPE_WEBHOOK_SECRET` (`whsec_...`)

Currently the webhook handler only logs. Future work: write sponsor data back to town JSON files, update a database, or notify the AIDE platform.

## Environment variables

| Variable | Required | Where | Example |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Yes | Server only | `sk_test_...` or `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | For production | Server only | `whsec_...` |
| `NEXT_PUBLIC_GA_ID` | No | Client + server | `G-XXXXXXXXXX` |

Set in `.env.local` for local dev, or via `vercel env add` for Vercel deployments.

## Town context

The sponsorship page reads the current town via `getTownData()` which reads the `x-town-slug` header set by middleware. The town slug and name are passed to the `CheckoutButton` component and forwarded to the checkout API.

This means:
- A sponsor clicking "Subscribe" on `ridgewood.info/sponsorship` creates a subscription tagged with `town_slug: ridgewood`
- A sponsor on `bergen-towns.vercel.app/sponsorship?town=fort-lee` creates one tagged with `town_slug: fort-lee`

## Apple Pay / Google Pay

Stripe Checkout supports Apple Pay and Google Pay automatically. No extra configuration needed. When a user opens the checkout page on an iPhone with Apple Pay set up, it appears as a payment option.

In **test mode**, Apple Pay shows up but uses test credentials. In **production**, it works with real payments after Stripe auto-verifies the domain.

## Integration with AIDE payment platform

Bergen Towns is a standalone Next.js app. The long-term plan is to run it as an AIDE app where payments flow through `AIDE.payments.*` SDK calls. For now, it uses Stripe directly.

When migrating to AIDE:
1. Replace `POST /api/checkout` with `AIDE.payments.createCheckout({ tier_id, ... })`
2. Replace `POST /api/webhook` with AIDE's centralized webhook handler
3. Replace tier definitions in `sponsorship.ts` with the app manifest `pricing` block
4. The `CheckoutButton` component stays similar but calls the SDK instead of fetch

## Testing

1. Use Stripe test keys (`sk_test_...`)
2. Test card: `4242 4242 4242 4242`, any future expiry, any 3-digit CVC
3. Visit `/sponsorship`, click Subscribe on any tier
4. Complete Stripe Checkout with test card
5. Verify redirect to `/sponsorship/success`
6. Check Stripe Dashboard → Payments for the test transaction

## Dependencies

- `stripe` (server-side Node.js SDK) — used in API routes
- `@stripe/stripe-js` (client-side) — installed but not currently used (Stripe Checkout is redirect-based, not embedded)
