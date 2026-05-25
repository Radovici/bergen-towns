export type TownSlug = string;

export interface TownData {
  meta: TownMeta;
  overview: Overview;
  realEstate: RealEstate;
  services: MunicipalServices;
  rules: RulesOrdinances;
  schools: Schools;
  buyers: BuyersGuide;
  visitors: VisitorsGuide;
  government: LocalGovernment;
  emergency: Emergency;
}

export interface TownMeta {
  slug: TownSlug;
  name: string;
  fullName: string;
  county: string;
  state: string;
  domain: string;
  zipCodes: string[];
  themeColor: string;
  accentColor: string;
}

export interface Overview {
  tagline: string;
  description: string;
  population: number;
  populationYear: number;
  areaSqMi: number;
  elevation: string;
  incorporated: string;
  governmentType: string;
  schoolDistrict: string;
  highlights: string[];
}

export interface RealEstate {
  medianHomePrice: string;
  medianPriceYear: number;
  propertyTaxRate: string;
  averagePropertyTax: string;
  assessmentInfo: string;
  recentTrends: string;
  neighborhoodNotes: string[];
}

export interface ServiceInfo {
  title: string;
  description: string;
  details: string[];
  contactPhone?: string;
  contactUrl?: string;
}

export interface MunicipalServices {
  trashCollection: ServiceInfo;
  recycling: ServiceInfo;
  waterSewer: ServiceInfo;
  permits: ServiceInfo;
  parking: ServiceInfo;
  additionalServices: ServiceInfo[];
}

export interface OrdinanceInfo {
  title: string;
  summary: string;
  keyRules: string[];
  source?: string;
}

export interface RulesOrdinances {
  noise: OrdinanceInfo;
  propertyMaintenance: OrdinanceInfo;
  pets: OrdinanceInfo;
  parking: OrdinanceInfo;
  rentals: OrdinanceInfo;
  other: OrdinanceInfo[];
}

export interface School {
  name: string;
  grades: string;
  rating?: number;
  enrollment?: number;
  type: "public" | "private" | "charter";
  notes?: string;
}

export interface Schools {
  publicDistrict: string;
  publicSchools: School[];
  privateSchools: School[];
  nearbyHigherEd: string[];
}

export interface CommuteInfo {
  primaryMethod: string;
  duration: string;
  trainStation?: string;
  busRoutes?: string[];
  notes: string;
}

export interface CostComparison {
  summary: string;
  vsStateAverage: string;
  vsNationalAverage: string;
}

export interface BuyersGuide {
  whyMoveHere: string[];
  commuteToNYC: CommuteInfo;
  costOfLiving: CostComparison;
  prosAndCons: { pros: string[]; cons: string[] };
}

export interface Place {
  name: string;
  description: string;
  address?: string;
  category?: string;
}

export interface TownEvent {
  name: string;
  description: string;
  when: string;
}

export interface VisitorsGuide {
  restaurants: Place[];
  parks: Place[];
  events: TownEvent[];
  attractions: Place[];
  shoppingAreas: string[];
}

export interface Official {
  name: string;
  title: string;
  term?: string;
}

export interface Contact {
  department: string;
  phone: string;
  email?: string;
  hours?: string;
}

export interface LocalGovernment {
  governingBody: string;
  mayor: Official;
  council: Official[];
  meetingSchedule: string;
  meetingLocation: string;
  municipalWebsite: string;
  importantContacts: Contact[];
}

export interface EmergencyContact {
  emergency: string;
  nonEmergency: string;
  address?: string;
}

export interface HospitalInfo {
  name: string;
  address: string;
  phone: string;
  distanceMiles?: number;
}

export interface UtilityContact {
  service: string;
  provider: string;
  phone: string;
  url?: string;
}

export interface Emergency {
  police: EmergencyContact;
  fire: EmergencyContact;
  ems: EmergencyContact;
  hospitals: HospitalInfo[];
  utilities: UtilityContact[];
  importantNumbers: { label: string; number: string }[];
}
