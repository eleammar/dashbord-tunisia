import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DelegationsService, Delegation } from '../../core/services/delegation.service';
import { CityService } from '../../core/services/city.service';
import { CityListItem } from '../../core/models/city.model';

@Component({
  selector: 'app-deligations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deligations.component.html',
  styleUrls: ['./deligations.component.css'],
})
export class DeligationsComponent implements OnInit {
  delegations: Delegation[] = [];
  filteredDelegations: Delegation[] = [];
  cities: CityListItem[] = [];
  showModal = false;
  editMode = false;
  form: Partial<Delegation> = {};
  editingId: number | null = null;
  loading = false;
  selectedCity: string = '';
  selectedType: string = '';
  searchTerm: string = '';
  delegationTypes: string[] = [
    'Urbaine',
    'Rurale',
    'Mixte',
    'Autre'
  ];

  constructor(private delegationService: DelegationsService, private cityService: CityService) {}

  ngOnInit() {
    this.fetchCities();
    this.fetchDelegations();
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

  fetchDelegations() {
    this.loading = true;
    this.delegationService.getAll(50, 0).subscribe({
      next: (res) => {
        this.delegations = res.data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredDelegations = this.delegations.filter(d => {
      const cityMatch = this.selectedCity ? String(d.city_id) === this.selectedCity : true;
      const typeMatch = this.selectedType ? d.type === this.selectedType : true;
      const searchMatch = this.searchTerm
        ? (d.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || d.type?.toLowerCase().includes(this.searchTerm.toLowerCase()))
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

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.selectedCity) count++;
    if (this.selectedType) count++;
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

  openEditModal(delegation: Delegation) {
    this.editMode = true;
    this.form = { ...delegation };
    this.showModal = true;
    this.editingId = delegation.id;
  }

  closeModal() {
    this.showModal = false;
    this.form = {};
    this.editingId = null;
  }

  saveDelegation() {
    // Always send city_id as number
    if (this.form.city_id) {
      this.form.city_id = Number(this.form.city_id);
    }
    // Only send allowed fields to backend
    const payload: any = {
      city_id: this.form.city_id,
      name: this.form.name,
      type: this.form.type,
      population: this.form.population,
      area: this.form.area,
      description: this.form.description,
      img: this.form.img,
      founded: this.form.founded,
      notable: this.form.notable,
      lat: this.form.lat,
      lng: this.form.lng,
    };
    if (this.editMode && this.editingId != null) {
      this.delegationService.update(Number(this.editingId), payload).subscribe(() => {
        this.fetchDelegations();
        this.closeModal();
      });
    } else {
      this.delegationService.create(payload).subscribe(() => {
        this.fetchDelegations();
        this.closeModal();
      });
    }
  }

  deleteDelegation(id: number | string) {
    if (confirm('Are you sure you want to delete this delegation?')) {
      this.delegationService.delete(Number(id)).subscribe(() => {
        this.fetchDelegations();
      });
    }
  }
}
