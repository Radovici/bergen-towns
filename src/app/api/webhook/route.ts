import { NextRequest, NextResponse } from "next/server";
import {
  getSponsorProfile,
  putSponsorProfile,
  rebuildTownIndex,
  rebuildCountyIndex,
} from "@/lib/sponsor-storage";
import type { SponsorProfile } from "@/lib/sponsor-types";

async function rebuildIndexes(profile: SponsorProfile) {
  await rebuildTownIndex(profile.townSlug);
  if (profile.tierId === "county_partner") {
    await rebuildCountyIndex();
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const serviceKey = process.env.AIDE_SERVICE_KEY;

  if (!serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { event_type, data, metadata } = body as {
    event_type: string;
    data: Record<string, unknown>;
    metadata: Record<string, string>;
  };

  switch (event_type) {
    case "checkout.session.completed": {
      const customerId =
        typeof data.customer === "string"
          ? data.customer
          : (data.customer as Record<string, string>)?.id || "";
      const subscriptionId =
        typeof data.subscription === "string"
          ? data.subscription
          : (data.subscription as Record<string, string>)?.id || "";
      const customerDetails = data.customer_details as Record<
        string,
        string
      > | null;

      const now = new Date().toISOString();
      const profile: SponsorProfile = {
        id: customerId,
        stripeSubscriptionId: subscriptionId,
        managementToken: metadata.management_token || "",
        tierId: metadata.tier_id || "",
        tierName: metadata.tier_name || "",
        status: "active",
        townSlug: metadata.town_slug || "",
        townName: metadata.town_name || "",
        email: customerDetails?.email || "",
        businessName: customerDetails?.name || "New Sponsor",
        description: "",
        createdAt: now,
        updatedAt: now,
      };

      await putSponsorProfile(profile);
      await rebuildIndexes(profile);

      console.log(
        `[sponsor] Created: ${profile.townName} — ${profile.tierName} (${profile.email})`,
      );
      break;
    }

    case "customer.subscription.updated": {
      const customerId =
        typeof data.customer === "string"
          ? data.customer
          : (data.customer as Record<string, string>)?.id;
      if (!customerId) break;

      const profile = await getSponsorProfile(customerId);
      if (!profile) break;

      const statusMap: Record<string, SponsorProfile["status"]> = {
        active: "active",
        past_due: "past_due",
        canceled: "canceled",
        unpaid: "past_due",
      };
      const stripeStatus = data.status as string;
      profile.status = statusMap[stripeStatus] || profile.status;
      profile.updatedAt = new Date().toISOString();

      await putSponsorProfile(profile);
      await rebuildIndexes(profile);
      console.log(`[sponsor] Updated: ${customerId} → ${profile.status}`);
      break;
    }

    case "customer.subscription.deleted": {
      const customerId =
        typeof data.customer === "string"
          ? data.customer
          : (data.customer as Record<string, string>)?.id;
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
