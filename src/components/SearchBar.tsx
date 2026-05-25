"use client";

import { useState, useEffect, useRef } from "react";

interface SearchResult {
  town: string;
  townSlug: string;
  townUrl: string;
  section: string;
  sectionPath: string;
  title: string;
  snippet: string;
  isCurrentTown: boolean;
}

export default function SearchBar({ currentTown }: { currentTown: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(value)}&town=${encodeURIComponent(currentTown)}`
        );
        const data = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="search"
        placeholder="Search all Bergen County towns..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15"
      />
      {loading && (
        <span className="absolute right-3 top-2.5 text-white/40 text-xs">...</span>
      )}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {results.map((r, i) => (
            <a
              key={i}
              href={
                r.isCurrentTown
                  ? r.sectionPath
                  : `${r.townUrl}${r.sectionPath === "/" ? "" : r.sectionPath}`
              }
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 no-underline"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {r.town}
                </span>
                <span className="text-xs text-gray-400">{r.section}</span>
                {r.isCurrentTown && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    this town
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                {r.snippet}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
