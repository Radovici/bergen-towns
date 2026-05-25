import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import { OrdinanceInfo } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Rules & Ordinances in ${meta.name}` };
}

function OrdinanceSection({ ordinance }: { ordinance: OrdinanceInfo }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-primary mb-2">{ordinance.title}</h2>
      <p className="text-gray-700 mb-3">{ordinance.summary}</p>
      {ordinance.keyRules.length > 0 && (
        <ul className="space-y-1">
          {ordinance.keyRules.map((rule, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-1 text-xs">&#9679;</span>
              <span className="text-gray-600">{rule}</span>
            </li>
          ))}
        </ul>
      )}
      {ordinance.source && (
        <p className="mt-3 text-xs text-gray-400">Source: {ordinance.source}</p>
      )}
    </div>
  );
}

export default async function RulesPage() {
  const { meta, rules } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">
        Rules & Ordinances in {meta.name}
      </h1>
      <p className="mt-2 text-gray-600">
        Key local ordinances and regulations. Always check with the municipal
        clerk for the most current rules.
      </p>
      <div className="mt-6 space-y-4">
        <OrdinanceSection ordinance={rules.noise} />
        <OrdinanceSection ordinance={rules.propertyMaintenance} />
        <OrdinanceSection ordinance={rules.pets} />
        <OrdinanceSection ordinance={rules.parking} />
        <OrdinanceSection ordinance={rules.rentals} />
        {rules.other.map((o, i) => (
          <OrdinanceSection key={i} ordinance={o} />
        ))}
      </div>
    </article>
  );
}
