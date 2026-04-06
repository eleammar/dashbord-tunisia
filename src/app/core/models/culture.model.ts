// ═══════════════════════════════════════════════════════════
//  CULTURE MODEL — Explorer Tunisia Admin
// ═══════════════════════════════════════════════════════════

import { Tag } from './tag.model';

export type CultureCategory =
  | 'archaeological-site'
  | 'museum'
  | 'monument'
  | 'mosque'
  | 'synagogue'
  | 'church'
  | 'medina'
  | 'traditional-craft'
  | 'art-gallery'
  | 'heritage-site';

export type HeritageClassification =
  | 'UNESCO World Heritage'
  | 'National Heritage'
  | 'Regional Heritage'
  | 'None';

export interface CulturePlace {
  id: string;
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: CultureCategory;
  period?: string;           // Ex: "Antiquité", "Médiéval", "Ottoman"
  civilization?: string;     // Ex: "Carthaginois", "Romain", "Arabe"
  description: string;
  descriptionAr?: string;
  coverImage: string;
  gallery: string[];
  tags: Tag[];
  heritage: HeritageClassification;
  heritageYear?: number;     // Année de classement
  visitInfo: {
    openDays: string[];
    openTime: string;
    closeTime: string;
    entryFee: number;
    currency: 'TND' | 'EUR';
    isFree: boolean;
    guidedTour: boolean;
    audioGuide: boolean;
    languages: string[];
  };
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  rating: number;
  reviewsCount: number;
  compatibilityScore?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── DTOs ─────────────────────────────────────────────���─────
export interface CreateCulturePlaceDto {
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: CultureCategory;
  period?: string;
  civilization?: string;
  description: string;
  coverImage: string;
  gallery?: string[];
  tagIds: string[];
  heritage: HeritageClassification;
  heritageYear?: number;
  visitInfo: CulturePlace['visitInfo'];
  location: CulturePlace['location'];
}

export interface UpdateCulturePlaceDto extends Partial<CreateCulturePlaceDto> {
  isActive?: boolean;
  isFeatured?: boolean;
}

// ── Mock Data ──────────────────────────────────────────────
export const MOCK_CULTURE_PLACES: CulturePlace[] = [
  {
    id: 'culture-001',
    cityId: 'city-001',
    name: 'Carthage',
    nameAr: 'قرطاج',
    slug: 'carthage',
    category: 'archaeological-site',
    period: 'Antiquité',
    civilization: 'Carthaginois / Romain',
    description:
      'Ancienne cité phénicienne devenue grande puissance méditerranéenne, rivale de Rome.',
    coverImage: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
    gallery: [],
    tags: [],
    heritage: 'UNESCO World Heritage',
    heritageYear: 1979,
    visitInfo: {
      openDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      openTime: '08:30',
      closeTime: '17:00',
      entryFee: 12,
      currency: 'TND',
      isFree: false,
      guidedTour: true,
      audioGuide: true,
      languages: ['Français', 'Arabe', 'Anglais', 'Italien'],
    },
    location: {
      address: 'Carthage, Tunis',
      coordinates: { lat: 36.8528, lng: 10.3233 },
    },
    rating: 4.5,
    reviewsCount: 2840,
    compatibilityScore: 88,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
];