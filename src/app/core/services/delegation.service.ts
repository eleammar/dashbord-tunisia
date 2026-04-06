import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Delegation {
  id: string;
  name: string;
  pop: string;
  area: number;
  type: string;
  img?: string;
}

@Injectable({ providedIn: 'root' })
export class DelegationService {
  private http = inject(HttpClient);

  getAll(): Observable<{ success: boolean; data: Delegation[] }> {
    return this.http.get<{ success: boolean; data: Delegation[] }>(
      'http://localhost:5000/api/cities/data/delegations'
    );
  }
}