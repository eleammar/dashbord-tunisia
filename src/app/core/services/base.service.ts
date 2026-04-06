// ═══════════════════════════════════════════════════════════
//  BASE SERVICE — Explorer Tunisia Admin
//  Classe abstraite partagée par tous les services
// ══════════════════════════════════════════��════════════════

import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
//import { environment } from '../../../environments/environment.development';

// ── Interfaces utilitaires ─────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ── Classe abstraite de base ───────────────────────────────
export abstract class BaseService<T extends { id: string }> {
  protected http = inject(HttpClient);
  protected abstract apiEndpoint: string;

  // ── Simulation delay (imite la latence réseau) ──────────
  protected simulateDelay<R>(data: R, ms = 400): Observable<R> {
    return of(data).pipe(delay(ms));
  }

  // ── Construire les HttpParams depuis un objet ───────────
  protected buildParams(query: QueryParams): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }

  // ── URL complète ────────────────────────────────────────
  /*protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.apiEndpoint}`;
  }*/
}