
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  logo: string;
  industry: string;
  partnershipOffers?: string[];
  sponsorshipOffers?: string[];
}

export type PlatformType = "partnership" | "sponsorship";

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface PricingTier {
  name: string;
  description: string;
  price: number;
  features: string[];
  cta: string;
  popular?: boolean;
}
