import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import InfoCard from "@/components/InfoCard";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Real Estate & Taxes in ${meta.name}` };
}

export default async function RealEstatePage() {
  const { meta, realEstate } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">
        Real Estate & Taxes in {meta.name}
      </h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard label="Median Home Price" value={realEstate.medianHomePrice} />
        <InfoCard label="Property Tax Rate" value={realEstate.propertyTaxRate} />
        <InfoCard label="Avg. Annual Property Tax" value={realEstate.averagePropertyTax} />
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-3">Assessment Information</h2>
        <p className="text-gray-700 leading-relaxed">{realEstate.assessmentInfo}</p>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-3">Recent Trends</h2>
        <p className="text-gray-700 leading-relaxed">{realEstate.recentTrends}</p>
      </div>

      {realEstate.neighborhoodNotes.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-3">Neighborhood Notes</h2>
          <ul className="space-y-2">
            {realEstate.neighborhoodNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-1 text-xs">&#9679;</span>
                <span className="text-gray-700">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-sm text-gray-400">
        Data reflects estimates as of {realEstate.medianPriceYear}. Verify with local tax assessor.
      </p>
    </article>
  );
}
