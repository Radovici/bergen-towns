export interface SponsorshipTier {
  id: string;
  name: string;
  price: string;
  priceCents: number;
  interval: "month";
  features: string[];
  highlight: boolean;
}

export const TIERS: SponsorshipTier[] = [
  {
    id: "founders_special",
    name: "Founder's Special",
    price: "$1/mo",
    priceCents: 100,
    interval: "month",
    features: [
      "Founding sponsor recognition",
      "Business listing on your town's page",
      "Name and link in the Services section",
      "Listed as a community sponsor in the footer",
    ],
    highlight: true,
  },
  {
    id: "community_sponsor",
    name: "Community Sponsor",
    price: "$99/mo",
    priceCents: 9900,
    interval: "month",
    features: [
      "Business listing on your town's page",
      "Name and link in the Services section",
      "Listed as a community sponsor in the footer",
    ],
    highlight: false,
  },
  {
    id: "town_partner",
    name: "Town Partner",
    price: "$299/mo",
    priceCents: 29900,
    interval: "month",
    features: [
      "Everything in Community Sponsor",
      "Featured placement across all 9 sections",
      "Logo in the header area of your town's site",
      "Priority listing in search results",
      "Custom business profile card",
    ],
    highlight: false,
  },
  {
    id: "county_partner",
    name: "County Partner",
    price: "$799/mo",
    priceCents: 79900,
    interval: "month",
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

export const OPPORTUNITIES = [
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
