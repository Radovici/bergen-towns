import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getSponsorProfile,
  putSponsorProfile,
  rebuildTownIndex,
  rebuildCountyIndex,
} from "@/lib/sponsor-storage";
import type { SponsorProfile } from "@/lib/sponsor-types";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const serviceKey = process.env.AIDE_SERVICE_KEY;
  if (!serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const sessions = await stripe.checkout.sessions.list({
    limit: 20,
    expand: ["data.subscription", "data.customer"],
  });

  const recovered: Array<Record<string, string>> = [];
  const skipped: Array<Record<string, string>> = [];

  for (const session of sessions.data) {
    if (session.payment_status !== "paid" && session.status !== "complete") {
      skipped.push({ id: session.id, reason: "not paid/complete" });
      continue;
    }
    const meta = session.metadata || {};
    if (meta.app !== "bergen-towns") {
      skipped.push({ id: session.id, reason: "not bergen-towns" });
      continue;
    }
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id || "";
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id || "";

    if (!customerId) {
      skipped.push({ id: session.id, reason: "no customer" });
      continue;
    }

    const existing = await getSponsorProfile(customerId);
    if (existing) {
      skipped.push({ id: session.id, reason: "already exists", customerId });
      continue;
    }

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
    await rebuildTownIndex(profile.townSlug);
    if (profile.tierId === "county_partner") {
      await rebuildCountyIndex();
    }

    recovered.push({
      sessionId: session.id,
      customerId,
      email: profile.email,
      town: profile.townSlug,
      tier: profile.tierId,
    });
  }

  return NextResponse.json({ recovered, skipped });
}
