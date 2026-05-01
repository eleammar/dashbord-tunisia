import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  OnboardingStep,
  OnboardingOption,
  OnboardingPayload
} from '../models/questionnaire.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  private API = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // ─────────────────────────────────────────────
  // 🔹 QUESTIONNAIRE (STRUCTURE)
  // ─────────────────────────────────────────────

  getFullQuestionnaire(): Observable<OnboardingStep[]> {
    return this.http.get<any>(`${this.API}/onboarding`).pipe(
      map(res => res.data)
    );
  }


  // ─────────────────────────────────────────────
  // 🔹 STEPS (ADMIN)
  // ─────────────────────────────────────────────

  getSteps(): Observable<OnboardingStep[]> {
    return this.http.get<any>(`${this.API}/onboarding/steps`).pipe(
      map(res => res.data)
    );
  }

  createStep(step: OnboardingStep): Observable<OnboardingStep> {
    return this.http.post<any>(`${this.API}/onboarding/steps`, step).pipe(
      map(res => res.data)
    );
  }

  updateStep(id: string, step: Partial<OnboardingStep>): Observable<OnboardingStep> {
    return this.http.put<any>(`${this.API}/onboarding/steps/${id}`, step).pipe(
      map(res => res.data)
    );
  }

  deleteStep(id: string): Observable<any> {
    return this.http.delete(`${this.API}/onboarding/steps/${id}`);
  }


  // ─────────────────────────────────────────────
  // 🔹 OPTIONS (ADMIN)
  // ─────────────────────────────────────────────

  getOptions(): Observable<OnboardingOption[]> {
    return this.http.get<any>(`${this.API}/onboarding/options`).pipe(
      map(res => res.data)
    );
  }

  getOption(id: string): Observable<OnboardingOption> {
    return this.http.get<any>(`${this.API}/onboarding/options/${id}`).pipe(
      map(res => res.data)
    );
  }

  createOption(option: any): Observable<OnboardingOption> {
    return this.http.post<any>(`${this.API}/onboarding/options`, option).pipe(
      map(res => res.data)
    );
  }

  updateOption(id: string, option: Partial<OnboardingOption>): Observable<OnboardingOption> {
    return this.http.put<any>(`${this.API}/onboarding/options/${id}`, option).pipe(
      map(res => res.data)
    );
  }

  deleteOption(id: string): Observable<any> {
    return this.http.delete(`${this.API}/onboarding/options/${id}`);
  }


  // ─────────────────────────────────────────────
  // 🔹 ANSWERS (USER)
  // ─────────────────────────────────────────────

  submitAnswers(payload: OnboardingPayload): Observable<any> {
    return this.http.post(`${this.API}/onboarding/answers`, {
      user_id: payload.userId,
      answers: payload.answers
    });
  }


  // ─────────────────────────────────────────────
  // 🔹 ANSWERS (ADMIN)
  // ─────────────────────────────────────────────

  getAllAnswers(): Observable<any[]> {
    return this.http.get<any>(`${this.API}/onboarding/answers`).pipe(
      map(res => res.data)
    );
  }

  getAnswersByUser(userId: string): Observable<any[]> {
    return this.http.get<any>(`${this.API}/onboarding/answers/${userId}`).pipe(
      map(res => res.data)
    );
  }


  // ─────────────────────────────────────────────
  // 🔹 ANALYTICS (OPTIONNEL)
  // ─────────────────────────────────────────────

  getStats(): Observable<any[]> {
    return this.http.get<any>(`${this.API}/onboarding/answers/stats`).pipe(
      map(res => res.data)
    );
  }

}