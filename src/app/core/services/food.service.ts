import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, finalize, map, retry, tap } from 'rxjs/operators';

import {
  PopularFood,
  AllFood,
  FoodRegion,
  FoodEvent,
  Restaurant,
  FoodCategory
} from '../models/food.model';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = 'http://localhost:5000/api/food'; // Full URL for local development
  private readonly fallbackFoodImage = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80';

  // Subjects & state
  private popularFoodsSubject = new BehaviorSubject<PopularFood[]>([]);
  private allFoodsSubject = new BehaviorSubject<AllFood[]>([]);
  private regionsSubject = new BehaviorSubject<FoodRegion[]>([]);
  private eventsSubject = new BehaviorSubject<FoodEvent[]>([]);
  private restaurantsSubject = new BehaviorSubject<Restaurant[]>([]);
  private categoriesSubject = new BehaviorSubject<FoodCategory[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Exposed observables
  popularFoods$ = this.popularFoodsSubject.asObservable();
  allFoods$ = this.allFoodsSubject.asObservable();
  regions$ = this.regionsSubject.asObservable();
  events$ = this.eventsSubject.asObservable();
  restaurants$ = this.restaurantsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();

  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ---------- Utilities ----------
  private normalizeImageUrl(rawUrl?: string | null): string {
    if (!rawUrl) return this.fallbackFoodImage;
    const url = (rawUrl || '').toString().trim();
    if (!url) return this.fallbackFoodImage;
    if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
    const apiOrigin = new URL(this.apiUrl).origin;
    return `${apiOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private mapPopularFood(raw: any): PopularFood {
    const image = raw?.imageUrl ?? raw?.image_url ?? raw?.image;
    return { ...raw, imageUrl: this.normalizeImageUrl(image) } as PopularFood;
  }

  private mapAllFood(raw: any): AllFood {
    const image = raw?.imageUrl ?? raw?.image_url ?? raw?.image;
    const imageUrl = this.normalizeImageUrl(image);
    return { ...raw, imageUrl, image_url: raw?.image_url ?? imageUrl } as AllFood;
  }

  private mapRegion(raw: any): FoodRegion {
    const imgs = raw?.images ?? raw?.image_url ?? [];
    return { ...raw, images: imgs } as FoodRegion;
  }

  private mapEvent(raw: any): FoodEvent {
    const image = raw?.imageUrl ?? raw?.image_url ?? raw?.image;
    return { ...raw, imageUrl: this.normalizeImageUrl(image) } as FoodEvent;
  }

  private mapRestaurant(raw: any): Restaurant {
    const image = raw?.imageUrl ?? raw?.image_url ?? raw?.image;
    return { ...raw, imageUrl: this.normalizeImageUrl(image) } as Restaurant;
  }

  private mapCategory(raw: any): FoodCategory {
    return { ...raw } as FoodCategory;
  }

  private handleError(prefix = 'Request error') {
    return (err: any) => {
      console.error(prefix, err);
      const message = (err?.error?.message) || err?.message || 'Server error';
      this.errorSubject.next(`${prefix}: ${message}`);
      return throwError(() => err);
    };
  }

  // ---------- High-level dashboard loader ----------
  /**
   * Charge toutes les sections nécessaires au dashboard en parallèle.
   * Par défaut charge un petit échantillon (limit) pour alléger la page.
   */
  loadDashboardData(options?: { limit?: number; restaurantsLimit?: number; foodsLimit?: number; force?: boolean }): Observable<any> {
    const { limit = 20, restaurantsLimit = 50, foodsLimit = 50, force = false } = options || {};

    // Si pas de force et déjà rempli, on renvoie les sujets existants (observables)
    if (!force && this.popularFoodsSubject.value.length && this.regionsSubject.value.length) {
      return of({
        popular: this.popularFoodsSubject.value,
        all: this.allFoodsSubject.value,
        regions: this.regionsSubject.value,
        events: this.eventsSubject.value,
        restaurants: this.restaurantsSubject.value,
        categories: this.categoriesSubject.value
      });
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const popular$ = this.http.get<PopularFood[] | PaginatedResponse<PopularFood>>(`${this.apiUrl}/popular?limit=${limit}`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((i: any) => this.mapPopularFood(i))),
      tap(list => this.popularFoodsSubject.next(list)),
      catchError(this.handleError('Loading popular foods'))
    );

    const allFoods$ = this.http.get<AllFood[] | PaginatedResponse<AllFood>>(`${this.apiUrl}/all?limit=${foodsLimit}`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((i: any) => this.mapAllFood(i))),
      tap(list => this.allFoodsSubject.next(list)),
      catchError(this.handleError('Loading all foods'))
    );

    const regions$ = this.http.get<FoodRegion[]>(`${this.apiUrl}/regions`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((r: any) => this.mapRegion(r))),
      // ensure order by id ascending
      map(list => list.sort((a: any, b: any) => (a.id || 0) - (b.id || 0))),
      tap(list => this.regionsSubject.next(list)),
      catchError(this.handleError('Loading regions'))
    );

    const events$ = this.http.get<FoodEvent[]>(`${this.apiUrl}/events?limit=${limit}`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((e: any) => this.mapEvent(e))),
      tap(list => this.eventsSubject.next(list)),
      catchError(this.handleError('Loading events'))
    );

    const restaurants$ = this.http.get<PaginatedResponse<Restaurant> | Restaurant[]>(`${this.apiUrl}/restaurants?limit=${restaurantsLimit}`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((r: any) => this.mapRestaurant(r))),
      tap(list => this.restaurantsSubject.next(list)),
      catchError(this.handleError('Loading restaurants'))
    );

    const categories$ = this.http.get<FoodCategory[]>(`${this.apiUrl}/categories`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((c: any) => this.mapCategory(c))),
      tap(list => this.categoriesSubject.next(list)),
      catchError(this.handleError('Loading categories'))
    );

    return forkJoin({
      popular: popular$,
      all: allFoods$,
      regions: regions$,
      events: events$,
      restaurants: restaurants$,
      categories: categories$
    }).pipe(
      finalize(() => this.loadingSubject.next(false)),
      catchError(err => {
        // already handled per-stream, but ensure loading flag cleared and rethrow
        this.loadingSubject.next(false);
        return throwError(() => err);
      })
    );
  }

  // ---------- POPULAR ----------
  fetchPopularFoods(limit = 50, offset = 0): Observable<PopularFood[]> {
    return this.http.get<PopularFood[] | PaginatedResponse<PopularFood>>(`${this.apiUrl}/popular?limit=${limit}&offset=${offset}`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((i: any) => this.mapPopularFood(i))),
      tap(list => this.popularFoodsSubject.next(list)),
      catchError(this.handleError('fetchPopularFoods'))
    );
  }

  getPopularFoodsSnapshot(): PopularFood[] {
    return this.popularFoodsSubject.value;
  }

  getPopularById(id: number): Observable<PopularFood> {
    return this.http.get<PopularFood>(`${this.apiUrl}/popular/${id}`).pipe(
      retry(1),
      map((raw: any) => this.mapPopularFood(raw)),
      catchError(this.handleError('getPopularById'))
    );
  }

  createPopular(food: Partial<PopularFood>): Observable<PopularFood> {
    return this.http.post<PopularFood>(`${this.apiUrl}/popular`, food).pipe(
      map((raw: any) => this.mapPopularFood(raw)),
      tap(created => this.popularFoodsSubject.next([created, ...this.popularFoodsSubject.value])),
      catchError(this.handleError('createPopular'))
    );
  }

  updatePopular(id: number, payload: Partial<PopularFood>): Observable<PopularFood> {
    return this.http.put<PopularFood>(`${this.apiUrl}/popular/${id}`, payload).pipe(
      map((raw: any) => this.mapPopularFood(raw)),
      tap(updated => {
        const list = this.popularFoodsSubject.value.map(p => (p.id === updated.id ? updated : p));
        this.popularFoodsSubject.next(list);
      }),
      catchError(this.handleError('updatePopular'))
    );
  }

  deletePopular(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/popular/${id}`).pipe(
      tap(() => {
        const list = this.popularFoodsSubject.value.filter(p => p.id !== id);
        this.popularFoodsSubject.next(list);
      }),
      catchError(this.handleError('deletePopular'))
    );
  }

  // ---------- ALL FOODS ----------
  fetchAllFoods(limit = 100, offset = 0): Observable<AllFood[]> {
    return this.http.get<AllFood[] | PaginatedResponse<AllFood>>(`${this.apiUrl}/all?limit=${limit}&offset=${offset}`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((i: any) => this.mapAllFood(i))),
      tap(list => this.allFoodsSubject.next(list)),
      catchError(this.handleError('fetchAllFoods'))
    );
  }

  getAllFoodsSnapshot(): AllFood[] {
    return this.allFoodsSubject.value;
  }

  getFoodById(id: number | string): Observable<AllFood> {
    return this.http.get<AllFood>(`${this.apiUrl}/all/${id}`).pipe(
      map((raw: any) => this.mapAllFood(raw)),
      catchError(this.handleError('getFoodById'))
    );
  }

  searchFoods(q: string, category?: string, city?: string): Observable<AllFood[]> {
    let params = new HttpParams().set('q', q || '');
    if (category) params = params.set('category', category);
    if (city) params = params.set('city', city);
    return this.http.get<AllFood[] | PaginatedResponse<AllFood>>(`${this.apiUrl}/all/search`, { params }).pipe(
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((i: any) => this.mapAllFood(i))),
      catchError(this.handleError('searchFoods'))
    );
  }

  createFood(payload: Partial<AllFood> | FormData): Observable<AllFood> {
    return this.http.post<AllFood>(`${this.apiUrl}/all`, payload).pipe(
      map((raw: any) => this.mapAllFood(raw)),
      tap(created => this.allFoodsSubject.next([created, ...this.allFoodsSubject.value])),
      catchError(this.handleError('createFood'))
    );
  }

  updateFood(id: number | string, payload: Partial<AllFood> | FormData): Observable<AllFood> {
    return this.http.put<AllFood>(`${this.apiUrl}/all/${id}`, payload).pipe(
      map((raw: any) => this.mapAllFood(raw)),
      tap(updated => {
        const list = this.allFoodsSubject.value.map(f => (f.id === updated.id ? updated : f));
        this.allFoodsSubject.next(list);
      }),
      catchError(this.handleError('updateFood'))
    );
  }

  deleteFood(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/all/${id}`).pipe(
      tap(() => {
        const list = this.allFoodsSubject.value.filter(f => f.id !== id);
        this.allFoodsSubject.next(list);
      }),
      catchError(this.handleError('deleteFood'))
    );
  }

  // ---------- REGIONS ----------
  fetchRegions(): Observable<FoodRegion[]> {
    return this.http.get<FoodRegion[]>(`${this.apiUrl}/regions`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((r: any) => this.mapRegion(r)).sort((a: any, b: any) => (a.id || 0) - (b.id || 0))),
      tap(list => this.regionsSubject.next(list)),
      catchError(this.handleError('fetchRegions'))
    );
  }

  getRegionById(id: number): Observable<FoodRegion> {
    return this.http.get<FoodRegion>(`${this.apiUrl}/regions/${id}`).pipe(
      map((raw: any) => this.mapRegion(raw)),
      catchError(this.handleError('getRegionById'))
    );
  }

  createRegion(payload: Partial<FoodRegion>): Observable<FoodRegion> {
    return this.http.post<FoodRegion>(`${this.apiUrl}/regions`, payload).pipe(
      map((raw: any) => this.mapRegion(raw)),
      tap(created => this.regionsSubject.next([...this.regionsSubject.value, created])),
      catchError(this.handleError('createRegion'))
    );
  }

  updateRegion(id: number, payload: Partial<FoodRegion>): Observable<FoodRegion> {
    return this.http.put<FoodRegion>(`${this.apiUrl}/regions/${id}`, payload).pipe(
      map((raw: any) => this.mapRegion(raw)),
      tap(updated => {
        const list = this.regionsSubject.value.map(r => (r.id === updated.id ? updated : r));
        this.regionsSubject.next(list);
      }),
      catchError(this.handleError('updateRegion'))
    );
  }

  deleteRegion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/regions/${id}`).pipe(
      tap(() => this.regionsSubject.next(this.regionsSubject.value.filter(r => r.id !== id))),
      catchError(this.handleError('deleteRegion'))
    );
  }

  // ---------- EVENTS ----------
  fetchEvents(limit = 50): Observable<FoodEvent[]> {
    return this.http.get<FoodEvent[] | PaginatedResponse<FoodEvent>>(`${this.apiUrl}/events?limit=${limit}`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((e: any) => this.mapEvent(e))),
      tap(list => this.eventsSubject.next(list)),
      catchError(this.handleError('fetchEvents'))
    );
  }

  createEvent(payload: Partial<FoodEvent>): Observable<FoodEvent> {
    return this.http.post<FoodEvent>(`${this.apiUrl}/events`, payload).pipe(
      map((raw: any) => this.mapEvent(raw)),
      tap(created => this.eventsSubject.next([created, ...this.eventsSubject.value])),
      catchError(this.handleError('createEvent'))
    );
  }

  updateEvent(id: number, payload: Partial<FoodEvent>): Observable<FoodEvent> {
    return this.http.put<FoodEvent>(`${this.apiUrl}/events/${id}`, payload).pipe(
      map((raw: any) => this.mapEvent(raw)),
      tap(updated => {
        const list = this.eventsSubject.value.map(e => (e.id === updated.id ? updated : e));
        this.eventsSubject.next(list);
      }),
      catchError(this.handleError('updateEvent'))
    );
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${id}`).pipe(
      tap(() => this.eventsSubject.next(this.eventsSubject.value.filter(e => e.id !== id))),
      catchError(this.handleError('deleteEvent'))
    );
  }

  // ---------- RESTAURANTS ----------
  fetchRestaurants(limit = 100, offset = 0, city?: string): Observable<Restaurant[]> {
    let params = new HttpParams().set('limit', `${limit}`).set('offset', `${offset}`);
    if (city) params = params.set('city', city);
    return this.http.get<Restaurant[] | PaginatedResponse<Restaurant>>(`${this.apiUrl}/restaurants`, { params }).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((r: any) => this.mapRestaurant(r))),
      tap(list => this.restaurantsSubject.next(list)),
      catchError(this.handleError('fetchRestaurants'))
    );
  }

  getRestaurantsPaginated(limit = 20, offset = 0, city?: string): Observable<PaginatedResponse<Restaurant>> {
    let params = new HttpParams().set('limit', `${limit}`).set('offset', `${offset}`);
    if (city) params = params.set('city', city);
    return this.http.get<PaginatedResponse<Restaurant>>(`${this.apiUrl}/restaurants`, { params }).pipe(
      retry(1),
      map((res: any) => {
        res.data = (res.data || []).map((r: any) => this.mapRestaurant(r));
        return res;
      }),
      catchError(this.handleError('getRestaurantsPaginated'))
    );
  }

  createRestaurant(payload: Partial<Restaurant> | FormData): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${this.apiUrl}/restaurants`, payload).pipe(
      map((raw: any) => this.mapRestaurant(raw)),
      tap(created => this.restaurantsSubject.next([created, ...this.restaurantsSubject.value])),
      catchError(this.handleError('createRestaurant'))
    );
  }

  updateRestaurant(id: number, payload: Partial<Restaurant> | FormData): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.apiUrl}/restaurants/${id}`, payload).pipe(
      map((raw: any) => this.mapRestaurant(raw)),
      tap(updated => {
        const list = this.restaurantsSubject.value.map(r => (r.id === updated.id ? updated : r));
        this.restaurantsSubject.next(list);
      }),
      catchError(this.handleError('updateRestaurant'))
    );
  }

  deleteRestaurant(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/restaurants/${id}`).pipe(
      tap(() => this.restaurantsSubject.next(this.restaurantsSubject.value.filter(r => r.id !== id))),
      catchError(this.handleError('deleteRestaurant'))
    );
  }

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/restaurants/${id}`).pipe(
      map((raw: any) => this.mapRestaurant(raw)),
      catchError(this.handleError('getRestaurantById'))
    );
  }

  // unique cities
  fetchRestaurantCities(): Observable<string[]> {
    return this.http.get<{ city: string }[]>(`${this.apiUrl}/restaurants/cities/list`).pipe(
      retry(1),
      map((rows: any[]) => rows.map(r => r.city || r)),
      catchError(this.handleError('fetchRestaurantCities'))
    );
  }

  // ---------- CATEGORIES ----------
  fetchCategories(): Observable<FoodCategory[]> {
    return this.http.get<FoodCategory[]>(`${this.apiUrl}/categories`).pipe(
      retry(1),
      map((res: any) => (Array.isArray(res) ? res : res.data || [])),
      map(list => list.map((c: any) => this.mapCategory(c))),
      tap(list => this.categoriesSubject.next(list)),
      catchError(this.handleError('fetchCategories'))
    );
  }

  createCategory(payload: Partial<FoodCategory>): Observable<FoodCategory> {
    return this.http.post<FoodCategory>(`${this.apiUrl}/categories`, payload).pipe(
      tap(created => this.categoriesSubject.next([created, ...this.categoriesSubject.value])),
      catchError(this.handleError('createCategory'))
    );
  }

  updateCategory(id: number, payload: Partial<FoodCategory>): Observable<FoodCategory> {
    return this.http.put<FoodCategory>(`${this.apiUrl}/categories/${id}`, payload).pipe(
      tap(updated => {
        const list = this.categoriesSubject.value.map(c => (c.id === updated.id ? updated : c));
        this.categoriesSubject.next(list);
      }),
      catchError(this.handleError('updateCategory'))
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`).pipe(
      tap(() => this.categoriesSubject.next(this.categoriesSubject.value.filter(c => c.id !== id))),
      catchError(this.handleError('deleteCategory'))
    );
  }
}