import { readFileSync } from "fs";
import { join } from "path";
import { getAllSlugs, getTownUrl } from "./town-registry";
import type { TownData } from "./types";

export interface SearchEntry {
  town: string;
  townSlug: string;
  townUrl: string;
  section: string;
  sectionPath: string;
  title: string;
  text: string;
}

function extractEntries(slug: string, data: TownData): SearchEntry[] {
  const url = getTownUrl(slug);
  const name = data.meta.name;
  const entries: SearchEntry[] = [];

  const add = (section: string, path: string, title: string, text: string) => {
    entries.push({ town: name, townSlug: slug, townUrl: url, section, sectionPath: path, title, text });
  };

  add("Overview", "/", data.meta.name, [data.overview.tagline, data.overview.description, ...data.overview.highlights].join(" "));
  add("Real Estate", "/real-estate", `Real Estate in ${name}`, [data.realEstate.medianHomePrice, data.realEstate.propertyTaxRate, data.realEstate.assessmentInfo, data.realEstate.recentTrends, ...data.realEstate.neighborhoodNotes].join(" "));
  add("Schools", "/schools", `Schools in ${name}`, [data.schools.publicDistrict, ...data.schools.publicSchools.map(s => `${s.name} ${s.grades} ${s.notes || ""}`), ...data.schools.privateSchools.map(s => `${s.name} ${s.grades} ${s.notes || ""}`), ...data.schools.nearbyHigherEd].join(" "));
  add("Services", "/services", `Services in ${name}`, [data.services.trashCollection.description, data.services.recycling.description, data.services.waterSewer.description, data.services.permits.description, data.services.parking.description].join(" "));
  add("Rules", "/rules", `Rules in ${name}`, [data.rules.noise.summary, data.rules.propertyMaintenance.summary, data.rules.pets.summary, data.rules.parking.summary, data.rules.rentals.summary].join(" "));
  add("For Buyers", "/buyers", `Moving to ${name}`, [...data.buyers.whyMoveHere, data.buyers.commuteToNYC.notes, data.buyers.costOfLiving.summary, ...data.buyers.prosAndCons.pros, ...data.buyers.prosAndCons.cons].join(" "));
  add("Visitors", "/visitors", `Visit ${name}`, [...data.visitors.restaurants.map(r => `${r.name} ${r.description}`), ...data.visitors.parks.map(p => `${p.name} ${p.description}`), ...data.visitors.events.map(e => `${e.name} ${e.description}`), ...data.visitors.attractions.map(a => `${a.name} ${a.description}`), ...data.visitors.shoppingAreas].join(" "));
  add("Government", "/government", `Government in ${name}`, [data.government.governingBody, data.government.mayor.name, data.government.municipalWebsite, ...data.government.council.map(c => c.name), ...data.government.importantContacts.map(c => `${c.department} ${c.phone}`)].join(" "));
  add("Emergency", "/emergency", `Emergency in ${name}`, [data.emergency.police.nonEmergency, data.emergency.fire.nonEmergency, ...data.emergency.hospitals.map(h => `${h.name} ${h.address} ${h.phone}`), ...data.emergency.utilities.map(u => `${u.service} ${u.provider} ${u.phone}`)].join(" "));

  return entries;
}

export function buildSearchIndex(): SearchEntry[] {
  const dataDir = join(process.cwd(), "data");
  const entries: SearchEntry[] = [];

  for (const slug of getAllSlugs()) {
    try {
      const raw = readFileSync(join(dataDir, `${slug}.json`), "utf-8");
      const data = JSON.parse(raw) as TownData;
      entries.push(...extractEntries(slug, data));
    } catch {
      // skip towns without data files
    }
  }

  return entries;
}
