import Link from "next/link";
import { TownMeta } from "@/lib/types";
import type { TownSponsorEntry } from "@/lib/sponsor-types";
import SearchBar from "./SearchBar";

export default function Header({
  town,
  sponsors = [],
}: {
  town: TownMeta;
  sponsors?: TownSponsorEntry[];
}) {
  const headerSponsors = sponsors.filter(
    (s) => s.tierId === "town_partner" || s.tierId === "county_partner",
  );

  return (
    <header className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        <Link href="/" className="text-white no-underline shrink-0">
          <h1 className="text-xl font-bold tracking-tight">{town.name}</h1>
          <p className="text-sm opacity-80">{town.fullName}</p>
        </Link>
        {headerSponsors.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {headerSponsors.map((s) =>
              s.logoUrl ? (
                <a
                  key={s.id}
                  href={s.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  title={s.businessName}
                >
                  <img
                    src={s.logoUrl}
                    alt={s.businessName}
                    className="h-8 w-8 rounded object-cover border border-white/30"
                  />
                </a>
              ) : null,
            )}
          </div>
        )}
        <div className="flex-1 hidden sm:block max-w-md">
          <SearchBar currentTown={town.slug} />
        </div>
        <div className="text-right text-sm opacity-80 shrink-0 hidden md:block">
          <p>Bergen County, NJ</p>
          <p>{town.zipCodes.join(", ")}</p>
        </div>
        <Link
          href="/sponsor/login"
          className="shrink-0 text-sm font-medium text-white border border-white/40 rounded px-3 py-1.5 hover:bg-white/10 no-underline"
        >
          Sign in
        </Link>
      </div>
      <div className="sm:hidden max-w-6xl mx-auto px-4 pb-3">
        <SearchBar currentTown={town.slug} />
      </div>
    </header>
  );
}
