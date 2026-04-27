
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { CityService } from '../../core/services/city.service';
import { Event } from '../../core/models/event.model';
import { CityListItem } from '../../core/models/city.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  cities: CityListItem[] = [];
  categories: string[] = [];
  showModal = false;
  editMode = false;
  form: Partial<Event> = {};
  editingId: number | null = null;
  loading = false;
  selectedCity: string = '';
  selectedCategory: string = '';
  searchTerm: string = '';

  constructor(private eventService: EventService, private cityService: CityService) {}

  ngOnInit() {
    this.fetchCities();
    this.fetchCategories();
    this.fetchEvents();
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

  fetchCategories() {
    this.eventService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats || [];
      },
      error: () => {
        this.categories = [];
      }
    });
  }

  fetchEvents() {
    this.loading = true;
    this.eventService.getAll().subscribe({
      next: (events) => {
        this.events = events || [];
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredEvents = this.events.filter(event => {
      const cityMatch = this.selectedCity ? String(event.city_id) === this.selectedCity : true;
      const categoryMatch = this.selectedCategory ? event.category === this.selectedCategory : true;
      const searchMatch = this.searchTerm
        ? (event.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || event.category?.toLowerCase().includes(this.searchTerm.toLowerCase()))
        : true;
      return cityMatch && categoryMatch && searchMatch;
    });
  }

  onCityFilterChange(cityId: string) {
    this.selectedCity = cityId;
    this.applyFilters();
  }

  onCategoryFilterChange(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.selectedCity) count++;
    if (this.selectedCategory) count++;
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

  openEditModal(event: Event) {
    this.editMode = true;
    this.form = { ...event };
    this.showModal = true;
    this.editingId = event.id ?? null;
  }

  closeModal() {
    this.showModal = false;
    this.form = {};
    this.editingId = null;
  }

  saveEvent() {
    if (this.form.city_id) {
      this.form.city_id = Number(this.form.city_id);
    }
    const payload: any = {
      city_id: this.form.city_id,
      name: this.form.name,
      category: this.form.category,
      date: this.form.date,
      img: this.form.img,
    };
    if (this.editMode && this.editingId != null) {
      this.eventService.update(Number(this.editingId), payload).subscribe(() => {
        this.fetchEvents();
        this.closeModal();
      });
    } else {
      this.eventService.create(payload).subscribe(() => {
        this.fetchEvents();
        this.closeModal();
      });
    }
  }

  deleteEvent(id: number | string | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.delete(Number(id)).subscribe(() => {
        this.fetchEvents();
      });
    }
  }
}
