import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface correspondant à la table experiences (selon ton backend)
export interface Experience {
  id: number;
  city_id: number | null;
  name: string;
  type: string;
  rating?: number | null;
  img?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  count?: number;
  message?: string;
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);

   private baseUrl = 'http://localhost:5000/api/experiences'; //BACKEND URL

  // Liste avec pagination (limit, offset)
  getAll(limit = 20, offset = 0): Observable<ApiListResponse<Experience>> {
    const params = new HttpParams()
      .set('limit', String(limit))
      .set('offset', String(offset));
    return this.http.get<ApiListResponse<Experience>>(`${this.baseUrl}`, { params });
  }

  // Récupérer un élément par id
  getById(id: number | string): Observable<ApiItemResponse<Experience>> {
    return this.http.get<ApiItemResponse<Experience>>(`${this.baseUrl}/${id}`);
  }

  // Récupérer les expériences d'une ville
  getByCity(cityId: number | string): Observable<ApiListResponse<Experience>> {
    return this.http.get<ApiListResponse<Experience>>(`${this.baseUrl}/city/${cityId}`);
  }

  // Créer une nouvelle expérience
  // payload attendu par le backend : { city_id, name, type, rating?, img?, display_order? }
  create(payload: Partial<Experience>): Observable<ApiItemResponse<Experience>> {
    return this.http.post<ApiItemResponse<Experience>>(`${this.baseUrl}`, payload);
  }

  // Mettre à jour une expérience
  update(id: number | string, payload: Partial<Experience>): Observable<ApiItemResponse<Experience>> {
    return this.http.put<ApiItemResponse<Experience>>(`${this.baseUrl}/${id}`, payload);
  }

  // Supprimer une expérience
  delete(id: number | string): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.baseUrl}/${id}`);
  }
}