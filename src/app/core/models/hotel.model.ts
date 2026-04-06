// ═══════════════════════════════════════════════════════════
//  HOTEL MODEL — Explorer Tunisia Admin
// ═══════════════════════════════════════════════════════════

import { Tag } from './tag.model';

export type HotelCategory =
  | 'luxury'
  | 'boutique'
  | 'resort'
  | 'riad'
  | 'hostel'
  | 'guesthouse'
  | 'apartment';

export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface HotelAmenity {
  id: string;
  name: string;
  icon: string;    // Emoji ou icon name
  category: 'comfort' | 'services' | 'leisure' | 'dining';
}

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  currency: 'TND' | 'EUR' | 'USD';
  amenities: string[];
  images: string[];
}

export interface Hotel {
  id: string;
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: HotelCategory;
  stars: StarRating;
  description: string;
  descriptionAr?: string;
  coverImage: string;
  gallery: string[];
  tags: Tag[];
  amenities: HotelAmenity[];
  roomTypes: RoomType[];
  priceRange: {
    min: number;
    max: number;
    currency: 'TND' | 'EUR' | 'USD';
  };
  location: {
    address: string;
    distanceFromCenter: number;  // en km
    coordinates: { lat: number; lng: number };
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  rating: number;         // 0-5
  reviewsCount: number;
  compatibilityScore?: number;
  checkIn: string;        // Ex: "14:00"
  checkOut: string;       // Ex: "12:00"
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── DTOs ───────────────────────────────────────────────────
export interface CreateHotelDto {
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: HotelCategory;
  stars: StarRating;
  description: string;
  coverImage: string;
  gallery?: string[];
  tagIds: string[];
  amenities?: HotelAmenity[];
  roomTypes?: RoomType[];
  priceRange: Hotel['priceRange'];
  location: Hotel['location'];
  contact?: Hotel['contact'];
  checkIn: string;
  checkOut: string;
}

export interface UpdateHotelDto extends Partial<CreateHotelDto> {
  isActive?: boolean;
  isFeatured?: boolean;
}

// ── Mock Data ──────────────────────────────────────────────
export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'hotel-001',
    cityId: 'city-002',
    name: 'Djerba Dream Resort & Spa',
    slug: 'djerba-dream-resort',
    category: 'resort',
    stars: 5,
    description:
      'Resort 5 étoiles sur la plage de Djerba avec thalassothérapie et vue mer imprenable.',
    coverImage: 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800',
    gallery: [],
    tags: [],
    amenities: [
      { id: 'am-1', name: 'Piscine', icon: '🏊', category: 'leisure' },
      { id: 'am-2', name: 'Spa', icon: '🧖', category: 'leisure' },
      { id: 'am-3', name: 'Wi-Fi gratuit', icon: '📶', category: 'services' },
      { id: 'am-4', name: 'Restaurant gastronomique', icon: '🍽️', category: 'dining' },
    ],
    roomTypes: [],
    priceRange: { min: 150, max: 450, currency: 'TND' },
    location: {
      address: 'Zone Touristique, Midoun, Djerba',
      distanceFromCenter: 3.5,
      coordinates: { lat: 33.8120, lng: 10.9845 },
    },
    contact: {
      phone: '+216 75 XXX XXX',
      email: 'info@djerba-dream.tn',
      website: 'https://djerba-dream.tn',
    },
    rating: 4.7,
    reviewsCount: 892,
    compatibilityScore: 90,
    checkIn: '14:00',
    checkOut: '12:00',
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
];