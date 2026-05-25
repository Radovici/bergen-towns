import { NextRequest, NextResponse } from "next/server";
import { TOWN_REGISTRY } from "./lib/town-registry";

const TOWN_DOMAINS: Record<string, string> = {
  "allendale.info": "allendale",
  "www.allendale.info": "allendale",
  "fortlee.info": "fort-lee",
  "www.fortlee.info": "fort-lee",
  "franklinlakes.info": "franklin-lakes",
  "www.franklinlakes.info": "franklin-lakes",
  "hackensack.info": "hackensack",
  "www.hackensack.info": "hackensack",
  "paramus.info": "paramus",
  "www.paramus.info": "paramus",
  "ridgewood.info": "ridgewood",
  "www.ridgewood.info": "ridgewood",
  "tenafly.info": "tenafly",
  "www.tenafly.info": "tenafly",
  "teterboro.info": "teterboro",
  "www.teterboro.info": "teterboro",
  "wyckoff.info": "wyckoff",
  "www.wyckoff.info": "wyckoff",
};

const COOKIE_NAME = "bergen-town";

function isValidSlug(slug: string): boolean {
  return slug in TOWN_REGISTRY;
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const host = hostname.split(":")[0];

  const fromDomain = TOWN_DOMAINS[host];
  const fromQuery = request.nextUrl.searchParams.get("town");
  const fromCookie = request.cookies.get(COOKIE_NAME)?.value;

  const townSlug =
    fromDomain ??
    (fromQuery && isValidSlug(fromQuery) ? fromQuery : null) ??
    (fromCookie && isValidSlug(fromCookie) ? fromCookie : null) ??
    "ridgewood";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-town-slug", townSlug);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!fromDomain && townSlug !== fromCookie) {
    response.cookies.set(COOKIE_NAME, townSlug, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og/).*)"],
};
