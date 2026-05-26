import { NextRequest, NextResponse } from "next/server";
import {
  getSponsorByToken,
  putSponsorProfile,
  rebuildTownIndex,
  rebuildCountyIndex,
} from "@/lib/sponsor-storage";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token, decision } = body as {
    token: string;
    decision: "approve" | "reject";
  };

  const serviceKey = request.headers.get("authorization")?.replace("Bearer ", "");
  const expectedKey = process.env.AIDE_SERVICE_KEY;
  if (!serviceKey || serviceKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!token || !["approve", "reject"].includes(decision)) {
    return NextResponse.json(
      { error: "Missing token or invalid decision" },
      { status: 400 },
    );
  }

  const profile = await getSponsorByToken(token);
  if (!profile) {
    return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
  }

  if (!profile.pendingReview) {
    return NextResponse.json(
      { error: "No pending review" },
      { status: 400 },
    );
  }

  if (decision === "approve") {
    for (const [key, value] of Object.entries(profile.pendingReview.fields)) {
      (profile as unknown as Record<string, unknown>)[key] = value;
    }
    profile.pendingReview = undefined;
    profile.updatedAt = new Date().toISOString();

    await putSponsorProfile(profile);
    await rebuildTownIndex(profile.townSlug);
    if (profile.tierId === "county_partner") {
      await rebuildCountyIndex();
    }

    return NextResponse.json({
      status: "approved",
      message: "Content approved and live.",
    });
  }

  profile.pendingReview = undefined;
  profile.updatedAt = new Date().toISOString();
  await putSponsorProfile(profile);

  return NextResponse.json({
    status: "rejected",
    message: "Content rejected. Sponsor's existing listing unchanged.",
  });
}
