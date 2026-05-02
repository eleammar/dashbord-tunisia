import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  Category,
  Circuit,
  CircuitStop,
  CityGuide,
  HeroCategory,
  HeroSection,
  LiveGuide,
  Place
} from '../models/guide.model';

const BASE = 'http://localhost:5000/api/guide';

@Injectable({ providedIn: 'root' })
export class GuideService {
  constructor(private http: HttpClient) {}

  private unwrapArray<T>(res: T[] | { data?: T[] } | null | undefined): T[] {
    if (Array.isArray(res)) return res;
    return Array.isArray(res?.data) ? res.data : [];
  }

  // ─────────────────────────────────────────
  // ✅ CACHE (OPTIONAL BUT PRO)
  // ─────────────────────────────────────────
  private cache = new Map<number, CityGuide>();

  // ─────────────────────────────────────────
  // ✅ MAIN GUIDE (🔥 CORE ENDPOINT)
  // ─────────────────────────────────────────
  getCityGuide(cityId: number): Observable<{ success: boolean; data: CityGuide }> {
    if (this.cache.has(cityId)) {
      return of({ success: true, data: this.cache.get(cityId)! });
    }

    const categories$ = this.http
      .get<Category[] | { data?: Category[] }>(`${BASE}/categories`)
      .pipe(
        map((res) => this.unwrapArray<Category>(res)),
        catchError(() => of([]))
      );

    const places$ = this.http
      .get<Place[] | { data?: Place[] }>(`${BASE}/places`)
      .pipe(
        map((res) => this.unwrapArray<Place>(res).filter((p) => Number(p.city_id) === Number(cityId))),
        catchError(() => of([]))
      );

    const circuits$ = this.http
      .get<Circuit[] | { data?: Circuit[] }>(`${BASE}/circuits`)
      .pipe(
        map((res) => this.unwrapArray<Circuit>(res).filter((c) => Number(c.city_id) === Number(cityId))),
        catchError(() => of([]))
      );

    const liveGuides$ = this.http
      .get<LiveGuide[] | { data?: LiveGuide[] }>(`${BASE}/live-guides`)
      .pipe(
        map((res) => this.unwrapArray<LiveGuide>(res).filter((g) => Number(g.city_id) === Number(cityId))),
        catchError(() => of([]))
      );

    const heroCategories$ = this.http
      .get<HeroCategory[] | { data?: HeroCategory[] }>(`${BASE}/hero-categories`)
      .pipe(
        map((res) => this.unwrapArray<HeroCategory>(res)),
        catchError(() => of([]))
      );

    const hero$ = this.getHeroSectionByCity(cityId).pipe(catchError(() => of(null)));

    return forkJoin({
      categories: categories$,
      places: places$,
      circuits: circuits$,
      liveGuides: liveGuides$,
      heroCategories: heroCategories$,
      hero: hero$,
    }).pipe(
      map(({ categories, places, circuits, liveGuides, heroCategories, hero }) => {
        const data: CityGuide = {
          city: { id: cityId, name: `City ${cityId}` },
          hero,
          heroCategories,
          categories,
          places,
          circuits,
          liveGuides,
        };
        this.cache.set(cityId, data);
        return { success: true, data };
      })
    );
  }

  // ─────────────────────────────────────────
  // ✅ CATEGORIES
  // ─────────────────────────────────────────
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${BASE}/categories`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${BASE}/categories/${id}`);
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${BASE}/categories`, data);
  }

  updateCategory(id: number, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${BASE}/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${BASE}/categories/${id}`);
  }

  // ─────────────────────────────────────────
  // ✅ PLACES
  // ─────────────────────────────────────────
  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${BASE}/places`);
  }

  getPlacesByCity(cityId: number): Observable<Place[]> {
    return this.http.get<Place[]>(`${BASE}/places/city/${cityId}`);
  }

  getPlace(id: number): Observable<Place> {
    return this.http.get<Place>(`${BASE}/places/${id}`);
  }

  createPlace(data: Partial<Place>): Observable<Place> {
    return this.http.post<Place>(`${BASE}/places`, data);
  }

  updatePlace(id: number, data: Partial<Place>): Observable<Place> {
    return this.http.put<Place>(`${BASE}/places/${id}`, data);
  }

  deletePlace(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${BASE}/places/${id}`);
  }

  // ─────────────────────────────────────────
  // ✅ CIRCUITS
  // ─────────────────────────────────────────
  getCircuits(): Observable<Circuit[]> {
    return this.http.get<Circuit[]>(`${BASE}/circuits`);
  }

  getCircuitsByCity(cityId: number): Observable<Circuit[]> {
    return this.http.get<Circuit[] | { data?: Circuit[] }>(`${BASE}/circuits`).pipe(
      map((res) => this.unwrapArray<Circuit>(res).filter((c) => Number(c.city_id) === Number(cityId))),
      catchError(() => of([]))
    );
  }

  getCircuit(id: string): Observable<Circuit> {
    return this.http.get<Circuit>(`${BASE}/circuits/${id}`);
  }

  createCircuit(data: Partial<Circuit>): Observable<Circuit> {
    return this.http.post<Circuit>(`${BASE}/circuits`, data);
  }

  updateCircuit(id: string, data: Partial<Circuit>): Observable<Circuit> {
    return this.http.put<Circuit>(`${BASE}/circuits/${id}`, data);
  }

  deleteCircuit(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${BASE}/circuits/${id}`);
  }

  // ─────────────────────────────────────────
  // ✅ CIRCUIT STOPS
  // ─────────────────────────────────────────
  getStopsByCircuit(circuitId: string): Observable<CircuitStop[]> {
    return this.http.get<CircuitStop[]>(`${BASE}/circuit-stops/${circuitId}`);
  }

  createStop(data: Partial<CircuitStop>): Observable<CircuitStop> {
    return this.http.post<CircuitStop>(`${BASE}/circuit-stops`, data);
  }

  updateStop(id: number, data: Partial<CircuitStop>): Observable<CircuitStop> {
    return this.http.put<CircuitStop>(`${BASE}/circuit-stops/${id}`, data);
  }

reorderStops(circuitId: string, stops: any[]) {
  return this.http.put(
    `${BASE}/circuit-stops/reorder/${circuitId}`,
    { stops } 
  );
}
  deleteStop(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${BASE}/circuit-stops/${id}`
    );
  }

  // ─────────────────────────────────────────
  // ✅ LIVE GUIDES (FIXED ROUTE)
  // ─────────────────────────────────────────
  getLiveGuides(): Observable<LiveGuide[]> {
    return this.http.get<LiveGuide[]>(`${BASE}/live-guides`);
  }

  getLiveGuidesByCity(cityId: number): Observable<LiveGuide[]> {
    return this.http.get<LiveGuide[]>(`${BASE}/live-guides/city/${cityId}`);
  }

  getLiveGuide(id: string): Observable<LiveGuide> {
    return this.http.get<LiveGuide>(`${BASE}/live-guides/${id}`);
  }

  createLiveGuide(data: Partial<LiveGuide>): Observable<LiveGuide> {
    return this.http.post<LiveGuide>(`${BASE}/live-guides`, data);
  }

  updateLiveGuide(id: string, data: Partial<LiveGuide>): Observable<LiveGuide> {
    return this.http.put<LiveGuide>(`${BASE}/live-guides/${id}`, data);
  }

  deleteLiveGuide(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${BASE}/live-guides/${id}`
    );
  }

  // ─────────────────────────────────────────
  // ✅ HERO CATEGORIES
  // ─────────────────────────────────────────
  getHeroCategories(): Observable<HeroCategory[]> {
    return this.http.get<HeroCategory[]>(`${BASE}/hero-categories`);
  }

  createHeroCategory(data: Partial<HeroCategory>): Observable<HeroCategory> {
    return this.http.post<HeroCategory>(`${BASE}/hero-categories`, data);
  }

  updateHeroCategory(id: number, data: Partial<HeroCategory>): Observable<HeroCategory> {
    return this.http.put<HeroCategory>(`${BASE}/hero-categories/${id}`, data);
  }

  deleteHeroCategory(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${BASE}/hero-categories/${id}`
    );
  }

  // HERO SECTIONS CRUD (compatibility for legacy callers)
  createHeroSection(data: Partial<HeroSection>): Observable<HeroSection> {
    return this.http.post<HeroSection>(`${BASE}/hero-sections`, data);
  }

  updateHeroSection(id: number, data: Partial<HeroSection>): Observable<HeroSection> {
    return this.http.put<HeroSection>(`${BASE}/hero-sections/${id}`, data);
  }

  deleteHeroSection(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${BASE}/hero-sections/${id}`);
  }

  // ─────────────────────────────────────────
  // 🚨 HERO SECTION (REMOVED CITY ENDPOINT)
  // ─────────────────────────────────────────
  // ⚠️ IMPORTANT:
  // Hero comes from getCityGuide() now
  // DO NOT call /hero-sections/city/:id anymore

  // Compatibility helper used by legacy components: returns the city's hero section (or null).
  getHeroSectionByCity(cityId: number): Observable<HeroSection | null> {
    return this.http
      .get<HeroSection[] | { data?: HeroSection[] }>(`${BASE}/hero-sections`)
      .pipe(
        map((res) => this.unwrapArray<HeroSection>(res)),
        map((sections) => sections.find((s) => Number(s.city_id) === Number(cityId)) ?? null),
        catchError(() => of(null))
      );
  }
}