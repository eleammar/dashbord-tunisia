
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService, Experience } from '../../core/services/activity.service';
import { CityService } from '../../core/services/city.service';
import { CityListItem } from '../../core/models/city.model';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent implements OnInit {
  // ...existing code...

  get activeFiltersCount(): number {
    let count = 0;
    if (this.selectedCity) count++;
    if (this.selectedType) count++;
    if (this.searchTerm && this.searchTerm.trim() !== '') count++;
    return count;
  }
  searchTerm: string = '';
    onSearchChange(term: string) {
      this.searchTerm = term;
      this.applyFilters();
    }
  activities: Experience[] = [];
  filteredActivities: Experience[] = [];
  cities: CityListItem[] = [];
  showModal = false;
  editMode = false;
  form: Partial<Experience> = {};
  editingId: number | null = null;
  loading = false;
  activityTypes: string[] = [
    'À la une',
    'Culture & Histoire',
    'Nature & Plein air',
    'Gastronomie',
    'Aventure'
  ];
  selectedCity: string = '';
  selectedType: string = '';

  constructor(private activityService: ActivityService, private cityService: CityService) {}

  ngOnInit() {
    this.fetchCities();
    this.fetchActivities();
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

  fetchActivities() {
    this.loading = true;
    this.activityService.getAll(50, 0).subscribe({
      next: (res) => {
        this.activities = res.data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredActivities = this.activities.filter(a => {
      const cityMatch = this.selectedCity ? String(a.city_id) === this.selectedCity : true;
      const typeMatch = this.selectedType ? a.type === this.selectedType : true;
      const searchMatch = this.searchTerm
        ? (a.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || a.type?.toLowerCase().includes(this.searchTerm.toLowerCase()))
        : true;
      return cityMatch && typeMatch && searchMatch;
    });
  }

  onCityFilterChange(cityId: string) {
    this.selectedCity = cityId;
    this.applyFilters();
  }

  onTypeFilterChange(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  getCityName(cityId: number | string | null): string {
    if (!cityId) return '-';
    const city = this.cities.find(c => c.id == cityId);
    return city ? city.name : cityId.toString();
  }

  openAddModal() {
    this.editMode = false;
    this.form = {};
    this.showModal = true;
    this.editingId = null;
  }

  openEditModal(activity: Experience) {
    this.editMode = true;
    this.form = { ...activity };
    this.showModal = true;
    this.editingId = activity.id;
  }

  closeModal() {
    this.showModal = false;
    this.form = {};
    this.editingId = null;
  }

  saveActivity() {
    // Always send city_id as number
    if (this.form.city_id) {
      this.form.city_id = Number(this.form.city_id);
    }
    // Only send allowed fields to backend
    const payload: any = {
      city_id: this.form.city_id,
      name: this.form.name,
      type: this.form.type,
      rating: this.form.rating,
      img: this.form.img,
      
    };
    // Debug: log the payload before sending
    console.log('Payload sent to backend:', JSON.stringify(payload));
    if (this.editMode && this.editingId != null) {
      this.activityService.update(Number(this.editingId), payload).subscribe(() => {
        this.fetchActivities();
        this.closeModal();
      });
    } else {
      this.activityService.create(payload).subscribe(() => {
        this.fetchActivities();
        this.closeModal();
      });
    }
  }

  deleteActivity(id: number | string) {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.delete(Number(id)).subscribe(() => {
        this.fetchActivities();
      });
    }
  }
}
