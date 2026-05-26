export interface SponsorProfile {
  id: string;
  stripeSubscriptionId: string;
  managementToken: string;
  tierId: string;
  tierName: string;
  status: "active" | "canceled" | "past_due";
  townSlug: string;
  townName: string;
  email: string;

  businessName: string;
  description: string;
  website?: string;
  phone?: string;
  category?: string;
  logoUrl?: string;
  bannerUrl?: string;
  profileCardHtml?: string;

  pendingReview?: {
    fields: Record<string, string>;
    reason: string;
    submittedAt: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface TownSponsorIndex {
  townSlug: string;
  lastUpdated: string;
  sponsors: TownSponsorEntry[];
}

export interface TownSponsorEntry {
  id: string;
  tierId: string;
  businessName: string;
  description: string;
  website?: string;
  phone?: string;
  category?: string;
  logoUrl?: string;
  bannerUrl?: string;
  profileCardHtml?: string;
}

export interface ModerationResult {
  approved: boolean;
  needsReview?: boolean;
  reason?: string;
  flaggedFields?: string[];
}
