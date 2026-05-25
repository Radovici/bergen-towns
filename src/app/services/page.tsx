import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import { ServiceInfo } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Municipal Services in ${meta.name}` };
}

function ServiceSection({ service }: { service: ServiceInfo }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-primary mb-2">{service.title}</h2>
      <p className="text-gray-700 mb-3">{service.description}</p>
      {service.details.length > 0 && (
        <ul className="space-y-1 mb-3">
          {service.details.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-1 text-xs">&#9679;</span>
              <span className="text-gray-600">{d}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-4 text-sm">
        {service.contactPhone && (
          <a href={`tel:${service.contactPhone}`} className="font-medium">
            {service.contactPhone}
          </a>
        )}
        {service.contactUrl && (
          <a
            href={service.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium"
          >
            Website
          </a>
        )}
      </div>
    </div>
  );
}

export default async function ServicesPage() {
  const { meta, services } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">
        Municipal Services in {meta.name}
      </h1>
      <div className="mt-6 space-y-4">
        <ServiceSection service={services.trashCollection} />
        <ServiceSection service={services.recycling} />
        <ServiceSection service={services.waterSewer} />
        <ServiceSection service={services.permits} />
        <ServiceSection service={services.parking} />
        {services.additionalServices.map((s, i) => (
          <ServiceSection key={i} service={s} />
        ))}
      </div>
    </article>
  );
}
