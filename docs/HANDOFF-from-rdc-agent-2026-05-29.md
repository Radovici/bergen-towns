# Handoff to Bergen County agent — 2026-05-29

Author: RDC (ruddiduddi.com) agent
Purpose: align bergen-towns docs with its actual AIDE-relay integration

## What you need to know

I (the RDC agent) just refactored ruddiduddi.com to use **AIDE's centralized Stripe webhook relay** (`aide-api-radovici.fly.dev/api/v1/payments/webhook`). While doing that I read your code and confirmed:

**Your code is already fully on this pattern.** Specifically:
- `src/app/api/checkout/route.ts` sets `metadata.app = "bergen-towns"` and `metadata.callback_url = ${origin}/api/webhook` on the Stripe Checkout Session.
- `src/app/api/webhook/route.ts` expects `Authorization: Bearer ${AIDE_SERVICE_KEY}` and reads the relay body shape `{ event_type, data, metadata }`.

No code change is needed. **But your docs are stale.** They still describe the old direct-Stripe-to-Bergen flow.

## What's stale and needs updating

### 1. `docs/sponsorship-payments-agent-guide.md`

Currently describes (incorrectly, as of 2026-05-29):
- "Stripe sends webhook to `/api/webhook`" — wrong; Stripe sends to AIDE, AIDE relays to your `/api/webhook`.
- `STRIPE_WEBHOOK_SECRET` listed as a required env var on bergen-towns — **wrong; that secret lives on AIDE backend only.**
- "Integration with AIDE payment platform" section says it's a "long-term plan" — **it's already done.**

### 2. `CLAUDE.md`

- "Webhook at `POST /api/webhook`" — keep, but clarify it receives AIDE's relay, not direct Stripe.
- "Env vars: `STRIPE_SECRET_KEY` (required), `STRIPE_WEBHOOK_SECRET` (required for production)" — replace `STRIPE_WEBHOOK_SECRET` with `AIDE_SERVICE_KEY` since that's what your code actually checks.

### 3. `docs/sponsorship-payments-setup.md` (if it exists)

Probably contains the same misinformation. Audit it.

## What the architecture actually is now

```
User clicks Subscribe on bergen-towns
  ↓ POST /api/checkout
  Stripe Checkout Session created with metadata:
    app:          "bergen-towns"
    callback_url: "https://<bergen-host>/api/webhook"
    tier_id, town_slug, town_name, management_token

  ↓ session.url returned, browser → checkout.stripe.com
  User completes payment

  Stripe → POST https://aide-api-radovici.fly.dev/api/v1/payments/webhook
  AIDE verifies Stripe signature (STRIPE_WEBHOOK_SECRET on AIDE side)
  AIDE looks up service-key entry where name = "bergen-towns"
  AIDE → POST https://<bergen-host>/api/webhook
         Authorization: Bearer <AIDE_SERVICE_KEY>
         Body: { event_type, data, metadata }

  Bergen webhook:
    1. Verifies bearer == AIDE_SERVICE_KEY
    2. Switches on event_type
    3. Persists sponsor profile, rebuilds indexes
    4. Returns 200
```

## Reference materials

Read these in this order — they're authoritative:

1. `/home/eldar/src/aide/docs/22-payment-platform.md` — payment platform design
2. `/home/eldar/src/aide/docs/23-credits-and-billing.md` — credits/wallet model (sibling concern to subscriptions)
3. `/home/eldar/src/aide/backend/aide/backend/api/routers/payments_webhook.py` — the relay implementation (source of truth for body shape)
4. `/home/eldar/src/ruddiduddi/docs/aide-stripe-integration.md` — a sibling app's integration doc (one-time top-ups vs your subscriptions; pattern is the same)
5. `~/.claude/projects/-home-eldar-src/memory/reference_aide_docs.md` — index of all AIDE docs (memory; loaded at session start)
6. `~/.claude/projects/-home-eldar-src/memory/feedback_aide_owns_shared_infra.md` — the architectural rule

## Suggested action plan for you

1. **Update `docs/sponsorship-payments-agent-guide.md`** — rewrite the flow section, the env var table, and the "Integration with AIDE" section to reflect current reality. Pattern the doc on ruddiduddi's `docs/aide-stripe-integration.md` for the flow diagram and the responsibility split.
2. **Update `CLAUDE.md`** — fix the env var list (drop `STRIPE_WEBHOOK_SECRET`, add `AIDE_SERVICE_KEY`), tighten the webhook description.
3. **Audit `docs/sponsorship-payments-setup.md`** if present.
4. **Verify your Vercel env** — confirm `AIDE_SERVICE_KEY` is set (Production + Preview + Development); confirm `STRIPE_WEBHOOK_SECRET` is NOT set (or is leftover and can be removed).
5. **Verify your Stripe Dashboard webhook** — should be pointing at `https://aide-api-radovici.fly.dev/api/v1/payments/webhook`, NOT at bergen.
6. **Commit + push** the doc updates.

## What you should NOT do

- Don't generate a new service key. You already have one (`AIDE_SERVICE_KEY` in your env, and a corresponding entry in AIDE's `SERVICE_KEYS_JSON` with `name: "bergen-towns"`).
- Don't touch the relay code in your `/api/webhook` — it's correct.
- Don't add a `STRIPE_WEBHOOK_SECRET` env var to bergen. Stripe's signature is verified at AIDE.

## Cross-check

When you're done, the answer to "does bergen-towns own a Stripe webhook secret?" should be **no**. The answer to "does bergen-towns own a Stripe checkout secret?" should be **yes** (`STRIPE_SECRET_KEY` — you create sessions). The answer to "does bergen-towns have a per-app service key shared with AIDE?" should be **yes** (`AIDE_SERVICE_KEY`).

---

When you're done with this handoff, delete this file (it's transient). The permanent documentation lives in the updated `docs/sponsorship-payments-agent-guide.md` and `CLAUDE.md`.
