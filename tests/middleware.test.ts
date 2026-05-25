import { describe, it, expect } from "vitest";
import { TOWN_REGISTRY } from "@/lib/town-registry";

const COOKIE_NAME = "bergen-town";

function resolveSlug(options: {
  host: string;
  queryTown?: string | null;
  cookieTown?: string | null;
}): string {
  const TOWN_DOMAINS: Record<string, string> = {
    "allendale.info": "allendale",
    "fortlee.info": "fort-lee",
    "franklinlakes.info": "franklin-lakes",
    "hackensack.info": "hackensack",
    "paramus.info": "paramus",
    "ridgewood.info": "ridgewood",
    "tenafly.info": "tenafly",
    "teterboro.info": "teterboro",
    "wyckoff.info": "wyckoff",
  };

  const host = options.host.split(":")[0];
  const fromDomain = TOWN_DOMAINS[host];
  const fromQuery = options.queryTown;
  const fromCookie = options.cookieTown;
  const isValid = (s: string | null | undefined): s is string =>
    !!s && s in TOWN_REGISTRY;

  return (
    fromDomain ??
    (isValid(fromQuery) ? fromQuery : null) ??
    (isValid(fromCookie) ? fromCookie : null) ??
    "ridgewood"
  );
}

describe("middleware slug resolution", () => {
  it("resolves from custom domain", () => {
    expect(resolveSlug({ host: "wyckoff.info" })).toBe("wyckoff");
    expect(resolveSlug({ host: "fortlee.info" })).toBe("fort-lee");
  });

  it("resolves from ?town= query param", () => {
    expect(
      resolveSlug({ host: "bergen-towns.vercel.app", queryTown: "teaneck" })
    ).toBe("teaneck");
  });

  it("resolves from cookie when no domain or query", () => {
    expect(
      resolveSlug({ host: "bergen-towns.vercel.app", cookieTown: "fair-lawn" })
    ).toBe("fair-lawn");
  });

  it("query param takes precedence over cookie", () => {
    expect(
      resolveSlug({
        host: "bergen-towns.vercel.app",
        queryTown: "glen-rock",
        cookieTown: "fair-lawn",
      })
    ).toBe("glen-rock");
  });

  it("domain takes precedence over query and cookie", () => {
    expect(
      resolveSlug({
        host: "ridgewood.info",
        queryTown: "teaneck",
        cookieTown: "fair-lawn",
      })
    ).toBe("ridgewood");
  });

  it("falls back to ridgewood when nothing matches", () => {
    expect(resolveSlug({ host: "bergen-towns.vercel.app" })).toBe("ridgewood");
  });

  it("ignores invalid query param slugs", () => {
    expect(
      resolveSlug({ host: "bergen-towns.vercel.app", queryTown: "not-a-town" })
    ).toBe("ridgewood");
  });

  it("ignores invalid cookie slugs", () => {
    expect(
      resolveSlug({
        host: "bergen-towns.vercel.app",
        cookieTown: "not-a-town",
      })
    ).toBe("ridgewood");
  });

  it("strips port from hostname", () => {
    expect(resolveSlug({ host: "wyckoff.info:3000" })).toBe("wyckoff");
  });

  it("cookie preserves town across section navigation", () => {
    const slug1 = resolveSlug({
      host: "bergen-towns.vercel.app",
      queryTown: "fair-lawn",
    });
    expect(slug1).toBe("fair-lawn");

    const slug2 = resolveSlug({
      host: "bergen-towns.vercel.app",
      cookieTown: "fair-lawn",
    });
    expect(slug2).toBe("fair-lawn");
  });
});
