import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FoodItem {
  id: string;
  name: string;
  cat: string;
  desc: string;
  img?: string;
}

@Injectable({ providedIn: 'root' })
export class FoodService {
  private http = inject(HttpClient);

  getAll(): Observable<{ success: boolean; data: FoodItem[] }> {
    return this.http.get<{ success: boolean; data: FoodItem[] }>(
      'http://localhost:5000/api/cities/data/food'
    );
  }
}