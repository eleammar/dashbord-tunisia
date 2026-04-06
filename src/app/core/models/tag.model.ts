// ═══════════════════════════════════════════════════════════
//  TAG MODEL — Explorer Tunisia Admin
//  Atome sémantique central du moteur de recommandation
// ═══════════════════════════════════════════════════════════

export type TagCategory =
  | 'nature'
  | 'culture'
  | 'adventure'
  | 'food'
  | 'luxury'
  | 'budget'
  | 'family'
  | 'romantic'
  | 'historical'
  | 'beach'
  | 'desert'
  | 'urban'
  | 'wellness';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  category: TagCategory;
  color: string;           // Hex color pour le badge UI  ex: "#00b0cc"
  bgColor?: string;        // Background du badge         ex: "#e6f7fa"
  icon?: string;           // Emoji ou icon name          ex: "🏖️"
  description?: string;
  usageCount: number;      // Nombre d'entités utilisant ce tag
  compatibilityScore?: number; // Score moyen de compatibilité (0-100)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── DTO pour créer/modifier un tag ─────────────────────────
export interface CreateTagDto {
  name: string;
  slug: string;
  category: TagCategory;
  color: string;
  bgColor?: string;
  icon?: string;
  description?: string;
}

export interface UpdateTagDto extends Partial<CreateTagDto> {
  isActive?: boolean;
}

// ── Interface pour les statistiques d'un tag ───────────────
export interface TagStats {
  tag: Tag;
  usedInCities: number;
  usedInActivities: number;
  usedInFood: number;
  usedInHotels: number;
  usedInEvents: number;
  usedInCulture: number;
  usedInChoices: number;
  totalUsage: number;
}

// ── Mock data pour développement frontend ──────────────────
export const MOCK_TAGS: Tag[] = [
  {
    id: 'tag-001',
    name: 'Nature',
    slug: 'nature',
    category: 'nature',
    color: '#28a745',
    bgColor: '#edf7f0',
    icon: '🌿',
    description: 'Activités et lieux en plein air',
    usageCount: 24,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tag-002',
    name: 'Plage',
    slug: 'beach',
    category: 'beach',
    color: '#00b0cc',
    bgColor: '#e6f7fa',
    icon: '🏖️',
    description: 'Bord de mer, sable et soleil',
    usageCount: 31,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tag-003',
    name: 'Culture',
    slug: 'culture',
    category: 'culture',
    color: '#e6713f',
    bgColor: '#fdf3ef',
    icon: '🏛️',
    description: 'Patrimoine, histoire et art',
    usageCount: 19,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tag-004',
    name: 'Aventure',
    slug: 'adventure',
    category: 'adventure',
    color: '#f5c21b',
    bgColor: '#fefaed',
    icon: '🧗',
    description: 'Sports extrêmes et exploration',
    usageCount: 15,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tag-005',
    name: 'Désert',
    slug: 'desert',
    category: 'desert',
    color: '#d4a616',
    bgColor: '#fdf0c4',
    icon: '🐪',
    description: 'Sahara et dunes de sable',
    usageCount: 12,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tag-006',
    name: 'Luxe',
    slug: 'luxury',
    category: 'luxury',
    color: '#9333ea',
    bgColor: '#f5f3ff',
    icon: '💎',
    description: 'Expériences haut de gamme',
    usageCount: 8,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tag-007',
    name: 'Famille',
    slug: 'family',
    category: 'family',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    icon: '👨‍👩‍👧‍👦',
    description: 'Activités adaptées aux familles',
    usageCount: 22,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tag-008',
    name: 'Romantique',
    slug: 'romantic',
    category: 'romantic',
    color: '#ec4899',
    bgColor: '#fce7f3',
    icon: '❤️',
    description: 'Escapades en couple',
    usageCount: 17,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tag-009',
    name: 'Historique',
    slug: 'historical',
    category: 'historical',
    color: '#92400e',
    bgColor: '#fef3c7',
    icon: '🏺',
    description: 'Sites archéologiques et monuments',
    usageCount: 20,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tag-010',
    name: 'Gastronomie',
    slug: 'food',
    category: 'food',
    color: '#ef4444',
    bgColor: '#fee2e2',
    icon: '🍽️',
    description: 'Cuisine tunisienne et gastronomie',
    usageCount: 26,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];