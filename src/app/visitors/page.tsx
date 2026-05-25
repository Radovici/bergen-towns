import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import { Place } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Visit ${meta.name} - Things to Do` };
}

function PlaceCard({ place }: { place: Place }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-primary">{place.name}</h3>
      {place.category && (
        <span className="inline-block mt-1 text-xs bg-primary-light text-primary px-2 py-0.5 rounded">
          {place.category}
        </span>
      )}
      <p className="text-sm text-gray-600 mt-2">{place.description}</p>
      {place.address && (
        <p className="text-xs text-gray-400 mt-1">{place.address}</p>
      )}
    </div>
  );
}

export default async function VisitorsPage() {
  const { meta, visitors } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">Visit {meta.name}</h1>
      <p className="mt-2 text-gray-600">
        Restaurants, parks, events, and attractions in {meta.name}, Bergen County.
      </p>

      {visitors.restaurants.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visitors.restaurants.map((r, i) => (
              <PlaceCard key={i} place={r} />
            ))}
          </div>
        </section>
      )}

      {visitors.parks.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Parks & Recreation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visitors.parks.map((p, i) => (
              <PlaceCard key={i} place={p} />
            ))}
          </div>
        </section>
      )}

      {visitors.attractions.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Attractions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visitors.attractions.map((a, i) => (
              <PlaceCard key={i} place={a} />
            ))}
          </div>
        </section>
      )}

      {visitors.events.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Annual Events</h2>
          <div className="space-y-3">
            {visitors.events.map((e, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-primary">{e.name}</h3>
                <p className="text-sm text-accent font-medium">{e.when}</p>
                <p className="text-sm text-gray-600 mt-1">{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {visitors.shoppingAreas.length > 0 && (
        <section className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-3">Shopping Areas</h2>
          <ul className="space-y-1">
            {visitors.shoppingAreas.map((s, i) => (
              <li key={i} className="text-gray-700">{s}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
