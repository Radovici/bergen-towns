import { NextRequest, NextResponse } from "next/server";
import {
  getSponsorByToken,
  putSponsorProfile,
  rebuildTownIndex,
  rebuildCountyIndex,
} from "@/lib/sponsor-storage";
import { moderateContent } from "@/lib/ai-moderation";

const EDITABLE_FIELDS = [
  "businessName",
  "description",
  "website",
  "phone",
  "category",
] as const;

async function notifyModerator(
  sponsorName: string,
  townName: string,
  reason: string,
) {
  const aideUrl = process.env.AIDE_API_URL || "https://aide-mu.vercel.app";
  const serviceKey = process.env.AIDE_SERVICE_KEY || "";
  if (!serviceKey) return;

  try {
    await fetch(`${aideUrl}/api/v1/service/notify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bridge_slug: process.env.AIDE_BRIDGE_SLUG || "commercial",
        terminal_slug: process.env.AIDE_TERMINAL_SLUG || "bergen-sponsor-agent",
        title: "Sponsor content needs review",
        body: `${sponsorName} (${townName}): ${reason}`,
      }),
    });
  } catch {
    // notification failure shouldn't block the response
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token, ...updates } = body as Record<string, string>;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const profile = await getSponsorByToken(token);
  if (!profile) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const textFields: Record<string, string> = {};
  for (const field of EDITABLE_FIELDS) {
    if (typeof updates[field] === "string") {
      textFields[field] = updates[field];
    }
  }

  if (Object.keys(textFields).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 },
    );
  }

  const moderation = await moderateContent(textFields);

  if (!moderation.approved && !moderation.needsReview) {
    return NextResponse.json(
      { error: "Content rejected", moderation },
      { status: 422 },
    );
  }

  if (moderation.needsReview) {
    profile.pendingReview = {
      fields: textFields,
      reason: moderation.reason || "Flagged for human review",
      submittedAt: new Date().toISOString(),
    };
    profile.updatedAt = new Date().toISOString();
    await putSponsorProfile(profile);

    await notifyModerator(
      profile.businessName || profile.email,
      profile.townName,
      moderation.reason || "Content flagged for review",
    );

    return NextResponse.json({
      status: "pending_review",
      message:
        "Your submission is under review. A moderator will review it shortly.",
      reason: moderation.reason,
    });
  }

  for (const [key, value] of Object.entries(textFields)) {
    (profile as unknown as Record<string, unknown>)[key] = value;
  }
  profile.pendingReview = undefined;
  profile.updatedAt = new Date().toISOString();

  await putSponsorProfile(profile);
  await rebuildTownIndex(profile.townSlug);
  if (profile.tierId === "county_partner") {
    await rebuildCountyIndex();
  }

  return NextResponse.json({ profile });
}
