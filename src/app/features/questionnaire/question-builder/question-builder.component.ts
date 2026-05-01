import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { OnboardingStep, OnboardingOption } from '../../../core/models/questionnaire.model';

interface UserRow {
  userId: string;
  answers: Record<string, string[]>; // stepId → optionIds[]
  submittedAt: string;
  totalAnswers: number;
}

@Component({
  selector: 'app-question-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './question-builder.component.html',
})
export class QuestionBuilderComponent implements OnInit {
  private svc = inject(QuestionnaireService);

  loading      = signal(true);
  search       = signal('');
  users        = signal<UserRow[]>([]);
  steps        = signal<OnboardingStep[]>([]);
  optionMap    = signal<Record<string, OnboardingOption>>({});
  selected     = signal<UserRow | null>(null);

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return q
      ? this.users().filter(u => u.userId.toLowerCase().includes(q))
      : this.users();
  });

  totalUsers   = computed(() => this.users().length);
  totalAnswers = computed(() => this.users().reduce((n, u) => n + u.totalAnswers, 0));

  ngOnInit(): void { this.load(); }

 load(): void {
  this.loading.set(true);

  forkJoin({
    answers: this.svc.getAllAnswers(),
    steps:   this.svc.getSteps(),
    options: this.svc.getOptions(),
  }).subscribe({
    next: ({ answers, steps, options }) => {

      // 🔹 option map
      const oMap: Record<string, OnboardingOption> = {};
      (options ?? []).forEach(o => oMap[o.id] = o);
      this.optionMap.set(oMap);

      // 🔹 steps
      this.steps.set(
        (steps ?? []).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      );

      const raw: any[] = answers ?? [];
      let rows: UserRow[] = [];

      // ✅ NEW BACKEND FORMAT (steps)
      if (raw.length > 0 && 'steps' in raw[0]) {

        rows = raw.map(user => {
          const answers: Record<string, string[]> = {};

          Object.entries(user.steps || {}).forEach(([stepId, stepData]: any) => {
            answers[stepId] = (stepData.options || []).map((o: any) => o.id);
          });

          return {
            userId: String(user.user_id),
            answers,
            submittedAt: '',
            totalAnswers: Object.values(answers).flat().length
          };
        });

      } else {
        // fallback (old format)
        const map: Record<string, { answers: Record<string, string[]> }> = {};

        raw.forEach(r => {
          const uid = r.user_id ?? 'unknown';

          if (!map[uid]) map[uid] = { answers: {} };

          if (!map[uid].answers[r.step_id]) {
            map[uid].answers[r.step_id] = [];
          }

          map[uid].answers[r.step_id].push(r.option_id);
        });

        rows = Object.entries(map).map(([userId, d]) => ({
          userId,
          answers: d.answers,
          submittedAt: '',
          totalAnswers: Object.values(d.answers).flat().length
        }));
      }

      this.users.set(rows);
      this.loading.set(false);
    },
    error: () => this.loading.set(false),
  });
}
  openUser(user: UserRow): void  { this.selected.set(user); }
  closePanel(): void             { this.selected.set(null); }

  stepOptions(stepId: string, user: UserRow): OnboardingOption[] {
    const ids = user.answers[stepId] ?? [];
    return ids.map(id => this.optionMap()[id]).filter(Boolean);
  }

  hasAnyAnswer(user: UserRow): boolean {
    return Object.values(user.answers).some(a => a.length > 0);
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  initials(userId: string): string {
    return userId.slice(0, 2).toUpperCase();
  }

  avatarColor(userId: string): string {
    const colors = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-cyan-500','bg-pink-500','bg-indigo-500'];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }
}
