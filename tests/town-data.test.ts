import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { getAllSlugs, TOWN_REGISTRY } from "@/lib/town-registry";
import type { TownData } from "@/lib/types";

const DATA_DIR = join(process.cwd(), "data");

describe("town data files", () => {
  const slugs = getAllSlugs();

  it("every registered town has a JSON data file", () => {
    const missing: string[] = [];
    for (const slug of slugs) {
      const path = join(DATA_DIR, `${slug}.json`);
      if (!existsSync(path)) missing.push(slug);
    }
    expect(missing, `Missing data files: ${missing.join(", ")}`).toEqual([]);
  });

  it("every JSON file parses without error", () => {
    for (const slug of slugs) {
      const path = join(DATA_DIR, `${slug}.json`);
      if (!existsSync(path)) continue;
      expect(() => {
        JSON.parse(readFileSync(path, "utf-8"));
      }, `${slug}.json failed to parse`).not.toThrow();
    }
  });

  it("every town has all required top-level sections", () => {
    const requiredSections = [
      "meta",
      "overview",
      "realEstate",
      "services",
      "rules",
      "schools",
      "buyers",
      "visitors",
      "government",
      "emergency",
    ];

    for (const slug of slugs) {
      const path = join(DATA_DIR, `${slug}.json`);
      if (!existsSync(path)) continue;
      const data = JSON.parse(readFileSync(path, "utf-8")) as TownData;
      for (const section of requiredSections) {
        expect(
          data[section as keyof TownData],
          `${slug} missing section "${section}"`
        ).toBeDefined();
      }
    }
  });

  it("every town meta.slug matches the filename", () => {
    for (const slug of slugs) {
      const path = join(DATA_DIR, `${slug}.json`);
      if (!existsSync(path)) continue;
      const data = JSON.parse(readFileSync(path, "utf-8")) as TownData;
      expect(
        data.meta.slug,
        `${slug}.json has meta.slug="${data.meta.slug}" but filename is "${slug}"`
      ).toBe(slug);
    }
  });

  it("every town has a non-empty name and tagline", () => {
    for (const slug of slugs) {
      const path = join(DATA_DIR, `${slug}.json`);
      if (!existsSync(path)) continue;
      const data = JSON.parse(readFileSync(path, "utf-8")) as TownData;
      expect(data.meta.name.length, `${slug} has empty name`).toBeGreaterThan(0);
      expect(data.overview.tagline.length, `${slug} has empty tagline`).toBeGreaterThan(0);
    }
  });

  it("every town has valid population data", () => {
    for (const slug of slugs) {
      const path = join(DATA_DIR, `${slug}.json`);
      if (!existsSync(path)) continue;
      const data = JSON.parse(readFileSync(path, "utf-8")) as TownData;
      expect(data.overview.population, `${slug} has invalid population`).toBeGreaterThan(0);
      expect(data.overview.populationYear, `${slug} has invalid year`).toBeGreaterThanOrEqual(2020);
    }
  });

  it("every town has at least one school", () => {
    for (const slug of slugs) {
      const path = join(DATA_DIR, `${slug}.json`);
      if (!existsSync(path)) continue;
      const data = JSON.parse(readFileSync(path, "utf-8")) as TownData;
      const totalSchools =
        data.schools.publicSchools.length + data.schools.privateSchools.length;
      expect(
        totalSchools,
        `${slug} has no schools`
      ).toBeGreaterThan(0);
    }
  });

  it("every town has emergency contact numbers", () => {
    for (const slug of slugs) {
      const path = join(DATA_DIR, `${slug}.json`);
      if (!existsSync(path)) continue;
      const data = JSON.parse(readFileSync(path, "utf-8")) as TownData;
      expect(data.emergency.police.emergency, `${slug} missing police emergency`).toBe("911");
      expect(
        data.emergency.police.nonEmergency.length,
        `${slug} missing police non-emergency`
      ).toBeGreaterThan(0);
    }
  });

  it("owned-domain towns have correct domain in registry", () => {
    const domainTowns = Object.values(TOWN_REGISTRY).filter((t) => t.domain);
    expect(domainTowns).toHaveLength(9);
    for (const town of domainTowns) {
      const path = join(DATA_DIR, `${town.slug}.json`);
      const data = JSON.parse(readFileSync(path, "utf-8")) as TownData;
      expect(data.meta.domain).toBe(town.domain);
    }
  });
});
