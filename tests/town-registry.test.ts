import { describe, it, expect } from "vitest";
import {
  TOWN_REGISTRY,
  getTownUrl,
  getAllSlugs,
  getNeighbors,
} from "@/lib/town-registry";

describe("town-registry", () => {
  it("has exactly 70 municipalities", () => {
    expect(getAllSlugs()).toHaveLength(70);
  });

  it("every slug matches its key", () => {
    for (const [key, town] of Object.entries(TOWN_REGISTRY)) {
      expect(town.slug).toBe(key);
    }
  });

  it("every neighbor reference is a valid slug", () => {
    const allSlugs = new Set(getAllSlugs());
    for (const [slug, town] of Object.entries(TOWN_REGISTRY)) {
      for (const neighbor of town.neighbors) {
        expect(allSlugs.has(neighbor), `${slug} neighbor "${neighbor}" not found`).toBe(true);
      }
    }
  });

  it("neighbor relationships are symmetric", () => {
    for (const [slug, town] of Object.entries(TOWN_REGISTRY)) {
      for (const neighbor of town.neighbors) {
        const neighborTown = TOWN_REGISTRY[neighbor];
        expect(
          neighborTown.neighbors.includes(slug),
          `${slug} lists ${neighbor} as neighbor, but ${neighbor} does not list ${slug}`
        ).toBe(true);
      }
    }
  });

  it("no town lists itself as a neighbor", () => {
    for (const [slug, town] of Object.entries(TOWN_REGISTRY)) {
      expect(town.neighbors).not.toContain(slug);
    }
  });

  it("every town has at least one neighbor", () => {
    for (const [slug, town] of Object.entries(TOWN_REGISTRY)) {
      expect(
        town.neighbors.length,
        `${slug} has no neighbors`
      ).toBeGreaterThan(0);
    }
  });

  describe("getTownUrl", () => {
    it("returns domain URL for owned domains", () => {
      expect(getTownUrl("ridgewood")).toBe("https://ridgewood.info");
      expect(getTownUrl("wyckoff")).toBe("https://wyckoff.info");
      expect(getTownUrl("fort-lee")).toBe("https://fortlee.info");
    });

    it("returns vercel URL for non-domain towns", () => {
      expect(getTownUrl("teaneck")).toBe(
        "https://bergen-towns.vercel.app/?town=teaneck"
      );
      expect(getTownUrl("glen-rock")).toBe(
        "https://bergen-towns.vercel.app/?town=glen-rock"
      );
    });

    it("returns # for unknown slugs", () => {
      expect(getTownUrl("nonexistent")).toBe("#");
    });
  });

  describe("getNeighbors", () => {
    it("returns sorted neighbor TownInfo objects", () => {
      const neighbors = getNeighbors("ridgewood");
      expect(neighbors.length).toBeGreaterThan(0);
      const names = neighbors.map((n) => n.name);
      expect(names).toEqual([...names].sort());
    });

    it("returns empty array for unknown slug", () => {
      expect(getNeighbors("nonexistent")).toEqual([]);
    });
  });
});
