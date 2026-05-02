import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideService } from '@core/services/guide.service';
import { Category } from '@core/models/guide.model';

@Component({
  selector: 'app-guide-categories-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guide-categories-editor.component.html',
  styleUrls: ['./guide-categories-editor.component.css'],
})
export class GuideCategoriesEditorComponent implements OnChanges {
  @Input() cityId: number | null = null;

  private guideSvc = inject(GuideService);

  categories = signal<Category[]>([]);
  loading    = signal(true);
  saving     = signal(false);
  showModal  = signal(false);
  editItem   = signal<Partial<Category> | null>(null);
  isEditing  = signal(false);

  readonly colorPresets = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cityId']) this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.guideSvc.getCategories().subscribe({
      next: (cats) => { this.categories.set(cats); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openAdd(): void {
    this.editItem.set({ label: '', icon: '📍', color: '#3B82F6', bg_class: '' });
    this.isEditing.set(false);
    this.showModal.set(true);
  }

  openEdit(cat: Category): void {
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
      ? this.guideSvc.updateCategory(item.id, item)
      : this.guideSvc.createCategory(item);
    obs.subscribe({
      next: (saved) => {
        if (this.isEditing()) {
          this.categories.update(list => list.map(c => c.id === saved.id ? saved : c));
        } else {
          this.categories.update(list => [...list, saved]);
        }
        this.saving.set(false);
        this.showModal.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  delete(cat: Category): void {
    if (!confirm(`Supprimer "${cat.label}" ?`)) return;
    this.guideSvc.deleteCategory(cat.id).subscribe(() =>
      this.categories.update(list => list.filter(c => c.id !== cat.id))
    );
  }
}
