import { headers } from "next/headers";
import { TownData, TownSlug } from "./types";
import { readFileSync } from "fs";
import { join } from "path";

const townCache = new Map<TownSlug, TownData>();

export async function getTownSlug(): Promise<TownSlug> {
  const headersList = await headers();
  return (headersList.get("x-town-slug") as TownSlug) ?? "ridgewood";
}

export function loadTownData(slug: TownSlug): TownData {
  if (townCache.has(slug)) {
    return townCache.get(slug)!;
  }
  const filePath = join(process.cwd(), "data", `${slug}.json`);
  const raw = readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as TownData;
  townCache.set(slug, data);
  return data;
}

export async function getTownData(): Promise<TownData> {
  const slug = await getTownSlug();
  return loadTownData(slug);
}

export const ALL_TOWN_SLUGS: TownSlug[] = [
  "allendale",
  "fort-lee",
  "franklin-lakes",
  "hackensack",
  "paramus",
  "ridgewood",
  "tenafly",
  "teterboro",
  "wyckoff",
];
