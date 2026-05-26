import { Metadata } from "next";
import { getTownData } from "@/lib/towns";
import { TIERS, OPPORTUNITIES } from "@/lib/sponsorship";
import { CheckoutButton } from "./checkout-button";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Sponsorship & Partnerships - ${meta.name}` };
}

export default async function SponsorshipPage() {
  const { meta } = await getTownData();
  return (
    <article>
      <h1 className="text-3xl font-bold text-primary">
        Sponsorship & Partnerships
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Connect your business with residents, buyers, and visitors across Bergen
        County&apos;s 70 municipalities.
      </p>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-2">
          Why Partner With Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-4">
            <p className="text-3xl font-bold text-primary">70</p>
            <p className="text-sm text-gray-500">Town Sites</p>
          </div>
          <div className="text-center p-4">
            <p className="text-3xl font-bold text-primary">930K+</p>
            <p className="text-sm text-gray-500">Bergen County Residents</p>
          </div>
          <div className="text-center p-4">
            <p className="text-3xl font-bold text-primary">9</p>
            <p className="text-sm text-gray-500">
              Dedicated .info Domains
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-primary mt-10 mb-4">
        Sponsorship Tiers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`bg-white rounded-lg border-2 p-6 flex flex-col ${
              tier.highlight
                ? "border-primary shadow-lg relative"
                : "border-gray-200"
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
                Limited Offer
              </span>
            )}
            <h3 className="text-lg font-semibold text-primary">{tier.name}</h3>
            <p className="text-2xl font-bold mt-2">{tier.price}</p>
            <ul className="mt-4 space-y-2 flex-1">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5 font-bold">+</span>
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <CheckoutButton
              tierId={tier.id}
              townSlug={meta.slug}
              townName={meta.name}
            />
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-primary mt-10 mb-4">
        Partnership Opportunities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPPORTUNITIES.map((opp) => (
          <div
            key={opp.title}
            className="bg-white rounded-lg border border-gray-200 p-5"
          >
            <h3 className="font-semibold text-primary">{opp.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{opp.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-primary/5 rounded-lg border border-primary/20 p-6 text-center">
        <h2 className="text-xl font-semibold text-primary mb-2">
          Questions?
        </h2>
        <p className="text-gray-600 mb-4">
          Want to discuss a custom partnership for {meta.name}? Reach out
          directly.
        </p>
        <a
          href={`mailto:${meta.slug}@radovici.com?subject=Sponsorship Inquiry - ${meta.name}, Bergen County`}
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium no-underline hover:opacity-90 transition-opacity"
        >
          Contact Us
        </a>
        <p className="text-xs text-gray-400 mt-3">
          {meta.slug}@radovici.com
        </p>
      </div>
    </article>
  );
}
