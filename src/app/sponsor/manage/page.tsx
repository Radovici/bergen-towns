import { Metadata } from "next";
import { getSponsorByToken } from "@/lib/sponsor-storage";
import { TIERS } from "@/lib/sponsorship";
import ProfileEditor from "./profile-editor";
import ImageUploader from "./image-uploader";
import ContentGenerator from "./content-generator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sponsor Dashboard",
  robots: "noindex, nofollow",
};

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return (
      <article className="max-w-lg mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Sponsor Dashboard
        </h1>
        <p className="text-gray-500">
          Missing management token. Use the link from your confirmation email or
          checkout success page.
        </p>
      </article>
    );
  }

  const profile = await getSponsorByToken(token);

  if (!profile) {
    return (
      <article className="max-w-lg mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Invalid or Expired Link
        </h1>
        <p className="text-gray-500">
          This management link is no longer valid. If you&apos;re an active
          sponsor, contact us for a new link.
        </p>
      </article>
    );
  }

  const tier = TIERS.find((t) => t.id === profile.tierId);

  return (
    <article className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sponsor Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            {profile.townName} &middot; {tier?.name || profile.tierName}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            profile.status === "active"
              ? "bg-green-100 text-green-800"
              : profile.status === "past_due"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {profile.status}
        </span>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/?sponsor_preview=${token}`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium no-underline hover:bg-blue-700 transition-colors"
        >
          Preview on Site &rarr;
        </Link>
        <Link
          href={`/services?sponsor_preview=${token}`}
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium no-underline hover:bg-gray-50 transition-colors"
        >
          Preview in Services
        </Link>
      </div>

      {profile.status === "canceled" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">
            Your subscription has been canceled. Your listing will be removed.
            <Link
              href="/sponsorship"
              className="ml-2 underline font-medium"
            >
              Resubscribe
            </Link>
          </p>
        </div>
      )}

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Business Profile
        </h2>
        <ProfileEditor
          token={token}
          initialProfile={{
            businessName: profile.businessName,
            description: profile.description,
            website: profile.website || "",
            phone: profile.phone || "",
            category: profile.category || "",
          }}
        />
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Logo &amp; Banner
        </h2>
        <ImageUploader
          token={token}
          currentLogo={profile.logoUrl}
          currentBanner={profile.bannerUrl}
        />
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          AI Content Assistant
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Describe your business and what you&apos;d like your listing to say.
          Our AI will generate professional copy for you.
        </p>
        <ContentGenerator
          token={token}
          townName={profile.townName}
          tierId={profile.tierId}
        />
      </section>

      <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Your Tier: {tier?.name}
        </h2>
        <ul className="mt-2 space-y-1">
          {tier?.features.map((f) => (
            <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-green-500 mt-0.5">&#10003;</span>
              {f}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
