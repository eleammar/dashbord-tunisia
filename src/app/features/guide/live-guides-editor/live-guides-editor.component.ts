import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideService } from '@core/services/guide.service';
import { LiveGuide } from '@core/models/guide.model';

@Component({
  selector: 'app-guide-live-guides-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-guides-editor.component.html',
  styleUrls: ['./live-guides-editor.component.css'],
})
export class LiveGuidesEditorComponent implements OnChanges {
  @Input() cityId: number | null = null;
  @Output() guideChanged = new EventEmitter<void>();

  private guideSvc = inject(GuideService);

  guides     = signal<LiveGuide[]>([]);
  readonly liveCount = computed(() => this.guides().filter(g => g.is_live).length);
  loading   = signal(true);
  saving    = signal(false);
  showModal = signal(false);
  editItem  = signal<Partial<LiveGuide> | null>(null);
  isEditing = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cityId'] && this.cityId) this.load();
  }

  private load(): void {
    if (!this.cityId) return;
    this.loading.set(true);
    this.guideSvc.getLiveGuidesByCity(this.cityId).subscribe({
      next: (g) => { this.guides.set(g); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openAdd(): void {
    this.editItem.set({ name: '', speciality: '', avatar: '', is_live: false, rating: undefined, city_id: this.cityId ?? undefined, languages: [] });
    this.isEditing.set(false);
    this.showModal.set(true);
  }

  openEdit(guide: LiveGuide): void {
    this.editItem.set({ ...guide, languages: [...(guide.languages ?? [])] });
    this.isEditing.set(true);
    this.showModal.set(true);
  }

  setField(key: string, value: string | number | boolean): void {
    this.editItem.update(f => f ? { ...f, [key]: value } : f);
  }

  setLanguages(raw: string): void {
    const langs = raw.split(',').map(s => s.trim()).filter(Boolean);
    this.editItem.update(f => f ? { ...f, languages: langs } : f);
  }

  toggleLive(guide: LiveGuide): void {
    const updated = { ...guide, is_live: !guide.is_live };
    this.guideSvc.updateLiveGuide(guide.id, updated).subscribe({
      next: (saved) => this.guides.update(list => list.map(g => g.id === saved.id ? saved : g)),
    });
  }

  save(): void {
    const item = this.editItem();
    if (!item || this.saving()) return;
    this.saving.set(true);
    const obs = this.isEditing() && item.id
      ? this.guideSvc.updateLiveGuide(item.id, item)
      : this.guideSvc.createLiveGuide({ ...item, city_id: this.cityId ?? undefined });
    obs.subscribe({
      next: (saved) => {
        if (this.isEditing()) {
          this.guides.update(list => list.map(g => g.id === saved.id ? saved : g));
        } else {
          this.guides.update(list => [...list, saved]);
        }
        this.saving.set(false);
        this.showModal.set(false);
        this.guideChanged.emit();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(guide: LiveGuide): void {
    if (!confirm(`Supprimer ${guide.name} ?`)) return;
    this.guideSvc.deleteLiveGuide(guide.id).subscribe(() => {
      this.guides.update(list => list.filter(g => g.id !== guide.id));
      this.guideChanged.emit();
    });
  }

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}
