// ═══════════════════════════════════════════════════════════
//  RECOMMENDATION SERVICE — Explorer Tunisia Admin
//  ⭐ Moteur de scoring IA (simulation frontend)
// ═══════════════════════════════════════════════════════════

import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  Tag,

  Activity,   MOCK_ACTIVITIES,
  Hotel,      MOCK_HOTELS,
  FoodPlace,  MOCK_FOOD_PLACES,
  Event,      MOCK_EVENTS,
  RecommendationResult, RecommendationRule,
  EngineStats, UserSession, ScoredEntity,
  MOCK_ENGINE_STATS
} from '../models';
import { BaseService } from './base.service';
import { TagService } from './tag.service';

@Injectable({ providedIn: 'root' })
export class RecommendationService extends BaseService<RecommendationResult> {
  protected apiEndpoint = 'recommendations';
  private tagService = inject(TagService);

  // ── Signals ────────────────────────────────────────────
  private _lastResult   = signal<RecommendationResult | null>(null);
  private _loading      = signal<boolean>(false);
  private _engineStats  = signal<EngineStats>(MOCK_ENGINE_STATS);
  private _rules        = signal<RecommendationRule[]>([]);

  readonly lastResult   = this._lastResult.asReadonly();
  readonly loading      = this._loading.asReadonly();
  readonly engineStats  = this._engineStats.asReadonly();
  readonly rules        = this._rules.asReadonly();

  readonly topCity = computed(() =>
    this._lastResult()?.topCity ?? null
  );
  readonly hasResult = computed(() =>
    this._lastResult() !== null
  );

  // ══════════════════════════════════════════════════════
  //  🧠 SCORING ENGINE — Algorithme de matching par tags
  // ══════════════════════════════════════════════════════

  /**
   * Calcule le score de compatibilité entre les tags utilisateur
   * et les tags d'une entité
   * Score = (tags matchés / total tags utilisateur) * 100
   * Pondéré par l'importance relative des tags
   */
  private calculateScore(userTags: Tag[], entityTags: Tag[]): number {
    if (!userTags.length || !entityTags.length) return 0;
    const userTagSlugs = new Set(userTags.map(t => t.slug));
    const entityTagSlugs = new Set(entityTags.map(t => t.slug));
    const matchedCount = [...userTagSlugs].filter(s => entityTagSlugs.has(s)).length;
    const baseScore = (matchedCount / userTagSlugs.size) * 100;
    // Bonus si l'entité couvre plus de tags que l'utilisateur
    const coverageBonus = Math.min(entityTagSlugs.size / userTagSlugs.size, 1.2);
    return Math.min(Math.round(baseScore * coverageBonus), 100);
  }

  private findMatchedTags(userTags: Tag[], entityTags: Tag[]): Tag[] {
    const userSlugs = new Set(userTags.map(t => t.slug));
    return entityTags.filter(t => userSlugs.has(t.slug));
  }

  private findMissingTags(userTags: Tag[], entityTags: Tag[]): Tag[] {
    const entitySlugs = new Set(entityTags.map(t => t.slug));
    return userTags.filter(t => !entitySlugs.has(t.slug));
  }

  private scoreEntities<T extends { id: string; tags: Tag[] }>(
    userTags: Tag[],
    entities: T[]
  ): ScoredEntity<T>[] {
    return entities
      .map((entity, index) => ({
        entity,
        score: this.calculateScore(userTags, entity.tags),
        matchedTags: this.findMatchedTags(userTags, entity.tags),
        missingTags: this.findMissingTags(userTags, entity.tags),
        matchPercentage: entity.tags.length > 0
          ? Math.round(
              (this.findMatchedTags(userTags, entity.tags).length / entity.tags.length) * 100
            )
          : 0,
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, i) => ({ ...item, rank: i + 1 }));
  }

  // ──────────────────────────────────────────────────────
  // SIMULATE — Simulation locale complète (frontend-only)
  // ──────────────────────────────────────────────────────
  simulate(userTags: Tag[]): Observable<RecommendationResult> {
    this._loading.set(true);

    const session: UserSession = {
      sessionId: `session-${Date.now()}`,
      userTags,
      answeredQuestions: [],
      completedAt: new Date(),
    };

    const result: RecommendationResult = {
      id: `rec-${Date.now()}`,
      session,
      results: {
          activities: this.scoreEntities(userTags, MOCK_ACTIVITIES),
          hotels: this.scoreEntities(userTags, MOCK_HOTELS),
          food: this.scoreEntities(userTags, MOCK_FOOD_PLACES),
          events: this.scoreEntities(userTags, MOCK_EVENTS),
          culture: [],
          cities: []
      },
      topCity: null,
      totalEntitiesAnalyzed:
        MOCK_HOTELS.length + MOCK_FOOD_PLACES.length + MOCK_EVENTS.length,
      engineVersion: '1.0.0-mock',
      processingTimeMs: 120,
      generatedAt: new Date(),
    };

    // Déterminer la top city
    result.topCity = result.results.cities[0] ?? null;

    return this.simulateDelay(result, 600).pipe(
      tap(r => {
        this._lastResult.set(r);
        this._loading.set(false);
      })
    );

    // ── BACKEND READY ─────────────────────────────────────
    // return this.http.post<RecommendationResult>(`${this.baseUrl}/simulate`, {
    //   tagIds: userTags.map(t => t.id)
    // }).pipe(tap(r => { this._lastResult.set(r); this._loading.set(false); }));
  }

  // ──────────────────────────────────────────────────────
  // GET RESULT (depuis une session réelle)
  // ──────────────────────────────────────────────────────
  getBySession(sessionId: string): Observable<RecommendationResult> {
    this._loading.set(true);
    return this.simulateDelay(this._lastResult() as RecommendationResult).pipe(
      tap(r => { this._lastResult.set(r); this._loading.set(false); })
    );
    // return this.http.get<RecommendationResult>(`${this.baseUrl}/session/${sessionId}`);
  }

  // ────────��─────────────────────────────────────────────
  // ENGINE STATS
  // ──────────────────────────────────────────────────────
  getEngineStats(): Observable<EngineStats> {
    return this.simulateDelay(MOCK_ENGINE_STATS);
    // return this.http.get<EngineStats>(`${this.baseUrl}/stats`);
  }

  // ──────────────────────────────────────────────────────
  // RULES MANAGEMENT
  // ──────────────────────────────────────────────────────
  getRules(): Observable<RecommendationRule[]> {
    return this.simulateDelay([] as RecommendationRule[]).pipe(
      tap(rules => this._rules.set(rules))
    );
    // return this.http.get<RecommendationRule[]>(`${this.baseUrl}/rules`);
  }

  createRule(rule: Omit<RecommendationRule, 'id' | 'createdAt'>): Observable<RecommendationRule> {
    const newRule: RecommendationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
    };
    return this.simulateDelay(newRule).pipe(
      tap(r => this._rules.update(rules => [...rules, r]))
    );
    // return this.http.post<RecommendationRule>(`${this.baseUrl}/rules`, rule);
  }

  deleteRule(id: string): Observable<void> {
    return this.simulateDelay<void>(undefined as unknown as void).pipe(
      tap(() => this._rules.update(rules => rules.filter(r => r.id !== id)))
    );
    // return this.http.delete<void>(`${this.baseUrl}/rules/${id}`);
  }

  // ── Helpers ───────────────────────────────────────────
  clearResult(): void { this._lastResult.set(null); }

  getScoreForEntity(entityId: string): number {
    const result = this._lastResult();
    if (!result) return 0;
    const allScored = [
      ...result.results.cities,
      ...result.results.activities,
      ...result.results.hotels,
    ];
    return allScored.find(s => s.entity.id === entityId)?.score ?? 0;
  }
}