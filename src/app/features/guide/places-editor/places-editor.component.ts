import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideService } from '@core/services/guide.service';
import { Place, Category } from '@core/models/guide.model';

@Component({
  selector: 'app-guide-places-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './places-editor.component.html',
  styleUrls: ['./places-editor.component.css'],
})
export class PlacesEditorComponent implements OnChanges {
  @Input() cityId: number | null = null;
  @Output() guideChanged = new EventEmitter<void>();

  private guideSvc = inject(GuideService);

  places     = signal<Place[]>([]);
  categories = signal<Category[]>([]);
  loading    = signal(true);
  saving     = signal(false);
  search     = signal('');
  showModal  = signal(false);
  editItem   = signal<Partial<Place> | null>(null);
  isEditing  = signal(false);

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.places();
    return this.places().filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.address ?? '').toLowerCase().includes(q) ||
      (p.category_label ?? '').toLowerCase().includes(q)
    );
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cityId'] && this.cityId) this.load();
  }

  private load(): void {
    if (!this.cityId) return;
    this.loading.set(true);
    this.guideSvc.getPlacesByCity(this.cityId).subscribe({
      next: (places) => { this.places.set(places); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.guideSvc.getCategories().subscribe(cats => this.categories.set(cats));
  }

  openAdd(): void {
    this.editItem.set({
      name: '', description: '', address: '',
      city_id: this.cityId ?? undefined, category_id: undefined,
      rating: undefined, price: '', open_hours: '', image: '',
      lat: undefined, lng: undefined,
    });
    this.isEditing.set(false);
    this.showModal.set(true);
  }

  openEdit(place: Place): void {
    this.editItem.set({ ...place });
    this.isEditing.set(true);
    this.showModal.set(true);
  }

  setField(key: string, value: string | number): void {
    this.editItem.update(f => f ? { ...f, [key]: value } : f);
  }

  save(): void {
    const item = this.editItem();
    if (!item || this.saving()) return;
    this.saving.set(true);
    const obs = this.isEditing() && item.id
      ? this.guideSvc.updatePlace(item.id, item)
      : this.guideSvc.createPlace({ ...item, city_id: this.cityId ?? undefined });
    obs.subscribe({
      next: (saved) => {
        if (this.isEditing()) {
          this.places.update(list => list.map(p => p.id === saved.id ? saved : p));
        } else {
          this.places.update(list => [...list, saved]);
        }
        this.saving.set(false);
        this.showModal.set(false);
        this.guideChanged.emit();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(place: Place): void {
    if (!confirm(`Supprimer "${place.name}" ?`)) return;
    this.guideSvc.deletePlace(place.id).subscribe(() => {
      this.places.update(list => list.filter(p => p.id !== place.id));
      this.guideChanged.emit();
    });
  }

  getCategoryLabel(id: number | undefined): string {
    if (!id) return '—';
    return this.categories().find(c => c.id === id)?.label ?? '—';
  }

  stars(rating: number | undefined): number[] {
    const r = Math.round(rating ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < r ? 1 : 0);
  }
}
