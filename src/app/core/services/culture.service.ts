import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CultureItem {
  id: string;
  title: string;
  label: string;
  rating: number;
  img?: string;
}

@Injectable({ providedIn: 'root' })
export class CultureService {
  private http = inject(HttpClient);

  getAll(): Observable<{ success: boolean; data: CultureItem[] }> {
    return this.http.get<{ success: boolean; data: CultureItem[] }>(
      'http://localhost:5000/api/cities/data/culture'
    );
  }
}