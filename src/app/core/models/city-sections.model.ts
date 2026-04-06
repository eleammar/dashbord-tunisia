// ── Base Section ─────────────────────────────────────────────
export interface BaseSection {
  id:        string;
  type:      SectionType;
  isEnabled: boolean;
  order:     number;
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'discover'
  | 'activities'
  | 'hotels'
  | 'food'
  | 'events'
  | 'culture'
  | 'banner'
  | 'gallery'
  | 'map';

// ── Section Hero ──────────────────────────────────────────────
export interface HeroSection extends BaseSection {
  type:         'hero';
  coverImage:   string;
  overlayOpacity: number;       // 0–100
  tagline:      string;
  showStats:    boolean;
  showWeather:  boolean;
}

// ── Section About ─────────────────────────────────────────��──
export interface AboutSection extends BaseSection {
  type:          'about';
  title:         string;
  description:   string;
  descriptionAr: string;
  highlights:    { icon: string; label: string; value: string }[];
  climate:       string;
  bestSeason:    string[];
}

// ── Section Discover ─────────────────────────────────────────
export interface DiscoverSection extends BaseSection {
  type:    'discover';
  title:   string;
  subtitle: string;
  items:   { title: string; description: string; image: string; link?: string }[];
}

// ── Section Activities ───────────────────────────────────────
export interface ActivitiesSection extends BaseSection {
  type:          'activities';
  title:         string;
  subtitle:      string;
  displayMode:   'grid' | 'carousel' | 'list';
  maxItems:      number;
  activityIds:   string[];
}

// ── Section Hotels ───────────────────────────────────────────
export interface HotelsSection extends BaseSection {
  type:        'hotels';
  title:       string;
  subtitle:    string;
  displayMode: 'grid' | 'carousel';
  maxItems:    number;
  hotelIds:    string[];
}

// ── Section Food ─────────────────────────────────────────────
export interface FoodSection extends BaseSection {
  type:        'food';
  title:       string;
  subtitle:    string;
  displayMode: 'grid' | 'list';
  maxItems:    number;
  foodIds:     string[];
}

// ── Section Events ───────────────────────────────────────────
export interface EventsSection extends BaseSection {
  type:        'events';
  title:       string;
  subtitle:    string;
  displayMode: 'grid' | 'timeline';
  maxItems:    number;
  eventIds:    string[];
}

// ── Section Culture ──────────────────────────────────────────
export interface CultureSection extends BaseSection {
  type:        'culture';
  title:       string;
  subtitle:    string;
  displayMode: 'grid' | 'masonry';
  maxItems:    number;
  cultureIds:  string[];
}

// ── Section Banner (UNESCO, promo…) ──────────────────────────
export interface BannerSection extends BaseSection {
  type:          'banner';
  style:         'info' | 'warning' | 'success' | 'gradient';
  icon:          string;
  title:         string;
  description:   string;
  badgeText:     string;
  ctaLabel:      string;
  ctaLink:       string;
  bgColor:       string;
}

// ── Section Gallery ──────────────────────────────────────────
export interface GallerySection extends BaseSection {
  type:   'gallery';
  title:  string;
  images: { url: string; caption: string; alt: string }[];
  layout: 'masonry' | 'grid' | 'strip';
}

// ── Section Map ──────────────────────────────────────────────
export interface MapSection extends BaseSection {
  type:   'map';
  title:  string;
  zoom:   number;
  showPOI: boolean;
}

// ── Union type ───────────────────────────────────────────────
export type CitySection =
  | HeroSection | AboutSection | DiscoverSection
  | ActivitiesSection | HotelsSection | FoodSection
  | EventsSection | CultureSection | BannerSection
  | GallerySection | MapSection;

// ── City SEO ─────────────────────────────────────────────────
export interface CitySeo {
  metaTitle:       string;
  metaDescription: string;
  keywords:        string[];
  ogImage:         string;
  ogDescription:   string;
  canonicalUrl:    string;
}

// ── Content Score ────────────────────────────────────────────
export interface ContentScore {
  total:       number;   // 0–100
  seo:         number;
  media:       number;
  relations:   number;
  description: number;
  tags:        number;
  sections:    number;
  issues:      string[];
  suggestions: string[];
}