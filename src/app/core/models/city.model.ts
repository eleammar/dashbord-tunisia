// ═══════════════════════════════════════════════════════════════════════════════
//  CITY MODEL — Adapted for backend-tunisia
// ═══════════════════════════════════════════════════════════════════════════════
import { AllFood } from "./food.model";
export type TunisiaRegion =
  'Nord' | 'Nord-Est' | 'Nord-Ouest' |
  'Centre' | 'Centre-Est' | 'Centre-Ouest' |
  'Sud' | 'Sud-Est' | 'Sud-Ouest';

// ── HERO SECTION ───────────────────────────────────────────────────────────
export interface HeroCard {
  id: string;
  img: string;
  name: string;
}

export interface HeroSection {
  bg: string;
  desc: string;
  cards: HeroCard[];
}

// ── ABOUT SECTION ──────────────────────────────────────────────────────────
export interface AboutStat {
  icon: string;
  num: string;
  label: string;
}

export interface AboutSection {
  label: string;
  headline: string;
  body: string;
  img: string;
  stats: AboutStat[];
}

// ── CULTURE SECTION ────────────────────────────────────────────────────────
export interface CultureSection {
  title: string;
  country: string;
  items: any[];
}

// ── EVENT ──────────────────────────────────────────────────────────────────
export interface CityEvent {
  id: string;
  date: string;
  name: string;
  img: string;
}

// ── EXPERIENCE/ACTIVITY ───────────────────────────────────────────────────
export interface Experience {
  id: string;
  name: string;
  type: string;
  r: number; // rating
  img: string;
}



// ── HOTEL ──────────────────────────────────────────────────────────────────
export interface HotelItem {
  id: string;
  n: string; // name
  dist: number; // distance
  img: string;
  r: number; // rating
  price: number;
}

// ── DELEGATION ─────────────────────────────────────────────────────────────
export interface Delegation {
  id: string;
  name: string;
  pop: number; // population
  area: number;
  desc: string;
  img: string;
  founded: number;
  notable: string;
  type: string;
  lat: number;
  lng: number;
}

// ── BANNER ─────────────────────────────────────────────────────────────────
export interface BannerData {
  type: 'carousel' | 'video' | 'static';
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  videoUrl?: string;
  videoPoster?: string;
  images?: string[];
}

// ── CTA ────────────────────────────────────────────────────────────────────
export interface CTA {
  label: string;
  title: string;
  description: string;
  image: string;
}

// ── MAIN CITY INTERFACE ────────────────────────────────────────────────────
export interface City {
  id: string;
  name: string;
  region: TunisiaRegion;
  mapSrc: string;
  mapCenter: [number, number]; // [lat, lng]
  mapZoom: number;

  // ── Sections ────────────────────────────────────────────────────────────
  hero: HeroSection;
  about?: AboutSection;
  culture: CultureSection;
  events: CityEvent[];
  experiences: Experience[];
  food: AllFood[];
  hotels: HotelItem[];
  delegations: Delegation[];
  banner?: BannerData;
  cta: CTA;
}

// ── SUMMARY (for list view) ────────────────────────────────────────────────
export interface CityListItem {
  id: string;
  name: string;
  region: TunisiaRegion;
}