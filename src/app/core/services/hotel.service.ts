import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HotelItem {
  id: string;
  n: string;
  dist: number;
  r: number;
  price: number;
  img?: string;
}

@Injectable({ providedIn: 'root' })
export class HotelService {
  private http = inject(HttpClient);

  getAll(): Observable<{ success: boolean; data: HotelItem[] }> {
    return this.http.get<{ success: boolean; data: HotelItem[] }>(
      'http://localhost:5000/api/cities/data/hotels'
    );
  }
}