export interface Tag {
  id: number;
  name: string;
  created_at?: string;
}

export type EntityType = 'place' | 'event' | 'food' | 'experience' | 'city';

export const ENTITY_TYPES: { type: EntityType; label: string; icon: string }[] = [
  { type: 'city',       label: 'Cities',       icon: '🏙️' },
  { type: 'place',      label: 'Places',       icon: '📍' },
  { type: 'food',       label: 'Food',         icon: '🍽️' },
  { type: 'event',      label: 'Events',       icon: '🎭' },
  { type: 'experience', label: 'Experiences',  icon: '🎯' },
];
