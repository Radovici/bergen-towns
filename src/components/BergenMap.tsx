"use client";

import { useState } from "react";
import { getTownUrl, TOWN_REGISTRY } from "@/lib/town-registry";

// Coordinate mapping: lat/lon → SVG coords in 600×750 viewbox
const LO = -74.27, HI_LON = -73.89, LO_LAT = 40.77, HI_LAT = 41.13;
const sx = (lon: number) => ((lon - LO) / (HI_LON - LO)) * 600;
const sy = (lat: number) => ((HI_LAT - lat) / (HI_LAT - LO_LAT)) * 750;
const pt = (lon: number, lat: number) => `${sx(lon)},${sy(lat)}`;

interface TownPoly {
  slug: string;
  name: string;
  center: [number, number]; // [lon, lat]
  poly: string; // SVG polygon points
  pop?: string;
}

// Approximate boundary polygons for all 70 Bergen County municipalities
// Each polygon is a simplified representation of actual municipal borders
const TOWNS: TownPoly[] = [
  // === NORTHWEST ===
  { slug: "mahwah", name: "Mahwah", center: [-74.185, 41.085], pop: "26K",
    poly: `${pt(-74.26,41.11)} ${pt(-74.17,41.115)} ${pt(-74.12,41.10)} ${pt(-74.12,41.07)} ${pt(-74.14,41.05)} ${pt(-74.19,41.05)} ${pt(-74.24,41.06)} ${pt(-74.26,41.08)}` },
  { slug: "oakland", name: "Oakland", center: [-74.235, 41.03], pop: "13K",
    poly: `${pt(-74.26,41.06)} ${pt(-74.19,41.05)} ${pt(-74.19,41.01)} ${pt(-74.24,40.99)} ${pt(-74.27,41.01)}` },
  { slug: "franklin-lakes", name: "Franklin Lakes", center: [-74.20, 41.02], pop: "11K",
    poly: `${pt(-74.19,41.05)} ${pt(-74.14,41.05)} ${pt(-74.15,41.00)} ${pt(-74.17,40.98)} ${pt(-74.19,40.98)} ${pt(-74.19,41.01)}` },
  { slug: "ramsey", name: "Ramsey", center: [-74.14, 41.06], pop: "15K",
    poly: `${pt(-74.17,41.08)} ${pt(-74.12,41.08)} ${pt(-74.10,41.07)} ${pt(-74.10,41.05)} ${pt(-74.14,41.05)} ${pt(-74.17,41.05)}` },
  { slug: "allendale", name: "Allendale", center: [-74.13, 41.04], pop: "7K",
    poly: `${pt(-74.14,41.05)} ${pt(-74.10,41.05)} ${pt(-74.10,41.03)} ${pt(-74.12,41.025)} ${pt(-74.15,41.03)}` },
  { slug: "upper-saddle-river", name: "Upper Saddle River", center: [-74.10, 41.065], pop: "8K",
    poly: `${pt(-74.12,41.08)} ${pt(-74.07,41.08)} ${pt(-74.06,41.05)} ${pt(-74.07,41.03)} ${pt(-74.10,41.03)} ${pt(-74.10,41.05)}` },
  { slug: "saddle-river", name: "Saddle River", center: [-74.10, 41.035], pop: "3K",
    poly: `${pt(-74.12,41.04)} ${pt(-74.10,41.04)} ${pt(-74.08,41.03)} ${pt(-74.08,41.01)} ${pt(-74.10,41.01)} ${pt(-74.12,41.025)}` },
  { slug: "waldwick", name: "Waldwick", center: [-74.12, 41.015], pop: "10K",
    poly: `${pt(-74.14,41.03)} ${pt(-74.12,41.025)} ${pt(-74.10,41.01)} ${pt(-74.11,40.995)} ${pt(-74.14,41.00)} ${pt(-74.15,41.01)}` },
  // === NORTH-CENTRAL ===
  { slug: "wyckoff", name: "Wyckoff", center: [-74.17, 41.00], pop: "17K",
    poly: `${pt(-74.19,41.01)} ${pt(-74.15,41.01)} ${pt(-74.14,41.00)} ${pt(-74.14,40.975)} ${pt(-74.17,40.97)} ${pt(-74.19,40.98)}` },
  { slug: "ho-ho-kus", name: "Ho-Ho-Kus", center: [-74.10, 41.00], pop: "4K",
    poly: `${pt(-74.11,41.01)} ${pt(-74.08,41.01)} ${pt(-74.08,40.99)} ${pt(-74.10,40.98)} ${pt(-74.11,40.995)}` },
  { slug: "midland-park", name: "Midland Park", center: [-74.14, 40.99], pop: "7K",
    poly: `${pt(-74.15,41.00)} ${pt(-74.12,41.00)} ${pt(-74.11,40.98)} ${pt(-74.12,40.97)} ${pt(-74.15,40.975)}` },
  { slug: "ridgewood", name: "Ridgewood", center: [-74.11, 40.98], pop: "25K",
    poly: `${pt(-74.13,40.995)} ${pt(-74.08,40.99)} ${pt(-74.07,40.97)} ${pt(-74.08,40.955)} ${pt(-74.12,40.955)} ${pt(-74.13,40.975)}` },
  { slug: "glen-rock", name: "Glen Rock", center: [-74.13, 40.96], pop: "12K",
    poly: `${pt(-74.15,40.975)} ${pt(-74.12,40.97)} ${pt(-74.10,40.955)} ${pt(-74.10,40.94)} ${pt(-74.13,40.935)} ${pt(-74.16,40.95)}` },
  // === NORTHWEST VALLEY ===
  { slug: "montvale", name: "Montvale", center: [-74.05, 41.05], pop: "9K",
    poly: `${pt(-74.07,41.065)} ${pt(-74.03,41.065)} ${pt(-74.03,41.04)} ${pt(-74.06,41.035)} ${pt(-74.07,41.04)}` },
  { slug: "park-ridge", name: "Park Ridge", center: [-74.04, 41.04], pop: "9K",
    poly: `${pt(-74.06,41.05)} ${pt(-74.03,41.05)} ${pt(-74.02,41.03)} ${pt(-74.03,41.02)} ${pt(-74.06,41.02)} ${pt(-74.06,41.035)}` },
  { slug: "woodcliff-lake", name: "Woodcliff Lake", center: [-74.06, 41.02], pop: "6K",
    poly: `${pt(-74.07,41.035)} ${pt(-74.06,41.04)} ${pt(-74.04,41.03)} ${pt(-74.04,41.01)} ${pt(-74.07,41.01)}` },
  { slug: "hillsdale", name: "Hillsdale", center: [-74.04, 41.01], pop: "10K",
    poly: `${pt(-74.06,41.02)} ${pt(-74.03,41.02)} ${pt(-74.02,41.00)} ${pt(-74.03,40.99)} ${pt(-74.06,40.99)}` },
  { slug: "washington-township", name: "Washington Twp", center: [-74.06, 41.01], pop: "10K",
    poly: `${pt(-74.07,41.02)} ${pt(-74.06,41.02)} ${pt(-74.06,40.99)} ${pt(-74.07,40.99)} ${pt(-74.08,41.00)}` },
  { slug: "westwood", name: "Westwood", center: [-74.03, 41.00], pop: "11K",
    poly: `${pt(-74.04,41.01)} ${pt(-74.02,41.01)} ${pt(-74.01,40.99)} ${pt(-74.02,40.98)} ${pt(-74.04,40.98)} ${pt(-74.04,41.00)}` },
  { slug: "emerson", name: "Emerson", center: [-74.03, 40.975], pop: "8K",
    poly: `${pt(-74.04,40.99)} ${pt(-74.02,40.99)} ${pt(-74.01,40.97)} ${pt(-74.02,40.96)} ${pt(-74.04,40.96)}` },
  // === NORTHEAST ===
  { slug: "river-vale", name: "River Vale", center: [-74.01, 41.02], pop: "10K",
    poly: `${pt(-74.02,41.03)} ${pt(-73.99,41.03)} ${pt(-73.99,41.00)} ${pt(-74.01,40.99)} ${pt(-74.02,41.00)}` },
  { slug: "old-tappan", name: "Old Tappan", center: [-73.99, 41.03], pop: "6K",
    poly: `${pt(-74.01,41.05)} ${pt(-73.97,41.05)} ${pt(-73.96,41.03)} ${pt(-73.97,41.02)} ${pt(-74.01,41.02)}` },
  { slug: "northvale", name: "Northvale", center: [-73.95, 41.035], pop: "5K",
    poly: `${pt(-73.97,41.05)} ${pt(-73.94,41.05)} ${pt(-73.93,41.03)} ${pt(-73.94,41.02)} ${pt(-73.97,41.02)}` },
  { slug: "norwood", name: "Norwood", center: [-73.96, 41.055], pop: "6K",
    poly: `${pt(-73.98,41.07)} ${pt(-73.94,41.07)} ${pt(-73.94,41.05)} ${pt(-73.97,41.05)} ${pt(-73.98,41.055)}` },
  { slug: "rockleigh", name: "Rockleigh", center: [-73.93, 41.06], pop: "500",
    poly: `${pt(-73.94,41.07)} ${pt(-73.92,41.07)} ${pt(-73.91,41.05)} ${pt(-73.93,41.045)} ${pt(-73.94,41.05)}` },
  { slug: "alpine", name: "Alpine", center: [-73.93, 41.04], pop: "2K",
    poly: `${pt(-73.94,41.05)} ${pt(-73.91,41.05)} ${pt(-73.90,41.02)} ${pt(-73.93,41.01)} ${pt(-73.95,41.02)}` },
  { slug: "closter", name: "Closter", center: [-73.96, 41.015], pop: "9K",
    poly: `${pt(-73.98,41.03)} ${pt(-73.96,41.03)} ${pt(-73.95,41.02)} ${pt(-73.94,41.00)} ${pt(-73.97,40.99)} ${pt(-73.99,41.00)}` },
  { slug: "harrington-park", name: "Harrington Pk", center: [-73.98, 41.01], pop: "5K",
    poly: `${pt(-73.99,41.02)} ${pt(-73.97,41.02)} ${pt(-73.97,40.99)} ${pt(-73.99,40.99)}` },
  { slug: "demarest", name: "Demarest", center: [-73.96, 40.96], pop: "5K",
    poly: `${pt(-73.97,40.99)} ${pt(-73.94,40.99)} ${pt(-73.94,40.94)} ${pt(-73.97,40.93)}` },
  { slug: "haworth", name: "Haworth", center: [-73.99, 40.97], pop: "3K",
    poly: `${pt(-74.01,40.98)} ${pt(-73.97,40.98)} ${pt(-73.97,40.96)} ${pt(-74.01,40.955)}` },
  { slug: "dumont", name: "Dumont", center: [-73.99, 40.95], pop: "18K",
    poly: `${pt(-74.01,40.96)} ${pt(-73.97,40.96)} ${pt(-73.97,40.935)} ${pt(-74.00,40.93)} ${pt(-74.01,40.935)}` },
  { slug: "oradell", name: "Oradell", center: [-74.04, 40.96], pop: "8K",
    poly: `${pt(-74.05,40.975)} ${pt(-74.02,40.975)} ${pt(-74.01,40.955)} ${pt(-74.02,40.94)} ${pt(-74.05,40.94)}` },
  { slug: "cresskill", name: "Cresskill", center: [-73.96, 40.94], pop: "9K",
    poly: `${pt(-73.97,40.955)} ${pt(-73.94,40.955)} ${pt(-73.94,40.93)} ${pt(-73.97,40.925)}` },
  { slug: "tenafly", name: "Tenafly", center: [-73.96, 40.92], pop: "15K",
    poly: `${pt(-73.97,40.935)} ${pt(-73.94,40.935)} ${pt(-73.93,40.905)} ${pt(-73.95,40.895)} ${pt(-73.97,40.90)}` },
  // === CENTRAL ===
  { slug: "new-milford", name: "New Milford", center: [-74.02, 40.94], pop: "17K",
    poly: `${pt(-74.03,40.955)} ${pt(-74.01,40.95)} ${pt(-74.00,40.935)} ${pt(-74.01,40.92)} ${pt(-74.03,40.92)}` },
  { slug: "bergenfield", name: "Bergenfield", center: [-74.00, 40.93], pop: "29K",
    poly: `${pt(-74.01,40.94)} ${pt(-73.98,40.94)} ${pt(-73.98,40.91)} ${pt(-74.01,40.91)}` },
  { slug: "river-edge", name: "River Edge", center: [-74.04, 40.93], pop: "12K",
    poly: `${pt(-74.05,40.945)} ${pt(-74.03,40.94)} ${pt(-74.03,40.92)} ${pt(-74.05,40.915)}` },
  { slug: "maywood", name: "Maywood", center: [-74.06, 40.90], pop: "10K",
    poly: `${pt(-74.07,40.92)} ${pt(-74.05,40.92)} ${pt(-74.05,40.90)} ${pt(-74.07,40.89)}` },
  { slug: "paramus", name: "Paramus", center: [-74.07, 40.95], pop: "27K",
    poly: `${pt(-74.10,40.97)} ${pt(-74.05,40.97)} ${pt(-74.05,40.94)} ${pt(-74.05,40.92)} ${pt(-74.07,40.92)} ${pt(-74.10,40.93)}` },
  { slug: "rochelle-park", name: "Rochelle Pk", center: [-74.07, 40.91], pop: "6K",
    poly: `${pt(-74.08,40.92)} ${pt(-74.07,40.92)} ${pt(-74.06,40.905)} ${pt(-74.07,40.895)} ${pt(-74.08,40.90)}` },
  { slug: "fair-lawn", name: "Fair Lawn", center: [-74.13, 40.935], pop: "34K",
    poly: `${pt(-74.16,40.955)} ${pt(-74.10,40.955)} ${pt(-74.10,40.93)} ${pt(-74.10,40.91)} ${pt(-74.14,40.91)} ${pt(-74.16,40.92)}` },
  { slug: "saddle-brook", name: "Saddle Brook", center: [-74.09, 40.90], pop: "14K",
    poly: `${pt(-74.10,40.92)} ${pt(-74.08,40.92)} ${pt(-74.07,40.90)} ${pt(-74.08,40.88)} ${pt(-74.10,40.88)} ${pt(-74.10,40.91)}` },
  { slug: "elmwood-park", name: "Elmwood Park", center: [-74.12, 40.905], pop: "21K",
    poly: `${pt(-74.14,40.92)} ${pt(-74.10,40.92)} ${pt(-74.10,40.89)} ${pt(-74.13,40.88)} ${pt(-74.15,40.89)}` },
  { slug: "garfield", name: "Garfield", center: [-74.11, 40.88], pop: "33K",
    poly: `${pt(-74.13,40.895)} ${pt(-74.10,40.89)} ${pt(-74.09,40.87)} ${pt(-74.10,40.86)} ${pt(-74.13,40.86)} ${pt(-74.14,40.88)}` },
  // === CENTRAL-EAST ===
  { slug: "englewood", name: "Englewood", center: [-73.97, 40.89], pop: "29K",
    poly: `${pt(-73.99,40.91)} ${pt(-73.96,40.91)} ${pt(-73.95,40.895)} ${pt(-73.95,40.87)} ${pt(-73.98,40.87)} ${pt(-73.99,40.88)}` },
  { slug: "englewood-cliffs", name: "Englewood Cliffs", center: [-73.95, 40.88], pop: "5K",
    poly: `${pt(-73.96,40.90)} ${pt(-73.93,40.90)} ${pt(-73.92,40.87)} ${pt(-73.95,40.86)} ${pt(-73.96,40.87)}` },
  { slug: "teaneck", name: "Teaneck", center: [-74.01, 40.89], pop: "40K",
    poly: `${pt(-74.03,40.91)} ${pt(-73.99,40.91)} ${pt(-73.99,40.88)} ${pt(-74.00,40.86)} ${pt(-74.03,40.86)}` },
  { slug: "hackensack", name: "Hackensack", center: [-74.04, 40.885], pop: "45K",
    poly: `${pt(-74.06,40.91)} ${pt(-74.03,40.91)} ${pt(-74.03,40.87)} ${pt(-74.05,40.86)} ${pt(-74.06,40.87)}` },
  { slug: "bogota", name: "Bogota", center: [-74.03, 40.87], pop: "8K",
    poly: `${pt(-74.04,40.88)} ${pt(-74.02,40.88)} ${pt(-74.02,40.86)} ${pt(-74.04,40.86)}` },
  { slug: "leonia", name: "Leonia", center: [-73.99, 40.87], pop: "9K",
    poly: `${pt(-74.00,40.88)} ${pt(-73.97,40.88)} ${pt(-73.97,40.86)} ${pt(-74.00,40.855)}` },
  // === SOUTH-CENTRAL ===
  { slug: "lodi", name: "Lodi", center: [-74.08, 40.88], pop: "25K",
    poly: `${pt(-74.10,40.895)} ${pt(-74.07,40.895)} ${pt(-74.06,40.87)} ${pt(-74.08,40.86)} ${pt(-74.10,40.86)}` },
  { slug: "hasbrouck-heights", name: "Hasbrouck Hts", center: [-74.07, 40.86], pop: "12K",
    poly: `${pt(-74.08,40.87)} ${pt(-74.06,40.87)} ${pt(-74.05,40.85)} ${pt(-74.06,40.84)} ${pt(-74.08,40.84)}` },
  { slug: "teterboro", name: "Teterboro", center: [-74.06, 40.855], pop: "67",
    poly: `${pt(-74.06,40.87)} ${pt(-74.05,40.87)} ${pt(-74.04,40.855)} ${pt(-74.05,40.84)} ${pt(-74.06,40.84)}` },
  { slug: "south-hackensack", name: "S. Hackensack", center: [-74.045, 40.86], pop: "3K",
    poly: `${pt(-74.05,40.87)} ${pt(-74.03,40.87)} ${pt(-74.03,40.855)} ${pt(-74.04,40.845)} ${pt(-74.05,40.845)}` },
  { slug: "little-ferry", name: "Little Ferry", center: [-74.04, 40.85], pop: "11K",
    poly: `${pt(-74.05,40.855)} ${pt(-74.03,40.855)} ${pt(-74.03,40.84)} ${pt(-74.04,40.83)} ${pt(-74.05,40.835)}` },
  { slug: "moonachie", name: "Moonachie", center: [-74.05, 40.84], pop: "3K",
    poly: `${pt(-74.06,40.85)} ${pt(-74.05,40.85)} ${pt(-74.04,40.84)} ${pt(-74.04,40.83)} ${pt(-74.06,40.825)}` },
  { slug: "wood-ridge", name: "Wood-Ridge", center: [-74.09, 40.85], pop: "9K",
    poly: `${pt(-74.10,40.87)} ${pt(-74.08,40.87)} ${pt(-74.07,40.85)} ${pt(-74.08,40.835)} ${pt(-74.10,40.84)}` },
  { slug: "wallington", name: "Wallington", center: [-74.11, 40.855], pop: "12K",
    poly: `${pt(-74.12,40.87)} ${pt(-74.10,40.87)} ${pt(-74.10,40.84)} ${pt(-74.12,40.84)}` },
  { slug: "carlstadt", name: "Carlstadt", center: [-74.07, 40.83], pop: "7K",
    poly: `${pt(-74.08,40.84)} ${pt(-74.06,40.84)} ${pt(-74.05,40.82)} ${pt(-74.07,40.81)} ${pt(-74.08,40.82)}` },
  { slug: "east-rutherford", name: "E. Rutherford", center: [-74.09, 40.83], pop: "10K",
    poly: `${pt(-74.10,40.845)} ${pt(-74.08,40.84)} ${pt(-74.07,40.82)} ${pt(-74.08,40.80)} ${pt(-74.10,40.80)} ${pt(-74.10,40.82)}` },
  { slug: "rutherford", name: "Rutherford", center: [-74.11, 40.83], pop: "18K",
    poly: `${pt(-74.13,40.85)} ${pt(-74.10,40.85)} ${pt(-74.10,40.82)} ${pt(-74.10,40.80)} ${pt(-74.13,40.80)} ${pt(-74.14,40.82)}` },
  { slug: "lyndhurst", name: "Lyndhurst", center: [-74.12, 40.81], pop: "22K",
    poly: `${pt(-74.14,40.83)} ${pt(-74.13,40.82)} ${pt(-74.13,40.79)} ${pt(-74.10,40.79)} ${pt(-74.10,40.80)} ${pt(-74.14,40.82)}` },
  { slug: "north-arlington", name: "N. Arlington", center: [-74.13, 40.79], pop: "16K",
    poly: `${pt(-74.14,40.80)} ${pt(-74.13,40.80)} ${pt(-74.12,40.78)} ${pt(-74.14,40.77)} ${pt(-74.15,40.78)}` },
  // === EAST (PALISADES) ===
  { slug: "fort-lee", name: "Fort Lee", center: [-73.97, 40.85], pop: "40K",
    poly: `${pt(-73.99,40.87)} ${pt(-73.96,40.87)} ${pt(-73.94,40.85)} ${pt(-73.94,40.83)} ${pt(-73.97,40.83)} ${pt(-73.99,40.84)}` },
  { slug: "palisades-park", name: "Palisades Park", center: [-73.99, 40.85], pop: "21K",
    poly: `${pt(-74.00,40.86)} ${pt(-73.98,40.86)} ${pt(-73.97,40.84)} ${pt(-73.99,40.835)} ${pt(-74.00,40.84)}` },
  { slug: "ridgefield-park", name: "Ridgefield Pk", center: [-74.02, 40.86], pop: "13K",
    poly: `${pt(-74.03,40.87)} ${pt(-74.01,40.87)} ${pt(-74.00,40.855)} ${pt(-74.01,40.84)} ${pt(-74.03,40.845)}` },
  { slug: "ridgefield", name: "Ridgefield", center: [-74.01, 40.83], pop: "12K",
    poly: `${pt(-74.02,40.85)} ${pt(-73.99,40.845)} ${pt(-73.98,40.83)} ${pt(-73.99,40.82)} ${pt(-74.02,40.82)}` },
  { slug: "cliffside-park", name: "Cliffside Park", center: [-73.99, 40.82], pop: "26K",
    poly: `${pt(-74.00,40.835)} ${pt(-73.97,40.835)} ${pt(-73.96,40.82)} ${pt(-73.97,40.805)} ${pt(-74.00,40.805)}` },
  { slug: "edgewater", name: "Edgewater", center: [-73.97, 40.82], pop: "13K",
    poly: `${pt(-73.97,40.84)} ${pt(-73.94,40.84)} ${pt(-73.92,40.82)} ${pt(-73.93,40.80)} ${pt(-73.96,40.80)} ${pt(-73.97,40.81)}` },
  { slug: "fairview", name: "Fairview", center: [-74.00, 40.815], pop: "14K",
    poly: `${pt(-74.02,40.825)} ${pt(-74.00,40.82)} ${pt(-73.99,40.805)} ${pt(-74.01,40.80)} ${pt(-74.02,40.81)}` },
];

interface Landmark { name: string; x: number; y: number; icon: string; }
const LANDMARKS: Landmark[] = [
  { name: "George Washington Bridge", x: sx(-73.955), y: sy(40.852), icon: "🌉" },
  { name: "MetLife Stadium", x: sx(-74.08), y: sy(40.813), icon: "🏟️" },
  { name: "Teterboro Airport", x: sx(-74.06), y: sy(40.855), icon: "✈️" },
  { name: "Garden State Plaza", x: sx(-74.075), y: sy(40.925), icon: "🛍️" },
  { name: "Hackensack UMC", x: sx(-74.04), y: sy(40.895), icon: "🏥" },
  { name: "Valley Hospital", x: sx(-74.11), y: sy(40.975), icon: "🏥" },
  { name: "Campgaw Mountain", x: sx(-74.18), y: sy(41.07), icon: "⛷️" },
  { name: "Van Saun Park & Zoo", x: sx(-74.055), y: sy(40.945), icon: "🦁" },
  { name: "Palisades Interstate Park", x: sx(-73.93), y: sy(40.92), icon: "🌲" },
  { name: "Historic New Bridge Landing", x: sx(-74.04), y: sy(40.925), icon: "🏛️" },
  { name: "Celery Farm", x: sx(-74.13), y: sy(41.045), icon: "🐦" },
  { name: "Ramapo College", x: sx(-74.18), y: sy(41.085), icon: "🎓" },
  { name: "Holy Name Medical Ctr", x: sx(-74.01), y: sy(40.89), icon: "🏥" },
  { name: "Englewood Hospital", x: sx(-73.97), y: sy(40.888), icon: "🏥" },
  { name: "Bergen New Bridge Med Ctr", x: sx(-74.06), y: sy(40.86), icon: "🏥" },
  { name: "YMCA Ridgewood", x: sx(-74.11), y: sy(40.975), icon: "👶" },
  { name: "Bergen Family Center", x: sx(-73.97), y: sy(40.895), icon: "👶" },
  { name: "KinderCare Paramus", x: sx(-74.07), y: sy(40.955), icon: "👶" },
];

interface Road { name: string; color: string; width: number; dash?: string; d: string; }
const ROADS: Road[] = [
  { name: "GSP", color: "#e53935", width: 3, d: `M${pt(-74.07,40.82)} Q${pt(-74.08,40.88)} ${pt(-74.09,40.93)} Q${pt(-74.12,40.98)} ${pt(-74.14,41.02)} Q${pt(-74.17,41.06)} ${pt(-74.19,41.09)}` },
  { name: "I-80", color: "#e53935", width: 3, d: `M${pt(-74.22,40.91)} Q${pt(-74.15,40.90)} ${pt(-74.10,40.89)} L${pt(-74.04,40.88)}` },
  { name: "I-95/GWB", color: "#e53935", width: 3, d: `M${pt(-73.97,40.85)} L${pt(-73.94,40.855)}` },
  { name: "Rte 17", color: "#fb8c00", width: 2.5, d: `M${pt(-74.12,40.89)} Q${pt(-74.11,40.93)} ${pt(-74.10,40.97)} Q${pt(-74.12,41.02)} ${pt(-74.14,41.06)} Q${pt(-74.17,41.09)} ${pt(-74.18,41.11)}` },
  { name: "Rte 4", color: "#fdd835", width: 2, dash: "6,3", d: `M${pt(-74.12,40.89)} Q${pt(-74.06,40.885)} ${pt(-74.00,40.875)} L${pt(-73.95,40.87)}` },
  { name: "Rte 208", color: "#fdd835", width: 2, dash: "6,3", d: `M${pt(-74.13,40.935)} Q${pt(-74.16,40.97)} ${pt(-74.19,41.01)} L${pt(-74.21,41.04)}` },
  { name: "Palisades Pkwy", color: "#fb8c00", width: 2.5, d: `M${pt(-73.955,40.86)} Q${pt(-73.95,40.90)} ${pt(-73.94,40.95)} Q${pt(-73.93,41.01)} ${pt(-73.925,41.06)}` },
];

// NJ state outline (very simplified)
const NJ_OUTLINE = "M 55,10 L 65,5 L 80,8 L 85,15 L 82,25 L 78,35 L 80,45 L 88,50 L 90,60 L 85,70 L 78,80 L 72,90 L 68,95 L 60,100 L 55,108 L 50,115 L 48,120 L 52,125 L 58,130 L 60,140 L 55,148 L 48,155 L 42,160 L 38,155 L 35,145 L 30,135 L 28,125 L 25,115 L 28,105 L 32,95 L 35,85 L 38,75 L 40,65 L 42,55 L 45,45 L 48,35 L 50,25 L 52,18 Z";
const BERGEN_IN_NJ = "M 72,8 L 82,12 L 84,18 L 80,22 L 74,20 L 70,15 Z";

export default function BergenMap({ currentTown }: { currentTown?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [zoomed, setZoomed] = useState(true);

  if (!zoomed) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">Click Bergen County to zoom in</p>
        <svg viewBox="0 0 120 170" className="w-full max-w-xs mx-auto cursor-pointer" onClick={() => setZoomed(true)}>
          <rect width="120" height="170" fill="#e3f2fd" rx="4" />
          <path d={NJ_OUTLINE} fill="#e8f5e9" stroke="#66bb6a" strokeWidth="1.5" />
          <path d={BERGEN_IN_NJ} fill="#2e7d32" stroke="#1b5e20" strokeWidth="1" className="hover:fill-[#4caf50] transition-colors" />
          <text x="64" y="30" textAnchor="start" fontSize="5" fill="#1b5e20" fontWeight="bold" fontFamily="sans-serif">Bergen</text>
          <text x="64" y="35" textAnchor="start" fontSize="4" fill="#1b5e20" fontFamily="sans-serif">County</text>
          <text x="50" y="80" textAnchor="middle" fontSize="8" fill="#999" fontFamily="sans-serif">New Jersey</text>
          <text x="95" y="50" fontSize="5" fill="#64b5f6" fontFamily="sans-serif">NYC</text>
          <text x="15" y="70" fontSize="4" fill="#999" fontFamily="sans-serif">PA</text>
          {/* Atlantic Ocean */}
          <text x="95" y="110" fontSize="4" fill="#64b5f6" fontFamily="sans-serif" transform="rotate(30,95,110)">Atlantic</text>
        </svg>
        <p className="text-xs text-gray-400 mt-2">Bergen County is in northeastern New Jersey, across the Hudson from NYC</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <button onClick={() => setZoomed(false)} className="text-sm text-primary underline cursor-pointer bg-transparent border-none">
          ← Show NJ Overview
        </button>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showRoads} onChange={() => setShowRoads(!showRoads)} className="accent-primary" /> Roads
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showLandmarks} onChange={() => setShowLandmarks(!showLandmarks)} className="accent-primary" /> Landmarks
        </label>
      </div>

      <svg viewBox="0 0 600 750" className="w-full max-w-3xl mx-auto" role="img" aria-label="Bergen County map with town borders">
        <defs>
          <filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.12" /></filter>
        </defs>

        <rect width="600" height="750" fill="#dceefb" rx="6" />

        {/* Hudson River */}
        <path d={`M${pt(-73.92,41.07)} Q${pt(-73.91,41.00)} ${pt(-73.91,40.93)} Q${pt(-73.92,40.86)} ${pt(-73.92,40.80)}`}
          fill="none" stroke="#64b5f6" strokeWidth="10" opacity="0.3" strokeLinecap="round" />
        <text x={sx(-73.895)} y={sy(40.94)} fill="#1565c0" fontSize="9" fontFamily="sans-serif"
          transform={`rotate(-80,${sx(-73.895)},${sy(40.94)})`}>Hudson River</text>

        {/* Town polygons */}
        {TOWNS.map((town) => {
          const isActive = town.slug === currentTown;
          const isHovered = town.slug === hovered;
          const hasDomain = !!TOWN_REGISTRY[town.slug]?.domain;
          let fill = "#f1f8e9";
          if (isActive) fill = "var(--town-primary, #1565c0)";
          else if (isHovered) fill = "#c8e6c9";
          else if (hasDomain) fill = "#e8f5e9";
          return (
            <a key={town.slug} href={getTownUrl(town.slug)}>
              <polygon
                points={town.poly}
                fill={fill}
                stroke={isActive ? "var(--town-primary, #1565c0)" : hasDomain ? "#4caf50" : "#a5d6a7"}
                strokeWidth={isActive ? 2.5 : hasDomain ? 1.5 : 1}
                className="cursor-pointer transition-all duration-100"
                onMouseEnter={() => setHovered(town.slug)}
                onMouseLeave={() => setHovered(null)}
              />
              <text
                x={sx(town.center[0])}
                y={sy(town.center[1]) + (isActive || isHovered ? -2 : 0)}
                textAnchor="middle"
                fontSize={isActive || isHovered ? 9 : 7}
                fontWeight={isActive || isHovered ? "bold" : "normal"}
                fill={isActive ? "#fff" : "#333"}
                fontFamily="sans-serif"
                className="pointer-events-none"
              >
                {town.name}
              </text>
              {(isActive || isHovered) && town.pop && (
                <text
                  x={sx(town.center[0])} y={sy(town.center[1]) + 9}
                  textAnchor="middle" fontSize="7" fill={isActive ? "#ddd" : "#666"}
                  fontFamily="sans-serif" className="pointer-events-none"
                >
                  pop. {town.pop}
                </text>
              )}
            </a>
          );
        })}

        {/* Roads */}
        {showRoads && ROADS.map((road) => (
          <g key={road.name}>
            <path d={road.d} fill="none" stroke={road.color} strokeWidth={road.width}
              strokeDasharray={road.dash} opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
        {showRoads && (
          <g fontSize="7" fontWeight="bold" fontFamily="sans-serif">
            <text x={sx(-74.14)} y={sy(41.03)-4} fill="#e53935">GSP</text>
            <text x={sx(-74.14)} y={sy(40.895)-4} fill="#e53935">I-80</text>
            <text x={sx(-73.96)} y={sy(40.845)-4} fill="#e53935">I-95</text>
            <text x={sx(-74.115)} y={sy(40.96)-4} fill="#fb8c00">17</text>
            <text x={sx(-74.03)} y={sy(40.88)-4} fill="#fdd835">4</text>
            <text x={sx(-74.17)} y={sy(40.99)-4} fill="#fdd835">208</text>
            <text x={sx(-73.94)} y={sy(40.94)-4} fill="#fb8c00">PIP</text>
          </g>
        )}

        {/* Landmarks */}
        {showLandmarks && LANDMARKS.map((lm) => (
          <g key={lm.name}>
            <text x={lm.x} y={lm.y} textAnchor="middle" fontSize="14" className="pointer-events-none">{lm.icon}</text>
            <text x={lm.x} y={lm.y + 12} textAnchor="middle" fontSize="5.5" fill="#555" fontFamily="sans-serif"
              className="pointer-events-none">{lm.name}</text>
          </g>
        ))}

        <text x={sx(-73.91)} y={sy(40.82)} fill="#999" fontSize="11" fontFamily="sans-serif" fontWeight="bold">NYC →</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500 justify-center">
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-3 rounded-sm bg-[#e8f5e9] border-2 border-[#4caf50]"></span> Owned .info domain
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-3 rounded-sm bg-[#f1f8e9] border border-[#a5d6a7]"></span> Bergen County town
        </span>
        {showRoads && (<>
          <span className="flex items-center gap-1"><span className="inline-block w-5 h-0.5 bg-red-600"></span> Interstate</span>
          <span className="flex items-center gap-1"><span className="inline-block w-5 h-0.5 bg-orange-500"></span> Highway</span>
          <span className="flex items-center gap-1"><span className="inline-block w-5 h-0.5 bg-yellow-500"></span> Route</span>
        </>)}
      </div>
    </div>
  );
}
