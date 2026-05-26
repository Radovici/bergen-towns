import type { TownSponsorEntry } from "@/lib/sponsor-types";

export default function SponsorCard({
  sponsor,
  variant = "standard",
}: {
  sponsor: TownSponsorEntry;
  variant?: "compact" | "standard" | "featured";
}) {
  if (variant === "compact") {
    return (
      <a
        href={sponsor.website || "#"}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded transition-colors"
      >
        {sponsor.logoUrl && (
          <img
            src={sponsor.logoUrl}
            alt=""
            className="w-5 h-5 rounded object-cover"
          />
        )}
        <span className="text-xs text-gray-500 truncate">
          {sponsor.businessName}
        </span>
      </a>
    );
  }

  if (variant === "featured") {
    return (
      <div className="border-2 border-primary/20 bg-primary/5 rounded-xl p-6 space-y-3">
        {sponsor.bannerUrl && (
          <img
            src={sponsor.bannerUrl}
            alt=""
            className="w-full h-32 object-cover rounded-lg"
          />
        )}
        <div className="flex items-start gap-4">
          {sponsor.logoUrl && (
            <img
              src={sponsor.logoUrl}
              alt=""
              className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
            />
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {sponsor.businessName}
            </h3>
            {sponsor.category && (
              <span className="text-xs text-primary font-medium">
                {sponsor.category}
              </span>
            )}
            {sponsor.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                {sponsor.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-primary hover:underline"
            >
              Visit Website
            </a>
          )}
          {sponsor.phone && (
            <a href={`tel:${sponsor.phone}`} className="text-gray-500">
              {sponsor.phone}
            </a>
          )}
        </div>
        {sponsor.profileCardHtml && (
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: sponsor.profileCardHtml }}
          />
        )}
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
          Sponsored
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-start gap-3">
      {sponsor.logoUrl && (
        <img
          src={sponsor.logoUrl}
          alt=""
          className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
        />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-gray-900 text-sm truncate">
          {sponsor.businessName}
        </h3>
        {sponsor.category && (
          <span className="text-xs text-gray-400">{sponsor.category}</span>
        )}
        {sponsor.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {sponsor.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs">
          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-primary hover:underline"
            >
              Website
            </a>
          )}
          {sponsor.phone && (
            <a href={`tel:${sponsor.phone}`} className="text-gray-400">
              {sponsor.phone}
            </a>
          )}
        </div>
      </div>
      <span className="text-[10px] text-gray-300 uppercase shrink-0">
        Sponsor
      </span>
    </div>
  );
}
