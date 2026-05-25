import { Metadata } from "next";
import { getTownData } from "@/lib/towns";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Moving to ${meta.name} - Buyer's Guide` };
}

export default async function BuyersPage() {
  const { meta, buyers } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">
        Moving to {meta.name}
      </h1>
      <p className="mt-2 text-gray-600">
        Everything you need to know before buying in {meta.name}, Bergen County.
      </p>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-3">
          Why Move Here?
        </h2>
        <ul className="space-y-2">
          {buyers.whyMoveHere.map((reason, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1 text-xs">&#9679;</span>
              <span className="text-gray-700">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-3">
          Commute to NYC
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Primary Method</p>
            <p className="font-medium">{buyers.commuteToNYC.primaryMethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium">{buyers.commuteToNYC.duration}</p>
          </div>
          {buyers.commuteToNYC.trainStation && (
            <div>
              <p className="text-sm text-gray-500">Train Station</p>
              <p className="font-medium">{buyers.commuteToNYC.trainStation}</p>
            </div>
          )}
          {buyers.commuteToNYC.busRoutes && buyers.commuteToNYC.busRoutes.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Bus Routes</p>
              <p className="font-medium">{buyers.commuteToNYC.busRoutes.join(", ")}</p>
            </div>
          )}
        </div>
        <p className="mt-3 text-sm text-gray-600">{buyers.commuteToNYC.notes}</p>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-3">
          Cost of Living
        </h2>
        <p className="text-gray-700 mb-3">{buyers.costOfLiving.summary}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded p-3">
            <p className="text-sm text-gray-500">vs. NJ State Average</p>
            <p className="font-medium">{buyers.costOfLiving.vsStateAverage}</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-sm text-gray-500">vs. National Average</p>
            <p className="font-medium">{buyers.costOfLiving.vsNationalAverage}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Pros</h2>
          <ul className="space-y-2">
            {buyers.prosAndCons.pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-0.5">+</span>
                <span className="text-gray-700">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-3">Cons</h2>
          <ul className="space-y-2">
            {buyers.prosAndCons.cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-red-600 mt-0.5">&ndash;</span>
                <span className="text-gray-700">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
