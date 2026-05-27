import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import Stripe from "stripe";
import { TIERS } from "@/lib/sponsorship";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tierId, townSlug, townName } = body as {
    tierId: string;
    townSlug: string;
    townName: string;
  };

  const tier = TIERS.find((t) => t.id === tierId);
  if (!tier) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const origin = request.headers.get("origin") || request.nextUrl.origin;
  const stripe = getStripe();
  const managementToken = randomUUID();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: tier.priceCents,
          recurring: { interval: tier.interval },
          product_data: {
            name: `${tier.name} — ${townName}`,
            description: `Bergen County sponsorship for ${townName}`,
            metadata: {
              tier_id: tier.id,
              town_slug: townSlug,
            },
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      app: "bergen-towns",
      callback_url: `${origin}/api/webhook`,
      tier_id: tier.id,
      tier_name: tier.name,
      town_slug: townSlug,
      town_name: townName,
      management_token: managementToken,
    },
    subscription_data: {
      metadata: {
        app: "bergen-towns",
        callback_url: `${origin}/api/webhook`,
        tier_id: tier.id,
        town_slug: townSlug,
        town_name: townName,
        management_token: managementToken,
      },
    },
    success_url: `${origin}/sponsorship/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/sponsorship`,
  });

  return NextResponse.json({ url: session.url });
}
