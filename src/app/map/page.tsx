import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import BergenMap from "@/components/BergenMap";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Bergen County Map - ${meta.name}` };
}

export default async function MapPage() {
  const { meta } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">Bergen County Map</h1>
      <p className="mt-2 text-gray-600">
        Interactive map of all 70 Bergen County municipalities with major roads,
        landmarks, and points of interest. Click any town to explore.
      </p>
      <div className="mt-6">
        <BergenMap currentTown={meta.slug} />
      </div>
    </article>
  );
}
