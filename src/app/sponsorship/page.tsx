import { Metadata } from "next";
import { getTownData } from "@/lib/towns";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getTownData();
  return { title: `Sponsorship & Partnerships - ${meta.name}` };
}

const TIERS = [
  {
    name: "Community Sponsor",
    price: "$99/mo",
    features: [
      "Business listing on your town's page",
      "Name and link in the Services section",
      "Listed as a community sponsor in the footer",
    ],
    highlight: false,
  },
  {
    name: "Town Partner",
    price: "$299/mo",
    features: [
      "Everything in Community Sponsor",
      "Featured placement across all 9 sections",
      "Logo in the header area of your town's site",
      "Priority listing in search results",
      "Custom business profile card",
    ],
    highlight: true,
  },
  {
    name: "County Partner",
    price: "$799/mo",
    features: [
      "Everything in Town Partner",
      "Visibility across all 70 Bergen County town sites",
      "Featured in the county-wide town directory",
      "Sponsored content placement",
      "Monthly analytics report",
      "Cross-town promotional campaigns",
    ],
    highlight: false,
  },
];

const OPPORTUNITIES = [
  {
    title: "Local Business Listings",
    description:
      "Get your restaurant, shop, or service listed in the relevant section of your town's page. Restaurants appear in the Visitors guide, services in Municipal Services, and more.",
  },
  {
    title: "Real Estate Partnerships",
    description:
      "Real estate agents and brokers can feature listings and market data on the Real Estate & Taxes section. Ideal for agents specializing in Bergen County towns.",
  },
  {
    title: "Event Promotion",
    description:
      "Promote your local events, fundraisers, or community activities on your town's Visitors page. Reach residents and visitors actively looking for things to do.",
  },
  {
    title: "Municipal Partnerships",
    description:
      "We work with municipal governments to ensure accurate, up-to-date information. Town officials can request content updates and feature official announcements.",
  },
  {
    title: "Cross-Town Campaigns",
    description:
      "Businesses serving multiple Bergen County towns can run campaigns across all 70 municipality pages, reaching the entire county from one platform.",
  },
  {
    title: "Meridian GPS Integration",
    description:
      "Service providers can connect through our Meridian GPS platform for real-time mapping and dispatch. Show your location and availability to town residents looking for local services.",
  },
];

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`bg-white rounded-lg border-2 p-6 ${
              tier.highlight
                ? "border-primary shadow-lg relative"
                : "border-gray-200"
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-primary">{tier.name}</h3>
            <p className="text-2xl font-bold mt-2">{tier.price}</p>
            <ul className="mt-4 space-y-2">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5 font-bold">+</span>
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
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
          Get Started
        </h2>
        <p className="text-gray-600 mb-4">
          Interested in sponsoring {meta.name} or partnering across Bergen
          County? Reach out to discuss opportunities.
        </p>
        <a
          href="mailto:partnerships@bergen-towns.info?subject=Sponsorship Inquiry - Bergen County Towns"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium no-underline hover:opacity-90 transition-opacity"
        >
          Contact Us About Partnerships
        </a>
        <p className="text-xs text-gray-400 mt-3">
          partnerships@bergen-towns.info
        </p>
      </div>
    </article>
  );
}
