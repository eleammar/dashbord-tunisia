
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CultureService } from '../../core/services/culture.service';
import { CityService } from '../../core/services/city.service';
import { CultureItem } from '../../core/models/culture.model';
import { CityListItem } from '../../core/models/city.model';

@Component({
  selector: 'app-culture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.css'],
})
export class CultureComponent implements OnInit {
  cultureItems: CultureItem[] = [];
  filteredCultureItems: CultureItem[] = [];
  cities: CityListItem[] = [];
  showModal = false;
  editMode = false;
  form: Partial<CultureItem> = {};
  editingId: number | null = null;
  loading = false;
  selectedCity: string = '';
  searchTerm: string = '';

  constructor(private cultureService: CultureService, private cityService: CityService) {}

  ngOnInit() {
    this.fetchCities();
    this.fetchCultureItems();
  }

  fetchCities() {
    this.cityService.getAll().subscribe({
      next: (res: any) => {
        this.cities = res.data || [];
      },
      error: () => {
        this.cities = [];
      }
    });
  }

  fetchCultureItems() {
    this.loading = true;
    this.cultureService.getAll(50, 0).subscribe({
      next: (res) => {
        this.cultureItems = res.data || res;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredCultureItems = this.cultureItems.filter(item => {
      const cityMatch = this.selectedCity ? String(item.city_id) === this.selectedCity : true;
      const searchMatch = this.searchTerm
        ? (item.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) || item.label?.toLowerCase().includes(this.searchTerm.toLowerCase()))
        : true;
      return cityMatch && searchMatch;
    });
  }

  onCityFilterChange(cityId: string) {
    this.selectedCity = cityId;
    this.applyFilters();
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.selectedCity) count++;
    if (this.searchTerm && this.searchTerm.trim() !== '') count++;
    return count;
  }

  getCityName(cityId: number | string | null): string {
    if (!cityId) return '-';
    const city = this.cities.find(c => c.id == cityId);
    return city ? city.name : cityId?.toString();
  }

  openAddModal() {
    this.editMode = false;
    this.form = {};
    this.showModal = true;
    this.editingId = null;
  }

  openEditModal(item: CultureItem) {
    this.editMode = true;
    this.form = { ...item };
    this.showModal = true;
    this.editingId = item.id ?? null;
  }

  closeModal() {
    this.showModal = false;
    this.form = {};
    this.editingId = null;
  }

  saveCultureItem() {
    if (this.form.city_id) {
      this.form.city_id = Number(this.form.city_id);
    }
    const payload: any = {
      city_id: this.form.city_id,
      title: this.form.title,
      label: this.form.label,
      rating: this.form.rating,
      img: this.form.img,
      description: this.form.description,
    };
    if (this.editMode && this.editingId != null) {
      this.cultureService.update(Number(this.editingId), payload).subscribe(() => {
        this.fetchCultureItems();
        this.closeModal();
      });
    } else {
      this.cultureService.create(payload).subscribe(() => {
        this.fetchCultureItems();
        this.closeModal();
      });
    }
  }

  deleteCultureItem(id: number | string | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this culture item?')) {
      this.cultureService.delete(Number(id)).subscribe(() => {
        this.fetchCultureItems();
      });
    }
  }
}
