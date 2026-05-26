import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getSponsorProfile,
  putSponsorProfile,
  rebuildTownIndex,
  rebuildCountyIndex,
} from "@/lib/sponsor-storage";
import type { SponsorProfile } from "@/lib/sponsor-types";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

async function rebuildIndexes(profile: SponsorProfile) {
  await rebuildTownIndex(profile.townSlug);
  if (profile.tierId === "county_partner") {
    await rebuildCountyIndex();
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata || {};
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id || "";
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id || "";

      const now = new Date().toISOString();
      const profile: SponsorProfile = {
        id: customerId,
        stripeSubscriptionId: subscriptionId,
        managementToken: meta.management_token || "",
        tierId: meta.tier_id || "",
        tierName: meta.tier_name || "",
        status: "active",
        townSlug: meta.town_slug || "",
        townName: meta.town_name || "",
        email: session.customer_details?.email || "",
        businessName: session.customer_details?.name || "New Sponsor",
        description: "",
        createdAt: now,
        updatedAt: now,
      };

      await putSponsorProfile(profile);
      await rebuildIndexes(profile);

      if (subscriptionId && meta.management_token) {
        await stripe.subscriptions.update(subscriptionId, {
          metadata: { management_token: meta.management_token },
        });
      }

      console.log(
        `[sponsor] Created: ${profile.townName} — ${profile.tierName} (${profile.email})`,
      );
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
      if (!customerId) break;

      const profile = await getSponsorProfile(customerId);
      if (!profile) break;

      const statusMap: Record<string, SponsorProfile["status"]> = {
        active: "active",
        past_due: "past_due",
        canceled: "canceled",
        unpaid: "past_due",
      };
      profile.status = statusMap[sub.status] || profile.status;
      profile.updatedAt = new Date().toISOString();

      await putSponsorProfile(profile);
      await rebuildIndexes(profile);
      console.log(`[sponsor] Updated: ${customerId} → ${profile.status}`);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
      if (!customerId) break;

      const profile = await getSponsorProfile(customerId);
      if (!profile) break;

      profile.status = "canceled";
      profile.updatedAt = new Date().toISOString();

      await putSponsorProfile(profile);
      await rebuildIndexes(profile);
      console.log(`[sponsor] Canceled: ${customerId}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
