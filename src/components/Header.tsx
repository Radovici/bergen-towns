import Link from "next/link";
import { TownMeta } from "@/lib/types";

export default function Header({ town }: { town: TownMeta }) {
  return (
    <header className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-white no-underline">
          <h1 className="text-xl font-bold tracking-tight">{town.name}</h1>
          <p className="text-sm opacity-80">{town.fullName}, {town.state}</p>
        </Link>
        <div className="text-right text-sm opacity-80">
          <p>Bergen County, NJ</p>
          <p>{town.zipCodes.join(", ")}</p>
        </div>
      </div>
    </header>
  );
}
