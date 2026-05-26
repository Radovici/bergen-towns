import { put, del, list, head } from "@vercel/blob";
import type {
  SponsorProfile,
  TownSponsorIndex,
  TownSponsorEntry,
} from "./sponsor-types";

const PREFIX = "sponsors";

function profilePath(customerId: string) {
  return `${PREFIX}/profiles/${customerId}.json`;
}

function tokenPath(token: string) {
  return `${PREFIX}/tokens/${token}.json`;
}

function townIndexPath(townSlug: string) {
  return `${PREFIX}/index/${townSlug}.json`;
}

function countyIndexPath() {
  return `${PREFIX}/index/_county.json`;
}

async function readJson<T>(path: string): Promise<T | null> {
  try {
    const meta = await head(path);
    const res = await fetch(meta.url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function writeJson(path: string, data: unknown): Promise<string> {
  const blob = await put(path, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  return blob.url;
}

export async function getSponsorProfile(
  customerId: string,
): Promise<SponsorProfile | null> {
  return readJson<SponsorProfile>(profilePath(customerId));
}

export async function putSponsorProfile(
  profile: SponsorProfile,
): Promise<void> {
  await writeJson(profilePath(profile.id), profile);
  await writeJson(tokenPath(profile.managementToken), {
    customerId: profile.id,
  });
}

export async function getSponsorByToken(
  token: string,
): Promise<SponsorProfile | null> {
  const mapping = await readJson<{ customerId: string }>(tokenPath(token));
  if (!mapping) return null;
  return getSponsorProfile(mapping.customerId);
}

export async function deleteSponsorToken(token: string): Promise<void> {
  try {
    await del(tokenPath(token));
  } catch {
    // ignore if not found
  }
}

export async function getTownSponsors(
  townSlug: string,
): Promise<TownSponsorIndex | null> {
  return readJson<TownSponsorIndex>(townIndexPath(townSlug));
}

export async function getCountyPartners(): Promise<TownSponsorEntry[]> {
  const index = await readJson<TownSponsorIndex>(countyIndexPath());
  return index?.sponsors ?? [];
}

function profileToEntry(p: SponsorProfile): TownSponsorEntry {
  return {
    id: p.id,
    tierId: p.tierId,
    businessName: p.businessName,
    description: p.description,
    website: p.website,
    phone: p.phone,
    category: p.category,
    logoUrl: p.logoUrl,
    bannerUrl: p.bannerUrl,
    profileCardHtml: p.profileCardHtml,
  };
}

export async function rebuildTownIndex(townSlug: string): Promise<void> {
  const profiles: SponsorProfile[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({
      prefix: `${PREFIX}/profiles/`,
      cursor,
      limit: 100,
    });
    for (const blob of result.blobs) {
      try {
        const res = await fetch(blob.url);
        const profile = (await res.json()) as SponsorProfile;
        if (profile.townSlug === townSlug && profile.status === "active") {
          profiles.push(profile);
        }
      } catch {
        // skip corrupt entries
      }
    }
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  const index: TownSponsorIndex = {
    townSlug,
    lastUpdated: new Date().toISOString(),
    sponsors: profiles.map(profileToEntry),
  };
  await writeJson(townIndexPath(townSlug), index);
}

export async function rebuildCountyIndex(): Promise<void> {
  const profiles: SponsorProfile[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({
      prefix: `${PREFIX}/profiles/`,
      cursor,
      limit: 100,
    });
    for (const blob of result.blobs) {
      try {
        const res = await fetch(blob.url);
        const profile = (await res.json()) as SponsorProfile;
        if (
          profile.tierId === "county_partner" &&
          profile.status === "active"
        ) {
          profiles.push(profile);
        }
      } catch {
        // skip
      }
    }
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  const index: TownSponsorIndex = {
    townSlug: "_county",
    lastUpdated: new Date().toISOString(),
    sponsors: profiles.map(profileToEntry),
  };
  await writeJson(countyIndexPath(), index);
}

export async function uploadSponsorMedia(
  customerId: string,
  type: "logo" | "banner",
  file: Buffer,
  contentType: string,
): Promise<string> {
  const ext = contentType.split("/")[1] || "bin";
  const path = `${PREFIX}/media/${customerId}/${type}.${ext}`;
  const blob = await put(path, file, {
    access: "public",
    addRandomSuffix: false,
    contentType,
  });
  return blob.url;
}
