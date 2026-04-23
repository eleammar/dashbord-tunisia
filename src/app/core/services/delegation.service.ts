import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface correspondant à la table delegations (selon ton backend)
export interface Delegation {
  id: number;
  city_id: number | null;
  name: string;
  population?: number | null;
  area?: number | null;
  description?: string | null;
  img?: string | null;
  founded?: string | null;
  notable?: string | null;
  type?: string | null;
  lat?: number | null;
  lng?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  count?: number;
  total?: number;
  message?: string;
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class DelegationsService {
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:5000/api/delegations';

  // Liste avec pagination (limit, offset)
  getAll(limit = 20, offset = 0): Observable<ApiListResponse<Delegation>> {
    const params = new HttpParams()
      .set('limit', String(limit))
      .set('offset', String(offset));
    return this.http.get<ApiListResponse<Delegation>>(`${this.baseUrl}`, { params });
  }

  // Récupérer un élément par id
  getById(id: number | string): Observable<ApiItemResponse<Delegation>> {
    return this.http.get<ApiItemResponse<Delegation>>(`${this.baseUrl}/${id}`);
  }

  // Récupérer les delegations d'une ville
  getByCity(cityId: number | string): Observable<ApiListResponse<Delegation>> {
    return this.http.get<ApiListResponse<Delegation>>(`${this.baseUrl}/city/${cityId}`);
  }

  // Créer une nouvelle delegation
  // payload attendu par le backend : { city_id, name, population?, area?, description?, img?, founded?, notable?, type?, lat?, lng? }
  create(payload: Partial<Delegation>): Observable<ApiItemResponse<Delegation>> {
    return this.http.post<ApiItemResponse<Delegation>>(`${this.baseUrl}`, payload);
  }

  // Mettre à jour une delegation
  update(id: number | string, payload: Partial<Delegation>): Observable<ApiItemResponse<Delegation>> {
    return this.http.put<ApiItemResponse<Delegation>>(`${this.baseUrl}/${id}`, payload);
  }

  // Supprimer une delegation
  delete(id: number | string): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.baseUrl}/${id}`);
  }
}