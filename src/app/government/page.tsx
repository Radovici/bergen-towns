import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import ContactCard from "@/components/ContactCard";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Local Government - ${meta.name}` };
}

export default async function GovernmentPage() {
  const { meta, government } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">
        Local Government - {meta.name}
      </h1>
      <p className="mt-2 text-gray-600">{government.governingBody}</p>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Mayor</h2>
        <div>
          <p className="text-lg font-medium">{government.mayor.name}</p>
          <p className="text-sm text-gray-500">{government.mayor.title}</p>
          {government.mayor.term && (
            <p className="text-sm text-gray-400">Term: {government.mayor.term}</p>
          )}
        </div>
      </div>

      {government.council.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Council</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {government.council.map((c, i) => (
              <div key={i} className="border border-gray-100 rounded p-3">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-500">{c.title}</p>
                {c.term && (
                  <p className="text-xs text-gray-400">Term: {c.term}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-2">Meetings</h2>
          <p className="text-gray-700">{government.meetingSchedule}</p>
          <p className="text-sm text-gray-500 mt-2">{government.meetingLocation}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-2">Municipal Website</h2>
          <a
            href={government.municipalWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium break-all"
          >
            {government.municipalWebsite}
          </a>
        </div>
      </div>

      {government.importantContacts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Municipal Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {government.importantContacts.map((c, i) => (
              <ContactCard
                key={i}
                title={c.department}
                phone={c.phone}
                email={c.email}
                hours={c.hours}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
