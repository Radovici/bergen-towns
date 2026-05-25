"use client";

import { useState } from "react";

interface TownPin {
  slug: string;
  name: string;
  domain: string;
  x: number;
  y: number;
}

const TOWNS: TownPin[] = [
  { slug: "allendale", name: "Allendale", domain: "allendale.info", x: 148, y: 72 },
  { slug: "franklin-lakes", name: "Franklin Lakes", domain: "franklinlakes.info", x: 115, y: 115 },
  { slug: "wyckoff", name: "Wyckoff", domain: "wyckoff.info", x: 158, y: 135 },
  { slug: "ridgewood", name: "Ridgewood", domain: "ridgewood.info", x: 178, y: 102 },
  { slug: "paramus", name: "Paramus", domain: "paramus.info", x: 210, y: 170 },
  { slug: "hackensack", name: "Hackensack", domain: "hackensack.info", x: 240, y: 200 },
  { slug: "tenafly", name: "Tenafly", domain: "tenafly.info", x: 270, y: 240 },
  { slug: "fort-lee", name: "Fort Lee", domain: "fortlee.info", x: 310, y: 290 },
  { slug: "teterboro", name: "Teterboro", domain: "teterboro.info", x: 225, y: 235 },
];

export default function BergenCountyMap({ currentTown }: { currentTown?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-primary mb-4">Bergen County Towns</h2>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Map */}
        <div className="relative flex-shrink-0">
          <svg
            viewBox="0 0 400 420"
            className="w-full max-w-[400px]"
            role="img"
            aria-label="Map of Bergen County, New Jersey showing our featured towns"
          >
            {/* Bergen County outline (simplified polygon) */}
            <path
              d="M 80,30 L 120,15 L 180,10 L 240,15 L 290,30 L 320,60 L 340,100 L 350,150 L 345,200 L 340,250 L 335,300 L 330,330 L 320,360 L 300,380 L 280,390 L 250,395 L 220,390 L 190,380 L 160,360 L 135,330 L 115,290 L 100,250 L 90,200 L 85,150 L 80,100 Z"
              fill="#e8f5e9"
              stroke="#4caf50"
              strokeWidth="2"
              opacity="0.5"
            />
            {/* County label */}
            <text x="200" y="400" textAnchor="middle" className="text-xs" fill="#999" fontFamily="sans-serif">
              Bergen County, NJ
            </text>

            {/* Hudson River (east side) */}
            <path
              d="M 340,100 Q 360,150 355,200 Q 350,260 340,320 Q 335,350 320,380"
              fill="none"
              stroke="#90caf9"
              strokeWidth="3"
              opacity="0.6"
            />
            <text x="365" y="240" fill="#64b5f6" fontSize="8" fontFamily="sans-serif" transform="rotate(80,365,240)">
              Hudson River
            </text>

            {/* Town pins */}
            {TOWNS.map((town) => {
              const isActive = town.slug === currentTown;
              const isHovered = town.slug === hovered;
              const pinSize = isActive ? 10 : isHovered ? 9 : 7;
              return (
                <g key={town.slug}>
                  <a
                    href={`https://${town.domain}`}
                    target={isActive ? undefined : "_self"}
                  >
                    {/* Pin shadow */}
                    <circle
                      cx={town.x}
                      cy={town.y + 1}
                      r={pinSize + 1}
                      fill="rgba(0,0,0,0.15)"
                    />
                    {/* Pin circle */}
                    <circle
                      cx={town.x}
                      cy={town.y}
                      r={pinSize}
                      fill={isActive ? "var(--town-primary, #1a365d)" : isHovered ? "var(--town-accent, #2b6cb0)" : "#fff"}
                      stroke={isActive ? "var(--town-primary, #1a365d)" : "#666"}
                      strokeWidth={isActive ? 3 : 2}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHovered(town.slug)}
                      onMouseLeave={() => setHovered(null)}
                    />
                    {/* Town label */}
                    <text
                      x={town.x}
                      y={town.y - pinSize - 4}
                      textAnchor="middle"
                      fontSize={isActive || isHovered ? 11 : 9}
                      fontWeight={isActive || isHovered ? "bold" : "normal"}
                      fill={isActive ? "var(--town-primary, #1a365d)" : "#333"}
                      fontFamily="sans-serif"
                      className="pointer-events-none"
                    >
                      {town.name}
                    </text>
                  </a>
                </g>
              );
            })}

            {/* NYC arrow indicator */}
            <text x="350" y="370" fill="#999" fontSize="9" fontFamily="sans-serif" textAnchor="end">
              NYC &rarr;
            </text>
          </svg>
        </div>

        {/* Town list (for mobile accessibility and SEO) */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Our Towns
          </h3>
          <ul className="space-y-2">
            {TOWNS.map((town) => {
              const isActive = town.slug === currentTown;
              return (
                <li key={town.slug}>
                  <a
                    href={`https://${town.domain}`}
                    className={`block px-3 py-2 rounded text-sm transition-colors no-underline ${
                      isActive
                        ? "bg-gray-100 text-primary font-semibold border-l-3 border-primary"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                    }`}
                    onMouseEnter={() => setHovered(town.slug)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {town.name}
                    <span className="text-xs opacity-60 ml-2">{town.domain}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
