import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { QuestionnaireService } from '../../../core/services/questionnaire.service';
import { OnboardingStep, OnboardingOption } from '../../../core/models/questionnaire.model';

const STEP_COLORS = [
  { border: 'border-l-blue-500',   badge: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500',    ring: 'ring-blue-200'   },
  { border: 'border-l-violet-500', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500',  ring: 'ring-violet-200' },
  { border: 'border-l-emerald-500',badge: 'bg-emerald-100 text-emerald-700',dot: 'bg-emerald-500',ring: 'ring-emerald-200'},
  { border: 'border-l-amber-500',  badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500',   ring: 'ring-amber-200'  },
  { border: 'border-l-rose-500',   badge: 'bg-rose-100 text-rose-700',     dot: 'bg-rose-500',    ring: 'ring-rose-200'   },
  { border: 'border-l-cyan-500',   badge: 'bg-cyan-100 text-cyan-700',     dot: 'bg-cyan-500',    ring: 'ring-cyan-200'   },
];

@Component({
  selector: 'app-questionnaire-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './questionnaire-list.component.html',
})
export class QuestionnaireListComponent implements OnInit {
  private svc = inject(QuestionnaireService);

  loading  = signal(true);
  saving   = signal(false);
  deleting = signal(false);
  steps    = signal<OnboardingStep[]>([]);
  expanded = signal<Set<string>>(new Set());

  // ── Step modal ──────────────────────────────────────────────
  showStepModal = signal(false);
  stepMode      = signal<'create' | 'edit'>('create');
  editingStepId = signal<string | null>(null);
  stepForm      = signal({ id: '', title: '', description: '', multi: false, order_index: 1 });
  stepError     = signal('');

  // ── Option modal ────────────────────────────────────────────
  showOptionModal  = signal(false);
  optionMode       = signal<'create' | 'edit'>('create');
  editingOptionId  = signal<string | null>(null);
  optionForm       = signal({ id: '', title: '', subtitle: '', icon: '', step_id: '' });
  optionError      = signal('');

  // ── Delete confirms ─────────────────────────────────────────
  showDeleteStep    = signal(false);
  pendingStepDelete = signal<OnboardingStep | null>(null);
  showDeleteOption  = signal(false);
  pendingOptDelete  = signal<{ option: OnboardingOption; stepId: string } | null>(null);

  // ── Computed ────────────────────────────────────────────────
  totalOptions = computed(() => this.steps().reduce((n, s) => n + (s.options?.length ?? 0), 0));
  multiCount   = computed(() => this.steps().filter(s => s.multi).length);

  readonly colors = STEP_COLORS;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    forkJoin({
      steps:   this.svc.getSteps(),
      options: this.svc.getOptions(),
    }).subscribe({
      next: ({ steps, options }) => {
        const sorted = (steps ?? [])
          .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
          .map(s => ({
            ...s,
            options: (options ?? []).filter((o: any) => o.step_id === s.id),
          }));
        this.steps.set(sorted);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  color(i: number) { return STEP_COLORS[i % STEP_COLORS.length]; }

  toggle(id: string): void {
    const s = new Set(this.expanded());
    s.has(id) ? s.delete(id) : s.add(id);
    this.expanded.set(s);
  }

  isOpen(id: string): boolean { return this.expanded().has(id); }

  expandAll(): void   { this.expanded.set(new Set(this.steps().map(s => s.id))); }
  collapseAll(): void { this.expanded.set(new Set()); }

  slugify(v: string): string {
    return v.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  // ── Step CRUD ────────────────────────────────────────────────

  openCreateStep(): void {
    this.stepMode.set('create');
    this.stepForm.set({ id: '', title: '', description: '', multi: false, order_index: this.steps().length + 1 });
    this.stepError.set('');
    this.showStepModal.set(true);
  }

  openEditStep(step: OnboardingStep): void {
    this.stepMode.set('edit');
    this.editingStepId.set(step.id);
    this.stepForm.set({ id: step.id, title: step.title, description: step.description ?? '', multi: step.multi ?? false, order_index: step.order_index });
    this.stepError.set('');
    this.showStepModal.set(true);
  }

  onStepTitleInput(title: string): void {
    this.stepForm.update(f => ({ ...f, title, id: this.stepMode() === 'create' ? this.slugify(title) : f.id }));
  }

  setStep(key: 'id' | 'description', val: string): void { this.stepForm.update(f => ({ ...f, [key]: val })); }
  setStepMulti(val: boolean): void { this.stepForm.update(f => ({ ...f, multi: val })); }
  setStepOrder(val: number): void { this.stepForm.update(f => ({ ...f, order_index: val })); }

  saveStep(): void {
    const f = this.stepForm();
    if (!f.id.trim() || !f.title.trim()) { this.stepError.set('ID et titre requis.'); return; }
    this.saving.set(true);
    const obs = this.stepMode() === 'create'
      ? this.svc.createStep({ id: f.id, title: f.title, description: f.description, multi: f.multi, order_index: f.order_index, options: [] })
      : this.svc.updateStep(this.editingStepId()!, { title: f.title, description: f.description, multi: f.multi, order_index: f.order_index });
    obs.subscribe({
      next: () => { this.showStepModal.set(false); this.saving.set(false); this.load(); },
      error: ()  => { this.stepError.set('Erreur serveur.'); this.saving.set(false); },
    });
  }

  askDeleteStep(step: OnboardingStep): void { this.pendingStepDelete.set(step); this.showDeleteStep.set(true); }

  confirmDeleteStep(): void {
    const s = this.pendingStepDelete();
    if (!s) return;
    this.deleting.set(true);
    this.svc.deleteStep(s.id).subscribe({
      next: () => { this.showDeleteStep.set(false); this.deleting.set(false); this.load(); },
      error: ()  => this.deleting.set(false),
    });
  }

  // ── Option CRUD ──────────────────────────────────────────────

  openCreateOption(stepId: string): void {
    this.optionMode.set('create');
    this.optionForm.set({ id: '', title: '', subtitle: '', icon: '', step_id: stepId });
    this.optionError.set('');
    this.showOptionModal.set(true);
  }

  openEditOption(opt: OnboardingOption, stepId: string): void {
    this.optionMode.set('edit');
    this.editingOptionId.set(opt.id);
    this.optionForm.set({ id: opt.id, title: opt.title, subtitle: opt.subtitle ?? '', icon: opt.icon ?? '', step_id: stepId });
    this.optionError.set('');
    this.showOptionModal.set(true);
  }

  onOptionTitleInput(title: string): void {
    this.optionForm.update(f => ({ ...f, title, id: this.optionMode() === 'create' ? this.slugify(title) : f.id }));
  }

  setOption(key: 'id' | 'subtitle' | 'icon', val: string): void { this.optionForm.update(f => ({ ...f, [key]: val })); }

  saveOption(): void {
    const f = this.optionForm();
    if (!f.id.trim() || !f.title.trim()) { this.optionError.set('ID et titre requis.'); return; }
    this.saving.set(true);
    const obs = this.optionMode() === 'create'
      ? this.svc.createOption({ id: f.id, title: f.title, subtitle: f.subtitle, icon: f.icon, step_id: f.step_id })
      : this.svc.updateOption(this.editingOptionId()!, { title: f.title, subtitle: f.subtitle, icon: f.icon });
    obs.subscribe({
      next: () => { this.showOptionModal.set(false); this.saving.set(false); this.load(); },
      error: ()  => { this.optionError.set('Erreur serveur.'); this.saving.set(false); },
    });
  }

  askDeleteOption(opt: OnboardingOption, stepId: string): void {
    this.pendingOptDelete.set({ option: opt, stepId });
    this.showDeleteOption.set(true);
  }

  confirmDeleteOption(): void {
    const d = this.pendingOptDelete();
    if (!d) return;
    this.deleting.set(true);
    this.svc.deleteOption(d.option.id).subscribe({
      next: () => { this.showDeleteOption.set(false); this.deleting.set(false); this.load(); },
      error: ()  => this.deleting.set(false),
    });
  }
}
