import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CultureItem } from '../models/culture.model';

@Injectable({
  providedIn: 'root'
})
export class CultureService {

  private apiUrl = 'http://localhost:5000/api/culture'; //l'URL

  constructor(private http: HttpClient) {}

  // 🔹 GET all (avec pagination)
  getAll(limit: number = 20, offset: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset);

    return this.http.get<any>(this.apiUrl, { params });
  }

  // 🔹 GET by ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 🔹 GET by city
  getByCity(cityId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/city/${cityId}`);
  }

  // 🔹 CREATE
  create(item: CultureItem): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  // 🔹 UPDATE
  update(id: number, item: CultureItem): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }

  // 🔹 DELETE
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}