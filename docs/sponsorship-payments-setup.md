# Sponsorship Payments — Setup Guide

Bergen County Towns uses Stripe Checkout to process sponsorship subscriptions. Sponsors pick a tier on any town's `/sponsorship` page, get redirected to Stripe's hosted checkout, and come back to a success page. Apple Pay, Google Pay, and all major cards work automatically on Stripe Checkout — no extra configuration needed.

## How it works

1. Visitor clicks "Subscribe" on a sponsorship tier
2. Client-side `CheckoutButton` component calls `POST /api/checkout` with `{ tierId, townSlug, townName }`
3. Server creates a Stripe Checkout Session (subscription mode) with the tier's price and town metadata
4. Visitor is redirected to Stripe-hosted checkout (Apple Pay works here on iOS Safari)
5. After payment, Stripe redirects back to `/sponsorship/success?session_id=...`
6. Stripe sends a webhook to `/api/webhook` confirming the subscription

## Setup steps

### 1. Create a Stripe account
Go to https://dashboard.stripe.com and create an account (or use an existing one).

### 2. Get your API keys
From the Stripe Dashboard → Developers → API keys:
- **Secret key** (`sk_test_...` for test mode, `sk_live_...` for production)
- The publishable key is not needed — Stripe Checkout is entirely server-side redirect

### 3. Set environment variables

**Local development** — create `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_your_test_key_here
```

**Vercel production** — add via Vercel CLI or Dashboard:
```bash
vercel env add STRIPE_SECRET_KEY production
# paste your sk_live_... key
```

### 4. Set up webhooks (optional for testing, required for production)

In Stripe Dashboard → Developers → Webhooks:
1. Add endpoint: `https://your-domain.com/api/webhook`
2. Listen for events: `checkout.session.completed`, `customer.subscription.deleted`
3. Copy the webhook signing secret (`whsec_...`)
4. Add it as `STRIPE_WEBHOOK_SECRET` env var

For local testing with Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 5. Test on iPhone with Apple Pay

1. Set up Stripe in **test mode** (test keys start with `sk_test_`)
2. Deploy to Vercel (or use `vercel dev` locally)
3. Open the sponsorship page on your iPhone in Safari
4. Click "Subscribe" on the Founder's Special ($1/mo) tier
5. Stripe Checkout will show Apple Pay as an option automatically
6. Use test card `4242 4242 4242 4242` (any future expiry, any CVC)
7. **Note:** Apple Pay in test mode requires a real Apple Pay wallet setup but won't charge real money

### Test cards
| Card number | Result |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 3220` | Requires 3D Secure |
| `4000 0000 0000 0002` | Decline |

## Sponsorship tiers

Defined in `src/lib/sponsorship.ts`:

| Tier | Price | ID |
|---|---|---|
| Founder's Special | $1/mo | `founders_special` |
| Community Sponsor | $99/mo | `community_sponsor` |
| Town Partner | $299/mo | `town_partner` |
| County Partner | $799/mo | `county_partner` |

To add/change tiers, edit `src/lib/sponsorship.ts`. Prices are created dynamically in Stripe via `price_data` — no pre-configured Stripe Products needed.

## File structure

```
src/
  lib/sponsorship.ts              — Tier definitions and opportunity listings
  app/
    sponsorship/
      page.tsx                    — Sponsorship page (server component + client checkout button)
      checkout-button.tsx         — Client component: "Subscribe" button
      success/page.tsx            — Post-checkout success page
    api/
      checkout/route.ts           — POST: create Stripe Checkout Session
      webhook/route.ts            — POST: handle Stripe webhook events
```

## Per-town metadata

Every Stripe Checkout Session includes metadata:
- `tier_id` — which sponsorship tier
- `town_slug` — which town (e.g., `ridgewood`, `fort-lee`)
- `town_name` — display name (e.g., `Ridgewood`, `Fort Lee`)

This means you can filter subscriptions by town in the Stripe Dashboard.

## Going live

1. Switch `STRIPE_SECRET_KEY` from `sk_test_...` to `sk_live_...`
2. Set up production webhook endpoint
3. Optionally remove the Founder's Special tier from `sponsorship.ts`
4. Apple Pay works automatically in production — Stripe handles domain verification
