// ═══════════════════════════════════════════════════════════
//  EVENT MODEL — Explorer Tunisia Admin
// ═══════════════════════════════════════════════════════════

import { Tag } from './tag.model';

export type EventCategory =
  | 'festival'
  | 'concert'
  | 'exhibition'
  | 'sports'
  | 'cultural'
  | 'religious'
  | 'food-festival'
  | 'conference';

export type EventStatus =
  | 'draft'
  | 'published'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export interface EventOrganizer {
  name: string;
  logo?: string;
  contact?: string;
  website?: string;
}

export interface EventTicket {
  type: string;            // Ex: "Standard", "VIP"
  price: number;
  currency: 'TND' | 'EUR';
  available: number;
  isFree: boolean;
}

export interface Event {
  id: string;
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: EventCategory;
  description: string;
  descriptionAr?: string;
  coverImage: string;
  gallery: string[];
  tags: Tag[];
  organizer?: EventOrganizer;
  tickets: EventTicket[];
  schedule: {
    startDate: Date;
    endDate: Date;
    startTime?: string;
    endTime?: string;
    isRecurring: boolean;
    recurrencePattern?: string;
  };
  venue: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    capacity?: number;
  };
  status: EventStatus;
  expectedAttendees?: number;
  actualAttendees?: number;
  isFreeEntry: boolean;
  isOutdoor: boolean;
  compatibilityScore?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── DTOs ───────────────────────────────────────────────────
export interface CreateEventDto {
  cityId: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: EventCategory;
  description: string;
  coverImage: string;
  gallery?: string[];
  tagIds: string[];
  organizer?: EventOrganizer;
  tickets?: EventTicket[];
  schedule: Event['schedule'];
  venue: Event['venue'];
  isFreeEntry: boolean;
  isOutdoor: boolean;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  status?: EventStatus;
  actualAttendees?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

// ── Mock Data ──────────────────────────────────────────────
export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-001',
    cityId: 'city-004',
    name: 'Festival International du Sahara',
    slug: 'festival-international-sahara',
    category: 'festival',
    description:
      'Le plus grand festival saharien au monde, célébrant la culture nomade et berbère.',
    coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    gallery: [],
    tags: [],
    organizer: {
      name: 'Office National du Tourisme Tunisien',
      website: 'https://www.discovertunisia.com',
    },
    tickets: [
      { type: 'Entrée générale', price: 0, currency: 'TND', available: 9999, isFree: true },
    ],
    schedule: {
      startDate: new Date('2025-12-18'),
      endDate: new Date('2025-12-21'),
      isRecurring: true,
      recurrencePattern: 'Annuel en décembre',
    },
    venue: {
      name: 'Espace des Spectacles de Douz',
      address: 'Douz, Gouvernorat de Kébili',
      coordinates: { lat: 33.4569, lng: 9.0183 },
      capacity: 15000,
    },
    status: 'published',
    expectedAttendees: 80000,
    isFreeEntry: true,
    isOutdoor: true,
    compatibilityScore: 85,
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
];