"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { SECTIONS } from "@/lib/constants";

export default function Nav({ townName }: { townName: string }) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  function scroll(dir: number) {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-0 bottom-0 z-10 w-8 flex items-center justify-center bg-gradient-to-r from-white via-white/90 to-transparent border-none cursor-pointer"
            aria-label="Scroll tabs left"
          >
            <span className="text-gray-400 text-lg font-bold">&lsaquo;</span>
          </button>
        )}
        <ul
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto py-1 -mb-px scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {SECTIONS.map((section) => {
            const isActive =
              section.slug === "/"
                ? pathname === "/"
                : pathname.startsWith(section.slug);
            return (
              <li key={section.slug}>
                <Link
                  href={section.slug}
                  className={`block px-3 py-2 text-sm whitespace-nowrap transition-colors no-underline ${
                    isActive
                      ? "border-b-2 border-primary text-primary font-semibold bg-gray-50"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  aria-label={`${section.label} - ${townName}`}
                >
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-0 bottom-0 z-10 w-8 flex items-center justify-center bg-gradient-to-l from-white via-white/90 to-transparent border-none cursor-pointer"
            aria-label="Scroll tabs right"
          >
            <span className="text-gray-400 text-lg font-bold">&rsaquo;</span>
          </button>
        )}
      </div>
    </nav>
  );
}
