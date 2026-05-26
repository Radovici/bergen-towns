import {
  getTownSponsors,
  getCountyPartners,
  getSponsorByToken,
} from "./sponsor-storage";
import type { SponsorProfile, TownSponsorEntry } from "./sponsor-types";

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

export async function getActiveSponsors(
  townSlug: string,
  previewToken?: string | null,
): Promise<TownSponsorEntry[]> {
  try {
    const [townIndex, countySponsors] = await Promise.all([
      getTownSponsors(townSlug),
      getCountyPartners(),
    ]);
    const townSponsors = townIndex?.sponsors ?? [];
    const countyIds = new Set(countySponsors.map((s) => s.id));
    const deduped = townSponsors.filter((s) => !countyIds.has(s.id));
    const all = [...deduped, ...countySponsors];

    if (previewToken) {
      const preview = await getSponsorByToken(previewToken);
      if (preview && preview.townSlug === townSlug) {
        const existing = all.findIndex((s) => s.id === preview.id);
        const entry = profileToEntry(preview);
        if (existing >= 0) {
          all[existing] = entry;
        } else {
          all.unshift(entry);
        }
      }
    }

    return all;
  } catch {
    return [];
  }
}

export function sponsorsByTier(
  sponsors: TownSponsorEntry[],
  ...tierIds: string[]
): TownSponsorEntry[] {
  const set = new Set(tierIds);
  return sponsors.filter((s) => set.has(s.tierId));
}
