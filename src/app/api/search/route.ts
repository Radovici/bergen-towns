import { NextRequest, NextResponse } from "next/server";
import { buildSearchIndex, SearchEntry } from "@/lib/search-index";

let cachedIndex: SearchEntry[] | null = null;

function getIndex(): SearchEntry[] {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex();
  }
  return cachedIndex;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase().trim();
  const currentTown = request.nextUrl.searchParams.get("town") || "";

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const index = getIndex();
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = index
    .map((entry) => {
      const haystack = `${entry.town} ${entry.section} ${entry.title} ${entry.text}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (!haystack.includes(term)) return null;
        if (entry.town.toLowerCase().includes(term)) score += 10;
        if (entry.title.toLowerCase().includes(term)) score += 5;
        if (entry.text.toLowerCase().includes(term)) score += 1;
      }
      if (entry.townSlug === currentTown) score += 50;
      return { entry, score };
    })
    .filter((r): r is { entry: SearchEntry; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((r) => ({
      town: r.entry.town,
      townSlug: r.entry.townSlug,
      townUrl: r.entry.townUrl,
      section: r.entry.section,
      sectionPath: r.entry.sectionPath,
      title: r.entry.title,
      snippet: r.entry.text.substring(0, 200),
      isCurrentTown: r.entry.townSlug === currentTown,
    }));

  return NextResponse.json(scored);
}
