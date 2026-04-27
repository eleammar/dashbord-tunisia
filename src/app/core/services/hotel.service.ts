import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Hotel } from '../models/hotel.model';
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  count?: number;
  limit?: number;
  offset?: number;
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private apiUrl = 'http://localhost:5000/api/hotels';

  // Cache global
  private hotels$ = new BehaviorSubject<Hotel[]>([]);

  constructor(private http: HttpClient) {
    this.loadHotels();
  }

  // ======================================
  // LOAD ALL HOTELS (DEFAULT)
  // ======================================
  private loadHotels(): void {
    this.http.get<ApiResponse<Hotel[]>>(this.apiUrl)
      .pipe(
        map(res => res.data || []),
        tap(hotels => this.hotels$.next(hotels)),
        catchError(err => {
          console.error('Error loading hotels:', err);
          this.hotels$.next([]);
          return of([]);
        })
      )
      .subscribe();
  }

  // ======================================
  // GET ALL (FROM CACHE)
  // ======================================
  getAll(): Observable<Hotel[]> {
    return this.hotels$.asObservable();
  }

  // ======================================
  // GET WITH FILTER + PAGINATION
  // ======================================
  getHotels(cityId?: number, limit: number = 10, offset: number = 0): Observable<ApiResponse<Hotel[]>> {

    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset);

    if (cityId) {
      params = params.set('city', cityId);
    }

    return this.http.get<ApiResponse<Hotel[]>>(this.apiUrl, { params });
  }

  // ======================================
  // GET BY ID
  // ======================================
  getById(id: number): Observable<Hotel> {
    return this.http
      .get<ApiResponse<Hotel>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  // ======================================
  // GET BY CITY (ROUTE DÉDIÉE)
  // ======================================
  getByCity(cityId: number): Observable<Hotel[]> {
    return this.http
      .get<ApiResponse<Hotel[]>>(`${this.apiUrl}/city/${cityId}`)
      .pipe(map(res => res.data || []));
  }

  // ======================================
  // CREATE
  // ======================================
  create(hotel: Hotel): Observable<Hotel> {
    return this.http
      .post<ApiResponse<Hotel>>(this.apiUrl, hotel)
      .pipe(
        map(res => res.data),
        tap(() => this.loadHotels())
      );
  }

  // ======================================
  // UPDATE
  // ======================================
  update(id: number, hotel: Partial<Hotel>): Observable<Hotel> {
    return this.http
      .put<ApiResponse<Hotel>>(`${this.apiUrl}/${id}`, hotel)
      .pipe(
        map(res => res.data),
        tap(() => this.loadHotels())
      );
  }

  // ======================================
  // DELETE
  // ======================================
  delete(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.loadHotels())
      );
  }
}