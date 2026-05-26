import { getTownSponsors, getCountyPartners } from "./sponsor-storage";
import type { TownSponsorEntry } from "./sponsor-types";

export async function getActiveSponsors(
  townSlug: string,
): Promise<TownSponsorEntry[]> {
  try {
    const [townIndex, countySponsors] = await Promise.all([
      getTownSponsors(townSlug),
      getCountyPartners(),
    ]);
    const townSponsors = townIndex?.sponsors ?? [];
    const countyIds = new Set(countySponsors.map((s) => s.id));
    const deduped = townSponsors.filter((s) => !countyIds.has(s.id));
    return [...deduped, ...countySponsors];
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
