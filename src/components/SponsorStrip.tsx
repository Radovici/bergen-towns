import type { TownSponsorEntry } from "@/lib/sponsor-types";
import SponsorCard from "./SponsorCard";
import Link from "next/link";

export default function SponsorStrip({
  sponsors,
}: {
  sponsors: TownSponsorEntry[];
}) {
  if (sponsors.length === 0) return null;

  return (
    <div className="border-t border-gray-200 py-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
          Community Sponsors
        </p>
        <Link
          href="/sponsorship"
          className="text-[10px] text-primary hover:underline"
        >
          Become a Sponsor
        </Link>
      </div>
      <div className="flex flex-wrap gap-1">
        {sponsors.map((s) => (
          <SponsorCard key={s.id} sponsor={s} variant="compact" />
        ))}
      </div>
    </div>
  );
}
