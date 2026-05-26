import { NextRequest, NextResponse } from "next/server";
import { getSponsorByToken, putSponsorProfile, rebuildTownIndex, rebuildCountyIndex } from "@/lib/sponsor-storage";
import { moderateContent } from "@/lib/ai-moderation";

const EDITABLE_FIELDS = [
  "businessName",
  "description",
  "website",
  "phone",
  "category",
] as const;

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
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const moderation = await moderateContent(textFields);
  if (!moderation.approved) {
    return NextResponse.json(
      { error: "Content rejected", moderation },
      { status: 422 },
    );
  }

  for (const [key, value] of Object.entries(textFields)) {
    (profile as unknown as Record<string, unknown>)[key] = value;
  }
  profile.updatedAt = new Date().toISOString();

  await putSponsorProfile(profile);
  await rebuildTownIndex(profile.townSlug);
  if (profile.tierId === "county_partner") {
    await rebuildCountyIndex();
  }

  return NextResponse.json({ profile });
}
