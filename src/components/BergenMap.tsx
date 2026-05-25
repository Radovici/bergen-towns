"use client";

import { useState } from "react";
import { getTownUrl, TOWN_REGISTRY } from "@/lib/town-registry";

interface TownPin {
  slug: string;
  name: string;
  x: number;
  y: number;
  pop?: string;
}

// Approximate positions mapped from lat/long to SVG coords (600x800 viewbox)
// Bergen County runs ~40.82-41.10 lat, ~-74.22 to -73.95 lon
const scaleX = (lon: number) => ((lon - -74.24) / (73.94 - 74.24)) * -600 + 600;
const scaleY = (lat: number) => ((lat - 41.12) / (40.80 - 41.12)) * 800;

const TOWNS: TownPin[] = [
  { slug: "mahwah", name: "Mahwah", x: scaleX(-74.185), y: scaleY(41.085), pop: "26K" },
  { slug: "ramsey", name: "Ramsey", x: scaleX(-74.14), y: scaleY(41.06), pop: "15K" },
  { slug: "upper-saddle-river", name: "Upper Saddle River", x: scaleX(-74.10), y: scaleY(41.065), pop: "8K" },
  { slug: "oakland", name: "Oakland", x: scaleX(-74.24), y: scaleY(41.03), pop: "13K" },
  { slug: "franklin-lakes", name: "Franklin Lakes", x: scaleX(-74.20), y: scaleY(41.02), pop: "11K" },
  { slug: "allendale", name: "Allendale", x: scaleX(-74.13), y: scaleY(41.04), pop: "7K" },
  { slug: "saddle-river", name: "Saddle River", x: scaleX(-74.10), y: scaleY(41.035), pop: "3K" },
  { slug: "waldwick", name: "Waldwick", x: scaleX(-74.12), y: scaleY(41.015), pop: "10K" },
  { slug: "ho-ho-kus", name: "Ho-Ho-Kus", x: scaleX(-74.10), y: scaleY(41.00), pop: "4K" },
  { slug: "wyckoff", name: "Wyckoff", x: scaleX(-74.17), y: scaleY(41.00), pop: "17K" },
  { slug: "midland-park", name: "Midland Park", x: scaleX(-74.14), y: scaleY(40.99), pop: "7K" },
  { slug: "ridgewood", name: "Ridgewood", x: scaleX(-74.11), y: scaleY(40.98), pop: "25K" },
  { slug: "glen-rock", name: "Glen Rock", x: scaleX(-74.13), y: scaleY(40.96), pop: "12K" },
  { slug: "fair-lawn", name: "Fair Lawn", x: scaleX(-74.13), y: scaleY(40.935), pop: "34K" },
  { slug: "paramus", name: "Paramus", x: scaleX(-74.07), y: scaleY(40.95), pop: "27K" },
  { slug: "oradell", name: "Oradell", x: scaleX(-74.04), y: scaleY(40.96), pop: "8K" },
  { slug: "river-edge", name: "River Edge", x: scaleX(-74.04), y: scaleY(40.93), pop: "12K" },
  { slug: "new-milford", name: "New Milford", x: scaleX(-74.02), y: scaleY(40.94), pop: "17K" },
  { slug: "emerson", name: "Emerson", x: scaleX(-74.03), y: scaleY(40.975), pop: "8K" },
  { slug: "westwood", name: "Westwood", x: scaleX(-74.03), y: scaleY(41.00), pop: "11K" },
  { slug: "park-ridge", name: "Park Ridge", x: scaleX(-74.04), y: scaleY(41.04), pop: "9K" },
  { slug: "woodcliff-lake", name: "Woodcliff Lake", x: scaleX(-74.06), y: scaleY(41.02), pop: "6K" },
  { slug: "hillsdale", name: "Hillsdale", x: scaleX(-74.04), y: scaleY(41.01), pop: "10K" },
  { slug: "montvale", name: "Montvale", x: scaleX(-74.05), y: scaleY(41.05), pop: "9K" },
  { slug: "river-vale", name: "River Vale", x: scaleX(-74.01), y: scaleY(41.02), pop: "10K" },
  { slug: "harrington-park", name: "Harrington Park", x: scaleX(-73.98), y: scaleY(41.01), pop: "5K" },
  { slug: "old-tappan", name: "Old Tappan", x: scaleX(-73.99), y: scaleY(41.03), pop: "6K" },
  { slug: "northvale", name: "Northvale", x: scaleX(-73.95), y: scaleY(41.035), pop: "5K" },
  { slug: "norwood", name: "Norwood", x: scaleX(-73.96), y: scaleY(41.055), pop: "6K" },
  { slug: "rockleigh", name: "Rockleigh", x: scaleX(-73.93), y: scaleY(41.06), pop: "500" },
  { slug: "alpine", name: "Alpine", x: scaleX(-73.93), y: scaleY(41.04), pop: "2K" },
  { slug: "closter", name: "Closter", x: scaleX(-73.96), y: scaleY(41.015), pop: "9K" },
  { slug: "demarest", name: "Demarest", x: scaleX(-73.96), y: scaleY(40.96), pop: "5K" },
  { slug: "haworth", name: "Haworth", x: scaleX(-73.99), y: scaleY(40.97), pop: "3K" },
  { slug: "dumont", name: "Dumont", x: scaleX(-73.99), y: scaleY(40.95), pop: "18K" },
  { slug: "cresskill", name: "Cresskill", x: scaleX(-73.96), y: scaleY(40.94), pop: "9K" },
  { slug: "tenafly", name: "Tenafly", x: scaleX(-73.96), y: scaleY(40.92), pop: "15K" },
  { slug: "bergenfield", name: "Bergenfield", x: scaleX(-74.00), y: scaleY(40.93), pop: "29K" },
  { slug: "englewood", name: "Englewood", x: scaleX(-73.97), y: scaleY(40.89), pop: "29K" },
  { slug: "englewood-cliffs", name: "Englewood Cliffs", x: scaleX(-73.95), y: scaleY(40.88), pop: "5K" },
  { slug: "teaneck", name: "Teaneck", x: scaleX(-74.01), y: scaleY(40.89), pop: "40K" },
  { slug: "hackensack", name: "Hackensack", x: scaleX(-74.04), y: scaleY(40.885), pop: "45K" },
  { slug: "maywood", name: "Maywood", x: scaleX(-74.06), y: scaleY(40.90), pop: "10K" },
  { slug: "rochelle-park", name: "Rochelle Park", x: scaleX(-74.07), y: scaleY(40.91), pop: "6K" },
  { slug: "saddle-brook", name: "Saddle Brook", x: scaleX(-74.09), y: scaleY(40.90), pop: "14K" },
  { slug: "elmwood-park", name: "Elmwood Park", x: scaleX(-74.12), y: scaleY(40.905), pop: "21K" },
  { slug: "garfield", name: "Garfield", x: scaleX(-74.11), y: scaleY(40.88), pop: "33K" },
  { slug: "lodi", name: "Lodi", x: scaleX(-74.08), y: scaleY(40.88), pop: "25K" },
  { slug: "hasbrouck-heights", name: "Hasbrouck Hts", x: scaleX(-74.07), y: scaleY(40.86), pop: "12K" },
  { slug: "wood-ridge", name: "Wood-Ridge", x: scaleX(-74.09), y: scaleY(40.85), pop: "9K" },
  { slug: "wallington", name: "Wallington", x: scaleX(-74.11), y: scaleY(40.855), pop: "12K" },
  { slug: "east-rutherford", name: "E. Rutherford", x: scaleX(-74.09), y: scaleY(40.83), pop: "10K" },
  { slug: "rutherford", name: "Rutherford", x: scaleX(-74.11), y: scaleY(40.83), pop: "18K" },
  { slug: "carlstadt", name: "Carlstadt", x: scaleX(-74.07), y: scaleY(40.83), pop: "7K" },
  { slug: "moonachie", name: "Moonachie", x: scaleX(-74.05), y: scaleY(40.84), pop: "3K" },
  { slug: "teterboro", name: "Teterboro", x: scaleX(-74.06), y: scaleY(40.855), pop: "67" },
  { slug: "south-hackensack", name: "S. Hackensack", x: scaleX(-74.045), y: scaleY(40.86), pop: "3K" },
  { slug: "little-ferry", name: "Little Ferry", x: scaleX(-74.04), y: scaleY(40.85), pop: "11K" },
  { slug: "bogota", name: "Bogota", x: scaleX(-74.03), y: scaleY(40.87), pop: "8K" },
  { slug: "ridgefield-park", name: "Ridgefield Park", x: scaleX(-74.02), y: scaleY(40.86), pop: "13K" },
  { slug: "ridgefield", name: "Ridgefield", x: scaleX(-74.01), y: scaleY(40.83), pop: "12K" },
  { slug: "palisades-park", name: "Palisades Park", x: scaleX(-73.99), y: scaleY(40.85), pop: "21K" },
  { slug: "leonia", name: "Leonia", x: scaleX(-73.99), y: scaleY(40.87), pop: "9K" },
  { slug: "fort-lee", name: "Fort Lee", x: scaleX(-73.97), y: scaleY(40.85), pop: "40K" },
  { slug: "edgewater", name: "Edgewater", x: scaleX(-73.97), y: scaleY(40.82), pop: "13K" },
  { slug: "cliffside-park", name: "Cliffside Park", x: scaleX(-73.99), y: scaleY(40.82), pop: "26K" },
  { slug: "fairview", name: "Fairview", x: scaleX(-74.00), y: scaleY(40.815), pop: "14K" },
  { slug: "lyndhurst", name: "Lyndhurst", x: scaleX(-74.12), y: scaleY(40.81), pop: "22K" },
  { slug: "north-arlington", name: "N. Arlington", x: scaleX(-74.13), y: scaleY(40.79), pop: "16K" },
  { slug: "washington-township", name: "Washington Twp", x: scaleX(-74.06), y: scaleY(41.01), pop: "10K" },
];

interface Road {
  name: string;
  type: "interstate" | "highway" | "route";
  points: [number, number][];
}

const ROADS: Road[] = [
  { name: "I-95 / GWB", type: "interstate", points: [[scaleX(-73.97), scaleY(40.85)], [scaleX(-73.955), scaleY(40.86)]] },
  { name: "GSP", type: "interstate", points: [[scaleX(-74.07), scaleY(40.82)], [scaleX(-74.07), scaleY(40.87)], [scaleX(-74.08), scaleY(40.92)], [scaleX(-74.10), scaleY(40.95)], [scaleX(-74.12), scaleY(40.98)], [scaleX(-74.14), scaleY(41.01)], [scaleX(-74.17), scaleY(41.06)], [scaleX(-74.19), scaleY(41.09)]] },
  { name: "I-80", type: "interstate", points: [[scaleX(-74.22), scaleY(40.91)], [scaleX(-74.15), scaleY(40.90)], [scaleX(-74.10), scaleY(40.89)], [scaleX(-74.04), scaleY(40.88)]] },
  { name: "Rte 4", type: "route", points: [[scaleX(-74.12), scaleY(40.89)], [scaleX(-74.07), scaleY(40.89)], [scaleX(-74.02), scaleY(40.88)], [scaleX(-73.97), scaleY(40.87)]] },
  { name: "Rte 17", type: "highway", points: [[scaleX(-74.12), scaleY(40.89)], [scaleX(-74.11), scaleY(40.92)], [scaleX(-74.10), scaleY(40.96)], [scaleX(-74.11), scaleY(41.00)], [scaleX(-74.12), scaleY(41.03)], [scaleX(-74.14), scaleY(41.08)], [scaleX(-74.17), scaleY(41.10)]] },
  { name: "Rte 208", type: "route", points: [[scaleX(-74.13), scaleY(40.94)], [scaleX(-74.16), scaleY(40.97)], [scaleX(-74.18), scaleY(41.01)], [scaleX(-74.20), scaleY(41.04)]] },
  { name: "Palisades Pkwy", type: "highway", points: [[scaleX(-73.96), scaleY(40.86)], [scaleX(-73.95), scaleY(40.90)], [scaleX(-73.94), scaleY(40.95)], [scaleX(-73.93), scaleY(41.01)], [scaleX(-73.93), scaleY(41.06)]] },
];

interface Landmark {
  name: string;
  x: number;
  y: number;
  icon: string;
}

const LANDMARKS: Landmark[] = [
  { name: "George Washington Bridge", x: scaleX(-73.955), y: scaleY(40.852), icon: "🌉" },
  { name: "MetLife Stadium", x: scaleX(-74.08), y: scaleY(40.815), icon: "🏟️" },
  { name: "Teterboro Airport", x: scaleX(-74.06), y: scaleY(40.85), icon: "✈️" },
  { name: "Garden State Plaza", x: scaleX(-74.07), y: scaleY(40.92), icon: "🛍️" },
  { name: "Bergen Town Center", x: scaleX(-74.06), y: scaleY(40.94), icon: "🛍️" },
  { name: "Hackensack Univ Medical Ctr", x: scaleX(-74.04), y: scaleY(40.90), icon: "🏥" },
  { name: "Valley Hospital", x: scaleX(-74.11), y: scaleY(40.97), icon: "🏥" },
  { name: "Holy Name Medical Ctr", x: scaleX(-74.01), y: scaleY(40.89), icon: "🏥" },
  { name: "Campgaw Mountain", x: scaleX(-74.18), y: scaleY(41.07), icon: "⛷️" },
  { name: "Van Saun County Park / Zoo", x: scaleX(-74.06), y: scaleY(40.94), icon: "🦁" },
  { name: "Ramapo College", x: scaleX(-74.18), y: scaleY(41.08), icon: "🎓" },
  { name: "FDU / Teaneck", x: scaleX(-74.01), y: scaleY(40.89), icon: "🎓" },
  { name: "Historic New Bridge Landing", x: scaleX(-74.04), y: scaleY(40.92), icon: "🏛️" },
  { name: "Palisades Interstate Park", x: scaleX(-73.95), y: scaleY(40.90), icon: "🌲" },
  { name: "Flat Rock Brook", x: scaleX(-73.97), y: scaleY(40.89), icon: "🌲" },
  { name: "Celery Farm (Allendale)", x: scaleX(-74.13), y: scaleY(41.04), icon: "🐦" },
];

// County outline (simplified polygon)
const COUNTY_OUTLINE = `M ${scaleX(-74.22)},${scaleY(41.10)}
  L ${scaleX(-74.20)},${scaleY(41.11)} L ${scaleX(-74.10)},${scaleY(41.10)}
  L ${scaleX(-74.02)},${scaleY(41.08)} L ${scaleX(-73.94)},${scaleY(41.07)}
  L ${scaleX(-73.92)},${scaleY(41.04)} L ${scaleX(-73.91)},${scaleY(40.97)}
  L ${scaleX(-73.93)},${scaleY(40.88)} L ${scaleX(-73.94)},${scaleY(40.84)}
  L ${scaleX(-73.97)},${scaleY(40.80)} L ${scaleX(-74.02)},${scaleY(40.80)}
  L ${scaleX(-74.08)},${scaleY(40.80)} L ${scaleX(-74.14)},${scaleY(40.78)}
  L ${scaleX(-74.16)},${scaleY(40.82)} L ${scaleX(-74.14)},${scaleY(40.88)}
  L ${scaleX(-74.22)},${scaleY(40.90)} L ${scaleX(-74.25)},${scaleY(40.98)}
  L ${scaleX(-74.24)},${scaleY(41.05)} Z`;

function roadPath(points: [number, number][]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ");
}

const roadStyle: Record<string, { stroke: string; width: number; dash?: string }> = {
  interstate: { stroke: "#e53935", width: 3 },
  highway: { stroke: "#fb8c00", width: 2.5 },
  route: { stroke: "#fdd835", width: 2, dash: "6,3" },
};

export default function BergenMap({ currentTown }: { currentTown?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showRoads, setShowRoads] = useState(true);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showRoads} onChange={() => setShowRoads(!showRoads)} className="accent-primary" />
          Major Roads
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showLandmarks} onChange={() => setShowLandmarks(!showLandmarks)} className="accent-primary" />
          Landmarks
        </label>
      </div>

      <svg viewBox="0 0 600 800" className="w-full max-w-3xl mx-auto" role="img" aria-label="Interactive map of Bergen County, NJ">
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Water / background */}
        <rect width="600" height="800" fill="#e3f2fd" rx="8" />

        {/* County fill */}
        <path d={COUNTY_OUTLINE} fill="#f1f8e9" stroke="#66bb6a" strokeWidth="2" />

        {/* Hudson River (east edge) */}
        <path
          d={`M ${scaleX(-73.94)},${scaleY(40.84)} Q ${scaleX(-73.92)},${scaleY(40.90)} ${scaleX(-73.91)},${scaleY(40.97)} Q ${scaleX(-73.92)},${scaleY(41.02)} ${scaleX(-73.92)},${scaleY(41.06)}`}
          fill="none" stroke="#42a5f5" strokeWidth="8" opacity="0.4"
        />
        <text x={scaleX(-73.90)} y={scaleY(40.95)} fill="#1565c0" fontSize="9" fontFamily="sans-serif" transform={`rotate(-80, ${scaleX(-73.90)}, ${scaleY(40.95)})`}>
          Hudson River
        </text>

        {/* Hackensack River */}
        <path
          d={`M ${scaleX(-74.04)},${scaleY(41.02)} Q ${scaleX(-74.04)},${scaleY(40.96)} ${scaleX(-74.04)},${scaleY(40.92)} Q ${scaleX(-74.03)},${scaleY(40.88)} ${scaleX(-74.02)},${scaleY(40.84)}`}
          fill="none" stroke="#42a5f5" strokeWidth="3" opacity="0.4"
        />

        {/* Roads */}
        {showRoads && ROADS.map((road) => {
          const s = roadStyle[road.type];
          return (
            <g key={road.name}>
              <path
                d={roadPath(road.points)}
                fill="none"
                stroke={s.stroke}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
                opacity="0.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x={road.points[Math.floor(road.points.length / 2)][0]}
                y={road.points[Math.floor(road.points.length / 2)][1] - 6}
                textAnchor="middle"
                fontSize="7"
                fontWeight="bold"
                fill={s.stroke}
                fontFamily="sans-serif"
                opacity="0.9"
              >
                {road.name}
              </text>
            </g>
          );
        })}

        {/* Town dots */}
        {TOWNS.map((town) => {
          const isActive = town.slug === currentTown;
          const isHovered = town.slug === hovered;
          const r = isActive ? 8 : isHovered ? 7 : 4.5;
          const hasDomain = !!TOWN_REGISTRY[town.slug]?.domain;
          return (
            <g key={town.slug}>
              <a href={getTownUrl(town.slug)}>
                <circle
                  cx={town.x} cy={town.y} r={r + 1}
                  fill="rgba(0,0,0,0.1)"
                />
                <circle
                  cx={town.x} cy={town.y} r={r}
                  fill={isActive ? "var(--town-primary, #1565c0)" : isHovered ? "#1565c0" : hasDomain ? "#2e7d32" : "#fff"}
                  stroke={isActive ? "var(--town-primary, #1565c0)" : hasDomain ? "#2e7d32" : "#888"}
                  strokeWidth={isActive ? 2.5 : hasDomain ? 2 : 1.5}
                  className="cursor-pointer transition-all duration-100"
                  onMouseEnter={() => setHovered(town.slug)}
                  onMouseLeave={() => setHovered(null)}
                />
                {(isActive || isHovered) && (
                  <g filter="url(#shadow)">
                    <rect
                      x={town.x - 50} y={town.y - r - 22}
                      width="100" height="18" rx="4"
                      fill="white" stroke="#ccc" strokeWidth="0.5"
                    />
                    <text
                      x={town.x} y={town.y - r - 10}
                      textAnchor="middle" fontSize="9" fontWeight="bold"
                      fill="#333" fontFamily="sans-serif"
                    >
                      {town.name} {town.pop && `(${town.pop})`}
                    </text>
                  </g>
                )}
                {!isActive && !isHovered && (
                  <text
                    x={town.x} y={town.y - r - 3}
                    textAnchor="middle" fontSize="7"
                    fill="#555" fontFamily="sans-serif"
                    className="pointer-events-none"
                  >
                    {town.name}
                  </text>
                )}
              </a>
            </g>
          );
        })}

        {/* Landmarks */}
        {showLandmarks && LANDMARKS.map((lm) => (
          <g key={lm.name}>
            <text x={lm.x} y={lm.y} textAnchor="middle" fontSize="14" className="pointer-events-none">
              {lm.icon}
            </text>
            <text
              x={lm.x} y={lm.y + 12}
              textAnchor="middle" fontSize="6" fill="#666" fontFamily="sans-serif"
              className="pointer-events-none"
            >
              {lm.name}
            </text>
          </g>
        ))}

        {/* NYC indicator */}
        <text x={scaleX(-73.92)} y={scaleY(40.82)} fill="#999" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
          NYC →
        </text>

        {/* NJ label */}
        <text x={scaleX(-74.22)} y={scaleY(40.83)} fill="#aaa" fontSize="10" fontFamily="sans-serif">
          New Jersey
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500 justify-center">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-green-700 border border-green-700"></span>
          Has dedicated .info domain
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-white border-2 border-gray-400"></span>
          Bergen County town
        </span>
        {showRoads && (
          <>
            <span className="flex items-center gap-1">
              <span className="inline-block w-5 h-0.5 bg-red-600"></span> Interstate
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-5 h-0.5 bg-orange-500"></span> Highway
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-5 h-0.5 bg-yellow-500 border-dashed"></span> Route
            </span>
          </>
        )}
      </div>
    </div>
  );
}
