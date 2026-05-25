import Link from "next/link";
import { TownMeta } from "@/lib/types";
import SearchBar from "./SearchBar";

export default function Header({ town }: { town: TownMeta }) {
  return (
    <header className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        <Link href="/" className="text-white no-underline shrink-0">
          <h1 className="text-xl font-bold tracking-tight">{town.name}</h1>
          <p className="text-sm opacity-80">{town.fullName}</p>
        </Link>
        <div className="flex-1 hidden sm:block max-w-md">
          <SearchBar currentTown={town.slug} />
        </div>
        <div className="text-right text-sm opacity-80 shrink-0">
          <p>Bergen County, NJ</p>
          <p>{town.zipCodes.join(", ")}</p>
        </div>
      </div>
      <div className="sm:hidden max-w-6xl mx-auto px-4 pb-3">
        <SearchBar currentTown={town.slug} />
      </div>
    </header>
  );
}
