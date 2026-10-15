import type {
  PanoramaScene,
  RegionalSecretCatalogItem,
  PanoramaHotspot,
  HotspotType,
  HotspotInfoContent,
  HotspotTourContent,
  HotspotSecretContent
} from "@/data/experience-360";
import type { InstagramPost, InstagramProfile } from "@/data/instagram";
import type { Tour } from "@/data/tours";

export type {
  PanoramaScene,
  RegionalSecretCatalogItem,
  PanoramaHotspot,
  HotspotType,
  HotspotInfoContent,
  HotspotTourContent,
  HotspotSecretContent,
  InstagramPost,
  InstagramProfile,
  Tour
};

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  title: string;
  stat: string;
  statLabel: string;
  description: string;
}

export interface RouteItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export interface ShowcaseCard {
  id: string;
  title: string;
  image: string;
  size: "small" | "medium" | "large" | "wide";
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  image: string;
  rating: number;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutSectionData {
  eyebrow: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  stats: AboutStat[];
  mainImage: string;
  secondaryImage: string;
}

export interface Experience360SectionData {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  scenes: PanoramaScene[];
  secretsCatalog: RegionalSecretCatalogItem[];
  totalSecretsCount: number;
}

export interface GallerySectionData {
  eyebrow: string;
  title: string;
  cards: ShowcaseCard[];
}

export interface MaintenanceSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  estimatedReturn: string;
  contactWhatsApp: string;
  whatsappMessage: string;
  instagramHandle: string;
  instagramUrl: string;
  allowAdminBypass: boolean;
  showAdminLink: boolean;
}

export interface GeneralSettings {
  siteName: string;
  whatsappNumber: string;
  whatsappFormatted: string;
  whatsappDefaultMessage: string;
  instagramHandle: string;
  instagramUrl: string;
  maintenance?: MaintenanceSettings;
}

export interface SiteContent {
  heroSlides: HeroSlide[];
  about: AboutSectionData;
  routes: {
    homeItems: RouteItem[];
    tours: Tour[];
  };
  gallery: GallerySectionData;
  experience360: Experience360SectionData;
  testimonials: Testimonial[];
  instagram: {
    profile: InstagramProfile;
    curatedPosts: InstagramPost[];
  };
  settings: GeneralSettings;
  lastUpdated?: string;
}
