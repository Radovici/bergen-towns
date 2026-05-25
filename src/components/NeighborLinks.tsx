import { getNeighbors, getTownUrl, TOWN_REGISTRY } from "@/lib/town-registry";

export default function NeighborLinks({ currentSlug }: { currentSlug: string }) {
  const neighbors = getNeighbors(currentSlug);
  const current = TOWN_REGISTRY[currentSlug];
  if (!current || neighbors.length === 0) return null;

  return (
    <div className="mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-3">
        Neighboring towns
      </span>
      <span className="inline-flex flex-wrap gap-2 mt-1">
        {neighbors.map((n) => (
          <a
            key={n.slug}
            href={getTownUrl(n.slug)}
            className="inline-block text-sm px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-colors no-underline"
          >
            {n.name}
            {n.domain && (
              <span className="ml-1 text-xs opacity-50">.info</span>
            )}
          </a>
        ))}
      </span>
    </div>
  );
}
