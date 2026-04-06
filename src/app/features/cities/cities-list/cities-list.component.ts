import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CityService } from '../../../core/services/city.service';
import { CityListItem, TunisiaRegion } from '../../../core/models/city.model';

interface FilterState {
  search: string;
  region: TunisiaRegion | '';
  sortBy: 'name' | 'region';
}

@Component({
  selector: 'app-cities-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cities-list.component.html',
})
export class CitiesListComponent implements OnInit {
  private citySvc = inject(CityService);
  private router = inject(Router);

  // ── STATE ──────────────────────────────────────────────────
  loading = signal(true);
  viewMode = signal<'grid' | 'table'>('grid');
  currentPage = signal(1);
  pageSize = signal(12);

  // Delete modal
  showDeleteModal = signal(false);
  deletingCityId = signal<string | null>(null);
  deletingCityName = signal('');

  // Cities data
  cities = this.citySvc.cities;

  // Filters
  filters = signal<FilterState>({
    search: '',
    region: '',
    sortBy: 'name',
  });

  readonly regions: TunisiaRegion[] = [
    'Nord',
    'Nord-Est',
    'Nord-Ouest',
    'Centre',
    'Centre-Est',
    'Centre-Ouest',
    'Sud',
    'Sud-Est',
    'Sud-Ouest',
  ];

  // ── COMPUTED ─────────────────���─────────────────────────────
  filtered = computed(() => {
    const f = this.filters();
    let list = [...this.cities()];

    // Search filter
    if (f.search) {
      const searchLower = f.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.region.toLowerCase().includes(searchLower)
      );
    }

    // Region filter
    if (f.region) {
      list = list.filter((c) => c.region === f.region);
    }

    // Sort
    switch (f.sortBy) {
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'region':
        list.sort((a, b) => a.region.localeCompare(b.region));
        break;
    }

    return list;
  });

  paged = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize()))
  );

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const cur = this.currentPage();

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (cur <= 4) {
      return [1, 2, 3, 4, 5, '…', total];
    }

    if (cur >= total - 3) {
      return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, '…', cur - 1, cur, cur + 1, '…', total];
  });

  hasActiveFilters = computed(() => {
    const f = this.filters();
    return !!(f.search || f.region);
  });

  // ── KPIs ───────────────────────────────────────────────────
  totalCitiesCount = computed(() => this.cities().length);

  filteredCount = computed(() => this.filtered().length);

  ngOnInit(): void {
    this.citySvc.getAll().subscribe(() => {
      this.loading.set(false);
    });
  }

  // ── FILTER HELPERS ─────────────────────────────────────────
  setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]): void {
    this.filters.update((f) => ({ ...f, [key]: value }));
    this.currentPage.set(1);
  }

  resetFilters(): void {
    this.filters.set({
      search: '',
      region: '',
      sortBy: 'name',
    });
    this.currentPage.set(1);
  }

  // ── PAGINATION ────────────────────────────────────────────
  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // ── ACTIONS ───────────────────────────────────────────────
  viewCity(id: string): void {
    this.router.navigate(['/cities', id]);
  }

  editCity(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/cities', id, 'edit']);
  }

  confirmDelete(id: string, name: string, event: Event): void {
    event.stopPropagation();
    this.deletingCityId.set(id);
    this.deletingCityName.set(name);
    this.showDeleteModal.set(true);
  }

  deleteCity(): void {
    const id = this.deletingCityId();
    if (id) {
      this.citySvc.delete(id).subscribe({
        next: () => {
          this.showDeleteModal.set(false);
          alert('✓ City deleted successfully!');
        },
        error: (err: { message: string; }) => {
          alert('✗ Error deleting city: ' + err.message);
        },
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.deletingCityId.set(null);
    this.deletingCityName.set('');
  }

  // ── EXPORT ────────────────────────────────────────────────
  exportCsv(): void {
    const headers = ['Name', 'Region'];
    const rows = this.filtered().map((c) => [c.name, c.region].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `cities-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ── CLOSE MODAL ON ESC ────────────────────────────────────
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showDeleteModal()) {
      this.cancelDelete();
    }
  }
}