export interface TownInfo {
  slug: string;
  name: string;
  domain?: string;
  neighbors: string[];
}

export const TOWN_REGISTRY: Record<string, TownInfo> = {
  "allendale": { slug: "allendale", name: "Allendale", domain: "allendale.info", neighbors: ["ho-ho-kus", "mahwah", "ramsey", "saddle-river", "upper-saddle-river", "waldwick", "wyckoff"] },
  "alpine": { slug: "alpine", name: "Alpine", neighbors: ["closter", "cresskill", "demarest", "norwood"] },
  "bergenfield": { slug: "bergenfield", name: "Bergenfield", neighbors: ["dumont", "englewood", "new-milford", "teaneck"] },
  "bogota": { slug: "bogota", name: "Bogota", neighbors: ["hackensack", "ridgefield-park", "south-hackensack", "teaneck"] },
  "carlstadt": { slug: "carlstadt", name: "Carlstadt", neighbors: ["east-rutherford", "moonachie", "south-hackensack", "wood-ridge"] },
  "cliffside-park": { slug: "cliffside-park", name: "Cliffside Park", neighbors: ["edgewater", "fairview", "fort-lee"] },
  "closter": { slug: "closter", name: "Closter", neighbors: ["alpine", "demarest", "harrington-park", "haworth", "norwood"] },
  "cresskill": { slug: "cresskill", name: "Cresskill", neighbors: ["alpine", "demarest", "dumont", "tenafly"] },
  "demarest": { slug: "demarest", name: "Demarest", neighbors: ["alpine", "closter", "cresskill", "haworth", "tenafly"] },
  "dumont": { slug: "dumont", name: "Dumont", neighbors: ["bergenfield", "cresskill", "haworth", "new-milford", "oradell"] },
  "east-rutherford": { slug: "east-rutherford", name: "East Rutherford", neighbors: ["carlstadt", "lyndhurst", "moonachie", "rutherford", "wood-ridge"] },
  "edgewater": { slug: "edgewater", name: "Edgewater", neighbors: ["cliffside-park", "fort-lee", "leonia"] },
  "elmwood-park": { slug: "elmwood-park", name: "Elmwood Park", neighbors: ["fair-lawn", "garfield", "lodi", "saddle-brook"] },
  "emerson": { slug: "emerson", name: "Emerson", neighbors: ["hillsdale", "oradell", "park-ridge", "westwood"] },
  "englewood": { slug: "englewood", name: "Englewood", neighbors: ["bergenfield", "englewood-cliffs", "leonia", "teaneck", "tenafly"] },
  "englewood-cliffs": { slug: "englewood-cliffs", name: "Englewood Cliffs", neighbors: ["englewood", "fort-lee", "leonia", "tenafly"] },
  "fair-lawn": { slug: "fair-lawn", name: "Fair Lawn", neighbors: ["elmwood-park", "garfield", "glen-rock", "paramus", "saddle-brook"] },
  "fairview": { slug: "fairview", name: "Fairview", neighbors: ["cliffside-park", "north-bergen", "ridgefield"] },
  "fort-lee": { slug: "fort-lee", name: "Fort Lee", domain: "fortlee.info", neighbors: ["cliffside-park", "edgewater", "englewood-cliffs", "leonia", "palisades-park"] },
  "franklin-lakes": { slug: "franklin-lakes", name: "Franklin Lakes", domain: "franklinlakes.info", neighbors: ["oakland", "mahwah", "wyckoff"] },
  "garfield": { slug: "garfield", name: "Garfield", neighbors: ["elmwood-park", "fair-lawn", "lodi", "saddle-brook", "wallington"] },
  "glen-rock": { slug: "glen-rock", name: "Glen Rock", neighbors: ["fair-lawn", "hawthorne", "midland-park", "paramus", "ridgewood"] },
  "hackensack": { slug: "hackensack", name: "Hackensack", domain: "hackensack.info", neighbors: ["bogota", "maywood", "paramus", "river-edge", "rochelle-park", "south-hackensack", "teaneck"] },
  "harrington-park": { slug: "harrington-park", name: "Harrington Park", neighbors: ["closter", "haworth", "northvale", "old-tappan", "river-vale"] },
  "hasbrouck-heights": { slug: "hasbrouck-heights", name: "Hasbrouck Heights", neighbors: ["little-ferry", "lodi", "moonachie", "teterboro", "wood-ridge"] },
  "haworth": { slug: "haworth", name: "Haworth", neighbors: ["closter", "demarest", "dumont", "harrington-park", "oradell"] },
  "hillsdale": { slug: "hillsdale", name: "Hillsdale", neighbors: ["emerson", "park-ridge", "river-vale", "westwood", "woodcliff-lake"] },
  "ho-ho-kus": { slug: "ho-ho-kus", name: "Ho-Ho-Kus", neighbors: ["allendale", "midland-park", "ridgewood", "upper-saddle-river", "waldwick"] },
  "leonia": { slug: "leonia", name: "Leonia", neighbors: ["edgewater", "englewood", "englewood-cliffs", "fort-lee", "palisades-park", "teaneck"] },
  "little-ferry": { slug: "little-ferry", name: "Little Ferry", neighbors: ["hasbrouck-heights", "moonachie", "ridgefield", "south-hackensack", "teterboro"] },
  "lodi": { slug: "lodi", name: "Lodi", neighbors: ["elmwood-park", "garfield", "hasbrouck-heights", "maywood", "rochelle-park", "saddle-brook", "wood-ridge"] },
  "lyndhurst": { slug: "lyndhurst", name: "Lyndhurst", neighbors: ["east-rutherford", "north-arlington", "rutherford"] },
  "mahwah": { slug: "mahwah", name: "Mahwah", neighbors: ["allendale", "franklin-lakes", "oakland", "ramsey", "upper-saddle-river"] },
  "maywood": { slug: "maywood", name: "Maywood", neighbors: ["hackensack", "lodi", "paramus", "rochelle-park", "river-edge"] },
  "midland-park": { slug: "midland-park", name: "Midland Park", neighbors: ["glen-rock", "ho-ho-kus", "ridgewood", "waldwick", "wyckoff"] },
  "montvale": { slug: "montvale", name: "Montvale", neighbors: ["park-ridge", "upper-saddle-river", "woodcliff-lake"] },
  "moonachie": { slug: "moonachie", name: "Moonachie", neighbors: ["carlstadt", "east-rutherford", "hasbrouck-heights", "little-ferry", "south-hackensack", "teterboro", "wood-ridge"] },
  "new-milford": { slug: "new-milford", name: "New Milford", neighbors: ["bergenfield", "dumont", "oradell", "river-edge", "teaneck"] },
  "north-arlington": { slug: "north-arlington", name: "North Arlington", neighbors: ["lyndhurst", "rutherford"] },
  "northvale": { slug: "northvale", name: "Northvale", neighbors: ["harrington-park", "norwood", "old-tappan", "rockleigh"] },
  "norwood": { slug: "norwood", name: "Norwood", neighbors: ["alpine", "closter", "northvale", "old-tappan"] },
  "oakland": { slug: "oakland", name: "Oakland", neighbors: ["franklin-lakes", "mahwah", "ramsey", "wyckoff"] },
  "old-tappan": { slug: "old-tappan", name: "Old Tappan", neighbors: ["harrington-park", "northvale", "norwood", "river-vale"] },
  "oradell": { slug: "oradell", name: "Oradell", neighbors: ["dumont", "emerson", "haworth", "new-milford", "paramus", "river-edge"] },
  "palisades-park": { slug: "palisades-park", name: "Palisades Park", neighbors: ["fort-lee", "leonia", "ridgefield"] },
  "paramus": { slug: "paramus", name: "Paramus", domain: "paramus.info", neighbors: ["fair-lawn", "glen-rock", "hackensack", "maywood", "oradell", "ridgewood", "river-edge", "rochelle-park", "saddle-brook"] },
  "park-ridge": { slug: "park-ridge", name: "Park Ridge", neighbors: ["emerson", "hillsdale", "montvale", "westwood", "woodcliff-lake"] },
  "ramsey": { slug: "ramsey", name: "Ramsey", neighbors: ["allendale", "mahwah", "oakland", "upper-saddle-river", "waldwick"] },
  "ridgefield": { slug: "ridgefield", name: "Ridgefield", neighbors: ["fairview", "little-ferry", "palisades-park", "ridgefield-park"] },
  "ridgefield-park": { slug: "ridgefield-park", name: "Ridgefield Park", neighbors: ["bogota", "ridgefield", "south-hackensack", "teaneck"] },
  "ridgewood": { slug: "ridgewood", name: "Ridgewood", domain: "ridgewood.info", neighbors: ["glen-rock", "ho-ho-kus", "midland-park", "paramus", "waldwick", "wyckoff"] },
  "river-edge": { slug: "river-edge", name: "River Edge", neighbors: ["hackensack", "maywood", "new-milford", "oradell", "paramus"] },
  "river-vale": { slug: "river-vale", name: "River Vale", neighbors: ["harrington-park", "hillsdale", "old-tappan", "westwood", "woodcliff-lake"] },
  "rochelle-park": { slug: "rochelle-park", name: "Rochelle Park", neighbors: ["hackensack", "lodi", "maywood", "paramus", "saddle-brook"] },
  "rockleigh": { slug: "rockleigh", name: "Rockleigh", neighbors: ["northvale", "old-tappan"] },
  "rutherford": { slug: "rutherford", name: "Rutherford", neighbors: ["east-rutherford", "lyndhurst", "north-arlington", "wood-ridge"] },
  "saddle-brook": { slug: "saddle-brook", name: "Saddle Brook", neighbors: ["elmwood-park", "fair-lawn", "garfield", "lodi", "paramus", "rochelle-park"] },
  "saddle-river": { slug: "saddle-river", name: "Saddle River", neighbors: ["allendale", "ho-ho-kus", "upper-saddle-river", "waldwick"] },
  "south-hackensack": { slug: "south-hackensack", name: "South Hackensack", neighbors: ["bogota", "carlstadt", "hackensack", "little-ferry", "moonachie", "ridgefield-park", "teterboro"] },
  "teaneck": { slug: "teaneck", name: "Teaneck", neighbors: ["bergenfield", "bogota", "englewood", "hackensack", "leonia", "new-milford", "ridgefield-park"] },
  "tenafly": { slug: "tenafly", name: "Tenafly", domain: "tenafly.info", neighbors: ["alpine", "cresskill", "demarest", "englewood", "englewood-cliffs"] },
  "teterboro": { slug: "teterboro", name: "Teterboro", domain: "teterboro.info", neighbors: ["hasbrouck-heights", "little-ferry", "moonachie", "south-hackensack"] },
  "upper-saddle-river": { slug: "upper-saddle-river", name: "Upper Saddle River", neighbors: ["allendale", "ho-ho-kus", "mahwah", "montvale", "ramsey", "saddle-river", "waldwick", "woodcliff-lake"] },
  "waldwick": { slug: "waldwick", name: "Waldwick", neighbors: ["allendale", "ho-ho-kus", "midland-park", "ramsey", "saddle-river", "upper-saddle-river", "wyckoff"] },
  "wallington": { slug: "wallington", name: "Wallington", neighbors: ["garfield", "south-hackensack", "wood-ridge"] },
  "washington-township": { slug: "washington-township", name: "Washington Township", neighbors: ["emerson", "hillsdale", "park-ridge", "westwood", "woodcliff-lake"] },
  "westwood": { slug: "westwood", name: "Westwood", neighbors: ["emerson", "hillsdale", "park-ridge", "river-vale", "washington-township", "woodcliff-lake"] },
  "wood-ridge": { slug: "wood-ridge", name: "Wood-Ridge", neighbors: ["carlstadt", "east-rutherford", "hasbrouck-heights", "lodi", "moonachie", "rutherford", "wallington"] },
  "woodcliff-lake": { slug: "woodcliff-lake", name: "Woodcliff Lake", neighbors: ["hillsdale", "montvale", "park-ridge", "river-vale", "upper-saddle-river", "washington-township", "westwood"] },
  "wyckoff": { slug: "wyckoff", name: "Wyckoff", domain: "wyckoff.info", neighbors: ["allendale", "franklin-lakes", "glen-rock", "midland-park", "oakland", "ridgewood", "waldwick"] },
};

export function getTownUrl(slug: string): string {
  const town = TOWN_REGISTRY[slug];
  if (!town) return "#";
  if (town.domain) return `https://${town.domain}`;
  return `https://bergen-towns.vercel.app/?town=${slug}`;
}

export function getAllSlugs(): string[] {
  return Object.keys(TOWN_REGISTRY).sort();
}

export function getNeighbors(slug: string): TownInfo[] {
  const town = TOWN_REGISTRY[slug];
  if (!town) return [];
  return town.neighbors
    .map((n) => TOWN_REGISTRY[n])
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}
