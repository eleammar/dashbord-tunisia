// ═══════════════════════════════════════════════════════════
//  TAG SERVICE — Explorer Tunisia Admin
//  Gestion complète des tags (atomes du moteur IA)
// ═══════════════════════════════════════════════════════════

import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import {
  Tag, CreateTagDto, UpdateTagDto, TagStats, TagCategory, MOCK_TAGS
} from '../models';
import { BaseService, PaginatedResponse, QueryParams } from './base.service';

export interface TagQueryParams extends QueryParams {
  category?: TagCategory;
}

@Injectable({ providedIn: 'root' })
export class TagService extends BaseService<Tag> {
  protected apiEndpoint = 'tags';

  // ── State via Angular Signals ──────────────────────────
  private _tags         = signal<Tag[]>(MOCK_TAGS);
  private _loading      = signal<boolean>(false);
  private _selectedTag  = signal<Tag | null>(null);

  // ── Computed signals ───────────────────────────────────
  readonly tags         = this._tags.asReadonly();
  readonly loading      = this._loading.asReadonly();
  readonly selectedTag  = this._selectedTag.asReadonly();
  readonly activeTags   = computed(() => this._tags().filter(t => t.isActive));
  readonly totalTags    = computed(() => this._tags().length);
  readonly tagsByCategory = computed(() => {
    const groups: Record<string, Tag[]> = {};
    this._tags().forEach(tag => {
      if (!groups[tag.category]) groups[tag.category] = [];
      groups[tag.category].push(tag);
    });
    return groups;
  });
  readonly topTags = computed(() =>
    [...this._tags()].sort((a, b) => b.usageCount - a.usageCount).slice(0, 10)
  );

  // ──────────────────────────────────────────────────────
  // GETALL
  // ──────────────────────────────────────────────────────
  getAll(params?: TagQueryParams): Observable<Tag[]> {
    this._loading.set(true);

    // ── MOCK (frontend-only) ──────────────────────────────
    let filtered = [...MOCK_TAGS];
    if (params?.search) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    if (params?.category) {
      filtered = filtered.filter(t => t.category === params.category);
    }
    if (params?.isActive !== undefined) {
      filtered = filtered.filter(t => t.isActive === params.isActive);
    }
    return this.simulateDelay(filtered).pipe(
      tap(tags => {
        this._tags.set(tags);
        this._loading.set(false);
      })
    );

    // ── BACKEND READY ─────────────────────────────────────
    // const httpParams = this.buildParams(params ?? {});
    // return this.http.get<Tag[]>(this.baseUrl, { params: httpParams }).pipe(
    //   tap(tags => { this._tags.set(tags); this._loading.set(false); })
    // );
  }

  // ──────────────────────────────────────────────────────
  // GETBYID
  // ──────────────────────────────────────────────────────
  getById(id: string): Observable<Tag> {
    this._loading.set(true);
    const found = MOCK_TAGS.find(t => t.id === id);

    // ── MOCK ──────────────────────────────────────────────
    return this.simulateDelay(found as Tag).pipe(
      tap(tag => { this._selectedTag.set(tag); this._loading.set(false); })
    );

    // ── BACKEND READY ─────────────────────────────────────
    // return this.http.get<Tag>(`${this.baseUrl}/${id}`).pipe(
    //   tap(tag => { this._selectedTag.set(tag); this._loading.set(false); })
    // );
  }

  // ──────────────────────────────────────────────────────
  // CREATE
  // ──────────────────────────────────────────────────────
  create(dto: CreateTagDto): Observable<Tag> {
    this._loading.set(true);
    const newTag: Tag = {
      ...dto,
      id: `tag-${Date.now()}`,
      usageCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ── MOCK ──────────────────────────────────────────────
    return this.simulateDelay(newTag).pipe(
      tap(tag => {
        this._tags.update(tags => [...tags, tag]);
        this._loading.set(false);
      })
    );

    // ── BACKEND READY ─────────────────────────────────────
    // return this.http.post<Tag>(this.baseUrl, dto).pipe(
    //   tap(tag => { this._tags.update(t => [...t, tag]); this._loading.set(false); })
    // );
  }

  // ──────────────────────────────────────────────────────
  // UPDATE
  // ──────────────────────────────────────────────────────
  update(id: string, dto: UpdateTagDto): Observable<Tag> {
    this._loading.set(true);
    const existing = this._tags().find(t => t.id === id)!;
    const updated: Tag = { ...existing, ...dto, updatedAt: new Date() };

    // ── MOCK ──────────────────────────────────────────────
    return this.simulateDelay(updated).pipe(
      tap(tag => {
        this._tags.update(tags => tags.map(t => t.id === id ? tag : t));
        this._loading.set(false);
      })
    );

    // ── BACKEND READY ─────────────────────────────────────
    // return this.http.patch<Tag>(`${this.baseUrl}/${id}`, dto).pipe(
    //   tap(tag => {
    //   this._tags.update(tags => tags.map(t => t.id === id ? tag : t));
    //   this._loading.set(false);
    // }));
  }

  // ──────────────────────────────────────────────────────
  // DELETE
  // ──────────────────────────────────────────────────────
  delete(id: string): Observable<void> {
    this._loading.set(true);

    // ── MOCK ──────────────────────────────────────────────
    return this.simulateDelay<void>(undefined as unknown as void).pipe(
      tap(() => {
        this._tags.update(tags => tags.filter(t => t.id !== id));
        this._loading.set(false);
      })
    );

    // ── BACKEND READY ─────────────────────────────────────
    // return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
    //   tap(() => { this._tags.update(t => t.filter(t => t.id !== id)); this._loading.set(false); })
    // );
  }

  // ──────────────────────────────────────────────────────
  // TOGGLE ACTIVE
  // ──────────────────────────────────────────────────────
  toggleActive(id: string): Observable<Tag> {
    const tag = this._tags().find(t => t.id === id)!;
    return this.update(id, { isActive: !tag.isActive });
  }

  // ──────────────────────────────────────────────────────
  // GET STATS
  // ──────────────────────────────────────────────────────
  getStats(): Observable<TagStats[]> {
    const stats: TagStats[] = this._tags().map(tag => ({
      tag,
      usedInCities:      Math.floor(Math.random() * 10),
      usedInActivities:  Math.floor(Math.random() * 8),
      usedInFood:        Math.floor(Math.random() * 6),
      usedInHotels:      Math.floor(Math.random() * 12),
      usedInEvents:      Math.floor(Math.random() * 5),
      usedInCulture:     Math.floor(Math.random() * 4),
      usedInChoices:     Math.floor(Math.random() * 15),
      totalUsage:        tag.usageCount,
    }));
    return this.simulateDelay(stats);

    // ── BACKEND READY ─────────────────────────────────────
    // return this.http.get<TagStats[]>(`${this.baseUrl}/stats`);
  }

  // ── Helpers locaux ────────────────────────────────────
  findBySlug(slug: string): Tag | undefined {
    return this._tags().find(t => t.slug === slug);
  }

  findByIds(ids: string[]): Tag[] {
    return this._tags().filter(t => ids.includes(t.id));
  }

  selectTag(tag: Tag | null): void {
    this._selectedTag.set(tag);
  }
}