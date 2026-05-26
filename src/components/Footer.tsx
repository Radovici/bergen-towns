import { TownMeta } from "@/lib/types";
import type { TownSponsorEntry } from "@/lib/sponsor-types";
import { TOWN_REGISTRY, getTownUrl } from "@/lib/town-registry";
import SponsorStrip from "./SponsorStrip";

const allTowns = Object.values(TOWN_REGISTRY).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export default function Footer({
  town,
  sponsors = [],
}: {
  town: TownMeta;
  sponsors?: TownSponsorEntry[];
}) {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {sponsors.length > 0 && <SponsorStrip sponsors={sponsors} />}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-2">{town.name}</h3>
            <p className="text-sm">
              Community information for residents, buyers, and visitors of{" "}
              {town.fullName}, Bergen County, New Jersey.
            </p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-2">
              All Bergen County Towns
            </h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {allTowns.map((t) => (
                <a
                  key={t.slug}
                  href={getTownUrl(t.slug)}
                  className={`hover:text-white transition-colors no-underline ${
                    t.slug === town.slug
                      ? "text-white font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {t.name}
                  {t.domain ? "*" : ""}
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">* has dedicated domain</p>
          </div>
        </div>
        <div className="mt-6 bg-gray-800 rounded p-4">
          <h3 className="text-white font-semibold mb-1 text-sm">Disclaimer</h3>
          <p className="text-xs text-gray-500">
            This site is independently operated and is not affiliated with any
            municipal government. Information is provided for general reference
            and may not be current. Please verify with official sources.
          </p>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-4 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} Bergen County Town Information
          </p>
        </div>
      </div>
    </footer>
  );
}
