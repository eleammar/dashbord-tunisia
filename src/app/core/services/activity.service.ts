import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Experience {
  id: string;
  name: string;
  type: string;
  r: number;
  img?: string;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);

  getAll(): Observable<{ success: boolean; data: Experience[] }> {
    return this.http.get<{ success: boolean; data: Experience[] }>(
      'http://localhost:5000/api/cities/data/activities'
    );
  }
}