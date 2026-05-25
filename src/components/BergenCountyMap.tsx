"use client";

import { TOWN_REGISTRY, getTownUrl } from "@/lib/town-registry";

const allTowns = Object.values(TOWN_REGISTRY).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export default function BergenCountyMap({
  currentTown,
}: {
  currentTown?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-primary mb-1">
        All Bergen County Towns
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        70 municipalities &mdash; click any town to explore
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {allTowns.map((town) => {
          const isActive = town.slug === currentTown;
          return (
            <a
              key={town.slug}
              href={getTownUrl(town.slug)}
              className={`block px-3 py-2 rounded text-sm transition-colors no-underline ${
                isActive
                  ? "bg-gray-100 text-primary font-semibold border-l-3 border-primary"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              {town.name}
              {town.domain && (
                <span className="block text-xs text-accent opacity-70">
                  {town.domain}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
