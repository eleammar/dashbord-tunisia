import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CityEvent {
  id: string;
  name: string;
  date: string;
  img?: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);

  getAll(): Observable<{ success: boolean; data: CityEvent[] }> {
    return this.http.get<{ success: boolean; data: CityEvent[] }>(
      'http://localhost:5000/api/cities/data/events'
    );
  }
}