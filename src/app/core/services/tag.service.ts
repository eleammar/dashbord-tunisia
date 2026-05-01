import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag, EntityType } from '../models/tag.model';

const TAGS_API  = 'http://localhost:5000/api/tags';
const REL_API   = 'http://localhost:5000/api/tags/assign';
const BASE_API  = 'http://localhost:5000/api';

const ENTITY_ENDPOINTS: Record<string, string> = {
  city:       `${BASE_API}/cities`,
  place:      `${BASE_API}/guide/places`,
  food:       `${BASE_API}/food/all`,
  event:      `${BASE_API}/events`,
  experience: `${BASE_API}/experiences`,
  option:     `${BASE_API}/onboarding/options`,
};

const ENTITY_LABEL_FIELD: Record<string, string> = {
  city: 'name', place: 'name', food: 'name', event: 'name', experience: 'name', option: 'title',
};

@Injectable({ providedIn: 'root' })
export class TagService {

  constructor(private http: HttpClient) {}

  /* =========================================================
     TAG CRUD
  ========================================================= */

  getAll(): Observable<Tag[]> {
    return this.http.get<{ data: Tag[] }>(TAGS_API).pipe(
      map(res => res.data ?? [])
    );
  }

  create(name: string): Observable<Tag> {
    return this.http.post<Tag>(TAGS_API, { name });
  }

  update(id: number, name: string): Observable<Tag> {
    return this.http.put<Tag>(`${TAGS_API}/${id}`, { name });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${TAGS_API}/${id}`);
  }

  /* =========================================================
     TAG RELATIONS  (POST /api/tags/assign)
  ========================================================= */

  /** Assign one or more tags to an entity (INSERT, no duplicates) */
  assignTags(type: EntityType, id: number | string, tag_ids: number[]): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${REL_API}/${type}`, { id, tag_ids });
  }

  /** Remove a single tag from an entity */
  removeTag(type: EntityType, id: number | string, tag_id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${REL_API}/${type}`, {
      body: { id, tag_id },
    });
  }

  /** Get all tags attached to an entity */
  getEntityTags(type: EntityType, id: number | string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${REL_API}/${type}/${id}`);
  }

  /** Replace all tags of an entity (DELETE old + INSERT new) */
  replaceEntityTags(type: EntityType, id: number | string, tag_ids: number[]): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${REL_API}/${type}`, { id, tag_ids });
  }

  /* =========================================================
     ENTITY LIST  (for dropdowns in assign panel)
  ========================================================= */

  getEntityList(type: EntityType): Observable<{ id: number | string; label: string }[]> {
    const url = ENTITY_ENDPOINTS[type];
    const labelField = ENTITY_LABEL_FIELD[type];
    return this.http.get<any>(url).pipe(
      map(res => {
        const list: any[] = Array.isArray(res) ? res : (res.data ?? []);
        return list.map(x => ({ id: x.id, label: x[labelField] ?? String(x.id) }));
      })
    );
  }
}
