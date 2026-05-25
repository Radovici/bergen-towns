import { Metadata } from "next";
import { getTownData } from "@/lib/towns";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Emergency Information - ${meta.name}` };
}

export default async function EmergencyPage() {
  const { meta, emergency } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">
        Emergency Information - {meta.name}
      </h1>

      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-red-700">Emergency: Call 911</p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-primary mb-2">Police</h2>
          <p className="text-sm text-gray-500">Non-Emergency</p>
          <a href={`tel:${emergency.police.nonEmergency}`} className="text-lg font-medium">
            {emergency.police.nonEmergency}
          </a>
          {emergency.police.address && (
            <p className="text-xs text-gray-400 mt-2">{emergency.police.address}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-primary mb-2">Fire</h2>
          <p className="text-sm text-gray-500">Non-Emergency</p>
          <a href={`tel:${emergency.fire.nonEmergency}`} className="text-lg font-medium">
            {emergency.fire.nonEmergency}
          </a>
          {emergency.fire.address && (
            <p className="text-xs text-gray-400 mt-2">{emergency.fire.address}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-primary mb-2">EMS</h2>
          <p className="text-sm text-gray-500">Non-Emergency</p>
          <a href={`tel:${emergency.ems.nonEmergency}`} className="text-lg font-medium">
            {emergency.ems.nonEmergency}
          </a>
          {emergency.ems.address && (
            <p className="text-xs text-gray-400 mt-2">{emergency.ems.address}</p>
          )}
        </div>
      </div>

      {emergency.hospitals.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Nearby Hospitals</h2>
          <div className="space-y-3">
            {emergency.hospitals.map((h, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{h.name}</h3>
                  <p className="text-sm text-gray-500">{h.address}</p>
                  <a href={`tel:${h.phone}`} className="text-sm font-medium">
                    {h.phone}
                  </a>
                </div>
                {h.distanceMiles && (
                  <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                    ~{h.distanceMiles} mi
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {emergency.utilities.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Utility Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergency.utilities.map((u, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-primary">{u.service}</h3>
                <p className="text-sm text-gray-600">{u.provider}</p>
                <a href={`tel:${u.phone}`} className="text-sm font-medium">
                  {u.phone}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {emergency.importantNumbers.length > 0 && (
        <section className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-3">
            Other Important Numbers
          </h2>
          <div className="space-y-2">
            {emergency.importantNumbers.map((n, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{n.label}</span>
                <a href={`tel:${n.number}`} className="font-medium">
                  {n.number}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
