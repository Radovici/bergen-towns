import { TownMeta } from "@/lib/types";
import { ALL_TOWN_SLUGS } from "@/lib/towns";

const TOWN_DISPLAY: Record<string, { name: string; domain: string }> = {
  allendale: { name: "Allendale", domain: "allendale.info" },
  "fort-lee": { name: "Fort Lee", domain: "fortlee.info" },
  "franklin-lakes": { name: "Franklin Lakes", domain: "franklinlakes.info" },
  hackensack: { name: "Hackensack", domain: "hackensack.info" },
  paramus: { name: "Paramus", domain: "paramus.info" },
  ridgewood: { name: "Ridgewood", domain: "ridgewood.info" },
  tenafly: { name: "Tenafly", domain: "tenafly.info" },
  teterboro: { name: "Teterboro", domain: "teterboro.info" },
  wyckoff: { name: "Wyckoff", domain: "wyckoff.info" },
};

export default function Footer({ town }: { town: TownMeta }) {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-2">{town.name}</h3>
            <p className="text-sm">
              Community information for residents, buyers, and visitors of{" "}
              {town.fullName}, Bergen County, New Jersey.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Bergen County Towns</h3>
            <ul className="text-sm space-y-1">
              {ALL_TOWN_SLUGS.filter((s) => s !== town.slug).map((slug) => {
                const t = TOWN_DISPLAY[slug];
                return (
                  <li key={slug}>
                    <a
                      href={`https://${t.domain}`}
                      className="text-gray-400 hover:text-white transition-colors no-underline"
                    >
                      {t.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Disclaimer</h3>
            <p className="text-sm">
              This site is independently operated and is not affiliated with any
              municipal government. Information is provided for general reference
              and may not be current. Please verify with official sources.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-4 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} {town.domain} &mdash; Bergen County Community Information</p>
        </div>
      </div>
    </footer>
  );
}
