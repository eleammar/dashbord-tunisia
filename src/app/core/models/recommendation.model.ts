// ═══════════════════════════════════════════════════════════
//  RECOMMENDATION MODEL — Explorer Tunisia Admin
//  Résultat du moteur de recommandation IA
// ═══════════════════════════════════════════════════════════

import { Tag } from './tag.model';
import { City } from './city.model';
import { Activity } from './activity.model';
import { Hotel } from './hotel.model';
import { Event } from './event.model';
import { CulturePlace } from './culture.model';

// ── Entité scorée par le moteur IA ─────────────────────────
export interface ScoredEntity<T> {
  entity: T;
  score: number;            // 0-100
  matchedTags: Tag[];       // Tags qui correspondent
  missingTags: Tag[];       // Tags demandés mais absents
  matchPercentage: number;  // Pourcentage de tags matchés
  rank: number;
}

// ── Réponse d'une session questionnaire ───────────────────
export interface UserSession {
  sessionId: string;
  userId?: string;           // Optionnel si non connecté
  userTags: Tag[];           // Tags collectés via questionnaire
  answeredQuestions: {
    questionId: string;
    selectedChoiceIds: string[];
    collectedTags: Tag[];
  }[];
  completedAt: Date;
}

// ── Résultat complet de la recommandation ─────────────────
export interface RecommendationResult {
  id: string;
  session: UserSession;
  results: {
    cities:     ScoredEntity<City>[];
    activities: ScoredEntity<Activity>[];
    hotels:     ScoredEntity<Hotel>[];
    events:     ScoredEntity<Event>[];
    culture:    ScoredEntity<CulturePlace>[];
  };
  topCity: ScoredEntity<City> | null;
  totalEntitiesAnalyzed: number;
  engineVersion: string;
  processingTimeMs: number;
  generatedAt: Date;
}

// ── Règle du moteur de recommandation ─────────────────────
export interface RecommendationRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    tagSlugs: string[];        // Tags requis
    operator: 'AND' | 'OR';
    minMatchCount?: number;
  };
  action: {
    boostEntityType: 'city' | 'activity' | 'hotel' | 'food' | 'event' | 'culture';
    boostFactor: number;       // Multiplicateur de score (ex: 1.5 = +50%)
    tagSlugsToBoost: string[];
  };
  priority: number;
  isActive: boolean;
  createdAt: Date;
}

// ── Statistiques du moteur ─────────────────────────────────
export interface EngineStats {
  totalRecommendations: number;
  averageScore: number;
  satisfactionRate: number;   // % d'utilisateurs satisfaits
  topMatchedTags: {
    tag: Tag;
    matchCount: number;
    averageScore: number;
  }[];
  topRecommendedCities: {
    city: City;
    recommendationCount: number;
    averageScore: number;
  }[];
  engineHealthScore: number;  // 0-100 (santé globale du moteur)
  lastUpdated: Date;
}

// ── Mock data pour simulation ──────────────────────────────
export const MOCK_ENGINE_STATS: EngineStats = {
  totalRecommendations: 4820,
  averageScore: 73,
  satisfactionRate: 89,
  topMatchedTags: [],
  topRecommendedCities: [],
  engineHealthScore: 87,
  lastUpdated: new Date(),
};