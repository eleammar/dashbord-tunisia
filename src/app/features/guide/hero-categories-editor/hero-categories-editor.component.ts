import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideService } from '@core/services/guide.service';
import { HeroCategory } from '@core/models/guide.model';

@Component({
  selector: 'app-guide-hero-categories-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-categories-editor.component.html',
  styleUrls: ['./hero-categories-editor.component.css'],
})
export class HeroCategoriesEditorComponent implements OnChanges {
  @Input() cityId: number | null = null;
  @Output() guideChanged = new EventEmitter<void>();

  private guideSvc = inject(GuideService);

  categories = signal<HeroCategory[]>([]);
  loading    = signal(true);
  saving     = signal(false);
  showModal  = signal(false);
  editItem   = signal<Partial<HeroCategory> | null>(null);
  isEditing  = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cityId']) this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.guideSvc.getHeroCategories().subscribe({
      next: (cats) => { this.categories.set(cats); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openAdd(): void {
    this.editItem.set({ key: '', label: '', image: '' });
    this.isEditing.set(false);
    this.showModal.set(true);
  }

  openEdit(cat: HeroCategory): void {
    this.editItem.set({ ...cat });
    this.isEditing.set(true);
    this.showModal.set(true);
  }

  setField(key: string, value: string): void {
    this.editItem.update(f => f ? { ...f, [key]: value } : f);
  }

  save(): void {
    const item = this.editItem();
    if (!item || this.saving()) return;
    this.saving.set(true);
    const obs = this.isEditing() && item.id
      ? this.guideSvc.updateHeroCategory(item.id, item)
      : this.guideSvc.createHeroCategory(item);
    obs.subscribe({
      next: (saved) => {
        if (this.isEditing()) {
          this.categories.update(list => list.map(c => c.id === saved.id ? saved : c));
        } else {
          this.categories.update(list => [...list, saved]);
        }
        this.saving.set(false);
        this.showModal.set(false);
        this.guideChanged.emit();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(cat: HeroCategory): void {
    if (!confirm(`Supprimer "${cat.label}" ?`)) return;
    this.guideSvc.deleteHeroCategory(cat.id).subscribe(() => {
      this.categories.update(list => list.filter(c => c.id !== cat.id));
      this.guideChanged.emit();
    });
  }
}
