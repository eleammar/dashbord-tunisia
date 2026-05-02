import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuideService } from '@core/services/guide.service';
import { Circuit, CircuitStop, Place } from '@core/models/guide.model';

@Component({
  selector: 'app-guide-circuits-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './circuits-editor.component.html',
  styleUrls: ['./circuits-editor.component.css'],
})
export class CircuitsEditorComponent implements OnChanges {
  @Input() cityId: number | null = null;
  @Output() guideChanged = new EventEmitter<void>();

  private guideSvc = inject(GuideService);

  circuits         = signal<Circuit[]>([]);
  selectedCircuit  = signal<Circuit | null>(null);
  stops            = signal<CircuitStop[]>([]);
  places           = signal<Place[]>([]);
  loading          = signal(true);
  loadingStops     = signal(false);
  saving           = signal(false);
  showCircuitModal = signal(false);
  showStopModal    = signal(false);
  newCircuit       = signal<Partial<Circuit>>({});
  newStop          = signal<Partial<CircuitStop>>({});

  readonly MODES = ['walking', 'cycling', 'driving', 'transit'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cityId'] && this.cityId) this.load();
  }

  private load(): void {
    if (!this.cityId) return;
    this.loading.set(true);
    this.guideSvc.getCircuitsByCity(this.cityId).subscribe({
      next: (c) => { this.circuits.set(c); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.guideSvc.getPlacesByCity(this.cityId).subscribe(p => this.places.set(p));
  }

  selectCircuit(circuit: Circuit): void {
    if (this.selectedCircuit()?.id === circuit.id) {
      this.selectedCircuit.set(null);
      this.stops.set([]);
      return;
    }
    this.selectedCircuit.set(circuit);
    this.loadingStops.set(true);
    this.guideSvc.getStopsByCircuit(circuit.id).subscribe({
      next: (s) => { this.stops.set([...s].sort((a, b) => a.stop_order - b.stop_order)); this.loadingStops.set(false); },
      error: () => this.loadingStops.set(false),
    });
  }

  openAddCircuit(): void {
    this.newCircuit.set({ name: '', mode: 'walking', city_id: this.cityId ?? undefined });
    this.showCircuitModal.set(true);
  }

  saveCircuit(): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.guideSvc.createCircuit({ ...this.newCircuit(), city_id: this.cityId ?? undefined }).subscribe({
      next: (c) => {
        this.circuits.update(list => [...list, c]);
        this.saving.set(false);
        this.showCircuitModal.set(false);
        this.guideChanged.emit();
      },
      error: () => this.saving.set(false),
    });
  }

  deleteCircuit(circuit: Circuit, e: Event): void {
    e.stopPropagation();
    if (!confirm(`Supprimer "${circuit.name}" et tous ses arrêts ?`)) return;
    this.guideSvc.deleteCircuit(circuit.id).subscribe(() => {
      this.circuits.update(list => list.filter(c => c.id !== circuit.id));
      if (this.selectedCircuit()?.id === circuit.id) { this.selectedCircuit.set(null); this.stops.set([]); }
      this.guideChanged.emit();
    });
  }

  openAddStop(): void {
    this.newStop.set({ place_id: undefined, start_time: '', stop_order: this.stops().length + 1 });
    this.showStopModal.set(true);
  }

  saveStop(): void {
    const circuit = this.selectedCircuit();
    const stop = this.newStop();
    if (!circuit || !stop.place_id || this.saving()) return;
    this.saving.set(true);
    this.guideSvc.createStop({ ...stop, circuit_id: circuit.id }).subscribe({
      next: (s) => { this.stops.update(list => [...list, s]); this.saving.set(false); this.showStopModal.set(false); },
      error: () => this.saving.set(false),
    });
  }

  deleteStop(stop: CircuitStop): void {
    this.guideSvc.deleteStop(stop.id).subscribe(() =>
      this.stops.update(list => list.filter(s => s.id !== stop.id))
    );
  }

  moveStop(stop: CircuitStop, dir: 1 | -1): void {
    const previous = [...this.stops()];
    const list = [...this.stops()];
    const idx = list.findIndex(s => s.id === stop.id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= list.length) return;

    [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
    list.forEach((s, i) => (s.stop_order = i + 1));
    this.stops.set(list);

    const circuit = this.selectedCircuit();
    if (!circuit) return;

    this.guideSvc
      .reorderStops(circuit.id, list.map(s => ({ id: s.id, stop_order: s.stop_order })))
      .subscribe({
        error: () => {
          this.stops.set(previous);
        },
      });
  }

  getPlaceName(id: number | undefined): string {
    if (!id) return '?';
    return this.places().find(p => p.id === id)?.name ?? `Lieu #${id}`;
  }

  setCircuitName(value: string): void {
    this.newCircuit.update(f => ({ ...f, name: value }));
  }

  setCircuitMode(mode: string): void {
    this.newCircuit.update(f => ({ ...f, mode }));
  }

  setStopPlaceId(value: string): void {
    this.newStop.update(f => ({ ...f, place_id: +value }));
  }

  setStopTime(value: string): void {
    this.newStop.update(f => ({ ...f, start_time: value }));
  }

  modeIcon(mode: string | undefined): string {
    const m: Record<string, string> = { walking: '🚶', cycling: '🚴', driving: '🚗', transit: '🚌' };
    return m[mode ?? ''] ?? '🛤️';
  }
}
