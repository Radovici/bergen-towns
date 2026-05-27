import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
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
  "bergenfield.info": "bergenfield",
  "www.bergenfield.info": "bergenfield",
  "carlstadt.info": "carlstadt",
  "www.carlstadt.info": "carlstadt",
  "demarest.info": "demarest",
  "www.demarest.info": "demarest",
  "fairlawn.info": "fair-lawn",
  "www.fairlawn.info": "fair-lawn",
  "leonia.info": "leonia",
  "www.leonia.info": "leonia",
  "lyndhurst.info": "lyndhurst",
  "www.lyndhurst.info": "lyndhurst",
  "mahwah.info": "mahwah",
  "www.mahwah.info": "mahwah",
  "maywood.info": "maywood",
  "www.maywood.info": "maywood",
  "montvale.info": "montvale",
  "www.montvale.info": "montvale",
  "moonachie.info": "moonachie",
  "www.moonachie.info": "moonachie",
  "oradell.info": "oradell",
  "www.oradell.info": "oradell",
  "uppersaddleriver.info": "upper-saddle-river",
  "www.uppersaddleriver.info": "upper-saddle-river",
};

const COOKIE_NAME = "bergen-town";

function isValidSlug(slug: string): boolean {
  return slug in TOWN_REGISTRY;
}

export async function middleware(request: NextRequest) {
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

  const sponsorPreview = request.nextUrl.searchParams.get("sponsor_preview");
  if (sponsorPreview) {
    requestHeaders.set("x-sponsor-preview", sponsorPreview);
  }

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

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      },
    );
    await supabase.auth.getUser();
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og/).*)"],
};
