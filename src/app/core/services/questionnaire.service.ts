// ═══════════════════════════════════════════════════════════
//  QUESTIONNAIRE SERVICE — Explorer Tunisia Admin
//  Gestion du builder + logique des choix/tags
// ═══════════════════════════════════════════════════════════

import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  Questionnaire, Question, Choice,
  CreateQuestionnaireDto, UpdateQuestionnaireDto,
  CreateQuestionDto, UpdateQuestionDto,
  CreateChoiceDto, UpdateChoiceDto,
  QuestionnaireStatus, MOCK_QUESTIONNAIRE
} from '../models';
import { BaseService } from './base.service';
import { TagService } from './tag.service';
//import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({ providedIn: 'root' })
export class QuestionnaireService extends BaseService<Questionnaire> {
  protected apiEndpoint = 'questionnaires';
  private tagService = inject(TagService);

  // ── Signals ────────────────────────────────────────────
  private _questionnaires  = signal<Questionnaire[]>([MOCK_QUESTIONNAIRE]);
  private _loading         = signal<boolean>(false);
  private _activeQuestionnaire = signal<Questionnaire | null>(MOCK_QUESTIONNAIRE);

  readonly questionnaires      = this._questionnaires.asReadonly();
  readonly loading             = this._loading.asReadonly();
  readonly activeQuestionnaire = this._activeQuestionnaire.asReadonly();
  readonly publishedQuestionnaires = computed(() =>
    this._questionnaires().filter(q => q.status === 'published')
  );
  readonly totalQuestions = computed(() =>
    this._activeQuestionnaire()?.questions.length ?? 0
  );
  readonly totalChoices = computed(() =>
    this._activeQuestionnaire()?.questions
      .reduce((acc, q) => acc + q.choices.length, 0) ?? 0
  );

  // ──────────────────────────────────────────────────────
  // QUESTIONNAIRE CRUD
  // ──────────────────────────────────────────────────────
  getAll(): Observable<Questionnaire[]> {
    this._loading.set(true);
    return this.simulateDelay([MOCK_QUESTIONNAIRE]).pipe(
      tap(qs => { this._questionnaires.set(qs); this._loading.set(false); })
    );
    // return this.http.get<Questionnaire[]>(this.baseUrl);
  }

  getById(id: string): Observable<Questionnaire> {
    this._loading.set(true);
    const found = this._questionnaires().find(q => q.id === id) as Questionnaire;
    return this.simulateDelay(found).pipe(
      tap(q => { this._activeQuestionnaire.set(q); this._loading.set(false); })
    );
    // return this.http.get<Questionnaire>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateQuestionnaireDto): Observable<Questionnaire> {
    this._loading.set(true);
    const newQ: Questionnaire = {
      ...dto,
      id: `q-${Date.now()}`,
      estimatedDuration: dto.estimatedDuration ?? 3,
      status: 'draft',
      questions: [],
      completionCount: 0,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.simulateDelay(newQ).pipe(
      tap(q => { this._questionnaires.update(qs => [...qs, q]); this._loading.set(false); })
    );
  }

  update(id: string, dto: UpdateQuestionnaireDto): Observable<Questionnaire> {
    this._loading.set(true);
    const existing = this._questionnaires().find(q => q.id === id)!;
    const updated: Questionnaire = { ...existing, ...dto, updatedAt: new Date() };
    return this.simulateDelay(updated).pipe(
      tap(q => {
        this._questionnaires.update(qs => qs.map(x => x.id === id ? q : x));
        if (this._activeQuestionnaire()?.id === id) this._activeQuestionnaire.set(q);
        this._loading.set(false);
      })
    );
  }

  publish(id: string): Observable<Questionnaire> {
    return this.update(id, { status: 'published' as QuestionnaireStatus });
  }

  archive(id: string): Observable<Questionnaire> {
    return this.update(id, { status: 'archived' as QuestionnaireStatus });
  }

  delete(id: string): Observable<void> {
    this._loading.set(true);
    return this.simulateDelay<void>(undefined as unknown as void).pipe(
      tap(() => { this._questionnaires.update(qs => qs.filter(q => q.id !== id)); this._loading.set(false); })
    );
  }

  // ──────────────────────────────────────────────────────
  // QUESTION CRUD
  // ──────────────────────────────────────────────────────
  addQuestion(dto: CreateQuestionDto): Observable<Question> {
    const q = this._questionnaires().find(x => x.id === dto.questionnaireId)!;
    const newQuestion: Question = {
      ...dto,
      id: `ques-${Date.now()}`,
      isRequired: dto.isRequired ?? false,
      choices: [],
      isActive: true,
    };
    const updated: Questionnaire = {
      ...q,
      questions: [...q.questions, newQuestion],
      updatedAt: new Date(),
    };
    return this.simulateDelay(newQuestion).pipe(
      tap(() => {
        this._questionnaires.update(qs => qs.map(x => x.id === dto.questionnaireId ? updated : x));
        this._activeQuestionnaire.set(updated);
      })
    );
  }

  updateQuestion(questionnaireId: string, questionId: string, dto: UpdateQuestionDto): Observable<Question> {
    const q = this._questionnaires().find(x => x.id === questionnaireId)!;
    const question = q.questions.find(x => x.id === questionId)!;
    const updated: Question = { ...question, ...dto };
    const updatedQ: Questionnaire = {
      ...q,
      questions: q.questions.map(x => x.id === questionId ? updated : x),
      updatedAt: new Date(),
    };
    return this.simulateDelay(updated).pipe(
      tap(() => {
        this._questionnaires.update(qs => qs.map(x => x.id === questionnaireId ? updatedQ : x));
        this._activeQuestionnaire.set(updatedQ);
      })
    );
  }

  deleteQuestion(questionnaireId: string, questionId: string): Observable<void> {
    const q = this._questionnaires().find(x => x.id === questionnaireId)!;
    const updatedQ: Questionnaire = {
      ...q,
      questions: q.questions.filter(x => x.id !== questionId),
      updatedAt: new Date(),
    };
    return this.simulateDelay<void>(undefined as unknown as void).pipe(
      tap(() => {
        this._questionnaires.update(qs => qs.map(x => x.id === questionnaireId ? updatedQ : x));
        this._activeQuestionnaire.set(updatedQ);
      })
    );
  }

  // ── Drag & Drop reorder questions ─────────────────────
  reorderQuestions(questionnaireId: string, event: any): void {
    const q = this._questionnaires().find(x => x.id === questionnaireId)!;
    const questions = [...q.questions];
    moveItemInArray(questions, event.previousIndex, event.currentIndex);
    const reordered = questions.map((qu, index) => ({ ...qu, order: index + 1 }));
    const updatedQ: Questionnaire = { ...q, questions: reordered, updatedAt: new Date() };
    this._questionnaires.update(qs => qs.map(x => x.id === questionnaireId ? updatedQ : x));
    this._activeQuestionnaire.set(updatedQ);
  }

  // ──────────────────────────────────────────────────────
  // CHOICE CRUD
  // ──────────────────────────────────────────────────────
  addChoice(dto: CreateChoiceDto): Observable<Choice> {
    const tags = this.tagService.findByIds(dto.tagIds);
    const newChoice: Choice = {
      ...dto,
      id: `ch-${Date.now()}`,
      tags,
      isActive: true,
    };
    const q = this._questionnaires().find(
      x => x.questions.some(qu => qu.id === dto.questionId)
    )!;
    const updatedQ: Questionnaire = {
      ...q,
      questions: q.questions.map(qu =>
        qu.id === dto.questionId
          ? { ...qu, choices: [...qu.choices, newChoice] }
          : qu
      ),
      updatedAt: new Date(),
    };
    return this.simulateDelay(newChoice).pipe(
      tap(() => {
        this._questionnaires.update(qs => qs.map(x => x.id === q.id ? updatedQ : x));
        this._activeQuestionnaire.set(updatedQ);
      })
    );
  }

  updateChoice(questionId: string, choiceId: string, dto: UpdateChoiceDto): Observable<Choice> {
    const tags = dto.tagIds ? this.tagService.findByIds(dto.tagIds) : undefined;
    const q = this._questionnaires().find(
      x => x.questions.some(qu => qu.id === questionId)
    )!;
    let updatedChoice!: Choice;
    const updatedQ: Questionnaire = {
      ...q,
      questions: q.questions.map(qu =>
        qu.id === questionId
          ? {
              ...qu,
              choices: qu.choices.map(ch => {
                if (ch.id === choiceId) {
                  updatedChoice = { ...ch, ...dto, tags: tags ?? ch.tags };
                  return updatedChoice;
                }
                return ch;
              }),
            }
          : qu
      ),
      updatedAt: new Date(),
    };
    return this.simulateDelay(updatedChoice).pipe(
      tap(() => {
        this._questionnaires.update(qs => qs.map(x => x.id === q.id ? updatedQ : x));
        this._activeQuestionnaire.set(updatedQ);
      })
    );
  }

  deleteChoice(questionId: string, choiceId: string): Observable<void> {
    const q = this._questionnaires().find(
      x => x.questions.some(qu => qu.id === questionId)
    )!;
    const updatedQ: Questionnaire = {
      ...q,
      questions: q.questions.map(qu =>
        qu.id === questionId
          ? { ...qu, choices: qu.choices.filter(ch => ch.id !== choiceId) }
          : qu
      ),
      updatedAt: new Date(),
    };
    return this.simulateDelay<void>(undefined as unknown as void).pipe(
      tap(() => {
        this._questionnaires.update(qs => qs.map(x => x.id === q.id ? updatedQ : x));
        this._activeQuestionnaire.set(updatedQ);
      })
    );
  }

  // ── Assign tags to choice ─────────────────────────────
  assignTagsToChoice(questionId: string, choiceId: string, tagIds: string[]): Observable<Choice> {
    return this.updateChoice(questionId, choiceId, { tagIds });
  }

  setActiveQuestionnaire(q: Questionnaire | null): void {
    this._activeQuestionnaire.set(q);
  }
}

function moveItemInArray(questions: Question[], previousIndex: any, currentIndex: any) {
    throw new Error('Function not implemented.');
}
