import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import { School } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Schools in ${meta.name}` };
}

function SchoolCard({ school }: { school: School }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-primary">{school.name}</h3>
          <p className="text-sm text-gray-500">
            Grades {school.grades} &middot;{" "}
            {school.type.charAt(0).toUpperCase() + school.type.slice(1)}
          </p>
        </div>
        {school.rating && (
          <div className="bg-primary text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
            {school.rating}
          </div>
        )}
      </div>
      {school.enrollment && (
        <p className="text-sm text-gray-500 mt-1">
          ~{school.enrollment.toLocaleString()} students
        </p>
      )}
      {school.notes && (
        <p className="text-sm text-gray-600 mt-2">{school.notes}</p>
      )}
    </div>
  );
}

export default async function SchoolsPage() {
  const { meta, schools } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">Schools in {meta.name}</h1>
      <p className="mt-2 text-gray-600">
        School district: <strong>{schools.publicDistrict}</strong>
      </p>

      <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">
        Public Schools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schools.publicSchools.map((s, i) => (
          <SchoolCard key={i} school={s} />
        ))}
      </div>

      {schools.privateSchools.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">
            Private Schools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schools.privateSchools.map((s, i) => (
              <SchoolCard key={i} school={s} />
            ))}
          </div>
        </>
      )}

      {schools.nearbyHigherEd.length > 0 && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-3">
            Nearby Higher Education
          </h2>
          <ul className="space-y-1">
            {schools.nearbyHigherEd.map((s, i) => (
              <li key={i} className="text-gray-700">{s}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
