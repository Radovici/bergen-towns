"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/lib/constants";

export default function Nav({ townName }: { townName: string }) {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <ul className="flex gap-1 overflow-x-auto py-1 -mb-px">
          {SECTIONS.map((section) => {
            const isActive =
              section.slug === "/"
                ? pathname === "/"
                : pathname.startsWith(section.slug);
            return (
              <li key={section.slug}>
                <Link
                  href={section.slug}
                  className={`block px-3 py-2 text-sm rounded-t whitespace-nowrap transition-colors no-underline ${
                    isActive
                      ? "bg-primary text-white font-medium"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                  aria-label={`${section.label} - ${townName}`}
                >
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
