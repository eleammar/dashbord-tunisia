// ═══════════════════════════════════════════════════════════
//  ACTIVITY MODEL — Explorer Tunisia Admin
// ═══════════════════════════════════════════════════════════

import { Tag } from './tag.model';

export type ActivityCategory =
  | 'outdoor'
  | 'cultural'
  | 'water-sports'
  | 'desert'
  | 'wellness'
  | 'nightlife'
  | 'shopping'
  | 'family'
  | 'sports';

export type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'extreme';

export interface ActivitySchedule {
  openDays: string[];      // Ex: ["Lundi", "Mardi", ...]
  openTime: string;        // Ex: "08:00"
  closeTime: string;       // Ex: "18:00"
  seasonalNote?: string;
}

export interface Activity {
  id: string;
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: ActivityCategory;
  description: string;
  descriptionAr?: string;
  coverImage: string;
  gallery: string[];
  tags: Tag[];
  price: {
    min: number;
    max: number;
    currency: 'TND' | 'EUR' | 'USD';
    isFree: boolean;
  };
  duration: {
    min: number;            // en heures
    max: number;
    unit: 'hour' | 'day';
  };
  difficulty: DifficultyLevel;
  maxParticipants?: number;
  minAge?: number;
  schedule?: ActivitySchedule;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  rating: number;           // 0-5
  reviewsCount: number;
  compatibilityScore?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── DTOs ───────────────────────────────────────────────────
export interface CreateActivityDto {
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: ActivityCategory;
  description: string;
  coverImage: string;
  gallery?: string[];
  tagIds: string[];
  price: Activity['price'];
  duration: Activity['duration'];
  difficulty: DifficultyLevel;
  maxParticipants?: number;
  minAge?: number;
  schedule?: ActivitySchedule;
  location: Activity['location'];
}

export interface UpdateActivityDto extends Partial<CreateActivityDto> {
  isActive?: boolean;
  isFeatured?: boolean;
}

// ── Mock Data ──────────────────────────────────────────────
export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    cityId: 'city-004',
    name: 'Excursion en chameau dans le Sahara',
    slug: 'excursion-chameau-sahara',
    category: 'desert',
    description:
      'Découvrez les grandes dunes du Sahara à dos de chameau au coucher du soleil.',
    coverImage: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
    gallery: [],
    tags: [],
    price: { min: 30, max: 80, currency: 'TND', isFree: false },
    duration: { min: 2, max: 4, unit: 'hour' },
    difficulty: 'easy',
    maxParticipants: 20,
    minAge: 5,
    location: {
      address: 'Douz, Gouvernorat de Kébili',
      coordinates: { lat: 33.4569, lng: 9.0183 },
    },
    rating: 4.8,
    reviewsCount: 312,
    compatibilityScore: 88,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'act-002',
    cityId: 'city-001',
    name: 'Visite guidée de la Médina de Tunis',
    slug: 'visite-medina-tunis',
    category: 'cultural',
    description:
      'Plongez dans les ruelles de la médina classée UNESCO, entre souks, mosquées et palais.',
    coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800',
    gallery: [],
    tags: [],
    price: { min: 20, max: 50, currency: 'TND', isFree: false },
    duration: { min: 2, max: 3, unit: 'hour' },
    difficulty: 'easy',
    maxParticipants: 15,
    minAge: 0,
    location: {
      address: 'Médina de Tunis',
      coordinates: { lat: 36.7992, lng: 10.1724 },
    },
    rating: 4.6,
    reviewsCount: 528,
    compatibilityScore: 79,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
];