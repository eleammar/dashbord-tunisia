import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Event as EventModel } from '../models/event.model';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {

  private apiUrl = 'http://localhost:5000/api/events'; // ✅ YOUR BACKEND URL

  // Cache global
  private events$ = new BehaviorSubject<EventModel[]>([]);

  constructor(private http: HttpClient) {
    this.loadEvents();
  }

  // ===============================
  // LOAD ALL EVENTS
  // ===============================
  private loadEvents(): void {
    this.http.get<ApiResponse<EventModel[]>>(this.apiUrl)
      .pipe(
        map(res => res.data || []),
        tap(events => this.events$.next(events)),
        catchError(err => {
          console.error('Error loading events', err);
          this.events$.next([]);
          return of([]);
        })
      )
      .subscribe();
  }

  // ===============================
  // GET ALL
  // ===============================
  getAll(): Observable<EventModel[]> {
    return this.events$.asObservable();
  }

  // ===============================
  // GET BY ID
  // ===============================
  getById(id: number): Observable<EventModel> {
    return this.http.get<ApiResponse<EventModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  // ===============================
  // GET BY CITY
  // ===============================
  getByCity(cityId: number): Observable<EventModel[]> {
    return this.http
      .get<ApiResponse<EventModel[]>>(`${this.apiUrl}/city/${cityId}`)
      .pipe(map(res => res.data || []));
  }

  // ===============================
  // GET BY CATEGORY
  // ===============================
  getByCategory(category: string): Observable<EventModel[]> {
    return this.http
      .get<ApiResponse<EventModel[]>>(`${this.apiUrl}/category/${encodeURIComponent(category)}`)
      .pipe(map(res => res.data || []));
  }

  // ===============================
  // GET CATEGORIES
  // ===============================
  getCategories(): Observable<string[]> {
    return this.http
      .get<ApiResponse<string[]>>(`${this.apiUrl}/list/categories`)
      .pipe(map(res => res.data || []));
  }

  // ===============================
  // CREATE
  // ===============================
  create(event: EventModel): Observable<EventModel> {
    return this.http.post<ApiResponse<EventModel>>(this.apiUrl, event)
      .pipe(
        map(res => res.data),
        tap(() => this.loadEvents())
      );
  }

  // ===============================
  // UPDATE
  // ===============================
  update(id: number, event: Partial<EventModel>): Observable<EventModel> {
    return this.http.put<ApiResponse<EventModel>>(`${this.apiUrl}/${id}`, event)
      .pipe(
        map(res => res.data),
        tap(() => this.loadEvents())
      );
  }

  // ===============================
  // DELETE
  // ===============================
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.loadEvents())
      );
  }
}