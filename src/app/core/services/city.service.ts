import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { City, CityListItem } from '../models/city.model';

@Injectable({ providedIn: 'root' })
export class CityService {
  private http = inject(HttpClient);
  private api = 'http://localhost:5000/api/cities'; // ✅ YOUR BACKEND URL

  // ── State ──────────────────────────────────────
  private _cities = signal<CityListItem[]>([]);
  private _currentCity = signal<City | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // ── Public readonly ────────────────────────────
  readonly cities = this._cities.asReadonly();
  readonly currentCity = this._currentCity.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // ════════════════════════════════════════════════════════════════
  // GET ALL CITIES
  // ════════════════════════════════════════════════════════════════
  getAll() {
    this._loading.set(true);
    return this.http
      .get<{ success: boolean; data: CityListItem[]; count: number }>(this.api)
      .pipe(
        tap((response) => {
          this._cities.set(response.data || []);
          this._loading.set(false);
          this._error.set(null);
        }),
        catchError((err) => {
          const errorMsg = err.error?.details || err.message || 'Failed to fetch cities';
          this._error.set(errorMsg);
          this._loading.set(false);
          console.error('Error fetching cities:', err);
          return of({ success: false, data: [], count: 0 });
        })
      );
  }

  // ════════════════════════════════════════════════════════════════
  // GET CITY BY ID
  // ════════════════════════════════════════════════════════════════
  getById(id: string) {
    this._loading.set(true);
    return this.http
      .get<{ success: boolean; data: City }>(`${this.api}/${id}`)
      .pipe(
        tap((response) => {
          this._currentCity.set(response.data);
          this._loading.set(false);
          this._error.set(null);
        }),
        catchError((err) => {
          const errorMsg = err.error?.details || err.message || 'Failed to fetch city';
          this._error.set(errorMsg);
          this._loading.set(false);
          console.error(`Error fetching city ${id}:`, err);
          return of({ success: false, data: null });
        })
      );
  }

  // ════════════════════════════════════════════════════════════════
  // CREATE CITY
  // ════════════════════════════════════════════════════════════════
  create(data: any) {
    return this.http
      .post<{ success: boolean; data: any; message: string }>(
        this.api,
        data
      )
      .pipe(
        tap((response) => {
          if (response.data?.id) {
            const newCity: CityListItem = {
              id: response.data.id,
              name: response.data.name,
              region: response.data.region,
            };
            this._cities.update((list) => [...list, newCity]);
          }
          this._error.set(null);
        }),
        catchError((err) => {
          const errorMsg = err.error?.details || err.message || 'Failed to create city';
          this._error.set(errorMsg);
          console.error('Error creating city:', err);
          return of({ success: false, data: null, message: errorMsg });
        })
      );
  }

  // ════════════════════════════════════════════════════════════════
  // UPDATE CITY
  // ════════════════════════════════════════════════════════════════
  update(id: string, data: any) {
    return this.http
      .put<{ success: boolean; data: any; message: string }>(
        `${this.api}/${id}`,
        data
      )
      .pipe(
        tap((response) => {
          if (response.data) {
            this._currentCity.set(response.data);
            this._cities.update((list) =>
              list.map((c) =>
                c.id === id
                  ? {
                      id: c.id,
                      name: response.data.name,
                      region: response.data.region,
                    }
                  : c
              )
            );
          }
          this._error.set(null);
        }),
        catchError((err) => {
          const errorMsg = err.error?.details || err.message || 'Failed to update city';
          this._error.set(errorMsg);
          console.error('Error updating city:', err);
          return of({ success: false, data: null, message: errorMsg });
        })
      );
  }

  // ════════════════════════════════════════════════════════════════
  // DELETE CITY ✅ THIS WAS MISSING!
  // ════════════════════════════════════════════════════════════════
  delete(id: string) {
    return this.http
      .delete<{ success: boolean; message: string }>(
        `${this.api}/${id}`
      )
      .pipe(
        tap((response) => {
          // Remove from cities list
          this._cities.update((list) => list.filter((c) => c.id !== id));
          
          // Clear current city if it was deleted
          if (this._currentCity()?.id === id) {
            this._currentCity.set(null);
          }
          
          this._error.set(null);
        }),
        catchError((err) => {
          const errorMsg = err.error?.details || err.message || 'Failed to delete city';
          this._error.set(errorMsg);
          console.error('Error deleting city:', err);
          return of({ success: false, message: errorMsg });
        })
      );
  }

  // ════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ════════════════════════════════════════════════════════════════
  
  clearError() {
    this._error.set(null);
  }

  clearCurrentCity() {
    this._currentCity.set(null);
  }

  // Reset all state
  reset() {
    this._cities.set([]);
    this._currentCity.set(null);
    this._loading.set(false);
    this._error.set(null);
  }
}