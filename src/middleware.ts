import { NextRequest, NextResponse } from "next/server";

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

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const host = hostname.split(":")[0];

  const townSlug =
    TOWN_DOMAINS[host] ??
    request.nextUrl.searchParams.get("town") ??
    "ridgewood";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-town-slug", townSlug);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og/).*)"],
};
