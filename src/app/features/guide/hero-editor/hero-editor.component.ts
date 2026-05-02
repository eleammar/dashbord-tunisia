import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideService } from '@core/services/guide.service';
import { HeroSection } from '@core/models/guide.model';

@Component({
  selector: 'app-guide-hero-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-editor.component.html',
  styleUrls: ['./hero-editor.component.css'],
})
export class HeroEditorComponent implements OnChanges {
  @Input() cityId: number | null = null;
  @Output() guideChanged = new EventEmitter<void>();

  private guideSvc = inject(GuideService);

  hero    = signal<HeroSection | null>(null);
  form    = signal<Partial<HeroSection>>({});
  loading = signal(true);
  saving  = signal(false);
  saved   = signal(false);
  creating = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cityId'] && this.cityId) this.load();
  }

  private load(): void {
    if (!this.cityId) return;
    this.loading.set(true);
    this.guideSvc.getHeroSectionByCity(this.cityId).subscribe({
      next: (hero) => {
        if (hero) {
          this.hero.set(hero);
          this.form.set({ ...hero });
          this.creating.set(false);
        } else {
          this.hero.set(null);
          this.form.set({ title: '', subtitle: '', location: '', background_image: '', city_id: this.cityId ?? undefined });
          this.creating.set(true);
        }
        this.loading.set(false);
      },
      error: () => {
        this.form.set({ title: '', subtitle: '', location: '', background_image: '', city_id: this.cityId ?? undefined });
        this.creating.set(true);
        this.loading.set(false);
      },
    });
  }

  set(key: keyof HeroSection, value: string): void {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  save(): void {
    if (!this.cityId || this.saving()) return;
    this.saving.set(true);
    const data = { ...this.form(), city_id: this.cityId };
    const obs = this.creating()
      ? this.guideSvc.createHeroSection(data)
      : this.guideSvc.updateHeroSection(this.hero()!.id, data);
    obs.subscribe({
      next: (saved) => {
        this.hero.set(saved);
        this.creating.set(false);
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 2500);
        this.guideChanged.emit();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(): void {
    const h = this.hero();
    if (!h || !confirm('Supprimer la section hero ?')) return;
    this.guideSvc.deleteHeroSection(h.id).subscribe(() => {
      this.hero.set(null);
      this.form.set({ title: '', subtitle: '', location: '', background_image: '', city_id: this.cityId ?? undefined });
      this.creating.set(true);
      this.guideChanged.emit();
    });
  }
}
