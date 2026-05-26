import { NextRequest, NextResponse } from "next/server";
import {
  getSponsorByToken,
  putSponsorProfile,
  uploadSponsorMedia,
  rebuildTownIndex,
} from "@/lib/sponsor-storage";

const MAX_LOGO = 512 * 1024;
const MAX_BANNER = 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const token = form.get("token") as string | null;
  const type = form.get("type") as "logo" | "banner" | null;
  const file = form.get("file") as File | null;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  if (!type || !["logo", "banner"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only PNG, JPEG, WebP, and SVG are allowed" },
      { status: 400 },
    );
  }

  const maxSize = type === "logo" ? MAX_LOGO : MAX_BANNER;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File too large (max ${maxSize / 1024}KB)` },
      { status: 400 },
    );
  }

  const profile = await getSponsorByToken(token);
  if (!profile) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadSponsorMedia(profile.id, type, buffer, file.type);

  if (type === "logo") {
    profile.logoUrl = url;
  } else {
    profile.bannerUrl = url;
  }
  profile.updatedAt = new Date().toISOString();

  await putSponsorProfile(profile);
  await rebuildTownIndex(profile.townSlug);

  return NextResponse.json({ url });
}
