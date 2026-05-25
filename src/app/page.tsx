import { getTownData } from "@/lib/towns";
import InfoCard from "@/components/InfoCard";
import BergenCountyMap from "@/components/BergenCountyMap";

export default async function HomePage() {
  const { meta, overview } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">
        Welcome to {meta.name}
      </h1>
      <p className="mt-2 text-lg text-gray-600">{overview.tagline}</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard label="Population" value={overview.population.toLocaleString()} />
        <InfoCard label="Area" value={`${overview.areaSqMi} sq mi`} />
        <InfoCard label="School District" value={overview.schoolDistrict} />
        <InfoCard label="Government" value={overview.governmentType} />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard label="Incorporated" value={overview.incorporated} />
        <InfoCard label="Elevation" value={overview.elevation} />
        <InfoCard label="ZIP Code(s)" value={meta.zipCodes.join(", ")} />
      </div>

      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-3">About {meta.name}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {overview.description}
        </p>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-3">Highlights</h2>
        <ul className="space-y-2">
          {overview.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1 text-xs">&#9679;</span>
              <span className="text-gray-700">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <BergenCountyMap currentTown={meta.slug} />
      </div>
    </article>
  );
}
