// ═══════════════════════════════════════════════════════════
//  FOOD MODEL — Explorer Tunisia Admin
// ═══════════════════════════════════════════════════════════

import { Tag } from './tag.model';

export type FoodCategory =
  | 'restaurant'
  | 'street-food'
  | 'cafe'
  | 'traditional'
  | 'seafood'
  | 'rooftop'
  | 'bakery'
  | 'juice-bar';

export type CuisineType =
  | 'tunisian'
  | 'mediterranean'
  | 'international'
  | 'french'
  | 'italian'
  | 'fusion'
  | 'vegetarian'
  | 'seafood';

export type PriceLevel = '$' | '$$' | '$$$' | '$$$$';

export interface MenuItem {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  price: number;
  currency: 'TND' | 'EUR';
  isSignature?: boolean;    // Plat signature
  allergens?: string[];
  image?: string;
}

export interface FoodPlace {
  id: string;
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: FoodCategory;
  cuisineTypes: CuisineType[];
  description: string;
  descriptionAr?: string;
  coverImage: string;
  gallery: string[];
  tags: Tag[];
  menu?: MenuItem[];
  priceLevel: PriceLevel;
  priceRange: {
    min: number;
    max: number;
    currency: 'TND' | 'EUR';
  };
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  contact: {
    phone?: string;
    instagram?: string;
    facebook?: string;
  };
  schedule: {
    openDays: string[];
    openTime: string;
    closeTime: string;
    isOpenLate?: boolean;    // Ouvert tard le soir
  };
  features: {
    hasDelivery: boolean;
    hasTakeaway: boolean;
    hasReservation: boolean;
    hasOutdoorSeating: boolean;
    isHalal: boolean;
    isVegetarianFriendly: boolean;
  };
  rating: number;
  reviewsCount: number;
  compatibilityScore?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── DTOs ───────────────────────────────────────────────────
export interface CreateFoodPlaceDto {
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: FoodCategory;
  cuisineTypes: CuisineType[];
  description: string;
  coverImage: string;
  gallery?: string[];
  tagIds: string[];
  menu?: MenuItem[];
  priceLevel: PriceLevel;
  priceRange: FoodPlace['priceRange'];
  location: FoodPlace['location'];
  contact?: FoodPlace['contact'];
  schedule: FoodPlace['schedule'];
  features?: FoodPlace['features'];
}

export interface UpdateFoodPlaceDto extends Partial<CreateFoodPlaceDto> {
  isActive?: boolean;
  isFeatured?: boolean;
}

// ── Mock Data ──────────────────────────────────────────────
export const MOCK_FOOD_PLACES: FoodPlace[] = [
  {
    id: 'food-001',
    cityId: 'city-001',
    name: "Dar El Jeld",
    slug: 'dar-el-jeld',
    category: 'restaurant',
    cuisineTypes: ['tunisian', 'mediterranean'],
    description:
      "Palais du 18ème siècle transformé en restaurant gastronomique, cuisine tunisienne authentique.",
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    gallery: [],
    tags: [],
    priceLevel: '$$$',
    priceRange: { min: 30, max: 90, currency: 'TND' },
    location: {
      address: '5 Rue Dar El Jeld, Médina de Tunis',
      coordinates: { lat: 36.7985, lng: 10.1718 },
    },
    contact: { phone: '+216 71 560 916' },
    schedule: {
      openDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      openTime: '12:00',
      closeTime: '23:00',
    },
    features: {
      hasDelivery: false,
      hasTakeaway: false,
      hasReservation: true,
      hasOutdoorSeating: false,
      isHalal: true,
      isVegetarianFriendly: false,
    },
    rating: 4.9,
    reviewsCount: 1240,
    compatibilityScore: 92,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
];